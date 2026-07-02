import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ScoreCard from '../components/ScoreCard';
import Icon from '../components/Icon';
import API from '../api/config';
import {
  getScenarioById,
  getCategoryById,
} from "../data/scenarios";

const roleOptions = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'React Developer',
  'MERN Stack Developer',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
  'UI/UX Designer',
  'Product Manager',
  'Marketing Executive',
  'Sales Executive',
  'Customer Support',
];

const experienceOptions = ['Student', 'Fresher', '1-2 Years', '3-5 Years', 'Senior'];
const companyOptions = ['Startup', 'Product Company', 'Service Company', 'FAANG', 'MNC'];
const difficultyOptions = ['Easy', 'Medium', 'Hard'];
const durationOptions = ['10 Minutes', '20 Minutes', '30 Minutes'];
const personalityOptions = ['Friendly', 'Professional', 'Strict'];

function SetupField({ label, children }) {
  return <label className="setup-field"><span>{label}</span>{children}</label>;
}

function RadioGroup({ label, value, options, onChange }) {
  return <div className="setup-field"><span>{label}</span><div className="setup-radio-group">{options.map((option) => <button type="button" key={option} className={value === option ? 'is-active' : ''} onClick={() => onChange(option)}><i/>{option}</button>)}</div></div>;
}

