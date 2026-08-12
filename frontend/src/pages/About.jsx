import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="about-page page-shell">
      <div className="about-hero">
        <div>
          <span className="eyebrow">ABOUT FIXMATE</span>
          <h1>Reliable home services, <span>without the hassle.</span></h1>
          <p>FixMate connects customers with verified local service businesses for everyday repairs and maintenance.</p>
        </div>
        <div className="about-mark">FM</div>
      </div>

      <div className="feature-grid">
        <article className="feature-card"><span>✓</span><h3>Verified providers</h3><p>Every provider is reviewed and approved by the FixMate admin team before appearing to customers.</p></article>
        <article className="feature-card"><span>⌁</span><h3>Live booking updates</h3><p>Customers can follow booking status and receive notifications when a provider accepts, rejects or completes a job.</p></article>
        <article className="feature-card"><span>⌖</span><h3>Doorstep-ready details</h3><p>Address and map coordinates are captured before a booking is confirmed so providers know exactly where to go.</p></article>
      </div>

      <div className="about-business">
        <div>
          <span className="eyebrow">FOR SERVICE BUSINESSES</span>
          <h2>Want to join FixMate?</h2>
          <p>Provider onboarding is handled directly by FixMate. If you want your business to join the platform, contact our team. We will discuss the partnership, commercial terms and onboarding before an admin creates and approves the provider account.</p>
          <a className="btn btn-primary" href="mailto:hello@fixmate.com">Contact FixMate</a>
        </div>
        <div className="business-card">
          <strong>Provider onboarding</strong>
          <ol>
            <li>Contact FixMate</li>
            <li>Business discussion &amp; commercial terms</li>
            <li>Admin creates the provider account</li>
            <li>Admin verifies the provider</li>
            <li>Provider starts receiving bookings</li>
          </ol>
        </div>
      </div>

      <div className="about-cta">
        <div><h2>Need a service?</h2><p>Create a customer account and book a verified professional.</p></div>
        <Link className="btn btn-light" to="/register/customer">Create customer account</Link>
      </div>
    </section>
  );
}
