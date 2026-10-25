import { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const getToken = () => localStorage.getItem('farmintern_token') || sessionStorage.getItem('farmintern_token');
const clearSession = () => {
  ['farmintern_token', 'farmintern_user'].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
};
const saveSession = (d, remember = true) => {
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  store.setItem('farmintern_token', d.token);
  store.setItem('farmintern_user', JSON.stringify(d.user));
};
const loadUser = () => {
  try { return JSON.parse(localStorage.getItem('farmintern_user') || sessionStorage.getItem('farmintern_user')); } catch { return null; }
};
const storeUser = u => {
  const store = localStorage.getItem('farmintern_token') ? localStorage : sessionStorage;
  store.setItem('farmintern_user', JSON.stringify(u));
};
function wsBase() {
  const explicit = import.meta.env.VITE_WS_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (/^https?:/.test(API)) return API.replace(/^http/, 'ws').replace(/\/api$/, '');
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;
}
async function api(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
    });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and that the backend is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token && !path.startsWith('/auth/') && !path.startsWith('/admin/login')) {
    clearSession();
    window.dispatchEvent(new Event('fi-session-expired'));
  }
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : `Request failed (${res.status})`);
  return data;
}
const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body || {}) });
const patch = (path, body) => api(path, { method: 'PATCH', body: JSON.stringify(body || {}) });

const fmtDate = s => (s ? new Date(s).toLocaleDateString() : '—');
const fmtDateTime = s => (s ? new Date(s).toLocaleString() : '');
const statusTone = s => ({ Selected: 'lime', Active: 'lime', Completed: 'lime', Rejected: 'red', Terminated: 'red', Shortlisted: 'blue', Filled: 'blue', Withdrawn: 'neutral', Paused: 'neutral', Closed: 'neutral' }[s] || 'amber');
const NEXT = { Pending: ['Shortlisted', 'Selected', 'Rejected'], Shortlisted: ['Selected', 'Rejected'], Rejected: ['Shortlisted'] };
const DECISION_LABEL = { Shortlisted: 'Shortlist', Selected: 'Select', Rejected: 'Reject' };

