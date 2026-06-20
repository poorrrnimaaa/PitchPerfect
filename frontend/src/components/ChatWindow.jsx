import { useState, useEffect, useRef } from 'react';
import API from '../api/config';
import Icon from './Icon';

export default function ChatWindow({ pitchId, scenarioType, partner, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitchActive, setPitchActive] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadPitch = async () => { try { const response = await API.get(`/pitch/${pitchId}`); setMessages(response.data.messages); } catch (error) { console.error('Error loading pitch:', error); } };
    loadPitch();
  }, [pitchId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault(); if (!input.trim()) return;
    const userMessage = input; setInput(''); setLoading(true);
    try { setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]); const response = await API.post(`/pitch/${pitchId}/message`, { message: userMessage }); setMessages((prev) => [...prev, { sender: 'ai', text: response.data.message }]); }
    catch (error) { console.error('Error sending message:', error); setInput(userMessage); }
    finally { setLoading(false); }
  };

  const completePitch = async () => {
    setLoading(true);
    try { const response = await API.post(`/pitch/${pitchId}/complete`); setPitchActive(false); onComplete(response.data); }
    catch (error) { console.error('Error completing pitch:', error); }
    finally { setLoading(false); }
  };

  return <div className="chat-window">
    <div className="chat-toolbar"><div><span className="avatar avatar--ai">P</span><div><strong>{partner}</strong><small><i/> Ready to talk</small></div></div><span className="chat-topic">{scenarioType.replace('-', ' ')}</span></div>
    <div className="messages" aria-live="polite">
      {messages.length === 0 ? <div className="chat-empty"><span><Icon name="message" size={25}/></span><h2>Start the conversation</h2><p>Open with the pitch or idea you want to practice. Your AI partner will respond in character.</p><div className="prompt-starter">“Thanks for meeting with me. I’d like to tell you about…”</div></div> : messages.map((msg, idx) => <div key={idx} className={`message-row ${msg.sender === 'user' ? 'message-row--user' : ''}`}><span className={`avatar ${msg.sender === 'ai' ? 'avatar--ai' : ''}`}>{msg.sender === 'user' ? 'You' : 'P'}</span><div><small>{msg.sender === 'user' ? 'You' : partner}</small><div className="message-bubble">{msg.text}</div></div></div>)}
      {loading && <div className="message-row"><span className="avatar avatar--ai">P</span><div><small>{partner}</small><div className="typing-indicator" aria-label="AI is responding"><i/><i/><i/></div></div></div>}
      <div ref={messagesEndRef}/>
    </div>
    {pitchActive && <div className="chat-controls">{messages.length > 2 && <button className="finish-session" onClick={completePitch} disabled={loading}><Icon name="check" size={16}/> Finish & get feedback</button>}<form onSubmit={sendMessage} className="chat-composer"><textarea rows="1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); }} disabled={loading} placeholder="Write your response…" aria-label="Your response"/><button type="submit" disabled={loading || !input.trim()} aria-label="Send response"><Icon name="send" size={18}/></button></form><p>Press Enter to send · Shift + Enter for a new line</p></div>}
  </div>;
}
