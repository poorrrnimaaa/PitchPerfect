import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Master Your Pitch</h1>
          <p className="text-xl text-blue-100 mb-8">
            Practice pitching with AI. Get instant feedback on your delivery, confidence, and persuasion.
          </p>
          {!token && (
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Get Started Free
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why PitchPerfect?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-xl mb-2">AI Opponent</h3>
            <p className="text-gray-600">Practice against a realistic AI that challenges your pitch with real objections.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2">Instant Feedback</h3>
            <p className="text-gray-600">Get scored on delivery, confidence, logic, and persuasiveness in real-time.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-xl mb-2">Multiple Scenarios</h3>
            <p className="text-gray-600">Practice startup pitches, product demos, and investor presentations.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!token && (
        <div className="bg-blue-50 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Perfect Your Pitch?</h2>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}