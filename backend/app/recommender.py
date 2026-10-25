"""Internship recommendations for students.

A transparent, content-based matcher that runs entirely on the live database (no hard-coded results and no
external AI service). For each open internship it computes an explainable score from:

  * skills      - the student's profile skills found in the internship title / category / description
  * interests   - TF-IDF cosine similarity between the student's profile text (headline, course, bio, skills)
                  plus the internships they previously applied to, and the internship text
  * location    - overlap between the student's location and the internship location
  * history     - categories of internships the student already applied to
  * availability- openings still free and how recent the posting is

Components that cannot be evaluated (e.g. the student has no skills yet) are left out and the remaining
weights are re-normalised, so an incomplete profile is never punished with fake zeros. Without any profile
signal the percentage is capped, and the response says the profile should be completed.
"""
import math
import re
from collections import Counter
from datetime import datetime, timezone

WEIGHTS = {"skills": 45, "interests": 25, "location": 10, "history": 10, "availability": 10}
NO_SIGNAL_CAP = 35  # maximum match % when neither skills nor interests could be evaluated

STOP = {"a", "an", "and", "the", "of", "to", "in", "for", "on", "with", "at", "by", "or", "is", "are", "be", "as",
        "will", "you", "your", "our", "we", "this", "that", "from", "it", "their", "have", "has", "into", "who",
        "about", "such", "can", "all", "any", "work", "working", "student", "students", "months", "month",
        "weeks", "week", "days", "learn", "learning", "get", "gain", "help", "support", "including", "etc"}
# Words that appear in almost every listing: they count only a little.
GENERIC = {"agriculture", "agricultural", "farming", "farm", "farms", "internship", "internships", "intern",
           "training", "field", "program", "programme", "practical", "opportunity"}

SYNONYMS = {
    "ai": ["ai", "ml", "artificial", "intelligence", "machine", "neural", "deep", "nlp", "vision"],
    "data": ["data", "analytics", "analysis", "analyst", "statistics", "statistical", "excel", "sql", "dashboard", "bi"],
    "software": ["python", "java", "javascript", "coding", "programming", "software", "developer", "development", "web", "app"],
    "iot": ["iot", "sensor", "sensors", "arduino", "automation", "robotics", "robot", "embedded", "raspberry", "electronics"],
    "drone": ["drone", "drones", "uav", "aerial", "gis", "remote", "sensing", "satellite", "mapping"],
    "crop": ["crop", "crops", "agronomy", "agronomist", "plant", "plants", "seed", "seeds", "horticulture",
             "cultivation", "yield", "harvest", "breeding", "science"],
    "soil": ["soil", "soils", "fertilizer", "fertiliser", "nutrient", "nutrients", "compost", "pedology"],
    "water": ["irrigation", "drip", "water", "hydroponics", "hydroponic", "aquaponics"],
    "protected": ["greenhouse", "polyhouse", "nursery", "protected"],
    "livestock": ["livestock", "dairy", "poultry", "cattle", "animal", "animals", "veterinary", "fishery",
                  "aquaculture", "goat", "sheep"],
    "organic": ["organic", "sustainable", "sustainability", "natural", "regenerative"],
    "business": ["sales", "marketing", "business", "agribusiness", "market", "markets", "supply", "chain",
                 "commerce", "entrepreneurship", "finance", "trade", "retail", "customer"],
    "precision": ["precision", "smart", "digital", "technology", "tech", "modern"],
    "research": ["research", "researcher", "laboratory", "lab", "experiment", "experiments", "study", "survey"],
    "pest": ["pest", "pests", "disease", "diseases", "pathology", "entomology", "protection"],
}
_CANON = {w: k for k, ws in SYNONYMS.items() for w in ws}


def stem(t):
    if len(t) > 4 and t.endswith("ies"):
        return t[:-3] + "y"
    if len(t) > 5 and t.endswith("ing"):
        return t[:-3]
    if len(t) > 4 and t.endswith("es"):
        return t[:-2]
    if len(t) > 3 and t.endswith("s"):
        return t[:-1]
    return t


def canon(t):
    return _CANON.get(t) or _CANON.get(stem(t)) or stem(t)


