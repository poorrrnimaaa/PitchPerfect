import { useState, useEffect, useRef } from 'react';
import API from '../api/config';

export default function ChatWindow({ pitchId, scenarioType, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitchActive, setPitchActive] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadPitch = async () => {
      try {
        const response = await API.get(`/pitch/${pitchId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error loading pitch:', error);
      }
    };
    loadPitch();
  }, [pitchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    try {
      setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);

      const response = await API.post(`/pitch/${pitchId}/message`, {
        message: userMessage,
      });

      setMessages(prev => [...prev, { sender: 'ai', text: response.data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const completePitch = async () => {
    setLoading(true);
    try {
      const response = await API.post(`/pitch/${pitchId}/complete`);
      setPitchActive(false);
      onComplete(response.data);
    } catch (error) {
      console.error('Error completing pitch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Start your {scenarioType.replace('-', ' ')} pitch practice...
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {pitchActive && (
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Your response..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      )}

      {pitchActive && messages.length > 2 && (
        <div className="p-4 bg-white border-t border-gray-200 text-center">
          <button
            onClick={completePitch}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Completing...' : 'Complete & Get Scores'}
          </button>
        </div>
      )}
    </div>
  );
}