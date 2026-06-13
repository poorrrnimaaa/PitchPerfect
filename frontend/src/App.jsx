import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">PitchPerfect</h1>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-4">Welcome to Pitch Perfect</h2>
      <p className="text-lg text-gray-600 mb-6">
        Practice negotiations with AI. Coming soon!
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Get Started
      </button>
    </div>
  );
}