def tokens(text):
    """Canonical, de-noised tokens of a text (list, order kept)."""
    out = []
    for raw in re.findall(r"[a-z0-9+#]+", (text or "").lower()):
        if raw in STOP or len(raw) < 2 and raw not in {"c"}:
            continue
        out.append(canon(raw))
    return out


def _is_generic(tok):
    return tok in GENERIC or stem(tok) in GENERIC


def skill_phrases(skills):
    return [s.strip() for s in re.split(r"[,;/\n|]+", skills or "") if s.strip()]


def _tf(weighted_texts, idf):
    vec = Counter()
    for text, w in weighted_texts:
        for t in tokens(text):
            vec[t] += w * (0.3 if _is_generic(t) else 1.0)
    return {t: c * idf.get(t, 1.0) for t, c in vec.items()}


def _cosine(a, b):
    if not a or not b:
        return 0.0
    dot = sum(v * b.get(t, 0.0) for t, v in a.items())
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    return dot / (na * nb) if na and nb else 0.0


def build_idf(internships):
    n = len(internships)
    df = Counter()
    for i in internships:
        df.update(set(tokens(f"{i['title']} {i['category']} {i['description']}")))
    return {t: math.log((n + 1) / (c + 1)) + 1.0 for t, c in df.items()}


def student_context(profile, applied_internships):
    """profile: dict(skills, headline, bio, course, institution, location). applied_internships: list of dicts."""
    phrases = skill_phrases(profile.get("skills"))
    interest_texts = [(profile.get("headline"), 2), (profile.get("course"), 2), (profile.get("bio"), 1),
                      (profile.get("skills"), 2)]
    # "has_text" is about what the student wrote in their own profile; application history alone is not
    # treated as a stated interest (it feeds the separate "history" component and refines similarity).
    has_text = any(tokens(t) for t, _ in interest_texts if t)
    for a in applied_internships:
        interest_texts.append((f"{a['title']} {a['category']}", 1))
    interest_texts = [(t, w) for t, w in interest_texts if t]
    return {"phrases": phrases, "interest_texts": interest_texts, "interest_texts_filtered": interest_texts,
            "has_text": has_text,
            "location_tokens": {t for t in tokens(profile.get("location")) if t},
            "history_categories": {(a["category"] or "").strip().lower() for a in applied_internships if a.get("category")},
            "profile_tokens": set(tokens(" ".join(t for t, _ in interest_texts)))}


def _match_skills(phrases, title_cat_tokens, all_tokens):
    matched, score = [], 0.0
    for ph in phrases:
        toks = {t for t in tokens(ph) if not _is_generic(t)}
        if not toks:  # purely generic skill such as "agriculture"
            if {t for t in tokens(ph)} & (all_tokens | title_cat_tokens):
                matched.append(ph)
                score += 0.25
            continue
        if toks <= title_cat_tokens:
            matched.append(ph)
            score += 1.0
        elif toks <= all_tokens:
            matched.append(ph)
            score += 0.7
        elif len(toks) > 1 and len(toks & all_tokens) * 2 >= len(toks):
            matched.append(ph)
            score += 0.4
    return matched, score


