import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  { title: "AC repair at your doorstep", text: "Fast help from verified local professionals.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1800&q=85" },
  { title: "Electrical work, handled right", text: "Book trusted help for home electrical jobs.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1800&q=85" },
  { title: "Plumbing without the stress", text: "Get a professional to your door with one booking.", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1800&q=85" },
];

const services = [
  ["❄", "AC Repair", "Cooling, servicing and maintenance"],
  ["⚡", "Electrical", "Home electrical repair and support"],
  ["⌁", "Plumbing", "Leaks, fittings and plumbing work"],
  ["⌂", "General Repair", "Reliable help for everyday problems"],
];

export default function Landing() {
  const [active, setActive] = useState(0);
  useEffect(() => { const id = setInterval(() => setActive((v) => (v + 1) % slides.length), 5000); return () => clearInterval(id); }, []);

  return (
    <div className="landing-premium">
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div key={slide.title} className={`hero-slide ${index === active ? "active" : ""}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(5,13,28,.9), rgba(5,13,28,.42), rgba(5,13,28,.12)), url(${slide.image})` }}>
            <div className="hero-copy page-shell">
              <span className="eyebrow">FIXMATE • HOME SERVICES</span>
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/register/customer">Book a service</Link><Link className="btn btn-outline-light btn-large" to="/about">How FixMate works</Link></div>
            </div>
          </div>
        ))}
        <div className="slider-dots">{slides.map((s, i) => <button key={s.title} className={i === active ? "active" : ""} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />)}</div>
      </section>

      <section className="trust-strip"><div><strong>Verified professionals</strong><span>Admin-approved providers</span></div><div><strong>Live updates</strong><span>Know when your booking changes</span></div><div><strong>Map-ready visits</strong><span>Location details captured at booking</span></div></section>

      <section className="section page-shell">
        <div className="section-heading"><div><span className="eyebrow">WHAT WE DO</span><h2>One place for your essential services</h2></div><Link to="/register/customer" className="text-link">Explore services →</Link></div>
        <div className="service-showcase">{services.map(([icon, title, text]) => <article className="showcase-card" key={title}><div className="showcase-icon">{icon}</div><h3>{title}</h3><p>{text}</p><span>Available through verified providers</span></article>)}</div>
      </section>

      <section className="how-section"><div className="page-shell"><div className="section-heading light"><div><span className="eyebrow">SIMPLE BY DESIGN</span><h2>From problem to doorstep</h2></div></div><div className="steps"><div><b>01</b><h3>Choose a service</h3><p>Browse categories and verified providers.</p></div><div><b>02</b><h3>Confirm your visit</h3><p>Add your address, map location and preferred time.</p></div><div><b>03</b><h3>Track the booking</h3><p>Receive updates until the provider completes the work.</p></div></div></div></section>

      <section className="cta-section page-shell"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Fix the problem. Get on with life.</h2><p>Create your customer account and book a verified professional.</p></div><Link to="/register/customer" className="btn btn-primary btn-large">Get started</Link></section>
    </div>
  );
}
