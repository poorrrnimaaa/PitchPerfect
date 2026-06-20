import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Brand from '../components/Brand';
import Icon from '../components/Icon';

const audience = ['Founders', 'Job seekers', 'Students', 'Product teams', 'Sales leaders'];

const testimonials = [
  { quote: 'The investor follow-ups forced me to sharpen the part of my story I had been avoiding. I walked into demo day noticeably calmer.', name: 'Maya Chen', role: 'Founder, Northstar Labs', initials: 'MC' },
  { quote: 'It feels less like rehearsing into a mirror and more like a thoughtful sparring partner. The feedback is specific enough to use immediately.', name: 'Daniel Okafor', role: 'Product manager', initials: 'DO' },
  { quote: 'I used the interview mode for two weeks before recruiting season. My answers became shorter, clearer, and much more confident.', name: 'Ananya Rao', role: 'Graduate student', initials: 'AR' },
];

const faqs = [
  ['What can I practice?', 'Choose from startup pitches, product demos, and fundraising conversations. Each simulation adapts its questions to your responses.'],
  ['How does the feedback work?', 'After a session, PitchPerfect evaluates delivery, confidence, logic, and persuasion, then gives you a focused written summary.'],
  ['Is PitchPerfect suitable for beginners?', 'Yes. The session goals and coaching cues make it easy to begin, while realistic follow-up questions keep it useful as you improve.'],
];