def score_internship(ctx, item, idf, now=None):
    """item: dict(id,title,category,description,location,openings,openings_left,created_at). Returns dict."""
    now = now or datetime.now(timezone.utc).replace(tzinfo=None)
    title_cat = set(tokens(f"{item['title']} {item['category']}"))
    all_tokens = title_cat | set(tokens(item["description"]))
    reasons, comps = [], {}

    if ctx["phrases"]:
        matched, raw = _match_skills(ctx["phrases"], title_cat, all_tokens)
        comps["skills"] = min(1.0, raw / min(len(ctx["phrases"]), 3))
        if matched:
            reasons.append(f"Your skills match: {', '.join(matched[:4])}")
    else:
        matched = []

    if ctx["has_text"]:
        sim = _cosine(_tf(ctx["interest_texts_filtered"], idf), _tf([(item["title"], 3), (item["category"], 2),
                                                                     (item["description"], 1)], idf))
        comps["interests"] = 1.0 - math.exp(-4.0 * sim)
        shared = sorted((ctx["profile_tokens"] & all_tokens) - {t for t in all_tokens if _is_generic(t)})
        if shared and comps["interests"] >= 0.15:
            reasons.append("Fits your interests: " + ", ".join(shared[:4]))

    loc_tokens = {t for t in tokens(item["location"]) if t}
    if ctx["location_tokens"] and loc_tokens:
        overlap = ctx["location_tokens"] & loc_tokens
        comps["location"] = 1.0 if overlap else 0.0
        if overlap:
            reasons.append(f"Located in {item['location']}, near your location")

    if ctx["history_categories"]:
        same = (item["category"] or "").strip().lower() in ctx["history_categories"]
        comps["history"] = 1.0 if same else 0.0
        if same:
            reasons.append(f"Same category ({item['category']}) as internships you applied to")

    left, total = item["openings_left"], max(item["openings"], 1)
    age_days = max((now - item["created_at"]).days, 0) if item.get("created_at") else 365
    comps["availability"] = 0.6 * min(1.0, left / total + 0.3) + 0.4 * max(0.0, 1.0 - age_days / 60.0)
    if left:
        reasons.append(f"{left} of {item['openings']} position(s) still open")

    avail_w = sum(WEIGHTS[k] for k in comps)
    pct = 100.0 * sum(WEIGHTS[k] * v for k, v in comps.items()) / avail_w
    if "skills" not in comps and "interests" not in comps:
        pct = min(pct, NO_SIGNAL_CAP)
    pct = int(round(max(0.0, min(100.0, pct))))
    gaps = sorted(t for t in set(tokens(item["title"])) - ctx["profile_tokens"] if not _is_generic(t) and len(t) > 2)[:3]
    return {"match": pct, "reasons": reasons, "matched_skills": matched, "skill_gaps": gaps,
            "components": {k: round(v, 3) for k, v in comps.items()}}


def rank(profile, applied, candidates, limit=6, now=None):
    """Pure function: returns [(candidate, result)] best first. No database access."""
    ctx = student_context(profile, applied)
    idf = build_idf(candidates)
    scored = [(c, score_internship(ctx, c, idf, now)) for c in candidates]
    scored.sort(key=lambda cr: (-cr[1]["match"], -(cr[0]["created_at"].timestamp() if cr[0].get("created_at") else 0), cr[0]["id"]))
    return scored[:limit], ctx


# ------------------------------------------------------------------ database layer
def recommend_for_student(db, user, limit=6):
    from app.models.all_models import Application, Internship, Profile, User

    p = db.query(Profile).filter_by(user_id=user.id).first()
    profile = {"skills": p.skills if p else "", "headline": p.headline if p else "", "bio": p.bio if p else "",
               "course": p.course if p else "", "institution": p.institution if p else "",
               "location": user.location or ""}
    apps = db.query(Application).filter_by(student_id=user.id).all()
    applied_ids = {a.internship_id for a in apps if a.status != "Withdrawn"}
    applied = [{"title": a.internship.title, "category": a.internship.category}
               for a in apps if a.internship is not None]

    from app.models.all_models import Placement  # hired_count mirrors main.hired_count
    rows = db.query(Internship).filter(Internship.status == "Active").all()
    candidates = []
    for i in rows:
        if i.id in applied_ids:
            continue
        farmer = db.get(User, i.farmer_id)
        if farmer is not None and not farmer.active:
            continue
        hired = db.query(Placement).filter(Placement.internship_id == i.id, Placement.status != "Terminated").count()
        left = max((i.openings or 1) - hired, 0)
        if left <= 0:
            continue
        candidates.append({"id": i.id, "title": i.title or "", "category": i.category or "",
                           "description": i.description or "", "location": i.location or "",
                           "openings": i.openings or 1, "openings_left": left, "created_at": i.created_at, "row": i})
    ranked, ctx = rank(profile, applied, candidates, limit)
    strength = sum(bool(x) for x in (profile["skills"], profile["headline"] or profile["bio"], profile["course"],
                                     profile["location"], profile["institution"]))
    return ranked, {"profile_strength": round(100 * strength / 5), "has_skills": bool(ctx["phrases"]),
                    "considered": len(candidates), "already_applied": len(applied_ids)}
