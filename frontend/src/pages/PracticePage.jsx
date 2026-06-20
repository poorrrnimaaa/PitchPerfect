import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ScoreCard from '../components/ScoreCard';
import Icon from '../components/Icon';
import API from '../api/config';

const scenarios = {
  startup: { title: 'Startup pitch', description: 'Present your startup idea to an investor.', partner: 'Seed investor', context: 'You’re meeting an early-stage investor for the first time. Make the problem, opportunity, and your advantage easy to understand.' },
  'product-demo': { title: 'Product demo', description: 'Showcase your product to a potential customer.', partner: 'Product buyer', context: 'A potential customer is evaluating whether your product solves a meaningful problem for their team.' },
  fundraising: { title: 'Fundraising', description: 'Practice raising capital with confidence.', partner: 'VC partner', context: 'You’re discussing your raise with a venture partner who wants to understand traction, ambition, and capital efficiency.' },
};

export default function PracticePage() {
  const { scenarioType } = useParams();
  const navigate = useNavigate();
  const [pitchId, setPitchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const startPitch = async () => {
      try { const response = await API.post('/pitch/start', { scenarioType }); setPitchId(response.data.pitchId); }
      catch (error) { console.error(error); navigate('/dashboard'); }
      finally { setLoading(false); }
    };
    startPitch();
  }, [scenarioType, navigate]);

  const handleComplete = (result) => { setScores(result.scores); setFeedback(result.feedback); };
  const current = scenarios[scenarioType] || scenarios.startup;

  if (loading) return <main className="session-loading"><div className="session-loader"><span><Icon name="sparkles" size={23}/></span><h2>Preparing your session</h2><p>Setting the context for your AI partner…</p><div><i/><i/><i/></div></div></main>;

  return (
    <main className="practice-page">
      <div className="container practice-container">
        <header className="practice-header"><button onClick={() => navigate('/dashboard')} className="back-button"><Icon name="arrowLeft" size={18}/> Dashboard</button><div className="practice-title"><div><span className="session-status"><i/> Practice session</span><h1>{current.title}</h1><p>{current.description}</p></div>{!scores && <div className="session-partner"><span className="avatar avatar--ai">P</span><div><small>Your conversation partner</small><strong>{current.partner}</strong></div></div>}</div></header>

        {!scores ? <div className="practice-grid"><section className="chat-card">{pitchId && <ChatWindow pitchId={pitchId} scenarioType={scenarioType} partner={current.partner} onComplete={handleComplete}/>}</section><aside className="session-sidebar"><div className="session-info-card"><span className="eyebrow">Scenario</span><h3>Set the scene</h3><p>{current.context}</p></div><div className="session-info-card"><span className="eyebrow">Keep in mind</span><ul className="goals-list"><li><span>01</span><p><strong>Be direct</strong>Lead with your core point.</p></li><li><span>02</span><p><strong>Use evidence</strong>Support claims with specifics.</p></li><li><span>03</span><p><strong>Stay present</strong>Answer the question being asked.</p></li></ul></div><div className="evaluation-note"><Icon name="shield" size={18}/><p>Your session is evaluated on <strong>delivery, confidence, logic, and persuasion.</strong></p></div></aside></div> : <div className="score-page-wrap"><ScoreCard scores={scores} feedback={feedback}/><div className="score-actions"><button onClick={() => navigate('/dashboard')} className="button button--secondary"><Icon name="arrowLeft" size={17}/> Back to dashboard</button><button onClick={() => window.location.reload()} className="button button--primary">Practice again <Icon name="arrowRight" size={17}/></button></div></div>}
      </div>
    </main>
  );
}