function ProductPreview() {
  return (
    <div className="product-preview" aria-label="PitchPerfect product preview">
      <div className="preview-topbar"><div className="preview-dots"><i/><i/><i/></div><span>Practice session</span><div className="preview-live"><i/> Live coaching</div></div>
      <div className="preview-layout">
        <aside className="preview-sidebar">
          <Brand compact />
          <div className="preview-user"><span>AR</span><div><strong>Alex Rivera</strong><small>Free plan</small></div></div>
          <div className="preview-nav"><span className="active"><Icon name="message" size={16}/>Practice</span><span><Icon name="trend" size={16}/>Progress</span><span><Icon name="clock" size={16}/>Sessions</span></div>
          <div className="preview-tip"><Icon name="insight" size={17}/><strong>Coach’s note</strong><p>Lead with the problem before introducing your solution.</p></div>
        </aside>
        <main className="preview-main">
          <div className="preview-heading"><div><span className="eyebrow">Investor simulation</span><h3>Seed round partner meeting</h3></div><span className="preview-time"><Icon name="clock" size={14}/> 08:42</span></div>
          <div className="preview-chat">
            <div className="preview-message preview-message--ai"><span className="avatar avatar--ai">P</span><div><small>AI investor</small><p>Your retention is promising. What makes this difficult for a larger competitor to replicate?</p></div></div>
            <div className="preview-message preview-message--user"><div><small>You</small><p>Our advantage is the proprietary conversation dataset we’ve built with design partners over the last 18 months.</p></div><span className="avatar">AR</span></div>
            <div className="preview-feedback"><Icon name="sparkles" size={16}/><p><strong>Strong evidence.</strong> Add one concrete metric to make the moat more memorable.</p><span>Clarity +4</span></div>
          </div>
          <div className="preview-composer"><span>Respond to the investor…</span><button aria-label="Send"><Icon name="send" size={16}/></button></div>
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { token } = useAuthStore();
  const startPath = token ? '/dashboard' : '/signup';

  return (
    <main className="marketing-page">
      <section className="hero">
        <div className="container hero-copy">
          <div className="eyebrow-pill"><span/>Purpose-built AI practice</div>
          <h1>Say it better when<br/>it <em>matters most.</em></h1>
          <p>Practice high-stakes conversations with realistic AI partners. Get precise feedback, build confidence, and make every word count.</p>
          <div className="hero-actions"><Link to={startPath} className="button button--primary button--lg">Start practicing free <Icon name="arrowRight" size={18}/></Link><a href="#product" className="button button--secondary button--lg"><Icon name="play" size={17}/> See how it works</a></div>
          <div className="hero-note"><span className="avatar-stack"><i>AR</i><i>MC</i><i>DO</i></span><span><strong>4.9/5</strong> from early practitioners</span></div>
        </div>
        <div className="container hero-product" id="product"><ProductPreview/><div className="preview-score-card"><span>Session score</span><strong>87</strong><small><Icon name="trend" size={13}/> 8 pts this week</small></div><div className="preview-quote-card"><span className="quote-mark">“</span><p>That answer was clear and evidence-led.</p><small>AI feedback</small></div></div>
      </section>

      <section className="audience-strip"><div className="container"><p>Built for ambitious communicators at every stage</p><div>{audience.map((item, i) => <span key={item}>{i > 0 && <i/>}{item}</span>)}</div></div></section>

      <section className="section section--intro" id="features"><div className="container"><div className="section-heading"><span className="eyebrow">Practice with purpose</span><h2>A sharper way to<br/>prepare for the room.</h2><p>Realistic practice, thoughtful feedback, and a clear record of your progress—without generic scripts or awkward role-play.</p></div></div></section>

      <section className="feature-section"><div className="container feature-grid"><div className="feature-copy"><span className="feature-number">01</span><span className="eyebrow">Adaptive conversations</span><h3>Practice the questions you can’t predict.</h3><p>Your AI partner listens and responds to what you actually say. Every follow-up reflects the context of your conversation.</p><ul><li><Icon name="check" size={16}/>Realistic investor objections</li><li><Icon name="check" size={16}/>Role-specific interview questions</li><li><Icon name="check" size={16}/>Adaptive product and customer scenarios</li></ul></div><div className="feature-visual feature-visual--chat"><div className="mini-session-header"><span><i/> Investor meeting</span><small>Question 4 of 6</small></div><div className="mini-chat"><div className="mini-bubble"><span className="avatar avatar--ai">P</span><p>What evidence tells you customers will pay for this?</p></div><div className="mini-bubble mini-bubble--user"><p>Our first twelve design partners converted to annual contracts after the pilot.</p><span className="avatar">You</span></div><div className="mini-coach"><Icon name="sparkles" size={15}/><span><strong>Good specificity</strong><br/>Now connect this to the size of the opportunity.</span></div></div></div></div></section>

      <section className="feature-section feature-section--tint"><div className="container feature-grid feature-grid--reverse"><div className="feature-copy"><span className="feature-number">02</span><span className="eyebrow">Actionable feedback</span><h3>Know exactly what to improve next.</h3><p>See how your delivery, confidence, logic, and persuasion work together—then turn insight into a focused next practice.</p><ul><li><Icon name="check" size={16}/>Clear, category-level scoring</li><li><Icon name="check" size={16}/>Specific coaching after each session</li><li><Icon name="check" size={16}/>Strengths and opportunities in plain language</li></ul></div><div className="feature-visual score-visual"><div className="score-visual-top"><div className="score-ring"><strong>87</strong><small>Overall</small></div><div><span className="eyebrow">Latest session</span><h4>A persuasive, well-structured pitch.</h4><p>Your opening was concise and your evidence made the value proposition credible.</p></div></div><div className="score-bars">{[['Clarity',92],['Confidence',84],['Persuasion',88]].map(([label,value]) => <div key={label}><span>{label}</span><div><i style={{width:`${value}%`}}/></div><strong>{value}</strong></div>)}</div></div></div></section>

      <section className="feature-section"><div className="container feature-grid"><div className="feature-copy"><span className="feature-number">03</span><span className="eyebrow">Visible progress</span><h3>Turn every session into momentum.</h3><p>Track your sessions and scores over time. See improvement take shape, stay consistent, and walk into the next conversation prepared.</p><Link to={startPath} className="text-link">Explore your dashboard <Icon name="arrowRight" size={17}/></Link></div><div className="feature-visual progress-visual"><div className="progress-visual-head"><div><small>Performance trend</small><strong>+18 points</strong></div><span>Last 6 sessions</span></div><div className="chart"><div className="chart-lines"><i/><i/><i/><i/></div><svg viewBox="0 0 500 180" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6D5DFC" stopOpacity=".24"/><stop offset="100%" stopColor="#6D5DFC" stopOpacity="0"/></linearGradient></defs><path className="chart-area" d="M0 150 C60 145 75 120 125 125 S190 100 250 105 S325 65 375 72 S445 30 500 38 L500 180 L0 180Z"/><path className="chart-line" d="M0 150 C60 145 75 120 125 125 S190 100 250 105 S325 65 375 72 S445 30 500 38"/></svg><div className="chart-labels"><span>Session 1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>Today</span></div></div></div></div></section>

      <section className="testimonials section" id="stories"><div className="container"><div className="section-heading section-heading--center"><span className="eyebrow">In their words</span><h2>Practice that shows up<br/>in the real conversation.</h2></div><div className="testimonial-grid">{testimonials.map(item => <article className="testimonial-card" key={item.name}><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{item.quote}”</blockquote><footer><span className="avatar">{item.initials}</span><div><strong>{item.name}</strong><small>{item.role}</small></div></footer></article>)}</div></div></section>

      <section className="faq section" id="faq"><div className="container faq-grid"><div className="section-heading"><span className="eyebrow">Questions, answered</span><h2>Everything you need to begin.</h2><p>PitchPerfect is designed to get out of your way and into the conversation quickly.</p></div><div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}<Icon name="plus" size={19}/></summary><p>{a}</p></details>)}</div></div></section>

      <section className="cta-section"><div className="container"><div className="cta-card"><span className="eyebrow">Your next conversation starts here</span><h2>Walk in ready.<br/>Speak with confidence.</h2><p>Start a realistic practice session in minutes. No credit card required.</p><Link to={startPath} className="button button--light button--lg">Start practicing free <Icon name="arrowRight" size={18}/></Link></div></div></section>

      <footer className="site-footer"><div className="container footer-main"><div><Brand/><p>Practice the conversations that move your career and ideas forward.</p></div><div className="footer-links"><div><strong>Product</strong><a href="#features">Features</a><Link to="/dashboard">Dashboard</Link><a href="#faq">FAQ</a></div><div><strong>Use cases</strong><span>Startup pitches</span><span>Interviews</span><span>Product demos</span></div><div><strong>Get started</strong><Link to="/signup">Create account</Link><Link to="/login">Log in</Link></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} PitchPerfect</span><span>Built for better conversations.</span></div></footer>
    </main>
  );
}
