export default function ScoreCard({ scores, feedback }) {
  const categories = [
    { label: 'Delivery', score: scores.delivery, color: 'bg-blue-500' },
    { label: 'Confidence', score: scores.confidence, color: 'bg-green-500' },
    { label: 'Logic', score: scores.logic, color: 'bg-purple-500' },
    { label: 'Persuasion', score: scores.persuasion, color: 'bg-orange-500' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🎯 Your Pitch Score</h2>

      <div className="text-center mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="text-6xl font-bold text-blue-600">{scores.overall}</div>
        <div className="text-xl text-gray-600">/100</div>
      </div>

      <div className="space-y-4 mb-6">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-700">{cat.label}</span>
              <span className="text-gray-600">{cat.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${cat.color} h-3 rounded-full transition-all`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-900 mb-2">Feedback</h3>
        <p className="text-yellow-800">{feedback}</p>
      </div>
    </div>
  );
}