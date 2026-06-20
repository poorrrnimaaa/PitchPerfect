import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import API from '../api/config';
import Icon from '../components/Icon';

const scenarios = [
  { id: 'startup', title: 'Startup pitch', description: 'Present your idea and defend the opportunity to a seed investor.', icon: 'sparkles', meta: 'Investor simulation', duration: '10–15 min' },
  { id: 'product-demo', title: 'Product demo', description: 'Explain your product’s value to a curious potential customer.', icon: 'message', meta: 'Customer conversation', duration: '8–12 min' },
  { id: 'fundraising', title: 'Fundraising', description: 'Handle tough questions about traction, growth, and your raise.', icon: 'trend', meta: 'VC partner meeting', duration: '12–18 min' },
];

function MetricCard({ label, value, suffix, icon, helper }) {
  return <article className="metric-card"><div className="metric-card__top"><span>{label}</span><i><Icon name={icon} size={17}/></i></div><div className="metric-card__value">{value}<small>{suffix}</small></div><p>{helper}</p></article>;
}

function EmptyActivity({ navigate }) {
  return <div className="empty-state"><span><Icon name="message" size={23}/></span><h3>Your first session awaits</h3><p>Choose a scenario and complete a conversation to see your progress here.</p><button className="button button--secondary" onClick={() => navigate('/practice/startup')}>Start a session <Icon name="arrowRight" size={17}/></button></div>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pitches, setPitches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPitches = async () => {
      try { const response = await API.get('/pitch'); setPitches(response.data); }
      catch (err) { console.error(err); setError('We couldn’t load your sessions. Please refresh and try again.'); }
      finally { setLoading(false); }
    };
    fetchPitches();
  }, []);

  const completedPitches = pitches.filter((pitch) => pitch.status === 'completed');
  const avgScore = completedPitches.length ? Math.round(completedPitches.reduce((sum, pitch) => sum + pitch.scores.overall, 0) / completedPitches.length) : 0;
  const bestScore = completedPitches.length ? Math.max(...completedPitches.map((pitch) => pitch.scores.overall)) : 0;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <main className="dashboard-page">
      <div className="container dashboard-container">
        <header className="dashboard-hero"><div><span className="eyebrow">Your practice space</span><h1>Good to see you, {firstName}.</h1><p>Choose a conversation to practice or review how your communication is improving.</p></div><button className="button button--primary" onClick={() => navigate('/practice/startup')}><Icon name="plus" size={18}/> New session</button></header>

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <section className="metrics-grid" aria-label="Performance overview">
          <MetricCard label="Practice sessions" value={completedPitches.length} icon="message" helper="Completed conversations"/>
          <MetricCard label="Average score" value={avgScore} suffix="/100" icon="target" helper={completedPitches.length ? 'Across all completed sessions' : 'Complete a session to begin'}/>
          <MetricCard label="Personal best" value={bestScore} suffix="/100" icon="trend" helper={completedPitches.length ? 'Your highest session score' : 'Your best score will appear here'}/>
        </section>

        <section className="dashboard-section">
          <div className="section-title-row"><div><h2>Choose a practice</h2><p>Step into a realistic conversation tailored to your goal.</p></div></div>
          <div className="scenario-grid">{scenarios.map((scenario) => <article className="scenario-card" key={scenario.id} onClick={() => navigate(`/practice/${scenario.id}`)}><div className="scenario-card__top"><span className="scenario-icon"><Icon name={scenario.icon} size={21}/></span><Icon name="arrowUpRight" size={19} className="scenario-arrow"/></div><span className="scenario-meta">{scenario.meta}</span><h3>{scenario.title}</h3><p>{scenario.description}</p><footer><span><Icon name="clock" size={14}/>{scenario.duration}</span><button aria-label={`Start ${scenario.title}`}>Start <Icon name="arrowRight" size={15}/></button></footer></article>)}</div>
        </section>

        <section className="dashboard-lower-grid">
          <div className="activity-card">
            <div className="card-header"><div><h2>Recent sessions</h2><p>Your latest practice activity</p></div></div>
            {loading ? <div className="activity-loading"><i/><i/><i/></div> : completedPitches.length ? <div className="activity-list">{completedPitches.slice(0, 6).map((pitch) => <div className="activity-row" key={pitch._id}><span className="activity-icon"><Icon name="message" size={17}/></span><div className="activity-name"><strong>{pitch.scenarioType.replace('-', ' ')}</strong><small>{new Date(pitch.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</small></div><span className="activity-status"><i/>Completed</span><div className="activity-score"><strong>{pitch.scores.overall}</strong><small>/100</small></div></div>)}</div> : <EmptyActivity navigate={navigate}/>} 
          </div>
          <aside className="focus-card"><div className="focus-card__icon"><Icon name="insight" size={21}/></div><span className="eyebrow">Practice tip</span><h3>Make your point before you explain it.</h3><p>Lead with the one sentence you want your listener to remember. Use the rest of your answer to prove it.</p><div className="focus-rule"><span>Simple structure</span><strong>Point → Proof → Meaning</strong></div></aside>
        </section>
      </div>
    </main>
  );
}
