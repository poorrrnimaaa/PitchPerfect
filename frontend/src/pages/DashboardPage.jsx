import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import API from '../api/config';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/auth/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
      <p className="text-gray-600 text-lg mb-8">Email: {user?.email}</p>

      <h2 className="text-2xl font-bold mb-6">Choose a Pitch Scenario</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer hover:translate-y-[-4px]">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="font-bold text-xl mb-2">Startup Pitch</h3>
          <p className="text-gray-600 mb-4">Practice your startup elevator pitch to investors.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Start Practice</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer hover:translate-y-[-4px]">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="font-bold text-xl mb-2">Product Demo</h3>
          <p className="text-gray-600 mb-4">Present your product features to potential customers.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Start Practice</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer hover:translate-y-[-4px]">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="font-bold text-xl mb-2">Fundraising Pitch</h3>
          <p className="text-gray-600 mb-4">Practice closing investment rounds with confidence.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Start Practice</button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-6">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">0</div>
            <p className="text-gray-600 mt-2">Pitches Practiced</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-green-600">0</div>
            <p className="text-gray-600 mt-2">Average Score</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-purple-600">0</div>
            <p className="text-gray-600 mt-2">Best Score</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-orange-600">0</div>
            <p className="text-gray-600 mt-2">Streak Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}