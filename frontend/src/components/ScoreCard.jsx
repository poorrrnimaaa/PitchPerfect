import Icon from './Icon';

export default function ScoreCard({ scores, feedback }) {
  const categories = [{ label: 'Delivery', score: scores.delivery }, { label: 'Confidence', score: scores.confidence }, { label: 'Logic', score: scores.logic }, { label: 'Persuasion', score: scores.persuasion }];
  const summary = scores.overall >= 85 ? 'A compelling performance.' : scores.overall >= 70 ? 'A strong foundation.' : 'A useful first step.';
  return <section className="score-card">
    <header className="score-header"><div><span className="eyebrow">Session complete</span><h1>{summary}</h1><p>Here’s how your pitch came across and where to focus next.</p></div><div className="overall-score" style={{'--score': `${Math.min(scores.overall, 100) * 3.6}deg`}}><div><strong>{scores.overall}</strong><small>out of 100</small></div></div></header>
    <div className="score-content"><div className="score-breakdown"><div className="score-section-title"><div><span className="eyebrow">Performance</span><h2>Score breakdown</h2></div><Icon name="trend" size={20}/></div><div className="category-grid">{categories.map((cat) => <div className="category-score" key={cat.label}><div><span>{cat.label}</span><strong>{cat.score}<small>/100</small></strong></div><div className="category-track"><i style={{width:`${Math.min(cat.score, 100)}%`}}/></div></div>)}</div></div><aside className="feedback-card"><span className="feedback-icon"><Icon name="sparkles" size={20}/></span><span className="eyebrow">AI coach feedback</span><h2>Your next improvement</h2><p>{feedback}</p><div className="feedback-tip"><Icon name="insight" size={17}/><span>Use this feedback as the focus for your next session.</span></div></aside></div>
  </section>;
}
