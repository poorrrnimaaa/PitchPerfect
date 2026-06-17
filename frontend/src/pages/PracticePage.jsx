import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ScoreCard from '../components/ScoreCard';
import API from '../api/config';

export default function PracticePage() {
  const { scenarioType } = useParams();
  const navigate = useNavigate();
  const [pitchId, setPitchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const startPitch = async () => {
      try {
        const response = await API.post('/pitch/start', { scenarioType });
        setPitchId(response.data.pitchId);
      } catch (error) {
        console.error('Error starting pitch:', error);
        alert('Error starting pitch session');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    startPitch();
  }, [scenarioType, navigate]);

  const handleComplete = (result) => {
    setScores(result.scores);
    setFeedback(result.feedback);
  };

  const getScenarioTitle = () => {
    const titles = {
      startup: '🚀 Startup Pitch',
      'product-demo': '💼 Product Demo',
      'fundraising': '💰 Fundraising Pitch',
    };
    return titles[scenarioType] || 'Pitch Practice';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting pitch session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{getScenarioTitle()}</h1>
        <p className="text-gray-600">Practice your pitch. Respond naturally to questions and feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {pitchId && !scores && (
            <ChatWindow
              pitchId={pitchId}
              scenarioType={scenarioType}
              onComplete={handleComplete}
            />
          )}
          {scores && (
            <div className="space-y-4">
              <ScoreCard scores={scores} feedback={feedback} />
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h3 className="font-bold text-lg mb-4">📝 Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✓ Speak clearly and confidently</li>
              <li>✓ Use specific examples</li>
              <li>✓ Address objections directly</li>
              <li>✓ Keep responses concise</li>
              <li>✓ Show enthusiasm</li>
              <li>✓ Have data to back claims</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}