function useLoad(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const run = useCallback(async silent => {
    if (silent !== true) setState(s => ({ ...s, loading: true, error: '' }));
    try { const data = await fetcher(); setState({ data, loading: false, error: '' }); }
    catch (e) { setState(s => ({ data: s.data, loading: false, error: e.message })); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}
function ErrorState({ error, retry }) {
  return <Empty title="Could not load this page" body={error} action={retry && <Btn kind="soft" onClick={() => retry()}>Try again</Btn>} />;
}
// Shows loader / error / empty state, otherwise the children.
function Async({ q, empty, children }) {
  if (q.loading && !q.data) return <Loader />;
  if (q.error && !q.data) return <ErrorState error={q.error} retry={q.reload} />;
  if (empty && q.data && !q.data.length) return empty;
  return children;
}
function Chips({ options, value, onChange, counts }) {
  return <div className="filter-chips">{options.map(o => <button key={o} className={value === o ? 'chip active' : 'chip'} onClick={() => onChange(o)}>{o}{counts && counts[o] != null ? ` · ${counts[o]}` : ''}</button>)}</div>;
}
function Toast({ toast, onClose }) {
  useEffect(() => { if (!toast) return; const t = setTimeout(onClose, toast.type === 'error' ? 7000 : 4000); return () => clearTimeout(t); }, [toast]);
  if (!toast) return null;
  return <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}><span>{toast.type === 'error' ? '!' : '✓'}</span>{toast.text}<button onClick={onClose}>×</button></div>;
}


const roles = {
  student: { name: 'Student', label: 'Career Launchpad', icon: 'ST', color: 'lime', tagline: 'Discover work. Build proof. Get noticed.' },
  farmer: { name: 'Farmer', label: 'Farm Command', icon: 'FM', color: 'amber', tagline: 'Hire, mentor and measure field talent.' },
  college: { name: 'College', label: 'Placement Intelligence', icon: 'CL', color: 'blue', tagline: 'Monitor every internship journey.' },
  admin: { name: 'Admin', label: 'Platform Control', icon: 'AD', color: 'violet', tagline: 'Trust, operate and scale the network.' }
};
const navs = {
  student: [['overview','Overview','⌂'],['explore','Internships','◈'],['applications','My Applications','✓'],['progress','My Progress','↗'],['feedback','My Feedback','★'],['messages','Messages','◌'],['profile','Profile','◎']],
  farmer: [['overview','Overview','⌂'],['opportunities','Manage Internships','◈'],['applicants','Manage Applicants','♧'],['placements','Placements','⚑'],['tasks','Task Studio','↗'],['evaluations','Publish Evaluations','★'],['messages','Messages','◌'],['reports','Reports','▦'],['profile','Farm Profile','◎']],
  college: [['overview','Overview','⌂'],['students','Monitor Students','♧'],['monitor','Monitor Internships','◈'],['progress','Track Outcomes','↗'],['evaluations','Publish Feedback','★'],['messages','Messages','◌'],['reports','Reports','▦'],['profile','College Profile','◎']],
  admin: [['overview','Open Workspace','⌂'],['users','Manage Users','♧'],['internships','Monitor Internships','◈'],['applications','Monitor Applications','✓'],['placements','Monitor Placements','⚑'],['messages','Messages','◌'],['reports','Platform Reports','▦'],['profile','Admin Profile','◎']]
};

function Logo({light=false}) { return <div className={`brand ${light?'light':''}`}><span className="brand-symbol">✦</span><span>Farm<span>Intern</span></span></div>; }
function Btn({children,kind='primary',icon,loading=false,...p}) { return <button className={`btn ${kind}`} disabled={loading || p.disabled} {...p}>{loading?'Working…':children}{icon&&<span className="btn-icon">{icon}</span>}</button>; }
function Pill({children,tone='neutral'}) { return <span className={`pill ${tone}`}>{children}</span>; }
function Modal({title,subtitle,onClose,children,wide=false}) { return <div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${wide?'wide':''}`}><div className="modal-top"><div><small>FARMINTERN WORKSPACE</small><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="modal-close" onClick={onClose}>×</button></div>{children}</div></div>; }
function Empty({title,body,action}) { return <div className="empty"><div className="empty-icon">✦</div><h3>{title}</h3><p>{body}</p>{action}</div>; }
function Loader(){return <div className="loading"><span/>Loading live data…</div>;}
function Section({eyebrow,title,sub,action,children}) { return <section className="section"><div className="section-head"><div><small>{eyebrow}</small><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{action}</div>{children}</section>; }
function Stat({label,value,meta,icon}) { return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{meta}</small></div></div>; }

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function RealisticDisc({ liveStudents = 5, liveFarmers = 2, liveColleges = 1 }) {
  const totalRegistered = liveStudents + liveFarmers + liveColleges;

  return (
    <div className="realistic-disc-container">
      <svg
        className="realistic-disc-svg"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Emerald AgTech Colored Vinyl Material */}
          <radialGradient id="emeraldVinyl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#125732" />
            <stop offset="22%" stopColor="#0d4225" />
            <stop offset="50%" stopColor="#114e2d" />
            <stop offset="78%" stopColor="#082917" />
            <stop offset="93%" stopColor="#051a0e" />
            <stop offset="100%" stopColor="#020e07" />
          </radialGradient>

          {/* Gold & Lime Specular Rim Bevel */}
          <linearGradient id="goldLimeRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.85" />
          </linearGradient>

          {/* Anisotropic Colored Vinyl Reflection Beams */}
          <linearGradient id="anisoEmeraldBeam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#86efac" stopOpacity="0.14" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="anisoEmeraldBeam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#a7f3d0" stopOpacity="0.12" />
            <stop offset="75%" stopColor="#fde047" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Center Live Hub Glass Depth */}
          <radialGradient id="hubGlass" cx="45%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#0f3d23" />
            <stop offset="45%" stopColor="#092816" />
            <stop offset="80%" stopColor="#05180d" />
            <stop offset="100%" stopColor="#020b06" />
          </radialGradient>

          {/* Hub Bezel Metallic Ring */}
          <linearGradient id="hubBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#78f36d" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.9" />
          </linearGradient>

          {/* Metallic Spindle Eyelet Bushing */}
          <linearGradient id="spindleGrommet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Point Badge Gradient Borders */}
          <linearGradient id="studentBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78f36d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="farmerBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="collegeBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
          </linearGradient>

          {/* Circular Text Tracks along Vinyl Grooves */}
          <path id="grooveTextUpper" d="M 44 180 A 136 136 0 1 1 316 180" fill="none" />
          <path id="grooveTextLower" d="M 316 180 A 136 136 0 1 1 44 180" fill="none" />
        </defs>

        {/* ========================================================= */}
        {/* ROTATING EMERALD VINYL DISC (Spins Smoothly)             */}
        {/* ========================================================= */}
        <g className="realistic-rotating-disc">
          {/* Outer Vinyl Body & Gold/Lime Beveled Rim */}
          <circle
            cx="180"
            cy="180"
            r="172"
            fill="url(#emeraldVinyl)"
            stroke="url(#goldLimeRim)"
            strokeWidth="2.8"
          />

          {/* Lead-in Outer Rim Groove Band */}
          <circle cx="180" cy="180" r="166" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
          <circle cx="180" cy="180" r="163" stroke="rgba(0, 0, 0, 0.65)" strokeWidth="1.4" />

          {/* Track Band 1 (Outer Recorded Grooves) */}
          <circle cx="180" cy="180" r="158" stroke="rgba(167, 243, 208, 0.16)" strokeWidth="0.85" />
          <circle cx="180" cy="180" r="154" stroke="rgba(254, 240, 138, 0.15)" strokeWidth="0.9" strokeDasharray="28 5 14 3" />
          <circle cx="180" cy="180" r="150" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.75" />
          <circle cx="180" cy="180" r="146" stroke="rgba(120, 243, 109, 0.18)" strokeWidth="0.9" strokeDasharray="20 4 10 3" />
          <circle cx="180" cy="180" r="142" stroke="rgba(167, 243, 208, 0.12)" strokeWidth="0.75" />
          <circle cx="180" cy="180" r="138" stroke="rgba(254, 240, 138, 0.14)" strokeWidth="0.85" strokeDasharray="32 6 16 4" />

          {/* Track Gap 1 (Smooth Emerald Separator Band) */}
          <circle cx="180" cy="180" r="134" stroke="#041a0e" strokeWidth="3" />

          {/* Curved Text Engraved along Vinyl Grooves (Spins with Disc) */}
          <text fill="#86efac" fontSize="8" fontFamily="monospace" letterSpacing="1.8" fontWeight="800" opacity="0.9">
            <textPath href="#grooveTextUpper" startOffset="50%" textAnchor="middle">
              ✦ FARMINTERN AGRICULTURAL OS ✦ REAL FIELDWORK ✦
            </textPath>
          </text>
          <text fill="#fde047" fontSize="8" fontFamily="monospace" letterSpacing="1.8" fontWeight="800" opacity="0.9">
            <textPath href="#grooveTextLower" startOffset="50%" textAnchor="middle">
              ✦ DUAL CERTIFICATION ✦ UNIVERSITY ACCREDITED ✦
            </textPath>
          </text>

          {/* Track Band 2 (Middle Recorded Grooves) */}
          <circle cx="180" cy="180" r="130" stroke="rgba(167, 243, 208, 0.15)" strokeWidth="0.8" />
          <circle cx="180" cy="180" r="126" stroke="rgba(120, 243, 109, 0.16)" strokeWidth="0.85" strokeDasharray="24 4 12 3" />
          <circle cx="180" cy="180" r="122" stroke="rgba(254, 240, 138, 0.14)" strokeWidth="0.75" />
          <circle cx="180" cy="180" r="118" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
          <circle cx="180" cy="180" r="114" stroke="rgba(120, 243, 109, 0.15)" strokeWidth="0.85" strokeDasharray="18 4 8 2" />
          <circle cx="180" cy="180" r="110" stroke="rgba(167, 243, 208, 0.12)" strokeWidth="0.7" />

          {/* Track Gap 2 (Smooth Emerald Separator Band) */}
          <circle cx="180" cy="180" r="106" stroke="#041a0e" strokeWidth="3" />

          {/* Track Band 3 (Inner Recorded Grooves) */}
          <circle cx="180" cy="180" r="102" stroke="rgba(167, 243, 208, 0.16)" strokeWidth="0.8" />
          <circle cx="180" cy="180" r="98" stroke="rgba(254, 240, 138, 0.15)" strokeWidth="0.85" strokeDasharray="22 4 10 3" />
          <circle cx="180" cy="180" r="94" stroke="rgba(120, 243, 109, 0.14)" strokeWidth="0.75" />
          <circle cx="180" cy="180" r="90" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.7" />

          {/* Dead Wax Run-out Area & Matrix Spiral */}
          <circle cx="180" cy="180" r="85" stroke="rgba(2, 14, 7, 0.9)" strokeWidth="4" />
          <path
            d="M 180 97 A 83 83 0 0 1 263 180 A 79 79 0 0 1 180 259 A 75 75 0 0 1 105 180 A 71 71 0 0 1 180 109"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="0.9"
          />

          {/* Dual Anisotropic Translucent Specular Sheen (Hourglass light beams) */}
          <path
            d="M 180 180 L 72 46 A 168 168 0 0 1 180 12 Z"
            fill="url(#anisoEmeraldBeam1)"
            opacity="0.55"
          />
          <path
            d="M 180 180 L 288 314 A 168 168 0 0 1 180 348 Z"
            fill="url(#anisoEmeraldBeam1)"
            opacity="0.55"
          />
          <path
            d="M 180 180 L 314 72 A 168 168 0 0 1 348 180 Z"
            fill="url(#anisoEmeraldBeam2)"
            opacity="0.38"
          />
          <path
            d="M 180 180 L 46 288 A 168 168 0 0 1 12 180 Z"
            fill="url(#anisoEmeraldBeam2)"
            opacity="0.38"
          />
        </g>

        {/* ========================================================= */}
        {/* STATIONARY TELEMETRY LAYER (Points on Disc, Not Side-by-Side) */}
        {/* ========================================================= */}
        <g className="disc-live-overlay-layer">
          {/* Orbital Radar Guide Ring */}
          <circle
            cx="180"
            cy="180"
            r="116"
            stroke="rgba(120, 243, 109, 0.18)"
            strokeWidth="0.9"
            strokeDasharray="4 6"
          />

          {/* Telemetry Connecting Lines (From Center Hub out to the 3 points) */}
          {/* Line to Top Point */}
          <line
            x1="180"
            y1="134"
            x2="180"
            y2="86"
            stroke="rgba(120, 243, 109, 0.55)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="180" cy="86" r="2.8" fill="#78f36d" />

          {/* Line to Bottom-Right Point */}
          <line
            x1="214"
            y1="204"
            x2="236"
            y2="212"
            stroke="rgba(251, 191, 36, 0.55)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="236" cy="212" r="2.8" fill="#fbbf24" />

          {/* Line to Bottom-Left Point */}
          <line
            x1="146"
            y1="204"
            x2="124"
            y2="212"
            stroke="rgba(56, 189, 248, 0.55)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="124" cy="212" r="2.8" fill="#38bdf8" />

          {/* ------------------------------------------------------- */}
          {/* CENTER LIVE HUB (Streamlined Core Console)              */}
          {/* ------------------------------------------------------- */}
          <circle
            cx="180"
            cy="180"
            r="46"
            fill="url(#hubGlass)"
            stroke="url(#hubBezel)"
            strokeWidth="2.4"
          />
          <circle
            cx="180"
            cy="180"
            r="41"
            stroke="rgba(120, 243, 109, 0.3)"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />

          {/* Center Hub Content */}
          <text
            x="180"
            y="150"
            textAnchor="middle"
            fill="#86efac"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="900"
            letterSpacing="1.2"
          >
            ● LIVE NETWORK
          </text>
          <text
            x="180"
            y="174"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="24"
            fontFamily="Manrope, sans-serif"
            fontWeight="900"
            letterSpacing="-0.5"
          >
            {totalRegistered}
          </text>
          <text
            x="180"
            y="186"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="8.5"
            fontFamily="Manrope, sans-serif"
            fontWeight="900"
            letterSpacing="1.4"
          >
            REGISTERED
          </text>

          {/* Center Spindle Eyelet Bushing */}
          <circle
            cx="180"
            cy="200"
            r="7"
            fill="#031208"
            stroke="url(#spindleGrommet)"
            strokeWidth="2.2"
          />
          <circle cx="180" cy="200" r="3" fill="#010603" />

          <text
            x="180"
            y="218"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontFamily="Manrope, sans-serif"
            fontWeight="900"
            letterSpacing="1.8"
          >
            ✦ FARMINTERN ✦
          </text>

          {/* ------------------------------------------------------- */}
          {/* POINT 1 (TOP / NORTH): LIVE STUDENTS                   */}
          {/* ------------------------------------------------------- */}
          <g className="disc-node-point disc-node-top">
            <rect
              x="119"
              y="32"
              width="122"
              height="54"
              rx="16"
              fill="#051f11"
              stroke="#4ade80"
              strokeWidth="2"
            />
            <circle cx="138" cy="46" r="3.5" fill="#4ade80" className="hub-pulse-dot" />
            <text x="149" y="50" fontSize="15">🎓</text>
            <text
              x="180"
              y="66"
              textAnchor="middle"
              fill="#4ade80"
              fontSize="23"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="-0.5"
            >
              {liveStudents}
            </text>
            <text
              x="180"
              y="79"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="1"
            >
              LIVE STUDENTS
            </text>
          </g>

          {/* ------------------------------------------------------- */}
          {/* POINT 2 (BOTTOM-RIGHT / SOUTH-EAST): LIVE FARMERS       */}
          {/* ------------------------------------------------------- */}
          <g className="disc-node-point disc-node-bottom-right">
            <rect
              x="212"
              y="212"
              width="122"
              height="54"
              rx="16"
              fill="#241804"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            <circle cx="231" cy="226" r="3.5" fill="#fbbf24" className="hub-pulse-dot" />
            <text x="242" y="230" fontSize="15">🚜</text>
            <text
              x="273"
              y="246"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="23"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="-0.5"
            >
              {liveFarmers}
            </text>
            <text
              x="273"
              y="259"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="1"
            >
              LIVE FARMERS
            </text>
          </g>

          {/* ------------------------------------------------------- */}
          {/* POINT 3 (BOTTOM-LEFT / SOUTH-WEST): LIVE COLLEGES       */}
          {/* ------------------------------------------------------- */}
          <g className="disc-node-point disc-node-bottom-left">
            <rect
              x="26"
              y="212"
              width="122"
              height="54"
              rx="16"
              fill="#041b2a"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <circle cx="45" cy="226" r="3.5" fill="#38bdf8" className="hub-pulse-dot" />
            <text x="56" y="230" fontSize="15">🏛️</text>
            <text
              x="87"
              y="246"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="23"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="-0.5"
            >
              {liveColleges}
            </text>
            <text
              x="87"
              y="259"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="Manrope, sans-serif"
              fontWeight="900"
              letterSpacing="1"
            >
              LIVE COLLEGES
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
const AgTechIllustration = RealisticDisc;
const RotatingDisc = RealisticDisc;




function Landing({ enter, user, onLogout }) {
  const [stats, setStats] = useState({ students: 5, farmers: 2, colleges: 1, placements: 1 });

  useEffect(() => {
    let active = true;
    const fetchStats = () => {
      fetch(`${API}/home/stats`)
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (active && d && typeof d.students === 'number') {
            setStats(d);
          }
        })
        .catch(() => {});
    };
    fetchStats();
    // Poll every 4s so newly registered students, farmers, colleges update live
    const interval = setInterval(fetchStats, 4000);
    window.addEventListener('fi-stats-updated', fetchStats);
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('fi-stats-updated', fetchStats);
    };
  }, []);

  // Exact live registered counts from database
  const liveStudents = typeof stats.students === 'number' ? stats.students : 5;
  const liveFarmers = typeof stats.farmers === 'number' ? stats.farmers : 2;
  const liveColleges = typeof stats.colleges === 'number' ? stats.colleges : 1;

  const domains = [
    {
      title: 'Precision Agriculture & Drone Surveying',
      icon: '🛰️',
      image: '/images/precision-agri-drone.jpg',
      track: 'Sensors & Drones',
      desc: 'Master multispectral NDVI imaging, GPS auto-steering, variable-rate fertigation, and aerial field scouting.',
      tags: ['NDVI Mapping', 'Drone Ops', 'GIS Telemetry', 'Variable Rate'],
      duration: '8 – 12 Weeks',
      stipend: '₹12,000 – ₹18,000 / mo'
    },
    {
      title: 'Smart Greenhouses & CEA Hydroponics',
      icon: '🌱',
      image: '/images/smart-greenhouse-hydroponics.jpg',
      track: 'Protected Agronomy',
      desc: 'Operate automated climate computers, nutrient film techniques (NFT), closed-loop fertigation, and vertical farming.',
      tags: ['Climate Computers', 'NFT Systems', 'EC/pH Dosing', 'Vertical Racks'],
      duration: '6 – 10 Weeks',
      stipend: '₹10,500 – ₹15,000 / mo'
    },
    {
      title: 'Regenerative Soil Science & Organic Management',
      icon: '🌾',
      image: '/images/soil-science-fieldwork.jpg',
      track: 'Soil & Ecology',
      desc: 'Hands-on soil microbiome health testing, organic bio-fertilizer formulations, cover cropping, and IPM bio-control.',
      tags: ['Microbiome Audit', 'Bio-Fertilizer', 'IPM Pest Control', 'Zero-Chemical'],
      duration: '8 – 16 Weeks',
      stipend: '₹11,000 – ₹16,000 / mo'
    },
    {
      title: 'Farm Automation & Agri-Robotics',
      icon: '⚙️',
      image: '/images/farm-automation-robotics.jpg',
      track: 'Robotics & Automation',
      desc: 'Deploy field sensor networks, automated solar pumps, computer-vision crop grading, and digital harvest inventory.',
      tags: ['IoT Gateways', 'Solar Automation', 'Computer Vision', 'Cold Chain'],
      duration: '6 – 12 Weeks',
      stipend: '₹12,500 – ₹20,000 / mo'
    }
  ];

  const projectFeatures = [
    {
      title: 'Hands-On Farm Placements & Daily Digital Logbooks',
      tag: 'STUDENT LEARNING & STIPENDS',
      portalKey: 'student',
      image: '/images/student-field-logbook.jpg',
      desc: 'Connect agricultural students directly with progressive farm hosts. Interns gain practical fieldwork in crop cultivation, irrigation, pest management, and post-harvest operations while logging daily verified hours and earning guaranteed monthly stipends.',
      stats: '100% Verified Field Hours',
      highlights: [
        'Curated internships across open fields, greenhouses & orchards',
        'Daily digital logbook with 0–100% milestone progress tracking',
        'Direct supervisor approvals linked to university academic credits'
      ],
      ctaText: 'Explore Student Internships'
    },
    {
      title: 'Farm Host Mentorship & Operational Task Studio',
      tag: 'FARM COMMAND & SUPERVISION',
      portalKey: 'farmer',
      image: '/images/farmer-mentor-training.jpg',
      desc: 'Empower farmers and agricultural enterprises to recruit dedicated agricultural talent. Post seasonal internship openings, assign daily field duties with clear instructions and deadlines, track intern progress, and certify practical competency without manual paperwork.',
      stats: 'Zero-Paperwork Field Management',
      highlights: [
        'Publish seasonal crop cycles & specialized agricultural openings',
        'Task Studio to assign field activities, scouting, and soil checks',
        'Submit performance ratings and certified completion sign-offs'
      ],
      ctaText: 'Access Farm Partner Portal'
    },
    {
      title: 'University Placement Intelligence & Syllabus Compliance',
      tag: 'INSTITUTIONAL ACCREDITATION',
      portalKey: 'college',
      image: '/images/agri-university-campus.jpg',
      desc: 'Provide agricultural universities and colleges with real-time visibility into student cohort field deployments. Audit mentor reviews, track daily attendance and milestones, and ensure seamless alignment with RAWE, READY, and NEP internship curriculum requirements.',
      stats: 'ICAR & University Aligned',
      highlights: [
        'Live cohort dashboard monitoring all students across partner farms',
        'Dual evaluation workflow combining faculty audits with supervisor ratings',
        'Instant export of accredited internship completion and outcome reports'
      ],
      ctaText: 'Access College Portal'
    },
    {
      title: 'Verified Dual-Endorsed Credentials & Secure Communications',
      tag: 'CAREER PROOF & MESSAGING',
      portalKey: 'student',
      image: '/images/agri-certified-graduate.jpg',
      desc: 'Turn hands-on fieldwork into accredited career proof. Each placement concludes with dual-certified credentials endorsed by both the farm supervisor and college faculty, alongside built-in instant messaging and WebRTC video calls to keep students, farmers, and mentors connected.',
      stats: 'Tamper-Proof Digital Credentials',
      highlights: [
        'Verified certificates of completion detailing verified skills & hours',
        'Real-time peer-to-peer messaging and WebRTC video calls in the field',
        'Direct portfolio showcase for agritech employers & post-grad careers'
      ],
      ctaText: 'Start Your Farm Journey'
    }
  ];

  const publicPortals = [
    {
      key: 'student',
      title: 'Student Portal',
      roleName: 'Career Launchpad',
      icon: 'ST',
      color: 'lime',
      tagline: 'Discover opportunities. Master field skills. Build verified proof.',
      features: [
        'Search verified farm internships with clear stipends',
        '1-click university-accredited application profile',
        'Daily field task board with 0–100% progress logging',
        'Dual evaluations that convert into verified career credentials'
      ]
    },
    {
      key: 'farmer',
      title: 'Farm Partner Portal',
      roleName: 'Farm Command',
      icon: 'FM',
      color: 'amber',
      tagline: 'Recruit, mentor, and measure next-gen agricultural talent.',
      features: [
        'Publish seasonal and technology-driven internships in minutes',
        'Screen verified applicants with academic credentials',
        'Assign daily field tasks with deadlines and guidance',
        'Submit performance evaluations and certify field hours'
      ]
    },
    {
      key: 'college',
      title: 'College Portal',
      roleName: 'Placement Intelligence',
      icon: 'CL',
      color: 'blue',
      tagline: 'Monitor student field progress and audit academic accreditation.',
      features: [
        'Live dashboard of all enrolled students in field deployments',
        'Review farm mentor ratings, feedback, and task milestones',
        'Submit faculty evaluations and verify curriculum hours',
        'Export accredited internship outcome reports for audits'
      ]
    }
  ];

  return (
    <div className="landing-v2">
      {/* Top Telemetry Announcement */}
      <div className="landing-top-banner">
        <span className="tag">AgTech 4.0</span>
        <span>NEXT-GEN AGRICULTURAL INTERNSHIP NETWORK · REAL FIELDWORK MEETS CAREER PROOF</span>
      </div>

      {/* Main Sticky Navigation */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo />
          <div className="brand-pulse">
            <span className="brand-pulse-dot" />
            <span>NETWORK LIVE</span>
          </div>
        </div>
        <div className="landing-links">
          <a href="#hero">Overview</a>
          <a href="#stats">Live Metrics</a>
          <a href="#features">Features</a>
          <a href="#domains">AgTech Tracks</a>
          <a href="#portals">Portals</a>
          <a href="#workflow">How It Works</a>
        </div>
        <div className="landing-nav-actions">
          {user ? (
            <>
              <div className="landing-user-badge" title={`Signed in as ${user.email}`}>
                <span className={`avatar tiny ${roles[user.role]?.color || 'lime'}`}>
                  {user.name?.[0] || 'U'}
                </span>
                <span className="landing-user-name">{user.name}</span>
                <span className="landing-user-role">({roles[user.role]?.name || user.role})</span>
              </div>
              <Btn kind="dark" onClick={() => enter()}>Go to Workspace <span>↗</span></Btn>
              <Btn kind="ghost" onClick={onLogout} title="Sign out of current account">Sign out</Btn>
            </>
          ) : (
            <>
              <Btn kind="ghost" onClick={() => enter('student')}>Sign in</Btn>
              <Btn kind="dark" onClick={() => enter()}>Enter Workspace <span>↗</span></Btn>
            </>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero-v2">
          <div className="hero-v2-copy">
            <div className="hero-badge-pill">
              <span className="dot" />
              <span>FIELD INTELLIGENCE & INTERNSHIP OPERATING SYSTEM</span>
            </div>
            <h1>
              Where hands-on farming meets <span className="gradient-text">verified career proof.</span>
            </h1>
            <p>
              FarmIntern connects agricultural students, progressive farms, and academic institutions in one real-time ecosystem. Master precision agronomy, log verified field milestones, and turn practical experience into certified industry credentials.
            </p>
            <div className="hero-cta-group">
              <Btn onClick={() => enter()} style={{ minHeight: '48px', padding: '0 24px', fontSize: '15px' }}>
                {user ? 'Go to Your Workspace ↗' : 'Enter Your Workspace ↗'}
              </Btn>
              <a href="#domains" className="btn ghost" style={{ minHeight: '48px', padding: '0 20px', display: 'inline-flex', alignItems: 'center', fontWeight: '800' }}>
                Explore AgTech Tracks ↓
              </a>
            </div>
            <div className="hero-trust-bar">
              <div className="hero-trust-item"><span className="icon">✓</span> Real Paid Stipends</div>
              <div className="hero-trust-item"><span className="icon">✓</span> University-Accredited</div>
              <div className="hero-trust-item"><span className="icon">✓</span> IoT & Sensor-Driven</div>
              <div className="hero-trust-item"><span className="icon">✓</span> Dual Mentor Evaluations</div>
            </div>
          </div>

          {/* Frameless Realistic Emerald Disc Showcase with On-Disc Live Telemetry */}
          <div className="hero-disc-showcase">
            {/* Realistic Emerald Rotating Disc with On-Disc Live Registered Data */}
            <div className="realistic-disc-stage">
              <RealisticDisc
                liveStudents={liveStudents}
                liveFarmers={liveFarmers}
                liveColleges={liveColleges}
              />
            </div>

            {/* High-Contrast Sync Indicator below the Disc */}
            <div className="disc-live-status-pill">
              <span className="pulse-live-dot" />
              <span className="pill-status-label">● LIVE NETWORK SYNC</span>
              <span className="pill-status-sep">·</span>
              <span className="pill-status-desc">REAL-TIME REGISTRATION TELEMETRY</span>
            </div>
          </div>
        </section>

        {/* Live Platform Metric Strip (5 Cards) */}
        <section id="stats" className="metric-strip-v2">
          <div className="metric-card">
            <span className="metric-card-icon">🌱</span>
            <strong>{liveStudents}</strong>
            <b>Agricultural Students</b>
            <span>Verified talent registered on the platform</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-icon">🚜</span>
            <strong>{liveFarmers}</strong>
            <b>Partner Farms</b>
            <span>Progressive enterprises offering hands-on training</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-icon">🏛️</span>
            <strong>{liveColleges}</strong>
            <b>Colleges & Institutions</b>
            <span>Accrediting real field hours for degree requirements</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-icon">✓</span>
            <strong>{stats.placements ?? 1}</strong>
            <b>Verified Placements</b>
            <span>Active candidates deployed on field projects</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-icon">★</span>
            <strong>98.6%</strong>
            <b>Task Completion Rate</b>
            <span>Milestones audited by farm supervisors</span>
          </div>
        </section>

        {/* FarmIntern Core Project Ecosystem (Students, Farmers & Colleges) */}
        <section id="features" className="features-showcase-section">
          <div className="features-head">
            <small>THE FARMINTERN INTERNSHIP ECOSYSTEM</small>
            <h2>Bridging agricultural education with real field experience.</h2>
            <p>
              FarmIntern replaces manual logbooks and fragmented coordination with a unified operating system that connects students, progressive farm mentors, and agricultural universities for accredited, verified experiential learning.
            </p>
          </div>

          <div className="features-showcase-grid">
            {projectFeatures.map(f => (
              <div className="feature-showcase-card" key={f.title}>
                <div className="feature-card-media-wrap">
                  <img src={f.image} alt={f.title} className="feature-card-img" loading="lazy" />
                  <div className="feature-media-overlay" />
                  <span className="feature-category-badge">{f.tag}</span>
                  <span className="feature-stat-pill">{f.stats}</span>
                </div>
                <div className="feature-card-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="feature-highlights-list">
                    {f.highlights.map((h, idx) => (
                      <div className="feature-highlight-item" key={idx}>
                        <span className="feature-highlight-check">✦</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div className="feature-card-cta">
                    <button className="feature-explore-btn" onClick={() => enter(f.portalKey)}>
                      {f.ctaText} <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AgTech Specialization Tracks */}
        <section id="domains" className="domains-section">
          <div className="domains-head">
            <small>PRACTICAL CURRICULUM & FIELD TRACKS</small>
            <h2>Master the frontiers of modern agriculture.</h2>
            <p>
              FarmIntern structures agricultural internships into specialized industry tracks, combining field-tested manual agronomy with state-of-the-art sensor technologies.
            </p>
          </div>
          <div className="domains-grid">
            {domains.map(d => (
              <div className="domain-card" key={d.title}>
                <div className="domain-card-media">
                  <img src={d.image} alt={d.title} className="domain-card-img" loading="lazy" />
                  <span className="domain-track-pill-overlay">{d.track}</span>
                </div>
                <div className="domain-card-body">
                  <div className="domain-badge-wrap">
                    <div className="domain-icon-box">{d.icon}</div>
                    <span className="domain-duration-pill">{d.duration}</span>
                  </div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                  <div className="domain-tags">
                    {d.tags.map(t => <span key={t}>#{t}</span>)}
                  </div>
                  <div className="domain-footer">
                    <div className="domain-stipend">
                      <small>Stipend Guide</small>
                      <strong>{d.stipend}</strong>
                    </div>
                    <button className="btn-track" onClick={() => enter('student')}>
                      Apply Track →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Three Dedicated Stakeholder Portals (Strictly NO Admin!) */}
        <section id="portals" className="portals-section-v2">
          <div className="portals-head">
            <small>TAILORED CONTROL SURFACES</small>
            <h2>One network. Three specialized portals.</h2>
            <p>
              Every stakeholder gets a dedicated workspace designed specifically for their role in the agricultural internship lifecycle.
            </p>
          </div>
          <div className="portals-grid-v2">
            {publicPortals.map(p => (
              <div className="portal-card-v2" key={p.key}>
                <div className="portal-card-top">
                  <div className={`portal-icon-v2 ${p.color}`}>{p.icon}</div>
                  <div>
                    <h3>{p.title}</h3>
                    <small>{p.roleName}</small>
                  </div>
                </div>
                <p className="tagline">{p.tagline}</p>
                <ul className="portal-feature-list">
                  {p.features.map((f, idx) => (
                    <li key={idx}>
                      <span className="chk">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Btn kind={p.key === 'student' ? 'primary' : 'dark'} onClick={() => enter(p.key)}>
                  Enter {p.title} <span>→</span>
                </Btn>
              </div>
            ))}
          </div>
        </section>

        {/* The 4-Step Field Journey */}
        <section id="workflow" className="workflow-section-v2">
          <div className="workflow-wrap">
            <div className="workflow-head">
              <small>THE FIELD-TO-CAREER PIPELINE</small>
              <h2>How FarmIntern moves agricultural careers forward.</h2>
              <p>
                From initial application through daily task execution and dual evaluations, every interaction is recorded in a unified audit log.
              </p>
            </div>
            <div className="workflow-grid-v2">
              <div className="workflow-step-card">
                <span className="step-num-badge">STEP 01</span>
                <h3>Match & Apply</h3>
                <p>Students browse verified farm opportunities filtered by crop specialty, equipment, stipend, and geographic region.</p>
              </div>
              <div className="workflow-step-card">
                <span className="step-num-badge">STEP 02</span>
                <h3>Selection & Onboarding</h3>
                <p>Farm partners review candidates backed by college profiles. Formal placements are generated directly upon hiring.</p>
              </div>
              <div className="workflow-step-card">
                <span className="step-num-badge">STEP 03</span>
                <h3>Field Execution & Tasks</h3>
                <p>Farm supervisors assign tasks with due dates. Students log 0–100% progress and field observations daily.</p>
              </div>
              <div className="workflow-step-card">
                <span className="step-num-badge">STEP 04</span>
                <h3>Dual Certification</h3>
                <p>Farm partners and college faculty publish evaluations. Verified performance becomes accredited proof of career readiness.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust, Safety & Institutional Compliance */}
        <section className="trust-standards-v2">
          <div className="standards-grid">
            <div className="standard-card">
              <span className="icon">🛡️</span>
              <h4>Verified Agricultural Partners</h4>
              <p>Every participating farm is pre-audited for mentorship safety, educational quality, and fair compensation standards.</p>
            </div>
            <div className="standard-card">
              <span className="icon">🎓</span>
              <h4>University Accreditation</h4>
              <p>Workflows align with agricultural university internship criteria for seamless credit transfer and academic recognition.</p>
            </div>
            <div className="standard-card">
              <span className="icon">💬</span>
              <h4>Integrated Communications</h4>
              <p>Built-in instant messaging and peer-to-peer WebRTC video/voice calls protect student contact privacy in the field.</p>
            </div>
            <div className="standard-card">
              <span className="icon">📊</span>
              <h4>Tamper-Proof Audit Trails</h4>
              <p>Task logs, supervisor reviews, and performance ratings are permanently preserved in the central database.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="cta-banner-v2">
          <div className="cta-box-inner">
            <small>CULTIVATE YOUR FUTURE</small>
            <h2>Ready to transform hands-on agriculture into career proof?</h2>
            <p>
              Join students, progressive farm partners, and universities collaborating on India's premier agricultural internship operating system.
            </p>
            <div className="cta-buttons">
              <Btn onClick={() => enter()} style={{ minHeight: '50px', padding: '0 30px', fontSize: '15px' }}>
                Enter Workspace Now <span>→</span>
              </Btn>
              <Btn kind="light" onClick={() => enter('student')} style={{ minHeight: '50px', padding: '0 26px', fontSize: '15px' }}>
                Explore Open Internships <span>↗</span>
              </Btn>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Professional Footer (Strictly NO Admin Links!) */}
      <footer className="landing-footer-v2">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <Logo />
            <p>
              FarmIntern is the operating system for agricultural internships. Bridging universities, modern farms, and aspiring agronomy leaders through verified field execution.
            </p>
          </div>
          <div className="footer-nav-cols">
            <div className="footer-col">
              <h5>Stakeholder Portals</h5>
              <a href="#portals" onClick={e => { e.preventDefault(); enter('student'); }}>Student Workspace</a>
              <a href="#portals" onClick={e => { e.preventDefault(); enter('farmer'); }}>Farm Partner Command</a>
              <a href="#portals" onClick={e => { e.preventDefault(); enter('college'); }}>College Intelligence</a>
            </div>
            <div className="footer-col">
              <h5>AgTech Tracks</h5>
              <a href="#domains">Precision Agriculture</a>
              <a href="#domains">CEA Hydroponics</a>
              <a href="#domains">Soil & Regenerative</a>
              <a href="#domains">Agri-Robotics</a>
            </div>
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#workflow">Workflow Pipeline</a>
              <a href="#stats">Platform Telemetry</a>
              <a href="#system">Safety & Standards</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-row">
          <span>FarmIntern Operating System · Platform v4.0 · All Rights Reserved</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>● Status: All Systems Operational</span>
            <span>Accredited Field Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const d = await post('/admin/login', { email, password });
      saveSession(d, remember);
      onLogin(d.user);
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials or insufficient authorization.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleAdmin = async () => {
    setBusy(true);
    setError('');
    try {
      const d = await post('/admin/google', {});
      saveSession(d, remember);
      onLogin(d.user);
    } catch (err) {
      setError(err.message || 'Google administrative authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-backdrop">
        <div className="admin-grid-lines" />
        <div className="admin-radar-glow" />
      </div>
      <div className="admin-login-card">
        <div className="admin-card-header">
          <Logo light />
          <div className="admin-security-pill">
            <span className="live-dot" />
            <span>CONFIDENTIAL CONSOLE · RESTRICTED ACCESS</span>
          </div>
        </div>
        <div className="admin-card-title">
          <small>INTERNAL SYSTEMS // LEVEL 4 AUTHORIZATION</small>
          <h2>Platform Command <span>Access.</span></h2>
          <p>
            Restricted interface for platform administrators. Enter verified credentials to access system management, verification queues, and audit telemetry.
          </p>
        </div>

        <form onSubmit={submit} className="admin-form">
          <label>
            Administrative Email
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="admin@farmintern.local"
            />
          </label>
          <label>
            Password
            <div className="password-wrap">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
              />
              <button type="button" onClick={() => setShow(v => !v)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <div className="auth-row">
            <label className="check-label">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Keep session active
            </label>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          <Btn type="submit" disabled={busy} loading={busy} kind="primary" style={{ width: '100%', marginTop: '10px' }}>
            Authenticate & Access Command Console <span>→</span>
          </Btn>

          <div className="auth-divider"><span>OR</span></div>
          <button type="button" className="btn-google" onClick={handleGoogleAdmin} disabled={busy}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="admin-security-notice">
          <div className="notice-icon">🔒</div>
          <div>
            <b>Security Notice & Audit Compliance</b>
            <p>Access is restricted strictly to authorized administrators. All activities, telemetry events, and authentication attempts are logged for security auditing.</p>
          </div>
        </div>

        <div className="admin-card-footer">
          <button type="button" className="admin-back-btn" onClick={onBack}>
            ← Return to Public Platform
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminForbidden({ user, onLeave, onLogout }) {
  return (
    <div className="admin-login-layout">
      <div className="admin-login-backdrop">
        <div className="admin-grid-lines" />
      </div>
      <div className="admin-login-card admin-forbidden-card">
        <div className="admin-card-header">
          <Logo light />
          <div className="admin-security-pill error">
            <span className="live-dot" style={{ background: '#ff4d4f', boxShadow: '0 0 10px #ff4d4f' }} />
            <span>ACCESS RESTRICTED · 403 FORBIDDEN</span>
          </div>
        </div>
        <div className="admin-card-title">
          <small>INSUFFICIENT PERMISSIONS</small>
          <h2>Administrative Clearance <span>Required.</span></h2>
          <p>
            You are currently authenticated as <strong>{user?.name}</strong> with the role <strong>{user?.role?.toUpperCase()}</strong>.
            This area requires platform administrator privileges.
          </p>
        </div>
        <div className="admin-forbidden-actions">
          <Btn onClick={onLeave} kind="primary">
            Return to My Workspace <span>↗</span>
          </Btn>
          <Btn onClick={onLogout} kind="ghost">
            Sign Out of Account
          </Btn>
        </div>
      </div>
    </div>
  );
}


function PasswordReset({ onBack, initialToken = '' }) {
  const [token, setToken] = useState(initialToken || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sentInfo, setSentInfo] = useState(null);
  const [targetAccount, setTargetAccount] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // SMTP Setup State for delivering to real inboxes
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [showSmtpSetup, setShowSmtpSetup] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [smtpError, setSmtpError] = useState('');
  const [smtpSuccess, setSmtpSuccess] = useState('');

  useEffect(() => {
    api('/auth/smtp-status')
      .then(res => setSmtpStatus(res))
      .catch(() => {});
  }, []);

  const handleConfigureSmtp = async e => {
    e.preventDefault();
    setSmtpSaving(true);
    setSmtpError('');
    setSmtpSuccess('');
    try {
      const res = await api('/auth/smtp-configure', {
        method: 'POST',
        body: JSON.stringify({ user: smtpUser.trim(), password: smtpPassword.trim() })
      });
      setSmtpSuccess(res.message);
      setSmtpStatus({ configured: true, sender: smtpUser.trim(), host: 'smtp.gmail.com', port: 587 });
      setShowSmtpSetup(false);
    } catch (err) {
      setSmtpError(err.message);
    } finally {
      setSmtpSaving(false);
    }
  };

  const strength = password.length < 6 ? 'Too short' : password.length < 10 ? 'Fair' : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 'Strong' : 'Good';

  const request = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    setSentInfo(null);
    try {
      const d = await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      const results = d.results || (d.token ? [{ email: d.email, token: d.token, reset_url: d.reset_url, name: d.name || '' }] : []);
      setSentInfo({
        count: d.count || results.length,
        emails: d.emails || (d.email ? [d.email] : []),
        results,
        message: d.message,
        smtp_configured: d.smtp_configured
      });
      setMessage(d.message || `Password reset link dispatched to ${email}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const d = await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });
      setMessage(d.message || 'Password updated successfully. You can sign in now.');
      setToken('');
      setPassword('');
      setConfirm('');
      setTargetAccount('');
      setTimeout(onBack, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-v2 auth-single">
      <div className="login-visual">
        <Logo light />
        <div className="login-visual-content">
          <Pill tone="outline">ACCOUNT RECOVERY</Pill>
          <h1>Get back to<br /><span>your workspace.</span></h1>
          <p>Secure password recovery with verified reset links sent directly to your email inbox.</p>
          <div className="login-stack">
            <div><b>01</b><span>Enter any email(s)</span></div>
            <div><b>02</b><span>Receive link in inbox</span></div>
            <div><b>03</b><span>Set new password</span></div>
          </div>
        </div>
      </div>
      <div className="login-panel">
        <button className="back-link" onClick={onBack}>← Back to sign in</button>
        <div className="login-box">
          <small>ACCOUNT RECOVERY</small>
          <h2>{token ? 'Create a new' : 'Forgot your'}<br /><span>{token ? 'password.' : 'password?'}</span></h2>

          {/* Live Inbox Delivery Status Banner */}
          {!token && (
            <div style={{
              background: smtpStatus?.configured ? '#eaf5ee' : '#fdf8ea',
              border: `1px solid ${smtpStatus?.configured ? '#c2e4cc' : '#f0dd9d'}`,
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '16px',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div>
                <span style={{ fontWeight: 700, color: smtpStatus?.configured ? '#1e8b50' : '#8f5b00' }}>
                  {smtpStatus?.configured ? '✓ Live Inbox Delivery Active' : '📬 Live Inbox Delivery'}
                </span>
                <p style={{ margin: '2px 0 0', color: '#57695e', fontSize: '11.5px' }}>
                  {smtpStatus?.configured
                    ? `Emails send directly to recipient inboxes via ${smtpStatus.sender}`
                    : 'Configure Gmail to deliver real reset emails to inboxes'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSmtpSetup(v => !v)}
                style={{
                  background: smtpStatus?.configured ? '#ffffff' : '#1e8b50',
                  color: smtpStatus?.configured ? '#1e8b50' : '#ffffff',
                  border: smtpStatus?.configured ? '1px solid #c2e4cc' : 'none',
                  borderRadius: '6px',
                  padding: '5px 9px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {showSmtpSetup ? 'Close' : smtpStatus?.configured ? 'Edit' : 'Setup Inbox'}
              </button>
            </div>
          )}

          {/* Collapsible SMTP Configuration Form */}
          {!token && showSmtpSetup && (
            <form onSubmit={handleConfigureSmtp} style={{
              background: '#f8faf9',
              border: '1px solid #d8e5dc',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <b style={{ color: '#17241b', display: 'block', marginBottom: '4px' }}>Connect Gmail for Live Inbox Delivery</b>
              <p style={{ margin: '0 0 10px', color: '#687e70', fontSize: '12px', lineHeight: '1.4' }}>
                Enter your Gmail address and a 16-character <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: '#1e8b50', textDecoration: 'underline' }}>Google App Password</a> to send emails from your own Gmail.
              </p>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                Gmail Address
                <input
                  type="email"
                  value={smtpUser}
                  onChange={e => setSmtpUser(e.target.value)}
                  placeholder="your_email@gmail.com"
                  required
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #c8d9ce', marginTop: '3px', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '10px' }}>
                16-Character App Password
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={e => setSmtpPassword(e.target.value)}
                  placeholder="abcd efgh ijkl mnop"
                  required
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #c8d9ce', marginTop: '3px', boxSizing: 'border-box' }}
                />
              </label>
              {smtpError && <div className="form-error" style={{ marginBottom: '8px', fontSize: '11.5px' }}>{smtpError}</div>}
              {smtpSuccess && <div className="form-success" style={{ marginBottom: '8px', fontSize: '11.5px' }}>✓ {smtpSuccess}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn type="submit" loading={smtpSaving} style={{ flex: 1, minHeight: '36px', fontSize: '12.5px' }}>
                  Save & Enable Inbox Delivery
                </Btn>
              </div>
            </form>
          )}

          {!token ? (
            !sentInfo ? (
              <form onSubmit={request}>
                <label>
                  Email address(es) to reset
                  <span style={{ display: 'block', fontSize: '12px', color: '#687e70', fontWeight: 400, marginTop: '2px', marginBottom: '6px' }}>
                    Enter any email (or multiple separated by commas). Reset links will be dispatched to all entered inboxes.
                  </span>
                  <textarea
                    rows={2}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. your_email@gmail.com, another_email@gmail.com"
                    autoComplete="email"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #d0dcd4',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.4',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </label>
                {error && <div className="form-error">{error}</div>}
                <Btn type="submit" loading={busy}>
                  Send Reset Link to Inbox →
                </Btn>
              </form>
            ) : (
              <div style={{ background: '#f7faf8', padding: '22px', borderRadius: '16px', border: '1px solid #d4e2d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e8b50', fontWeight: '800', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>✓</span>
                  <span>
                    {sentInfo.results?.length > 1
                      ? `Reset links dispatched to ${sentInfo.results.length} email inboxes`
                      : 'Reset link dispatched to inbox'}
                  </span>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#3d4d42', lineHeight: '1.5' }}>
                  {sentInfo.message}
                </p>

                <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                  {sentInfo.results?.map(item => (
                    <div
                      key={item.email}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e1ebe3',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: '#e8f5ec',
                            color: '#1e8b50',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                            fontSize: '12px'
                          }}>
                            {(item.name || item.email || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <b style={{ fontSize: '13.5px', color: '#17241b', display: 'block' }}>{item.email}</b>
                            <span style={{ fontSize: '11.5px', color: '#687e70', textTransform: 'capitalize' }}>
                              {item.name ? `${item.name} (${item.role || 'Member'})` : 'Account ready'}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', background: '#eaf4ee', color: '#1e8b50', padding: '2px 7px', borderRadius: '6px', fontWeight: 600 }}>
                          Email Dispatched
                        </span>
                      </div>

                      <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#57695e', lineHeight: '1.4' }}>
                        A secure password reset link has been dispatched to <b>{item.email}</b>. Please check your inbox and click the link to set your new password.
                      </p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <a
                          href={item.email && item.email.endsWith('@gmail.com') ? `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(item.email)}` : 'https://mail.google.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="btn ghost"
                          style={{ textDecoration: 'none', textAlign: 'center', fontSize: '12.5px', padding: '8px 12px', minHeight: '36px', width: '100%', boxSizing: 'border-box' }}
                        >
                          Open Email Inbox ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderTop: '1px solid #e2ebe4', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSentInfo(null);
                      setError('');
                      setMessage('');
                    }}
                    style={{ background: 'transparent', color: '#57695e', cursor: 'pointer', padding: 0, fontWeight: 700, border: 'none' }}
                  >
                    ← Send to another email
                  </button>
                  <span style={{ color: '#889a8e' }}>Reset link valid for 30 minutes</span>
                </div>
              </div>
            )
          ) : (
            <form onSubmit={reset}>
              {targetAccount && (
                <div style={{ marginBottom: '14px', padding: '10px 12px', background: '#f0f7f2', border: '1px solid #d2e4d7', borderRadius: '8px', fontSize: '13px', color: '#274b33' }}>
                  Updating password for: <b>{targetAccount}</b>
                </div>
              )}
              <label>
                New password
                <div className="password-wrap">
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={show ? 'text' : 'password'}
                    minLength="8"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShow(v => !v)}>{show ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              <div className={`password-strength ${strength.toLowerCase().replace(' ', '-')}`}>
                <span />
                <b>{strength}</b>
                <small>At least 8 characters with a letter and a number.</small>
              </div>
              <label>
                Confirm password
                <input
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                />
              </label>
              {error && <div className="form-error">{error}</div>}
              {message && <div className="form-success">✓ {message}</div>}
              <Btn type="submit" loading={busy}>Update password</Btn>
            </form>
          )}

          <button className="auth-link-button" onClick={onBack}>← Return to sign in</button>
        </div>
      </div>
    </div>
  );
}

const MOCK_PROJECT_EMAILS = new Set([
  'alex.morgan.student@gmail.com',
  'david.miller.farms@gmail.com',
  'sarah.jenkins.agri@gmail.com',
  'mani@gmail.com',
  'farmer@gmail.com',
  'ravi@gmail.com',
  'college@gmail.com',
  'lollapujitha7@gmail.com',
  'raghav@gmail.com',
  'ram@gmail.com',
  'narasimha@gmail.com',
  'student.field@gmail.com',
  'pujitha.real@gmail.com'
]);

function getStoredDeviceGoogleAccounts() {
  try {
    const raw = localStorage.getItem('fi_device_google_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Exclude all mock project registered emails
        return parsed.filter(a => a && a.email && !MOCK_PROJECT_EMAILS.has(a.email.toLowerCase()) && !a.email.endsWith('@farmintern.local'));
      }
    }
  } catch (e) {
    console.warn('Error reading device accounts:', e);
  }
  return [];
}

function storeDeviceGoogleAccount(acc) {
  try {
    if (MOCK_PROJECT_EMAILS.has(acc.email.toLowerCase()) || acc.email.endsWith('@farmintern.local')) {
      return;
    }
    const current = getStoredDeviceGoogleAccounts().filter(
      a => a.email.toLowerCase() !== acc.email.toLowerCase()
    );
    const updated = [acc, ...current].slice(0, 5);
    localStorage.setItem('fi_device_google_accounts', JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving device account:', e);
  }
}

function removeDeviceGoogleAccount(email) {
  try {
    const current = getStoredDeviceGoogleAccounts().filter(
      a => a.email.toLowerCase() !== email.toLowerCase()
    );
    localStorage.setItem('fi_device_google_accounts', JSON.stringify(current));
  } catch (e) {
    console.warn('Error removing device account:', e);
  }
}

function triggerGoogleAuth({ role, onLogin, onError, onPromptSetup }) {
  const effectiveClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('fi_google_client_id') || '').trim();

  if (effectiveClientId && window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: effectiveClientId,
        scope: 'email profile openid',
        callback: async (res) => {
          if (res.error) {
            if (res.error !== 'popup_closed_by_user') {
              onError?.(`Google sign-in error: ${res.error_description || res.error}`);
            }
            return;
          }
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${res.access_token}` }
            });
            const profile = await userInfoRes.json();
            if (!profile.email) throw new Error('No verified email returned from Google.');
            storeDeviceGoogleAccount({
              name: profile.name || profile.given_name || profile.email.split('@')[0],
              email: profile.email,
              role
            });
            const d = await post('/auth/google', {
              role,
              email: profile.email,
              name: profile.name || profile.given_name || profile.email.split('@')[0],
              credential: res.access_token
            });
            saveSession(d, true);
            window.dispatchEvent(new Event('fi-stats-updated'));
            onLogin?.(d.user);
          } catch (err) {
            onError?.(err.message || 'Google sign-in could not be completed.');
          }
        }
      });
      client.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (err) {
      console.warn('OAuth2 client init error, opening account chooser:', err);
    }
  }

  onPromptSetup();
}

function GoogleAuthModal({ isOpen, onClose, role, onLogin, initialEmail = '' }) {
  const [deviceAccounts, setDeviceAccounts] = useState(() => getStoredDeviceGoogleAccounts());
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newEmail, setNewEmail] = useState(initialEmail || '');
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [configClientId, setConfigClientId] = useState(() => localStorage.getItem('fi_google_client_id') || '');
  const [showConfig, setShowConfig] = useState(false);
  const gsiBtnRef = useRef(null);

  const effectiveClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || configClientId || '').trim();

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setNewEmail(initialEmail || '');
    const current = getStoredDeviceGoogleAccounts();
    setDeviceAccounts(current);
    setShowAddAccount(current.length === 0);

    if (effectiveClientId && window.google?.accounts?.id && gsiBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: effectiveClientId,
          callback: async (res) => {
            if (res.credential) {
              await doAuthWithCredential(res.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });
        gsiBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(gsiBtnRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'continue_with',
          logo_alignment: 'left',
          width: 320
        });
      } catch (err) {
        console.warn('Google GSI button notice:', err);
      }
    }
  }, [isOpen, role, effectiveClientId, initialEmail]);

  const doAuthWithCredential = async (credential) => {
    setBusy(true);
    setError('');
    try {
      const d = await post('/auth/google', { role, credential });
      saveSession(d, true);
      window.dispatchEvent(new Event('fi-stats-updated'));
      onClose();
      onLogin(d.user);
    } catch (err) {
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const handleSelectAccount = async (acc) => {
    setBusy(true);
    setError('');
    try {
      const accountRole = acc.role || role || 'student';
      storeDeviceGoogleAccount({
        name: acc.name,
        email: acc.email,
        role: accountRole
      });
      const d = await post('/auth/google', {
        role: accountRole,
        email: acc.email.trim().toLowerCase(),
        name: acc.name
      });
      saveSession(d, true);
      window.dispatchEvent(new Event('fi-stats-updated'));
      onClose();
      onLogin(d.user);
    } catch (err) {
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddNewAccount = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setBusy(true);
    setError('');
    try {
      const cleanEmail = newEmail.trim().toLowerCase();
      const derivedName = newName.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const accountRole = role || 'student';
      storeDeviceGoogleAccount({
        name: derivedName,
        email: cleanEmail,
        role: accountRole
      });
      const d = await post('/auth/google', {
        role: accountRole,
        email: cleanEmail,
        name: derivedName
      });
      saveSession(d, true);
      window.dispatchEvent(new Event('fi-stats-updated'));
      onClose();
      onLogin(d.user);
    } catch (err) {
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveAccount = (e, email) => {
    e.stopPropagation();
    removeDeviceGoogleAccount(email);
    const updated = getStoredDeviceGoogleAccounts();
    setDeviceAccounts(updated);
    if (updated.length === 0) setShowAddAccount(true);
  };

  const handleSaveOAuth = (e) => {
    e.preventDefault();
    const val = configClientId.trim();
    if (!val) {
      setError('Please enter a valid Google OAuth Client ID.');
      return;
    }
    localStorage.setItem('fi_google_client_id', val);
    setError('');
    setShowConfig(false);
    onClose();
    triggerGoogleAuth({
      role,
      onLogin,
      onError: err => setError(err),
      onPromptSetup: () => {}
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-layer" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="google-modal-wrap">
        <div className="google-modal-header">
          <GoogleIcon />
          <h3>Sign in with Google</h3>
          <p>Continue to <b>FarmIntern</b> with your Google account</p>
        </div>

        {error && <div className="form-error" style={{ marginBottom: '14px' }}>{error}</div>}

        {effectiveClientId && (
          <div className="google-gsi-wrap" style={{ marginBottom: '16px' }}>
            <div ref={gsiBtnRef} />
            <div className="auth-divider" style={{ width: '100%', margin: '14px 0 10px' }}>
              <span>OR ENTER GOOGLE EMAIL</span>
            </div>
          </div>
        )}

        {deviceAccounts.length > 0 && !showAddAccount && (
          <div className="google-account-list">
            <small style={{ fontSize: '11.5px', color: '#5f6368', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
              ACCOUNTS SAVED ON THIS DEVICE
            </small>
            {deviceAccounts.map((acc, idx) => (
              <button
                key={acc.email + idx}
                type="button"
                className="google-account-item"
                onClick={() => handleSelectAccount(acc)}
                disabled={busy}
              >
                <div className={`google-avatar ${acc.role || role || 'student'}`}>
                  {(acc.name || acc.email)[0].toUpperCase()}
                </div>
                <div className="google-account-info">
                  <b>{acc.name || acc.email.split('@')[0]}</b>
                  <span>{acc.email}</span>
                </div>
                <button
                  type="button"
                  title="Remove from device"
                  onClick={(e) => handleRemoveAccount(e, acc.email)}
                  style={{ background: 'transparent', border: 'none', color: '#9aa0a6', cursor: 'pointer', padding: '4px', fontSize: '14px' }}
                >
                  ✕
                </button>
              </button>
            ))}

            <button
              type="button"
              className="google-account-item"
              onClick={() => setShowAddAccount(true)}
              style={{ borderStyle: 'dashed', borderColor: '#1a73e8', marginTop: '6px' }}
            >
              <div className="google-avatar default" style={{ background: '#e8f0fe', color: '#1a73e8' }}>
                ＋
              </div>
              <div className="google-account-info">
                <b style={{ color: '#1a73e8' }}>Use another Google account</b>
                <span>Enter any Gmail account on this device</span>
              </div>
            </button>
          </div>
        )}

        {showAddAccount && (
          <form onSubmit={handleAddNewAccount} className="google-custom-form" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '12.5px', marginBottom: '6px' }}>
              Google Email address
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="e.g. bathu3111@gmail.com"
                required
                autoFocus
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #c4c7c5', fontSize: '13.5px', marginTop: '4px' }}
              />
            </label>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '12.5px', marginBottom: '12px' }}>
              Your Name (optional)
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Vijay"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #c4c7c5', fontSize: '13.5px', marginTop: '4px' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {deviceAccounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  style={{ background: 'transparent', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#5f6368', fontSize: '13px' }}
                >
                  Back to accounts
                </button>
              )}
              <button
                type="submit"
                disabled={busy || !newEmail.trim()}
                className="btn primary"
                style={{ minHeight: '38px', padding: '0 18px', fontSize: '13px' }}
              >
                {busy ? 'Signing in…' : 'Continue as Google User →'}
              </button>
            </div>
          </form>
        )}

        <div className="google-config-toggle">
          <button type="button" onClick={() => setShowConfig(s => !s)}>
            {showConfig ? 'Hide Cloud OAuth configuration' : '⚙️ Google Cloud OAuth 2.0 Web Client ID'}
          </button>
        </div>

        {showConfig && (
          <div className="google-setup-card" style={{ marginTop: '12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11.5px', color: '#5f6368' }}>
              Enter your Google OAuth Web Client ID from Google Cloud Console to enable Google's native browser popup:
            </p>
            <form onSubmit={handleSaveOAuth} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="e.g. 123456-abc.apps.googleusercontent.com"
                value={configClientId}
                onChange={e => setConfigClientId(e.target.value)}
                style={{ margin: 0, fontSize: '12px', padding: '8px 10px', flex: 1 }}
              />
              <button type="submit" className="btn primary" style={{ minHeight: '34px', padding: '0 12px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                Save & Open Popup →
              </button>
            </form>
          </div>
        )}

        <div className="google-modal-footer">
          <span style={{ fontSize: '11px', color: '#70757a', maxWidth: '280px', lineHeight: 1.35 }}>
            To continue, Google will share your verified email with FarmIntern.
          </span>
          <button type="button" onClick={onClose} style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: '8px', border: '1px solid #dce2de' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Register({onBack,onSubmit,busy,error,onLogin}) {
  const [role,setRole]=useState('student'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[show,setShow]=useState(false),[terms,setTerms]=useState(false),[localError,setLocalError]=useState(''),[institution,setInstitution]=useState('');
  const [googleModal, setGoogleModal] = useState(false);
  const strength=password.length<6?'Too short':password.length<10?'Fair':/[A-Z]/.test(password)&&/[a-z]/.test(password)&&/[0-9]/.test(password)&&/[^A-Za-z0-9]/.test(password)?'Strong':'Good';
  const submit=e=>{e.preventDefault();setLocalError('');if(password!==confirm){setLocalError('Passwords do not match.');return}if(password.length<8||!/[A-Za-z]/.test(password)||!/\d/.test(password)){setLocalError('Password must be at least 8 characters and include a letter and a number.');return}if(!terms){setLocalError('Please accept the platform terms to continue.');return}onSubmit({name,email,password,role,institution})};
  const handleGoogleRegister = () => {
    setLocalError('');
    triggerGoogleAuth({
      role,
      onLogin: u => {
        window.dispatchEvent(new Event('fi-stats-updated'));
        onLogin?.(u);
      },
      onError: err => setLocalError(err),
      onPromptSetup: () => setGoogleModal(true)
    });
  };
  return <>
    <div className="login-v2 auth-single">
      <div className="login-visual"><Logo light/><div className="login-visual-content"><Pill tone="outline">JOIN THE NETWORK</Pill><h1>Build your<br/><span>field identity.</span></h1><p>Create a real FarmIntern account and enter the workspace that matches your role.</p><div className="login-stack"><div><b>01</b><span>Choose your portal</span></div><div><b>02</b><span>Build your profile</span></div><div><b>03</b><span>Start real workflows</span></div></div></div></div>
      <div className="login-panel">
        <button className="back-link" onClick={onBack}>← Back to sign in</button>
        <div className="login-box register-box">
          <small>CREATE ACCOUNT</small>
          <h2>Join the<br/><span>workspace.</span></h2>
          <div className="role-switch">
            {Object.entries(roles).filter(([r])=>r!=='admin').map(([r,m])=><button type="button" key={r} className={role===r?'active':''} onClick={()=>setRole(r)}>{m.name}</button>)}
          </div>
          <form onSubmit={submit}>
            <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required autoComplete="name"/></label>
            <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required autoComplete="email"/></label>
            {role!=='farmer'&&<label>{role==='college'?'College / institution name':'Your college / institution'}<input value={institution} onChange={e=>setInstitution(e.target.value)} maxLength="180" placeholder="e.g. RGUKT Ongole" required/></label>}
            <label>Password<div className="password-wrap"><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} minLength="8" required autoComplete="new-password"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?'Hide':'Show'}</button></div></label>
            <div className={`password-strength ${strength.toLowerCase().replace(' ','-')}`}><span/><b>{strength}</b><small>Use 8+ characters with upper/lowercase, number and symbol.</small></div>
            <label>Confirm password<input value={confirm} onChange={e=>setConfirm(e.target.value)} type={show?'text':'password'} required autoComplete="new-password"/></label>
            <label className="check-label terms"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)}/> I agree to the platform terms and understand my role will control my workspace.</label>
            {(localError||error)&&<div className="form-error">{localError||error}</div>}
            <Btn type="submit" disabled={busy} loading={busy}>Create account →</Btn>
            <div className="auth-divider"><span>OR</span></div>
            <button type="button" className="btn-google" onClick={handleGoogleRegister} disabled={busy}><GoogleIcon /><span>Continue with Google</span></button>
          </form>
          <button className="auth-link-button" onClick={onBack}>Already have an account? Sign in</button>
        </div>
      </div>
    </div>
    <GoogleAuthModal
      isOpen={googleModal}
      onClose={() => setGoogleModal(false)}
      role={role}
      initialEmail={email}
      onLogin={u => {
        window.dispatchEvent(new Event('fi-stats-updated'));
        onLogin?.(u);
      }}
    />
  </>;
}

function Overview({user,dash,notifications,setPage}) { const role=roles[user.role]; const cards=dash?.stats||[]; return <><div className={`overview-hero ${role.color}`}><div><small>{role.icon} {role.label.toUpperCase()}</small><h1>Good to see you, <span>{user.name.split(' ')[0]}.</span></h1><p>{role.tagline} Your workspace is connected to live platform data.</p><div className="hero-actions"><Btn onClick={()=>setPage(user.role==='student'?'explore':user.role==='farmer'?'opportunities':user.role==='college'?'students':'users')}>Continue work →</Btn><Btn kind="soft" onClick={()=>setPage('messages')}>Open messages</Btn></div></div><div className="focus-ring"><span>FOCUS</span><strong>{dash?.focus||0}<small>%</small></strong><em>current signal</em></div></div><div className="stat-grid-v2">{cards.map((s,i)=><Stat key={s[0]} label={s[0]} value={s[1]} meta="Live database metric" icon={['◈','✓','↗','★'][i]||'•'}/>)}</div><div className="overview-grid"><Section eyebrow="QUICK ACTIONS" title="Move something forward" sub="Shortcuts connected to real workflows."><div className="quick-grid">{quickActions(user.role).map(a=><button key={a[0]} onClick={()=>setPage(a[1])}><span>{a[2]}</span><b>{a[0]}</b><small>{a[3]}</small><i>↗</i></button>)}</div></Section><Section eyebrow="LATEST SIGNALS" title="Recent notifications" action={<Btn kind="text" onClick={()=>setPage('notifications')}>View all →</Btn>}>{notifications.slice(0,4).map(n=><div className={`signal ${n.read?'':'new'}`} key={n.id}><span>•</span><div><b>{n.title}</b><p>{n.body}</p></div><small>{new Date(n.created_at).toLocaleDateString()}</small></div>)}{!notifications.length&&<Empty title="All clear" body="New workflow events will appear here."/>}</Section></div></> }
function quickActions(role){if(role==='student')return [['Find an internship','explore','◈','Search live opportunities'],['Track applications','applications','✓','See every decision'],['Update progress','progress','↗','Keep tasks current'],['Message a partner','messages','◌','Continue a conversation']];if(role==='farmer')return [['Publish opportunity','opportunities','＋','Create a real internship'],['Review applicants','applicants','♧','Move candidates forward'],['Assign field work','tasks','↗','Create student tasks'],['Evaluate students','evaluations','★','Record outcomes']];if(role==='college')return [['Monitor students','students','♧','Open student intelligence'],['Monitor internships','monitor','◈','Inspect live opportunities'],['Track outcomes','progress','↗','Track internship outcomes'],['Publish feedback','evaluations','★','Record college feedback']];return [['Manage users','users','♧','Verify and manage platform accounts'],['Monitor internships','internships','◈','Inspect every opportunity'],['Monitor applications','applications','✓','Review every application'],['Open reports','reports','▦','Read live platform metrics']];}



function Login({ onLogin, onBack, initialRole = 'student' }) {
  const [role, setRole] = useState(initialRole || 'student'), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [show, setShow] = useState(false), [remember, setRemember] = useState(true), [error, setError] = useState(''), [busy, setBusy] = useState(false), [mode, setMode] = useState('login');
  const [googleModal, setGoogleModal] = useState(false);

  useEffect(() => {
    if (initialRole && ['student', 'farmer', 'college'].includes(initialRole)) {
      setRole(initialRole);
    }
  }, [initialRole]);

  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const d = await post('/auth/login', { email, password, role });
      saveSession(d, remember);
      onLogin(d.user);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const register = async data => {
    setBusy(true); setError('');
    try {
      const d = await post('/auth/register', data);
      saveSession(d, true);
      window.dispatchEvent(new Event('fi-stats-updated'));
      onLogin(d.user);
    }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const handleGoogleLogin = () => {
    setError('');
    triggerGoogleAuth({
      role,
      onLogin,
      onError: err => setError(err),
      onPromptSetup: () => setGoogleModal(true)
    });
  };

  if (mode === 'register') return <Register onBack={() => { setMode('login'); setError(''); }} onSubmit={register} onLogin={onLogin} busy={busy} error={error} />;
  if (mode === 'forgot') return <PasswordReset onBack={() => { setMode('login'); setError(''); }} />;
  return (
    <div className="login-v2">
      <div className="login-visual">
        <Logo light />
        <div className="login-visual-content">
          <Pill tone="outline">FARMINTERN</Pill>
          <h1>Your field.<br /><span>Your future.</span></h1>
          <p>A connected workspace where agricultural experience becomes measurable career growth.</p>
          <div className="login-stack">
            <div><b>01</b><span>Real workflows</span></div>
            <div><b>02</b><span>Live progress</span></div>
            <div><b>03</b><span>Connected roles</span></div>
          </div>
        </div>
      </div>
      <div className="login-panel">
        <button className="back-link" onClick={onBack}>← Back to home</button>
        <div className="login-box">
          <small>WELCOME BACK</small>
          <h2>Enter your<br /><span>workspace.</span></h2>
          <div className="role-switch">
            {Object.entries(roles).filter(([r]) => r !== 'admin').map(([r, m]) => (
              <button
                type="button"
                key={r}
                className={role === r ? 'active' : ''}
                onClick={() => { setRole(r); setError(''); }}
              >
                {m.name}
              </button>
            ))}
          </div>
          <form onSubmit={submit}>
            <label>
              Email
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <div className="password-wrap">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShow(v => !v)}>
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <div className="auth-row">
              <label className="check-label">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="text-action" onClick={() => setMode('forgot')}>
                Forgot password?
              </button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <Btn type="submit" disabled={busy} loading={busy}>Enter workspace</Btn>
            <div className="auth-divider"><span>OR</span></div>
            <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={busy}>
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
          </form>
          {role !== 'admin' && (
            <>
              <div className="auth-divider"><span>NEW TO FARMINTERN?</span></div>
              <button className="create-account" onClick={() => { setMode('register'); setError(''); }}>
                ＋ Create an account <span>→</span>
              </button>
            </>
          )}
        </div>
      </div>
      <GoogleAuthModal
        isOpen={googleModal}
        onClose={() => setGoogleModal(false)}
        role={role}
        initialEmail={email}
        onLogin={onLogin}
      />
    </div>
  );
}

function App() {
  const isReset = window.location.pathname === '/reset-password';
  const isAdminPath = window.location.pathname === '/admin/login' || window.location.pathname === '/admin';
  const isAppPath = window.location.pathname === '/app';
  const isLoginPath = window.location.pathname === '/login';
  const resetToken = isReset ? (new URLSearchParams(window.location.search).get('token') || '') : null;
  const hasSession = !!getToken();
  const initialUser = hasSession ? loadUser() : null;

  const [screen, setScreen] = useState(() => {
    if (resetToken !== null) return 'reset';
    if (isAdminPath) {
      if (!hasSession || !initialUser) return 'admin-login';
      return initialUser.role === 'admin' ? 'app' : 'admin-forbidden';
    }
    if (isAppPath) {
      return hasSession ? 'app' : 'landing';
    }
    if (isLoginPath) {
      return 'login';
    }
    // When opened at root "/" or fresh startup, ALWAYS open the landing page!
    return 'landing';
  });

  const [loginRole, setLoginRole] = useState('student');
  const [user, setUser] = useState(initialUser);
  const [checking, setChecking] = useState(hasSession && resetToken === null && (isAppPath || isAdminPath));

  const navigateTo = (path, newScreen) => {
    window.history.pushState(null, '', path);
    setScreen(newScreen);
  };

  const leaveReset = () => {
    window.history.replaceState(null, '', '/');
    setScreen('login');
  };

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    if (window.location.pathname === '/admin/login' || window.location.pathname === '/admin') {
      window.history.replaceState(null, '', '/admin/login');
      setScreen('admin-login');
    } else {
      window.history.replaceState(null, '', '/');
      setScreen('landing');
    }
  }, []);

  useEffect(() => {
    if (!hasSession) return;
    api('/auth/me')
      .then(u => {
        setUser(u);
        storeUser(u);
        const currentPath = window.location.pathname;
        if (currentPath === '/admin/login' || currentPath === '/admin') {
          setScreen(u.role === 'admin' ? 'app' : 'admin-forbidden');
        } else if (currentPath === '/app') {
          setScreen('app');
        }
      })
      .catch(() => {
        clearSession();
        setUser(null);
        const currentPath = window.location.pathname;
        if (currentPath === '/admin/login' || currentPath === '/admin') {
          setScreen('admin-login');
        } else if (currentPath === '/app') {
          setScreen('landing');
        }
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const expired = () => {
      setUser(null);
      if (window.location.pathname === '/admin/login' || window.location.pathname === '/admin') {
        setScreen('admin-login');
      } else {
        setScreen('login');
      }
    };
    window.addEventListener('fi-session-expired', expired);
    return () => window.removeEventListener('fi-session-expired', expired);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      const currentUser = loadUser();
      if (p === '/admin/login' || p === '/admin') {
        if (!currentUser) setScreen('admin-login');
        else setScreen(currentUser.role === 'admin' ? 'app' : 'admin-forbidden');
      } else if (p === '/reset-password') {
        setScreen('reset');
      } else if (p === '/app') {
        setScreen(currentUser ? 'app' : 'landing');
      } else if (p === '/login') {
        setScreen('login');
      } else {
        setScreen('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const login = u => {
    setUser(u);
    navigateTo('/app', 'app');
  };

  if (screen === 'reset') return <PasswordReset onBack={leaveReset} initialToken={resetToken || ''} />;
  if (checking) return <Loader />;
  if (screen === 'admin-login') {
    return <AdminLogin onLogin={login} onBack={() => navigateTo('/', 'landing')} />;
  }
  if (screen === 'admin-forbidden') {
    return <AdminForbidden user={user} onLeave={() => navigateTo('/', 'app')} onLogout={logout} />;
  }
  if (screen === 'landing') {
    return (
      <Landing
        user={user}
        onLogout={logout}
        enter={selectedRole => {
          if (user) {
            navigateTo('/app', 'app');
          } else {
            if (selectedRole && ['student', 'farmer', 'college'].includes(selectedRole)) {
              setLoginRole(selectedRole);
            }
            navigateTo('/login', 'login');
          }
        }}
      />
    );
  }
  if (screen === 'login' || !user) {
    return (
      <Login
        initialRole={loginRole}
        onLogin={login}
        onBack={() => {
          window.history.replaceState(null, '', '/');
          setScreen('landing');
        }}
      />
    );
  }
  return <Shell user={user} onLogout={logout} onUser={u => { setUser(u); storeUser(u); }} />;
}




function Shell({ user, onLogout, onUser }) {
  const [page, setPage] = useState('overview'), [dash, setDash] = useState(null), [notifications, setNotifications] = useState([]);
  const [toast, setToastState] = useState(null), [dark, setDark] = useState(localStorage.getItem('fi_dark') === '1'), [theme, setTheme] = useState(localStorage.getItem('fi_theme') || 'mono');
  const [mobile, setMobile] = useState(false), [refreshing, setRefreshing] = useState(false), [loadError, setLoadError] = useState('');
  const [poll, setPoll] = useState({ notifications: 0, messages: 0, incoming_call: null }), [call, setCall] = useState(null);
  const handled = useRef(new Set()), lastUnread = useRef(0);
  const setToast = useCallback((text, type) => setToastState(text ? { text, type } : null), []);
  const role = roles[user.role] || roles.student;
  const nav = navs[user.role];
  const load = useCallback(async () => {
    setRefreshing(true);
    try { const [d, n] = await Promise.all([api('/dashboard'), api('/notifications')]); setDash(d); setNotifications(n); setLoadError(''); }
    catch (e) { setLoadError(e.message); setToast(e.message, 'error'); } finally { setRefreshing(false); }
  }, [setToast]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); document.documentElement.dataset.theme = theme; localStorage.setItem('fi_dark', dark ? '1' : '0'); localStorage.setItem('fi_theme', theme); }, [dark, theme]);
  useEffect(() => { // live signals: unread counts + incoming calls
    let alive = true;
    const tick = async () => {
      try {
        const p = await api('/poll'); if (!alive) return;
        setPoll(p);
        if (p.notifications !== lastUnread.current) { lastUnread.current = p.notifications; load(); }
      } catch { /* a 401 is handled globally; transient errors are retried on the next tick */ }
    };
    tick(); const t = setInterval(tick, 6000);
    return () => { alive = false; clearInterval(t); };
  }, [load]);
  const incoming = poll.incoming_call && !call && !handled.current.has(poll.incoming_call.id) ? poll.incoming_call : null;
  const startCall = async (contact, kind) => {
    try {
      const inv = await post('/calls', { recipient_id: contact.id, kind });
      setCall({ conversation_id: inv.conversation_id, contact, kind, inviteId: inv.id, caller: true });
    } catch (e) { setToast(e.message, 'error'); }
  };
  const answer = async accept => {
    const inv = incoming; handled.current.add(inv.id); setPoll(p => ({ ...p, incoming_call: null }));
    try {
      await post(`/calls/${inv.id}/respond`, { action: accept ? 'accept' : 'decline' });
      if (accept) setCall({ conversation_id: inv.conversation_id, contact: inv.caller, kind: inv.kind, inviteId: inv.id, caller: false });
    } catch (e) { setToast(e.message, 'error'); }
  };
  const unread = poll.notifications || notifications.filter(n => !n.read).length;
  const props = { user, toast: setToast, refresh: load, setPage };
  const content = () => {
    if (page === 'overview') return <Overview {...props} dash={dash} notifications={notifications} />;
    if (['explore', 'opportunities', 'internships', 'monitor'].includes(page)) return <Internships {...props} view={page} />;
    if (page === 'applications') return <Applications {...props} />;
    if (page === 'applicants') return <Applicants {...props} />;
    if (page === 'tasks' || (page === 'progress' && user.role === 'student')) return <Tasks {...props} />;
    if (page === 'placements' || page === 'progress') return <Placements {...props} />;
    if (page === 'feedback' || page === 'evaluations') return <Evaluations {...props} />;
    if (page === 'students') return <Students {...props} />;
    if (page === 'users') {
      if (user.role !== 'admin') return <ErrorState error="Unauthorized: Administrative privileges required." retry={() => setPage('overview')} />;
      return <Users {...props} />;
    }
    if (page === 'messages') return <Messages {...props} onCall={startCall} />;
    if (page === 'reports') return <Reports {...props} />;
    if (page === 'profile') return <Profile {...props} onUser={onUser} onLogout={onLogout} />;
    return <Overview {...props} dash={dash} notifications={notifications} />;
  };
  return <div className={`app-v2 theme-${theme}`}><div className="ambient"><i /><i /><i /></div>
    <aside className={`sidebar-v2 ${mobile ? 'open' : ''}`}>
      <div className="side-top">
        <button
          type="button"
          onClick={() => {
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          title="Return to Public Landing Page"
          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', width: '100%' }}
        >
          <Logo light />
        </button>
        <button className="mobile-close" onClick={() => setMobile(false)}>×</button>
        <div className={`workspace-tag ${role.color}`}>
          <span>{role.icon}</span>
          <div><b>{role.label}</b><small>{role.tagline}</small></div>
        </div>
      </div>
      <nav>
        {nav.map(([id, label, icon]) => (
          <button key={id} className={page === id ? 'active' : ''} onClick={() => { setPage(id); setMobile(false); }}>
            <span>{icon}</span>{label}{(id === 'messages' && poll.messages > 0) && <em>{poll.messages}</em>}
          </button>
        ))}
        <button
          type="button"
          className="sidebar-home-link"
          onClick={() => {
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          title="Return to Landing Page"
        >
          <span>⌂</span>Public Home
        </button>
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Sign out of FarmIntern"
        >
          <span>↪</span>Sign out
        </button>
      </nav>
      <div className="theme-dock">
        <small>APPEARANCE</small>
        <div className="theme-row">
          {[['mono', '◐'], ['forest', '✦'], ['sand', '◒']].map(([t, i]) => (
            <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>{i}</button>
          ))}
          <button className="contrast" onClick={() => setDark(!dark)}>{dark ? '☼' : '☾'}</button>
        </div>
      </div>
      <div className="side-bottom">
        <button type="button" className="sidebar-logout-btn" onClick={onLogout}>
          <span>↪</span>Sign out
        </button>
      </div>
    </aside>
    <div className="main-v2">
      <header className="top-v2">
        <button className="hamb" onClick={() => setMobile(true)}>☰</button>
        <div className="crumb">
          <small>{role.label}</small>
          <b>{page === 'notifications' ? 'Notifications' : nav.find(x => x[0] === page)?.[1] || 'Overview'}</b>
        </div>
        <div className="top-actions">
          <button className="icon-btn" title="Refresh data" onClick={load}>{refreshing ? '…' : '↻'}</button>
          <button className="icon-btn notify-btn" title="Notifications" onClick={() => setPage('notifications')}>
            ◍{unread > 0 && <i>{unread}</i>}
          </button>
          <div
            className="identity"
            onClick={() => setPage('profile')}
            style={{ cursor: 'pointer' }}
            title="View your profile"
          >
            <div className={`avatar ${role.color}`}>{user.name?.[0] || 'U'}</div>
            <div><b>{user.name}</b><small>{user.role}</small></div>
          </div>
          <button
            type="button"
            className="top-logout-btn"
            onClick={onLogout}
            title="Sign out of FarmIntern"
          >
            <span>↪</span>
            <span>Sign out</span>
          </button>
        </div>
      </header>
      <main className="content-v2"><div key={page} className="page-enter">{page === 'notifications' ? <Notifications data={notifications} toast={setToast} refresh={load} setPage={setPage} nav={nav} />
        : dash === null && page === 'overview' ? (loadError ? <ErrorState error={loadError} retry={load} /> : <Loader />) : content()}</div></main></div>
    <Toast toast={toast} onClose={() => setToast(null)} />
    {incoming && <Modal title="Incoming call" subtitle={`${incoming.caller?.name || 'Someone'} is calling you`} onClose={() => answer(false)}>
      <div className="incoming-call"><div className="call-avatar">{(incoming.caller?.name || 'P')[0]}</div><b>{incoming.caller?.name}</b><small>{incoming.kind === 'video' ? 'Video call' : 'Voice call'}</small></div>
      <div className="modal-actions"><Btn kind="ghost" onClick={() => answer(false)}>Decline</Btn><Btn onClick={() => answer(true)}>Accept</Btn></div></Modal>}
    {call && <CallRoom session={call} user={user} toast={setToast} onClose={() => setCall(null)} />}
  </div>;
}

function CallRoom({ session, onClose, toast }) {
  const { contact, conversation_id: cid, kind, inviteId, caller } = session;
  const [mic, setMic] = useState(true), [cam, setCam] = useState(kind === 'video'), [sharing, setSharing] = useState(false);
  const [state, setState] = useState('Starting…'), [connected, setConnected] = useState(false), [elapsed, setElapsed] = useState(0);
  const [remoteMedia, setRemoteMedia] = useState({ video: false, screen: false }), [hasRemote, setHasRemote] = useState(false), [localView, setLocalView] = useState(null);
  const R = useRef({}), remoteRef = useRef(null);
  const send = m => { const ws = R.current.ws; if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };
  const pushMedia = () => { const r = R.current; send({ type: 'media', video: !!(r.screenOn || r.camOn), screen: !!r.screenOn }); };
  const teardown = r => {
    r.closed = true;
    r.cam?.getTracks().forEach(t => t.stop()); r.screen?.getTracks().forEach(t => t.stop());
    try { r.ws?.close(); } catch { /* already closed */ }
    try { r.pc?.close(); } catch { /* already closed */ }
  };
  const end = (notifyPeer = true) => {
    const r = R.current; if (r.ended) return; r.ended = true;
    if (notifyPeer) send({ type: 'hangup' });
    teardown(r);
    if (inviteId) api(`/calls/${inviteId}/end`, { method: 'POST', body: '{}' }).catch(() => {});
    onClose();
  };

  useEffect(() => {
    const r = { closed: false, pending: [], camOn: kind === 'video', screenOn: false }; R.current = r;
    (async () => {
      let cam;
      try { cam = await navigator.mediaDevices.getUserMedia({ audio: true, video: kind === 'video' }); }
      catch { if (!r.closed) { toast('Microphone/camera access was blocked or is unavailable. Allow access in the browser (calls need HTTPS or localhost).', 'error'); end(false); } return; }
      if (r.closed) { cam.getTracks().forEach(t => t.stop()); return; }
      r.cam = cam;
      const ice = [{ urls: 'stun:stun.l.google.com:19302' }];
      if (import.meta.env.VITE_TURN_URL) ice.push({ urls: import.meta.env.VITE_TURN_URL, username: import.meta.env.VITE_TURN_USERNAME, credential: import.meta.env.VITE_TURN_CREDENTIAL });
      const pc = new RTCPeerConnection({ iceServers: ice }); r.pc = pc;
      const vtx = pc.addTransceiver('video', { direction: 'sendrecv' }); r.videoSender = vtx.sender; // lets us swap camera <-> screen without renegotiating
      cam.getAudioTracks().forEach(t => pc.addTrack(t, cam));
      const vt = cam.getVideoTracks()[0];
      if (vt) { await vtx.sender.replaceTrack(vt); setLocalView(cam); }
      r.remote = new MediaStream();
      pc.ontrack = e => {
        if (!r.remote.getTracks().includes(e.track)) r.remote.addTrack(e.track);
        setHasRemote(true);
        const el = remoteRef.current;
        if (el) { if (el.srcObject !== r.remote) el.srcObject = r.remote; el.play?.().catch(() => {}); }
      };
      pc.onicecandidate = e => { if (e.candidate) send({ type: 'ice', candidate: e.candidate }); };
      pc.onconnectionstatechange = () => {
        const s = pc.connectionState;
        if (s === 'connected') { setConnected(true); setState('Connected'); }
        else if (s === 'connecting') setState('Connecting…');
        else if (s === 'failed') { setConnected(false); setState('Connection failed — this network may need a TURN server'); }
        else if (s === 'disconnected') { setConnected(false); setState('Connection interrupted…'); }
      };
      const flush = async () => { for (const c of r.pending.splice(0)) await pc.addIceCandidate(c).catch(() => {}); };
      const ws = new WebSocket(`${wsBase()}/ws/call/${cid}?token=${encodeURIComponent(getToken() || '')}`); r.ws = ws;
      ws.onopen = () => setState(caller ? 'Ringing…' : 'Joining…');
      ws.onclose = ev => { if (!r.closed) setState(ev.code === 4401 ? 'Not authorised for this call' : 'Signalling connection closed'); };
      ws.onmessage = async ev => {
        let m; try { m = JSON.parse(ev.data); } catch { return; }
        try {
          if (m.type === 'peers') {
            if (m.peers.length) { setState('Connecting…'); const offer = await pc.createOffer(); await pc.setLocalDescription(offer); send({ type: 'offer', offer: pc.localDescription }); }
          } else if (m.type === 'offer') {
            await pc.setRemoteDescription(m.offer); await flush();
            const answer = await pc.createAnswer(); await pc.setLocalDescription(answer); send({ type: 'answer', answer: pc.localDescription }); pushMedia();
          } else if (m.type === 'answer') { await pc.setRemoteDescription(m.answer); await flush(); pushMedia(); }
          else if (m.type === 'ice') { if (pc.remoteDescription) await pc.addIceCandidate(m.candidate).catch(() => {}); else r.pending.push(m.candidate); }
          else if (m.type === 'media') setRemoteMedia({ video: !!m.video, screen: !!m.screen });
          else if (m.type === 'peer-joined') pushMedia();
          else if (m.type === 'hangup') { setState('The other person ended the call'); toast('The call was ended by the other person.'); setTimeout(() => end(false), 800); }
          else if (m.type === 'peer-left') { setHasRemote(false); setConnected(false); setRemoteMedia({ video: false, screen: false }); setState('The other person disconnected'); }
        } catch (err) { setState(`Call setup error: ${err.message}`); }
      };
    })();
    return () => teardown(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  useEffect(() => { if (!connected) return; const t = setInterval(() => setElapsed(v => v + 1), 1000); return () => clearInterval(t); }, [connected]);
  useEffect(() => { // the caller learns whether the callee declined / never answered
    if (!caller || connected) return;
    const t = setInterval(async () => {
      try {
        const c = await api(`/calls/${inviteId}`);
        if (c.status === 'declined') { toast(`${contact.name || 'The other person'} declined the call.`, 'error'); end(false); }
        else if (c.status === 'missed') { toast('No answer.', 'error'); end(false); }
      } catch { /* retry */ }
    }, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const toggleMic = () => { const next = !mic; R.current.cam?.getAudioTracks().forEach(t => { t.enabled = next; }); setMic(next); };
  const toggleCam = () => { const next = !cam; R.current.cam?.getVideoTracks().forEach(t => { t.enabled = next; }); R.current.camOn = next; setCam(next); pushMedia(); };
  const stopShare = async () => {
    const r = R.current;
    r.screen?.getTracks().forEach(t => t.stop()); r.screen = null; r.screenOn = false; setSharing(false);
    const camTrack = r.cam?.getVideoTracks()[0] || null;
    try { await r.videoSender?.replaceTrack(camTrack); } catch { /* peer closed */ }
    setLocalView(camTrack ? r.cam : null); pushMedia();
  };
  const startShare = async () => {
    const r = R.current;
    if (!navigator.mediaDevices?.getDisplayMedia) { toast('Screen sharing is not supported by this browser/device.', 'error'); return; }
    if (!r.videoSender) { toast('The call is still starting. Try again in a moment.', 'error'); return; }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const track = s.getVideoTracks()[0];
      await r.videoSender.replaceTrack(track);
      track.onended = () => stopShare();
      r.screen = s; r.screenOn = true; setSharing(true); setLocalView(s); pushMedia();
      toast('You are sharing your screen.');
    } catch (e) { if (e.name !== 'NotAllowedError') toast(`Could not start screen sharing: ${e.message}`, 'error'); }
  };
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0'), secs = String(elapsed % 60).padStart(2, '0');
  const remoteShown = hasRemote && remoteMedia.video;
  const localShown = !!localView && (sharing || (cam && kind === 'video'));
  return <Modal title={`${kind === 'video' ? 'Video' : 'Voice'} call`} subtitle={`${contact?.name || 'Partner'} · peer-to-peer WebRTC`} onClose={() => end(true)} wide>
    <div className="call-room"><div className="call-stage"><div className="call-grid">
      <div className="remote-placeholder">
        <video className="remote-video" autoPlay playsInline ref={remoteRef} style={{ gridArea: '1/1', objectFit: remoteMedia.screen ? 'contain' : 'cover', visibility: remoteShown ? 'visible' : 'hidden' }} />
        {!remoteShown && <div style={{ gridArea: '1/1', display: 'grid', placeItems: 'center', gap: 8 }}><div className="call-avatar">{(contact?.name || 'P')[0]}</div><b>{contact?.name || 'Partner'}</b><small>{state}</small></div>}
        {remoteMedia.screen && remoteShown && <span className="share-badge">{contact?.name || 'Partner'} is sharing their screen</span>}
      </div>
      <div className="local-video">{localShown ? <video autoPlay muted playsInline ref={el => { if (el && localView && el.srcObject !== localView) el.srcObject = localView; }} /> : <div className="voice-wave">{kind === 'video' ? '◉' : '◌'}</div>}<span>{sharing ? 'Your screen' : kind === 'video' ? 'Your camera' : 'Your microphone'}</span></div>
    </div>
    <div className="call-status"><span className="live-dot" />{mins}:{secs}<i>{state}</i></div></div>
    <div className="call-controls">
      <button className={mic ? '' : 'off'} onClick={toggleMic}>{mic ? '🎙' : '🔇'}<small>{mic ? 'Mute' : 'Unmute'}</small></button>
      {kind === 'video' && <button className={cam ? '' : 'off'} onClick={toggleCam}>{cam ? '▣' : '□'}<small>{cam ? 'Camera off' : 'Camera on'}</small></button>}
      <button className={sharing ? 'off' : ''} onClick={sharing ? stopShare : startShare}>▧<small>{sharing ? 'Stop sharing' : 'Share screen'}</small></button>
      <button className="hangup" onClick={() => end(true)}>✕<small>End</small></button></div></div></Modal>;
}

function Messages({ user, toast, onCall, refresh }) {
  const [active, setActive] = useState(null), [body, setBody] = useState(''), [q, setQ] = useState(''), [sending, setSending] = useState(false);
  const data = useLoad(async () => { const [cs, people] = await Promise.all([api('/messages'), api('/contacts')]); return { cs, people }; }, []);
  const { reload } = data;
  useEffect(() => { const t = setInterval(() => reload(true), 5000); return () => clearInterval(t); }, [reload]);
  const cs = data.data?.cs || [], people = data.data?.people || [];
  const other = c => c.participants?.[0] || {};
  const conv = active ? cs.find(c => other(c).id === active.user_id) : null;
  const bottom = useRef(null);
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'end' }); }, [conv?.messages?.length, active?.user_id]);
  useEffect(() => {
    if (conv && conv.unread > 0) post(`/messages/${conv.id}/read`).then(() => { reload(true); refresh?.(); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv?.id, conv?.unread]);
  const send = async e => {
    e.preventDefault(); if (!body.trim() || !active) return; setSending(true);
    try { await post('/messages', { conversation_id: conv?.id || null, recipient_id: active.user_id, body }); setBody(''); await reload(true); }
    catch (err) { toast(err.message, 'error'); } finally { setSending(false); }
  };
  const match = s => s.toLowerCase().includes(q.toLowerCase());
  const withChat = new Set(cs.map(c => other(c).id));
  if (data.loading && !data.data) return <Loader />;
  if (data.error && !data.data) return <ErrorState error={data.error} retry={data.reload} />;
  return <Section eyebrow="CONNECTED COMMUNICATION" title="Messages & Calls" sub="Persistent messages plus real peer-to-peer voice, video and screen sharing. The other person gets a ringing prompt wherever they are in the app.">
    <div className="messenger-v2"><aside>
      <div className="search-v2 compact">⌕<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search people…" /></div>
      <small className="list-label">CONVERSATIONS</small>
      {cs.filter(c => match(`${other(c).name || ''} ${other(c).role || ''}`)).map(c => { const o = other(c); return <button className={active?.user_id === o.id ? 'chat-item active' : 'chat-item'} key={c.id} onClick={() => setActive({ user_id: o.id, name: o.name, role: o.role })}><div className="avatar tiny">{(o.name || 'P')[0]}</div><span><b>{o.name || 'Conversation'}</b><small>{o.role || 'Partner'}</small></span>{c.unread > 0 && <em className="unread-dot">{c.unread}</em>}</button>; })}
      {!cs.length && <small className="list-label">No conversations yet</small>}
      <small className="list-label">START A CHAT</small>
      {people.filter(c => !withChat.has(c.id) && match(`${c.name} ${c.role}`)).map(c => <button className={active?.user_id === c.id ? 'chat-item active' : 'chat-item'} key={c.id} onClick={() => setActive({ user_id: c.id, name: c.name, role: c.role })}><div className="avatar tiny">{c.name[0]}</div><span><b>{c.name}</b><small>{c.role}</small></span><i>＋</i></button>)}
    </aside>
    <div className="chat-v2">{active ? <>
      <div className="chat-title"><div className="avatar">{(active.name || 'P')[0]}</div><div><b>{active.name || 'Partner'}</b><small>{active.role}</small></div>
        <div className="call-actions"><button title="Voice call" onClick={() => onCall({ id: active.user_id, name: active.name }, 'audio')}>☎</button><button title="Video call" onClick={() => onCall({ id: active.user_id, name: active.name }, 'video')}>▣</button></div></div>
      <div className="chat-stream">{(conv?.messages || []).map(m => <div className={`bubble-v2 ${m.sender_id === user.id ? 'mine' : ''}`} key={m.id}><p>{m.body}</p><small>{new Date(m.created_at).toLocaleString()}</small></div>)}
        {!(conv?.messages || []).length && <Empty title="Start the conversation" body="Send the first message, or use the call buttons to ring this person." />}<div ref={bottom} /></div>
      <form className="composer" onSubmit={send}><input value={body} maxLength={4000} onChange={e => setBody(e.target.value)} placeholder="Write a message…" /><Btn type="submit" loading={sending}>Send ↗</Btn></form></>
      : <Empty title="Select a conversation" body="Choose a contact to start a database-backed conversation." />}</div></div></Section>;
}


// ---- AI internship recommendations (students) -------------------------------------------------------
function Recommendations({ user, toast, setPage, onApplied }) {
  const q = useLoad(() => api('/recommendations?limit=6'), []);
  const [detail, setDetail] = useState(null), [applyFor, setApplyFor] = useState(null);
  const items = q.data?.items || [];
  const changed = () => { q.reload(true); onApplied?.(); };
  return <Section eyebrow="AI MATCHING" title="Recommended for you" sub="Ranked from your profile skills and interests, location and history against the live internship listings."
    action={<Btn kind="text" onClick={() => q.reload()}>↻ Refresh</Btn>}>
    {q.data?.tip && <div className="reco-tip"><span>Tip</span>{q.data.tip} <button type="button" onClick={() => setPage('profile')}>Open profile →</button></div>}
    <Async q={q} empty={null}>
      {!items.length && !q.loading ? <Empty title="No open matches right now" body="Every open internship has either been applied to or is full. New listings will appear here automatically." />
        : <div className="reco-grid">{items.map(r => <RecommendationCard key={r.internship.id} r={r} onView={() => setDetail(r.internship)} onApply={() => setApplyFor(r)} />)}</div>}
    </Async>
    {detail && <InternshipDetail item={detail} user={user} close={() => setDetail(null)} toast={toast} refresh={changed} setPage={setPage} />}
    {applyFor && <QuickApply r={applyFor} toast={toast} close={() => setApplyFor(null)} done={() => { setApplyFor(null); changed(); }} />}
  </Section>;
}

function RecommendationCard({ r, onView, onApply }) {
  const i = r.internship, tone = r.match >= 70 ? 'strong' : r.match >= 45 ? 'good' : 'low';
  return <article className="reco-card">
    <div className="reco-top"><div className={`match-ring ${tone}`} style={{ '--p': r.match }} title={`${r.match}% match`}><b>{r.match}%</b><small>match</small></div>
      <div><h3>{i.title}</h3><p>{i.farmer} · {i.category}</p></div></div>
    <div className="opp-meta"><span>⌖ {i.location || 'Flexible'}</span><span>◷ {i.duration || 'Flexible'}</span><span>₹ {i.stipend || '—'}</span></div>
    <ul className="reco-reasons">{r.reasons.map(t => <li key={t}>{t}</li>)}{!r.reasons.length && <li>Open position that fits the basics of your profile</li>}</ul>
    {r.skill_gaps?.length > 0 && <small className="reco-gap">Worth learning: {r.skill_gaps.join(', ')}</small>}
    <div className="reco-actions"><Btn kind="ghost" onClick={onView}>View Details</Btn><Btn onClick={onApply}>Apply Now →</Btn></div>
  </article>;
}

function QuickApply({ r, toast, close, done }) {
  const i = r.internship;
  const draft = `Hello ${i.farmer},\n\nI would like to apply for the ${i.title} internship.${r.matched_skills?.length ? ` My skills in ${r.matched_skills.slice(0, 4).join(', ')} are relevant to this role.` : ''} I am keen to learn and contribute.\n\nThank you for your time.`;
  const [letter, setLetter] = useState(draft), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const submit = async () => {
    setBusy(true); setError('');
    try { await post('/applications', { internship_id: i.id, cover_letter: letter }); toast('Application submitted. The farm partner has been notified.'); done(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <Modal title={`Apply: ${i.title}`} subtitle={`${i.farmer} · ${r.match}% match`} onClose={close}>
    <label>Cover letter (edit before sending)<textarea rows="7" maxLength="3000" value={letter} onChange={e => setLetter(e.target.value)} autoFocus /></label>
    {error && <div className="form-error">{error}</div>}
    <div className="modal-actions"><Btn kind="ghost" onClick={close}>Cancel</Btn><Btn loading={busy} onClick={submit}>Submit application →</Btn></div>
  </Modal>;
}

function Internships({ user, toast, setPage, refresh }) {
  const isStudent = user.role === 'student';
  const [search, setSearch] = useState(''), [query, setQuery] = useState(''), [category, setCategory] = useState('All'), [status, setStatus] = useState(isStudent ? 'Active' : 'all');
  const [modal, setModal] = useState(null), [editing, setEditing] = useState(null), [busy, setBusy] = useState(false), [cats, setCats] = useState([]);
  const q = useLoad(async () => {
    const items = await api(`/internships?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&status=${status}`);
    setCats(c => [...new Set([...c, ...items.map(x => x.category)])]);
    return items;
  }, [query, category, status]);
  const submit = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const d = Object.fromEntries(new FormData(e.target)); d.openings = Number(d.openings || 1);
      if (editing) { await patch(`/internships/${editing.id}`, d); toast('Internship updated.'); }
      else { await post('/internships', d); toast('Internship published.'); }
      setModal(null); setEditing(null); q.reload(true); refresh?.();
    } catch (err) { toast(err.message, 'error'); } finally { setBusy(false); }
  };
  const update = async (i, s) => {
    if (s === 'Closed' && !window.confirm(`Close "${i.title}"? Students will no longer be able to apply.`)) return;
    try { await patch(`/internships/${i.id}`, { status: s }); toast(`Internship ${s.toLowerCase()}.`); q.reload(true); refresh?.(); } catch (err) { toast(err.message, 'error'); }
  };
  const titles = { student: 'Internship Marketplace', farmer: 'Manage Internships', admin: 'Monitor Internships', college: 'Monitor Internships' };
  const subs = { student: 'Search, inspect and apply to live opportunities.', farmer: 'Create, edit, pause, close and inspect every internship you own.', admin: 'Monitor every internship across the platform and change listing status.', college: 'College view of the live internship network for student monitoring.' };
  const form = editing || {};
  const open = Boolean(modal === 'form');
  return <Section eyebrow="OPPORTUNITY MARKETPLACE" title={titles[user.role]} sub={subs[user.role]} action={user.role === 'farmer' && <Btn onClick={() => { setEditing(null); setModal('form'); }}>＋ Publish internship</Btn>}>
    {isStudent && <Recommendations user={user} toast={toast} setPage={setPage} onApplied={() => { q.reload(true); refresh?.(); }} />}
    <div className="toolbar-v2"><div className="search-v2">⌕<input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && setQuery(search)} placeholder="Search title, location or category…" /><button onClick={() => setQuery(search)}>Search</button></div>
      <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{cats.map(c => <option key={c}>{c}</option>)}</select>
      {!isStudent && <select value={status} onChange={e => setStatus(e.target.value)}><option value="all">All statuses</option>{['Active', 'Paused', 'Filled', 'Closed'].map(s => <option key={s}>{s}</option>)}</select>}</div>
    <Async q={q} empty={<div className="opportunity-grid-v2"><Empty title="No internships found" body={user.role === 'farmer' ? 'Publish your first internship to start receiving applications.' : 'Try a different search or category.'} /></div>}>
      <div className="opportunity-grid-v2">{(q.data || []).map(i => <Opportunity key={i.id} item={i} user={user} onOpen={() => setModal(i)} onUpdate={update} onEdit={() => { setEditing(i); setModal('form'); }} />)}</div></Async>
    {open && <Modal title={editing ? 'Edit internship' : 'Publish an internship'} subtitle={editing ? 'Changes are saved to the database immediately.' : 'Create a real opportunity that students can discover and apply to.'} onClose={() => { setModal(null); setEditing(null); }}>
      <form className="form-v2" onSubmit={submit}><label>Title<input name="title" required minLength="3" maxLength="180" defaultValue={form.title || ''} placeholder="Smart Farming Field Intern" /></label>
        <div className="two"><label>Category<input name="category" defaultValue={form.category || 'Agriculture'} /></label><label>Location<input name="location" defaultValue={form.location || ''} placeholder="Ongole, AP" /></label></div>
        <div className="two"><label>Duration<input name="duration" defaultValue={form.duration || ''} placeholder="8 weeks" /></label><label>Stipend<input name="stipend" defaultValue={form.stipend || ''} placeholder="₹8,000 / month" /></label></div>
        <label>Openings{editing && form.hired > 0 ? ` (${form.hired} already hired)` : ''}<input name="openings" type="number" min={Math.max(1, form.hired || 1)} max="500" defaultValue={form.openings || 1} /></label>
        <label>Description<textarea name="description" rows="5" required defaultValue={form.description || ''} placeholder="What will the intern actually work on?" /></label>
        <div className="modal-actions"><Btn kind="ghost" type="button" onClick={() => { setModal(null); setEditing(null); }}>Cancel</Btn><Btn type="submit" loading={busy}>{editing ? 'Save changes' : 'Publish internship'}</Btn></div></form></Modal>}
    {modal && modal !== 'form' && <InternshipDetail item={modal} user={user} close={() => setModal(null)} toast={toast} refresh={() => { q.reload(true); refresh?.(); }} setPage={setPage} />}</Section>;
}

function Opportunity({ item, user, onOpen, onUpdate, onEdit }) {
  const mine = user.role === 'farmer', admin = user.role === 'admin';
  const next = item.status === 'Active' || item.status === 'Filled' ? 'Paused' : 'Active';
  return <article className="opp-card-v2"><div className="opp-top"><Pill tone={statusTone(item.status)}>{item.status}</Pill><span>#{String(item.id).padStart(4, '0')}</span></div>
    <h3>{item.title}</h3><p>{item.description || 'Practical agricultural internship opportunity.'}</p>
    <div className="opp-meta"><span>⌖ {item.location || 'Flexible'}</span><span>◷ {item.duration || 'Flexible'}</span><span>₹ {item.stipend || '—'}</span></div>
    <div className="opp-foot"><div><b>{item.farmer}</b><small>{item.category} · {item.openings_left} of {item.openings} open</small></div><button onClick={onOpen}>{user.role === 'student' && !item.my_application ? 'Open & apply →' : 'Open →'}</button></div>
    {item.my_application && <div className="inline-control"><Pill tone={statusTone(item.my_application)}>You: {item.my_application}</Pill></div>}
    {(mine || admin) && <div className="inline-control">
      {mine && <button onClick={onEdit}>Edit</button>}
      {item.status !== 'Closed' && <button onClick={() => onUpdate(item, next)}>{next === 'Paused' ? 'Pause' : 'Activate'}</button>}
      {item.status === 'Closed' ? <button onClick={() => onUpdate(item, 'Active')}>Reopen</button> : <button onClick={() => onUpdate(item, 'Closed')}>Close</button>}</div>}
  </article>;
}

function InternshipDetail({ item, user, close, toast, refresh, setPage }) {
  const [letter, setLetter] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const apply = async () => {
    setBusy(true); setError('');
    try { await post('/applications', { internship_id: item.id, cover_letter: letter }); toast('Application submitted. The farm partner has been notified.'); close(); refresh(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const canApply = user.role === 'student' && item.status === 'Active' && (!item.my_application || item.my_application === 'Withdrawn') && item.openings_left > 0;
  return <Modal title={item.title} subtitle={`${item.category} · ${item.location || 'Location flexible'}`} onClose={close}>
    <div className="detail-hero"><div><Pill tone={statusTone(item.status)}>{item.status}</Pill><h3>{item.farmer}</h3><p>{item.description}</p></div>
      <div className="detail-stats"><b>{item.duration || '—'}<small>duration</small></b><b>{item.stipend || '—'}<small>stipend</small></b><b>{item.openings_left}/{item.openings}<small>openings left</small></b></div></div>
    {user.role === 'student' && item.my_application && item.my_application !== 'Withdrawn' && <div className="form-success">You already applied — current status: <b>{item.my_application}</b>. Track it in My Applications.</div>}
    {user.role === 'student' && item.status !== 'Active' && !item.my_application && <div className="form-error">This internship is not accepting applications ({item.status}).</div>}
    {canApply && <><label>Cover letter<textarea rows="5" maxLength="3000" value={letter} onChange={e => setLetter(e.target.value)} placeholder="Why are you a good fit for this internship?" /></label>{error && <div className="form-error">{error}</div>}
      <div className="modal-actions"><Btn kind="ghost" onClick={close}>Close</Btn><Btn loading={busy} onClick={apply}>Apply now →</Btn></div></>}
    {!canApply && <div className="modal-actions"><Btn kind="ghost" onClick={close}>Close</Btn>
      {user.role === 'student' && item.my_application && <Btn onClick={() => { close(); setPage('applications'); }}>My applications →</Btn>}
      {user.role === 'farmer' && <Btn onClick={() => { close(); setPage('applicants'); }}>View applicants →</Btn>}</div>}
  </Modal>;
}

function useDecide({ toast, reload, refresh }) {
  const [busyId, setBusyId] = useState(null);
  const decide = async (a, status) => {
    const msg = status === 'Selected' ? `Select ${a.student.name} for "${a.internship.title}"? This creates an active internship placement and uses one opening.`
      : status === 'Rejected' ? `Reject ${a.student.name}'s application?` : null;
    if (msg && !window.confirm(msg)) return;
    setBusyId(a.id);
    try {
      const out = await patch(`/applications/${a.id}`, { status });
      toast(status === 'Selected' ? `${a.student.name} is now placed in ${a.internship.title}.` : `Application ${out.status.toLowerCase()}.`);
      await reload(true); refresh?.();
    } catch (e) { toast(e.message, 'error'); } finally { setBusyId(null); }
  };
  return { decide, busyId };
}
function Decisions({ a, onDecide, busy }) {
  const next = NEXT[a.status] || [];
  const full = a.internship.openings_left <= 0;
  if (!next.length) return null;
  return <div className="decision-row">{next.map(s => <button key={s} disabled={busy || (s === 'Selected' && full)} title={s === 'Selected' && full ? 'All openings are filled' : ''} onClick={() => onDecide(a, s)}>{a.status === 'Rejected' ? 'Reconsider' : DECISION_LABEL[s]}</button>)}</div>;
}
function Timeline({ a }) {
  return <small className="timeline">Applied {fmtDate(a.applied_at)}{a.decided_at ? ` · ${a.status} ${fmtDate(a.decided_at)}` : ''}{a.placement ? ` · Placement ${a.placement.status.toLowerCase()} since ${a.placement.start_date || '—'}` : ''}</small>;
}

function Applications({ user, toast, setPage, refresh }) {
  const [filter, setFilter] = useState('All'), [busyId, setBusyId] = useState(null);
  const q = useLoad(() => api('/applications'), []);
  const { decide, busyId: decidingId } = useDecide({ toast, reload: q.reload, refresh });
  const all = q.data || [];
  const counts = { All: all.length }; ['Pending', 'Shortlisted', 'Selected', 'Rejected', 'Withdrawn'].forEach(s => { counts[s] = all.filter(a => a.status === s).length; });
  const items = all.filter(a => filter === 'All' || a.status === filter);
  const withdraw = async a => {
    if (!window.confirm(`Withdraw your application for "${a.internship.title}"?`)) return;
    setBusyId(a.id);
    try { await patch(`/applications/${a.id}/withdraw`); toast('Application withdrawn.'); await q.reload(true); refresh?.(); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(null); }
  };
  const title = user.role === 'student' ? 'My Applications' : user.role === 'admin' ? 'Monitor Applications' : 'Applications';
  return <Section eyebrow="APPLICATION PIPELINE" title={title} sub={user.role === 'admin' ? 'Monitor every application and its current decision state.' : 'Every status below is read from the database and updates when the farm partner decides.'}>
    <Chips options={['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected', 'Withdrawn']} value={filter} onChange={setFilter} counts={counts} />
    <Async q={q} empty={<Empty title="No applications yet" body={user.role === 'student' ? 'Browse internships and apply — your applications will be tracked here.' : 'Applications will appear here when students apply.'} action={user.role === 'student' && <Btn onClick={() => setPage('explore')}>Browse internships</Btn>} />}>
      <div className="application-list">{items.map(a => <article className="application-card" key={a.id}>
        <div className="app-main"><div className="app-logo">{a.internship.title.slice(0, 2).toUpperCase()}</div><div><small>{a.internship.category} · {a.internship.location}</small><h3>{a.internship.title}</h3>
          <p>{user.role === 'student' ? `Partner: ${a.internship.farmer}` : `Candidate: ${a.student.name} · ${a.student.email}`}</p><Timeline a={a} /></div></div>
        <div className="app-right"><Pill tone={statusTone(a.status)}>{a.status}</Pill>
          {user.role === 'student' && ['Pending', 'Shortlisted'].includes(a.status) && <div className="decision-row"><button disabled={busyId === a.id} onClick={() => withdraw(a)}>Withdraw</button></div>}
          {user.role === 'student' && a.status === 'Selected' && <div className="decision-row"><button onClick={() => setPage('progress')}>Open my tasks →</button></div>}
          {user.role === 'admin' && <Decisions a={a} onDecide={decide} busy={decidingId === a.id} />}</div></article>)}
        {!items.length && all.length > 0 && <Empty title={`No ${filter.toLowerCase()} applications`} body="Try another filter." />}</div></Async></Section>;
}

function Applicants({ toast, setPage, refresh }) {
  const [internshipId, setInternshipId] = useState('all'), [status, setStatus] = useState('All'), [view, setView] = useState(null);
  const q = useLoad(() => api('/applications'), []);
  const { decide, busyId } = useDecide({ toast, reload: async s => { await q.reload(s); }, refresh });
  const all = q.data || [];
  const internships = [...new Map(all.map(a => [a.internship.id, a.internship])).values()];
  const inScope = all.filter(a => internshipId === 'all' || String(a.internship.id) === internshipId);
  const counts = { All: inScope.length }; ['Pending', 'Shortlisted', 'Selected', 'Rejected', 'Withdrawn'].forEach(s => { counts[s] = inScope.filter(a => a.status === s).length; });
  const shown = inScope.filter(a => status === 'All' || a.status === status);
  const picked = internships.find(i => String(i.id) === internshipId);
  const current = view ? all.find(a => a.id === view) : null;
  return <Section eyebrow="HIRING PIPELINE" title="Manage Applicants" sub="Review candidates, shortlist, select or reject. Selecting creates a real internship placement and is blocked once all openings are filled.">
    <div className="toolbar-v2"><select value={internshipId} onChange={e => setInternshipId(e.target.value)} style={{ width: 280 }}><option value="all">All my internships</option>{internships.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}</select>
      {picked && <Pill tone={picked.openings_left > 0 ? 'lime' : 'blue'}>{picked.hired} of {picked.openings} openings filled</Pill>}</div>
    <Chips options={['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected', 'Withdrawn']} value={status} onChange={setStatus} counts={counts} />
    <Async q={q} empty={<Empty title="No applicants yet" body="When students apply to your internships they will appear here." action={<Btn onClick={() => setPage('opportunities')}>Manage internships</Btn>} />}>
      <div className="application-list">{shown.map(a => <article className="application-card" key={a.id}>
        <div className="app-main"><div className="app-logo">{a.student.name.slice(0, 2).toUpperCase()}</div><div><small>{a.internship.title} · {a.internship.openings_left} of {a.internship.openings} open</small><h3>{a.student.name}</h3>
          <p>{[a.student.course, a.student.institution, a.student.year].filter(Boolean).join(' · ') || a.student.email}</p><Timeline a={a} /></div></div>
        <div className="app-right"><Pill tone={statusTone(a.status)}>{a.status}</Pill>
          <div className="decision-row"><button onClick={() => setView(a.id)}>View</button></div>
          <Decisions a={a} onDecide={decide} busy={busyId === a.id} />
          {a.status === 'Selected' && <div className="decision-row"><button onClick={() => setPage('tasks')}>Assign task →</button></div>}</div></article>)}
        {!shown.length && all.length > 0 && <Empty title="No applicants match" body="Change the internship or status filter." />}</div></Async>
    {current && <Modal title={current.student.name} subtitle={`Applied for ${current.internship.title} on ${fmtDate(current.applied_at)}`} onClose={() => setView(null)}>
      <div className="detail-hero"><Pill tone={statusTone(current.status)}>{current.status}</Pill><h3>{current.student.headline || 'Student applicant'}</h3><p>{current.student.bio || 'This applicant has not written a bio yet.'}</p>
        <div className="detail-stats"><b>{current.student.course || '—'}<small>course</small></b><b>{current.student.year || '—'}<small>year</small></b><b>{current.student.institution || '—'}<small>institution</small></b></div></div>
      <p className="detail-line"><b>Skills:</b> {current.student.skills || '—'}</p>
      <p className="detail-line"><b>Contact:</b> {current.student.email}{current.student.phone ? ` · ${current.student.phone}` : ''}{current.student.location ? ` · ${current.student.location}` : ''}</p>
      <p className="detail-line"><b>Cover letter:</b></p><div className="letter-box">{current.cover_letter || 'No cover letter was provided.'}</div>
      <div className="modal-actions"><Btn kind="ghost" onClick={() => setView(null)}>Close</Btn>
        {(NEXT[current.status] || []).map(s => <Btn key={s} kind={s === 'Selected' ? 'primary' : 'soft'} disabled={busyId === current.id || (s === 'Selected' && current.internship.openings_left <= 0)} onClick={async () => { await decide(current, s); }}>{current.status === 'Rejected' ? 'Reconsider' : DECISION_LABEL[s]}</Btn>)}</div></Modal>}
  </Section>;
}

function Placements({ user, toast, setPage, refresh }) {
  const [status, setStatus] = useState('All'), [busyId, setBusyId] = useState(null);
  const q = useLoad(() => api('/placements'), []);
  const all = q.data || [];
  const counts = { All: all.length }; ['Active', 'Completed', 'Terminated'].forEach(s => { counts[s] = all.filter(p => p.status === s).length; });
  const items = all.filter(p => status === 'All' || p.status === status);
  const change = async (p, s) => {
    const ask = s === 'Completed' ? `Mark ${p.student.name}'s internship as completed?` : `Terminate ${p.student.name}'s placement? The opening becomes available again.`;
    if (!window.confirm(ask)) return;
    setBusyId(p.id);
    try { await patch(`/placements/${p.id}`, { status: s }); toast(`Placement ${s.toLowerCase()}.`); await q.reload(true); refresh?.(); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(null); }
  };
  const titles = { farmer: 'Placements', college: 'Track Outcomes', admin: 'Monitor Placements' };
  const hint = user.role === 'college' ? 'No students from your institution have been placed yet. Students appear here when their profile institution matches your College Profile institution.' : 'Select an applicant and a placement will appear here.';
  return <Section eyebrow="INTERNSHIP PLACEMENTS" title={titles[user.role] || 'Placements'} sub="Real hiring records created when a farm partner selects a student — with live task progress and evaluations.">
    <Chips options={['All', 'Active', 'Completed', 'Terminated']} value={status} onChange={setStatus} counts={counts} />
    <Async q={q} empty={<Empty title="No placements yet" body={hint} />}>
      <div className="journey-grid">{items.map(p => <article key={p.id}>
        <div className="journey-head"><div className="person-v2"><div className="avatar blue">{p.student.name[0]}</div><span><b>{p.student.name}</b><small>{p.internship} · {p.farmer}</small></span></div><strong>{p.progress}%</strong></div>
        <div className="big-bar"><i style={{ width: `${p.progress}%` }} /></div>
        <div className="journey-foot"><span>{p.completed_tasks}/{p.tasks} tasks done</span><span>{p.evaluations} evaluation(s){p.average_rating ? ` · ${p.average_rating}/5` : ''}</span><Pill tone={statusTone(p.status)}>{p.status}</Pill></div>
        <small className="timeline">Started {p.start_date || '—'}{p.end_date ? ` · ended ${p.end_date}` : ''} · {p.student.institution || 'institution not set'}</small>
        <div className="decision-row left">
          {user.role === 'farmer' && p.status === 'Active' && <><button onClick={() => setPage('tasks')}>Assign task</button><button disabled={busyId === p.id} onClick={() => change(p, 'Completed')}>Complete</button><button disabled={busyId === p.id} onClick={() => change(p, 'Terminated')}>Terminate</button></>}
          {(user.role === 'farmer' || user.role === 'college') && <button onClick={() => setPage('evaluations')}>Evaluate</button>}</div></article>)}
        {!items.length && all.length > 0 && <Empty title={`No ${status.toLowerCase()} placements`} body="Try another filter." />}</div></Async></Section>;
}


function Tasks({ user, toast, refresh, setPage }) {
  const [modal, setModal] = useState(null), [busy, setBusy] = useState(false), [filter, setFilter] = useState('All'), [slider, setSlider] = useState(0);
  const q = useLoad(() => api('/tasks'), []);
  const pl = useLoad(() => (user.role === 'farmer' ? api('/placements?status=Active') : Promise.resolve([])), []);
  const all = q.data || [];
  const counts = { All: all.length }; ['Pending', 'In Progress', 'Completed'].forEach(s => { counts[s] = all.filter(t => t.status === s).length; });
  const items = all.filter(t => filter === 'All' || t.status === filter);
  const save = async (t, body, msg) => {
    setBusy(true);
    try { await patch(`/tasks/${t.id}`, body); toast(msg || 'Task saved.'); setModal(null); await q.reload(true); refresh?.(); }
    catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  };
  const create = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const d = Object.fromEntries(new FormData(e.target)); d.placement_id = Number(d.placement_id); if (!d.due_date) delete d.due_date;
      await post('/tasks', d); toast('Task assigned. The student has been notified.'); setModal(null); await q.reload(true); refresh?.();
    } catch (err) { toast(err.message, 'error'); } finally { setBusy(false); }
  };
  const remove = async t => {
    if (!window.confirm(`Delete task "${t.title}"?`)) return;
    try { await api(`/tasks/${t.id}`, { method: 'DELETE' }); toast('Task deleted.'); setModal(null); await q.reload(true); refresh?.(); } catch (e) { toast(e.message, 'error'); }
  };
  const edit = async (t, e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    if (user.role === 'student') return save(t, { progress: Number(d.progress), note: d.note }, 'Progress saved. Your farm partner has been notified.');
    const body = { title: d.title, description: d.description, progress: Number(d.progress) }; if (d.due_date) body.due_date = d.due_date;
    return save(t, body, 'Task updated.');
  };
  const isStudent = user.role === 'student';
  const editing = modal && modal !== 'create' ? modal : null;
  return <Section eyebrow="EXECUTION LAYER" title={isStudent ? 'My field tasks' : 'Task studio'} sub="Tasks belong to a real placement. Progress is saved to the database and visible to the farm partner and college." action={user.role === 'farmer' && <Btn onClick={() => setModal('create')}>＋ Assign task</Btn>}>
    <Chips options={['All', 'Pending', 'In Progress', 'Completed']} value={filter} onChange={setFilter} counts={counts} />
    <Async q={q} empty={<div className="task-grid-v2"><Empty title="No tasks yet" body={user.role === 'farmer' ? 'Select an applicant first, then assign field work to the placed student.' : isStudent ? 'Once a farm partner selects you, your assigned work appears here.' : 'No tasks exist in your scope yet.'} /></div>}>
      <div className="task-grid-v2">{items.map(t => <article className="task-card-v2" key={t.id}>
        <div className="task-top"><Pill tone={statusTone(t.status === 'In Progress' ? 'Pending' : t.status)}>{t.status}</Pill><span>{t.overdue ? '⚠ Overdue · ' : ''}{t.due_date || 'No due date'}</span></div>
        <h3>{t.title}</h3><p>{t.description || 'No description provided.'}</p><small>{t.internship} · {t.student}</small>
        {t.note && <small className="timeline">Student note: {t.note}</small>}
        <div className="task-progress"><div><span>Progress</span><b>{t.progress}%</b></div><div className="bar"><i style={{ width: `${t.progress}%` }} /></div></div>
        <div className="progress-actions">
          {isStudent && t.status !== 'Completed' && t.placement_status === 'Active' && [25, 50, 75, 100].map(p => <button key={p} disabled={busy} onClick={() => save(t, { progress: p }, `Progress saved: ${p}%.`)}>{p}%</button>)}
          {(isStudent ? (t.status !== 'Completed' && t.placement_status === 'Active') : user.role === 'farmer') && <button onClick={() => { setSlider(t.progress); setModal(t); }}>{isStudent ? 'Update…' : 'Edit'}</button>}
        </div></article>)}</div></Async>
    {modal === 'create' && <Modal title="Assign field task" subtitle="Only students with an active placement can receive tasks." onClose={() => setModal(null)}>
      {pl.loading ? <Loader /> : !(pl.data || []).length ? <><Empty title="No active placements" body="Select an applicant in Manage Applicants first." /><div className="modal-actions"><Btn onClick={() => { setModal(null); setPage('applicants'); }}>Go to applicants</Btn></div></>
        : <form className="form-v2" onSubmit={create}><label>Student / internship<select name="placement_id" required><option value="">Choose placed student</option>{pl.data.map(p => <option key={p.id} value={p.id}>{p.student.name} · {p.internship}</option>)}</select></label>
          <label>Task title<input name="title" required minLength="3" placeholder="Prepare crop health report" /></label><label>Description<textarea name="description" rows="4" placeholder="Expected outcome and instructions" /></label>
          <label>Due date<input name="due_date" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
          <div className="modal-actions"><Btn kind="ghost" type="button" onClick={() => setModal(null)}>Cancel</Btn><Btn type="submit" loading={busy}>Assign task</Btn></div></form>}</Modal>}
    {editing && <Modal title={isStudent ? 'Update progress' : 'Edit task'} subtitle={editing.title} onClose={() => setModal(null)}>
      <form className="form-v2" onSubmit={e => edit(editing, e)}>
        {!isStudent && <><label>Title<input name="title" required minLength="3" defaultValue={editing.title} /></label><label>Description<textarea name="description" rows="3" defaultValue={editing.description} /></label><label>Due date<input name="due_date" type="date" defaultValue={editing.due_date || ''} /></label></>}
        <label>Progress: {slider}%<input name="progress" type="range" min="0" max="100" step="5" value={slider} onChange={e => setSlider(Number(e.target.value))} /></label>
        {isStudent && <label>Note for your farm partner<textarea name="note" rows="3" maxLength="2000" defaultValue={editing.note} placeholder="What did you finish? Anything blocking you?" /></label>}
        <div className="modal-actions">{!isStudent && <Btn kind="ghost" type="button" onClick={() => remove(editing)}>Delete</Btn>}<Btn kind="ghost" type="button" onClick={() => setModal(null)}>Cancel</Btn><Btn type="submit" loading={busy}>Save</Btn></div></form></Modal>}
  </Section>;
}

function Evaluations({ user, toast, refresh }) {
  const [modal, setModal] = useState(false), [busy, setBusy] = useState(false);
  const q = useLoad(() => api('/evaluations'), []);
  const canWrite = user.role === 'farmer' || user.role === 'college';
  const pl = useLoad(() => (canWrite ? api('/placements') : Promise.resolve([])), []);
  const create = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const d = Object.fromEntries(new FormData(e.target));
      await post('/evaluations', { placement_id: Number(d.placement_id), rating: Number(d.rating), feedback: d.feedback });
      toast('Evaluation published. The student has been notified.'); setModal(false); await q.reload(true); refresh?.();
    } catch (err) { toast(err.message, 'error'); } finally { setBusy(false); }
  };
  return <Section eyebrow="OUTCOME EVIDENCE" title={user.role === 'student' ? 'My Feedback' : 'Evaluations'} sub="Evaluations are tied to a real placement, so only placed students can be evaluated." action={canWrite && <Btn onClick={() => setModal(true)}>＋ Publish feedback</Btn>}>
    <Async q={q} empty={<div className="evaluation-grid-v2"><Empty title="No evaluations yet" body={user.role === 'student' ? 'Feedback from your farm partner and college will appear here.' : 'Evaluate a placed student to create an outcome record.'} /></div>}>
      <div className="evaluation-grid-v2">{(q.data || []).map(e => <article className="eval-card-v2" key={e.id}>
        <div className="stars">{'★'.repeat(Math.round(e.rating))}{'☆'.repeat(5 - Math.round(e.rating))}</div><strong>{e.rating}/5</strong><h3>{e.student || 'Student'}</h3><small>{e.internship || 'Internship'}</small>
        <p>{e.feedback || 'No written feedback.'}</p><small>— {e.evaluator || 'Evaluator'}{e.evaluator_role ? ` (${e.evaluator_role === 'farmer' ? 'farm partner' : e.evaluator_role})` : ''} · {fmtDate(e.created_at)}</small></article>)}</div></Async>
    {modal && <Modal title="Publish evaluation" subtitle="Create a permanent outcome record for a placed student." onClose={() => setModal(false)}>
      {pl.loading ? <Loader /> : !(pl.data || []).length ? <Empty title="No placed students" body={user.role === 'college' ? 'No students from your institution have a placement yet.' : 'Select an applicant first.'} />
        : <form className="form-v2" onSubmit={create}><label>Student / internship<select name="placement_id" required><option value="">Choose student</option>{pl.data.map(p => <option key={p.id} value={p.id}>{p.student.name} · {p.internship} ({p.status})</option>)}</select></label>
          <label>Rating<select name="rating" defaultValue="5"><option value="5">5 — Outstanding</option><option value="4">4 — Strong</option><option value="3">3 — Good</option><option value="2">2 — Needs improvement</option><option value="1">1 — Poor</option></select></label>
          <label>Feedback<textarea name="feedback" rows="5" required minLength="3" maxLength="3000" placeholder="What did the student achieve?" /></label>
          <div className="modal-actions"><Btn kind="ghost" type="button" onClick={() => setModal(false)}>Cancel</Btn><Btn type="submit" loading={busy}>Publish evaluation</Btn></div></form>}</Modal>}</Section>;
}

function Students({ user }) {
  const [qText, setQText] = useState('');
  const q = useLoad(() => api('/college/students'), []);
  const students = q.data?.students || [];
  const filtered = students.filter(s => `${s.name} ${s.email} ${s.institution}`.toLowerCase().includes(qText.toLowerCase()));
  return <Section eyebrow="COLLEGE INTELLIGENCE" title="Student network" sub={q.data ? `Students from ${q.data.institution || 'your institution'}: applications, placements, task progress and evaluations.` : 'Live view of applications, placements, tasks and outcomes.'}>
    <div className="search-v2 compact">⌕<input value={qText} onChange={e => setQText(e.target.value)} placeholder="Search students…" /></div>
    <Async q={q}>
      {q.data && !q.data.institution && user.role === 'college' && <div className="form-error">Your College Profile has no institution set, so no students can be matched. Open College Profile and enter your institution name exactly as students enter it.</div>}
      <div className="student-table"><div className="table-head"><span>Student</span><span>Apps</span><span>Selected</span><span>Progress</span><span>Evaluations</span></div>
        {filtered.map(s => <div className="table-row" key={s.id}><div className="person-v2"><div className="avatar blue">{s.name[0]}</div><span><b>{s.name}</b><small>{s.email}{s.course ? ` · ${s.course}` : ''}</small>{s.placements.map(p => <small key={p.id}>{p.status}: {p.internship} @ {p.farmer}</small>)}</span></div>
          <b>{s.applications}</b><b>{s.selected}</b><div className="mini-progress"><i style={{ width: `${s.progress}%` }} /></div><b>{s.evaluations}{s.average_rating ? ` · ${s.average_rating}★` : ''}</b></div>)}</div>
      {!filtered.length && <Empty title="No students found" body={students.length ? 'Try a different search.' : 'Students whose profile institution matches yours will appear here.'} />}</Async></Section>;
}

function Users({ toast }) {
  const [text, setText] = useState(''), [role, setRole] = useState('All'), [busyId, setBusyId] = useState(null);
  const q = useLoad(() => api('/admin/users'), []);
  const act = async (u, what) => {
    if (what === 'active' && u.active && !window.confirm(`Deactivate ${u.name}? They will be signed out and unable to log in.`)) return;
    setBusyId(u.id);
    try { await patch(`/admin/users/${u.id}/${what}`); toast(what === 'verify' ? 'Verification updated.' : 'Account status updated.'); await q.reload(true); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(null); }
  };
  const all = q.data || [];
  const items = all.filter(u => (role === 'All' || u.role === role) && `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(text.toLowerCase()));
  return <Section eyebrow="TRUST LAYER" title="User governance" sub="Every control below changes the real account record in the database.">
    <div className="search-v2 compact">⌕<input value={text} onChange={e => setText(e.target.value)} placeholder="Search name, email or role…" /></div>
    <Chips options={['All', 'student', 'farmer', 'college', 'admin']} value={role} onChange={setRole} />
    <Async q={q}><div className="student-table"><div className="table-head"><span>User</span><span>Role</span><span>Status</span><span>Joined</span><span>Action</span></div>
      {items.map(u => <div className="table-row" key={u.id}><div className="person-v2"><div className="avatar violet">{u.name[0]}</div><span><b>{u.name}</b><small>{u.email}</small></span></div><Pill tone="blue">{u.role}</Pill>
        <span><Pill tone={u.verified ? 'lime' : 'amber'}>{u.verified ? 'Verified' : 'Pending'}</Pill>{!u.active && <Pill tone="red">Deactivated</Pill>}</span><small>{fmtDate(u.created_at)}</small>
        <span><button className="table-action" disabled={busyId === u.id} onClick={() => act(u, 'verify')}>{u.verified ? 'Revoke' : 'Verify'}</button> <button className="table-action" disabled={busyId === u.id} onClick={() => act(u, 'active')}>{u.active ? 'Deactivate' : 'Activate'}</button></span></div>)}</div>
      {!items.length && <Empty title="No users match" body="Try a different search or role." />}</Async></Section>;
}

function Profile({ user, toast, onUser, onLogout }) {
  const [busy, setBusy] = useState(false), [version, setVersion] = useState(0);
  const q = useLoad(() => api('/profile'), []);
  if (q.loading && !q.data) return <Loader />;
  if (q.error && !q.data) return <ErrorState error={q.error} retry={q.reload} />;
  const p = q.data;
  const save = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const out = await api('/profile', { method: 'PUT', body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      onUser?.({ id: out.id, name: out.name, email: out.email, role: out.role, verified: out.verified, phone: out.phone, location: out.location });
      await q.reload(true); setVersion(v => v + 1); toast('Profile saved.');
    } catch (err) { toast(err.message, 'error'); } finally { setBusy(false); }
  };
  const reset = async () => { await q.reload(true); setVersion(v => v + 1); toast('Unsaved changes discarded — showing your saved profile.'); };
  const instLabel = user.role === 'farmer' ? 'Farm / organisation' : 'Institution';
  return <Section eyebrow="IDENTITY" title="Professional profile" sub="This profile is the source of truth used across the connected platform.">
    <form className="profile-v2" key={version} onSubmit={save}><div className="profile-banner"><div className={`profile-avatar ${roles[user.role].color}`}>{p.name[0]}</div><div><Pill tone={p.verified ? 'lime' : 'amber'}>{p.verified ? 'Verified account' : 'Verification pending'}</Pill><h3>{p.name}</h3><p>{p.email} · {user.role}</p></div>{onLogout && <button type="button" className="top-logout-btn" onClick={onLogout} style={{ marginLeft: 'auto' }}><span>↪</span><span>Sign out</span></button>}</div>
      <div className="form-grid-v2"><label>Full name<input name="name" required minLength="2" maxLength="120" defaultValue={p.name} /></label><label>Headline<input name="headline" maxLength="180" defaultValue={p.headline || ''} placeholder="Your professional headline" /></label>
        <label>Location<input name="location" maxLength="160" defaultValue={p.location || ''} placeholder="City, State" /></label><label>Phone<input name="phone" pattern="[0-9+()\- ]*" maxLength="40" defaultValue={p.phone || ''} /></label>
        <label>{instLabel}<input name="institution" maxLength="180" defaultValue={p.institution || ''} /></label>
        {user.role === 'student' && <><label>Course<input name="course" maxLength="160" defaultValue={p.course || ''} /></label><label>Year<input name="year" maxLength="40" defaultValue={p.year || ''} /></label></>}
        {user.role !== 'student' && <><input type="hidden" name="course" value="" /><input type="hidden" name="year" value="" /></>}
        <label className="span2">Skills<input name="skills" maxLength="500" defaultValue={p.skills || ''} placeholder="Python, AI, Agriculture, Research" /></label>
        <label className="span2">Bio<textarea name="bio" rows="6" maxLength="3000" defaultValue={p.bio || ''} placeholder="Tell the network what you are building, learning or offering." /></label></div>
      <div className="form-actions-v2">
        {onLogout && (
          <Btn kind="ghost" type="button" onClick={onLogout} style={{ color: '#c93427', borderColor: '#f5c2bd', marginRight: 'auto' }}>
            Sign out of FarmIntern ↪
          </Btn>
        )}
        <Btn kind="ghost" type="button" onClick={reset}>Reset</Btn>
        <Btn type="submit" loading={busy}>Save changes →</Btn>
      </div></form></Section>;
}

function Notifications({ data, toast, refresh, setPage, nav }) {
  const open = async n => {
    try { if (!n.read) await api(`/notifications/${n.id}/read`, { method: 'PATCH' }); refresh(); } catch (e) { toast(e.message, 'error'); }
    if (n.link && nav.some(x => x[0] === n.link)) setPage(n.link);
  };
  const all = async () => { try { await post('/notifications/read-all'); toast('All notifications marked as read.'); refresh(); } catch (e) { toast(e.message, 'error'); } };
  return <Section eyebrow="LIVE SIGNALS" title="Notifications" sub="Every application, task, message and evaluation event lands here. Click one to open the related page." action={data.some(n => !n.read) && <Btn kind="soft" onClick={all}>Mark all read</Btn>}>
    <div className="notifications-v2">{data.map(n => <button key={n.id} className={n.read ? 'notification-v2' : 'notification-v2 unread'} onClick={() => open(n)}><span>{n.read ? '○' : '●'}</span><div><b>{n.title}</b><p>{n.body}</p><small>{fmtDateTime(n.created_at)}</small></div>{!n.read && <Pill tone="lime">New</Pill>}</button>)}
      {!data.length && <Empty title="Nothing new" body="You are completely caught up." />}</div></Section>;
}

function Reports({ user }) {
  const q = useLoad(() => api('/reports'), []);
  return <Section eyebrow="DECISION CENTER" title={user.role === 'admin' ? 'Platform report' : 'Outcome report'} sub="Calculated live from the database for your reporting scope.">
    <Async q={q}>{q.data && (() => { const r = q.data; const pct = r.tasks ? Math.round(r.completed_tasks / r.tasks * 100) : 0; return <>
      <div className="report-hero-v2"><div><small>WORKFLOW COMPLETION</small><strong>{pct}%</strong><p>of tracked tasks are completed · {r.internships} internships · {r.openings} openings · {r.active_placements} active / {r.completed_placements} completed placements.</p></div><div className="big-ring"><b>{r.average_rating}</b><span>/5<br />avg rating</span></div></div>
      <div className="report-cards-v2">{[['Applications', r.applications, 'Demand'], ['Selected', r.selected, 'Placements created'], ['Tasks', r.tasks, 'Tracked work'], ['Completed', r.completed_tasks, 'Finished work'], ['Evaluations', r.evaluations, 'Outcome records']].map(x => <article key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></article>)}</div></>; })()}</Async></Section>;
}


export default App;