export default function PracticePage() {
  const { scenarioType } = useParams();
  const navigate = useNavigate();
  const scenario = useMemo(() => getScenarioById(scenarioType) || getScenarioById('hr-interview'), [scenarioType]);
  const category = useMemo(() => getCategoryById(scenario.category), [scenario]);
  const [pitchId, setPitchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [setup, setSetup] = useState({
    roleApplyingFor: scenario.defaultRole || roleOptions[0],
    experienceLevel: 'Fresher',
    companyType: 'Startup',
    difficulty: scenario.difficulty || 'Medium',
    interviewDuration: '20 Minutes',
    interviewerPersonality: 'Professional',
    additionalContext: '',
  });

  const updateSetup = (key, value) => setSetup((current) => ({ ...current, [key]: value }));

  const startInterview = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/pitch/start', {
        scenarioType: scenario.id,
        selectedScenario: scenario.id,
        ...setup,
      });
      setPitchId(response.data.pitchId);
    } catch (error) {
      console.error(error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (result) => { setScores(result.scores); setFeedback(result.feedback); };

  if (!pitchId && !scores) {
    return (
      <main className="practice-page">
        <div className="container practice-container">
          <header className="practice-header"><button onClick={() => navigate('/dashboard')} className="back-button"><Icon name="arrowLeft" size={18}/> Dashboard</button><div className="practice-title"><div><span className="session-status"><i/> Practice setup</span><h1>{scenario.title}</h1><p>{scenario.description}</p></div><div className="session-partner"><span className="avatar avatar--ai">P</span><div><small>{category?.title}</small><strong>{scenario.aiPersonality}</strong></div></div></div></header>

          <div className="setup-layout">
            <section className="setup-panel">
              <div className="setup-panel__header"><span className="eyebrow">Practice setup</span><h2>Tailor the session before you begin.</h2><p>Your AI interviewer adapts to the role, experience level, company type, difficulty, and context you choose.</p></div>
              <form onSubmit={startInterview} className="setup-form">
                <div className="setup-grid">
                  <SetupField label="Role Applying For"><select value={setup.roleApplyingFor} onChange={(e) => updateSetup('roleApplyingFor', e.target.value)}>{roleOptions.map((option) => <option key={option}>{option}</option>)}</select></SetupField>
                  <SetupField label="Experience Level"><select value={setup.experienceLevel} onChange={(e) => updateSetup('experienceLevel', e.target.value)}>{experienceOptions.map((option) => <option key={option}>{option}</option>)}</select></SetupField>
                  <SetupField label="Company Type"><select value={setup.companyType} onChange={(e) => updateSetup('companyType', e.target.value)}>{companyOptions.map((option) => <option key={option}>{option}</option>)}</select></SetupField>
                </div>

                <RadioGroup label="Difficulty" value={setup.difficulty} options={difficultyOptions} onChange={(value) => updateSetup('difficulty', value)}/>
                <RadioGroup label="Interview Duration" value={setup.interviewDuration} options={durationOptions} onChange={(value) => updateSetup('interviewDuration', value)}/>
                <RadioGroup label="Interviewer Personality" value={setup.interviewerPersonality} options={personalityOptions} onChange={(value) => updateSetup('interviewerPersonality', value)}/>

                <SetupField label="Additional Context (optional)"><textarea rows="4" value={setup.additionalContext} onChange={(e) => updateSetup('additionalContext', e.target.value)} placeholder="I am preparing for an SDE-1 interview focusing on React and Node.js."/></SetupField>

                <div className="setup-actions"><button type="button" className="button button--secondary" onClick={() => navigate('/dashboard')}>Cancel</button><button type="submit" disabled={loading} className="button button--primary">{loading ? <><span className="spinner"/> Starting</> : <>Start Interview <Icon name="arrowRight" size={17}/></>}</button></div>
              </form>
            </section>

            <aside className="setup-summary">
              <span className="scenario-icon"><Icon name={scenario.icon} size={22}/></span>
              <span className="eyebrow">{category?.title}</span>
              <h3>{scenario.title}</h3>
              <p>{scenario.aiPersonality}</p>
              <div className="setup-summary__meta"><span><Icon name="clock" size={14}/>{scenario.estimatedDuration}</span><span>{scenario.difficulty}</span></div>
              <div className="setup-summary__skills">{scenario.recommendedSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="practice-page">
      <div className="container practice-container">
        <header className="practice-header"><button onClick={() => navigate('/dashboard')} className="back-button"><Icon name="arrowLeft" size={18}/> Dashboard</button><div className="practice-title"><div><span className="session-status"><i/> Practice session</span><h1>{scenario.title}</h1><p>{scenario.description}</p></div>{!scores && <div className="session-partner"><span className="avatar avatar--ai">P</span><div><small>Your conversation partner</small><strong>{setup.interviewerPersonality} {scenario.aiPersonality}</strong></div></div>}</div></header>

        {!scores ? <div className="practice-grid"><section className="chat-card">{pitchId && <ChatWindow pitchId={pitchId} scenarioType={scenario.id} partner={scenario.aiPersonality} onComplete={handleComplete}/>}</section><aside className="session-sidebar"><div className="session-info-card"><span className="eyebrow">Scenario</span><h3>{scenario.title}</h3><p>{scenario.description}</p></div><div className="session-info-card"><span className="eyebrow">Session details</span><ul className="goals-list"><li><span>01</span><p><strong>{setup.roleApplyingFor}</strong>{setup.experienceLevel} at a {setup.companyType}</p></li><li><span>02</span><p><strong>{setup.difficulty}</strong>{setup.interviewDuration} with a {setup.interviewerPersonality.toLowerCase()} tone</p></li><li><span>03</span><p><strong>Focus</strong>{scenario.recommendedSkills.slice(0, 3).join(', ')}</p></li></ul></div><div className="evaluation-note"><Icon name="shield" size={18}/><p>Your session is evaluated on <strong>delivery, confidence, logic, and persuasion.</strong></p></div></aside></div> : <div className="score-page-wrap"><ScoreCard scores={scores} feedback={feedback}/><div className="score-actions"><button onClick={() => navigate('/dashboard')} className="button button--secondary"><Icon name="arrowLeft" size={17}/> Back to dashboard</button><button onClick={() => window.location.reload()} className="button button--primary">Practice again <Icon name="arrowRight" size={17}/></button></div></div>}
      </div>
    </main>
  );
}
