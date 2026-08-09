import HeroSection from "../components/HeroSection.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import StatCard from "../components/StatCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import InternshipCard from "../components/InternshipCard.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import TimelineStep from "../components/TimelineStep.jsx";
import TestimonialCard from "../components/TestimonialCard.jsx";

import stats from "../data/stats.jsx";
import categories from "../data/categories.js";
import internships from "../data/internships.js";
import features from "../data/features.jsx";
import timeline from "../data/timeline.js";
import testimonials from "../data/testimonials.js";

function Home() {
  return (
    <>
      <HeroSection />

      {/* Statistics */}
      <section className="section-sm">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat) => (
              <div className="col-6 col-lg-3" key={stat.id}>
                <StatCard icon={stat.icon} value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section bg-brand-soft" id="categories">
        <div className="container">
          <SectionTitle
            eyebrow="Explore"
            title="Popular Categories"
            description="Choose from a wide range of agricultural specializations to start your internship journey."
          />
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-sm-6 col-lg-4" key={category.id}>
                <CategoryCard
                  image={category.image}
                  title={category.title}
                  description={category.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="section" id="internships">
        <div className="container">
          <SectionTitle
            eyebrow="Opportunities"
            title="Featured Internship Preview"
            description="A glimpse of the hands-on internships currently open on the platform."
          />
          <div className="row g-4">
            {internships.map((internship) => (
              <div className="col-md-6 col-lg-4" key={internship.id}>
                <InternshipCard internship={internship} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-brand-soft" id="about">
        <div className="container">
          <SectionTitle
            eyebrow="Why AgriIntern"
            title="Why Choose Our Platform"
            description="Everything you need for a genuine, well-supported agricultural internship experience."
          />
          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-sm-6 col-lg-4" key={feature.id}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Process"
            title="How It Works"
            description="A simple, guided path from registration to certification."
          />
          <div className="row g-4 g-lg-2">
            {timeline.map((step, index) => (
              <div className="col-md-4 col-lg-2" key={step.id}>
                <TimelineStep
                  index={index + 1}
                  title={step.title}
                  description={step.description}
                  isLast={index === timeline.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-brand-soft">
        <div className="container">
          <SectionTitle
            eyebrow="Testimonials"
            title="What Students Say"
            description="Real experiences from students who completed an internship through AgriIntern."
          />
          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div className="col-md-6 col-lg-4" key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
