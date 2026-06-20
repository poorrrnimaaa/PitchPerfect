const Pitch = require('../models/Pitch');
const { GoogleGenerativeAI } = require('@google/generativeai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

function getScenarioPrompt(scenarioType) {
  const prompts = {
    startup: `You are a tough investor listening to a startup pitch. 
    Ask challenging questions about the business model, market size, and competition.
    Be realistic but fair. Ask follow-up questions.
    Keep responses concise (1-2 sentences).
    Stay in character as an investor.`,
    
    'product-demo': `You are a potential customer considering this product.
    Ask about features, pricing, and if it's better than alternatives.
    Be realistic and somewhat skeptical.
    Keep responses concise (1-2 sentences).
    Stay in character as a customer.`,
    
    'fundraising': `You are a venture capitalist reviewing an investment.
    Ask about unit economics, team experience, and competitive advantages.
    Be professional but tough.
    Keep responses concise (1-2 sentences).
    Stay in character as a VC.`,
  };
  
  return prompts[scenarioType] || prompts.startup;
}

exports.startPitch = async (req, res) => {
  try {
    const { scenarioType } = req.body;

    if (!['startup', 'product-demo', 'fundraising'].includes(scenarioType)) {
      return res.status(400).json({ error: 'Invalid scenario type' });
    }

    const pitch = new Pitch({
      userId: req.user.userId,
      scenarioType,
      messages: [],
      status: 'ongoing',
    });

    await pitch.save();

    try {
      const prompt = `You are starting a ${scenarioType.replace('-', ' ')} pitch session.
      ${getScenarioPrompt(scenarioType)}
      
      Give a brief opening (2-3 sentences).`;

      const result = await model.generateContent(prompt);
      const aiMessage = result.response.text();

      pitch.messages.push({
        sender: 'ai',
        text: aiMessage,
      });

      await pitch.save();

      res.status(201).json({
        pitchId: pitch._id,
        message: aiMessage,
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(500).json({ error: 'Error generating AI response' });
    }
  } catch (error) {
    console.error('Start pitch error:', error);
    res.status(500).json({ error: 'Error starting pitch session' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { pitchId, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    if (pitch.status !== 'ongoing') {
      return res.status(400).json({ error: 'Pitch session is completed' });
    }

    pitch.messages.push({
      sender: 'user',
      text: message.trim(),
    });

    const conversationText = pitch.messages
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n\n');

    try {
      const prompt = `${getScenarioPrompt(pitch.scenarioType)}
      
      Conversation so far:
      ${conversationText}
      
      Continue as the character. Ask a follow-up question (1-2 sentences).`;

      const result = await model.generateContent(prompt);
      const aiMessage = result.response.text();

      pitch.messages.push({
        sender: 'ai',
        text: aiMessage,
      });

      await pitch.save();

      res.json({
        message: aiMessage,
        messageCount: pitch.messages.length,
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(500).json({ error: 'Error generating AI response' });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

exports.getPitch = async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }
    res.json(pitch);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pitch' });
  }
};

exports.completePitch = async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    if (pitch.status === 'completed') {
      return res.status(400).json({ error: 'Pitch already completed' });
    }

    const transcript = pitch.messages
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n\n');

    try {
      const scoringPrompt = `Analyze this pitch practice session and score the user on 0-100 scale.

Transcript:
${transcript}

Respond ONLY with valid JSON (no markdown):
{
  "delivery": <number>,
  "confidence": <number>,
  "logic": <number>,
  "persuasion": <number>,
  "overall": <number>,
  "feedback": "<text>"
}`;

      const result = await model.generateContent(scoringPrompt);
      let scoreText = result.response.text().trim();

      // Clean markdown if present
      if (scoreText.includes('```')) {
        scoreText = scoreText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      let scores;
      try {
        scores = JSON.parse(scoreText);
      } catch (e) {
        console.warn('Failed to parse scores, using defaults');
        scores = {
          delivery: 75,
          confidence: 75,
          logic: 75,
          persuasion: 75,
          overall: 75,
          feedback: 'Good practice session! Keep working on your pitch skills.'
        };
      }

      pitch.scores = {
        delivery: Math.min(100, Math.max(0, parseInt(scores.delivery) || 75)),
        confidence: Math.min(100, Math.max(0, parseInt(scores.confidence) || 75)),
        logic: Math.min(100, Math.max(0, parseInt(scores.logic) || 75)),
        persuasion: Math.min(100, Math.max(0, parseInt(scores.persuasion) || 75)),
        overall: Math.min(100, Math.max(0, parseInt(scores.overall) || 75)),
      };
      pitch.feedback = scores.feedback || 'Great practice session!';
      pitch.status = 'completed';
      pitch.completedAt = new Date();

      await pitch.save();

      res.json({
        scores: pitch.scores,
        feedback: pitch.feedback,
      });
    } catch (geminiError) {
      console.error('Gemini scoring error:', geminiError);
      
      // Return fallback scores
      const fallbackScores = {
        delivery: 75,
        confidence: 75,
        logic: 75,
        persuasion: 75,
        overall: 75,
      };
      pitch.scores = fallbackScores;
      pitch.feedback = 'Session completed! Keep practicing to improve.';
      pitch.status = 'completed';
      pitch.completedAt = new Date();
      await pitch.save();

      res.json({
        scores: pitch.scores,
        feedback: pitch.feedback,
      });
    }
  } catch (error) {
    console.error('Complete pitch error:', error);
    res.status(500).json({ error: 'Error completing pitch' });
  }
};

exports.getUserPitches = async (req, res) => {
  try {
    const pitches = await Pitch.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(pitches);
  } catch (error) {
    console.error('Get pitches error:', error);
    res.status(500).json({ error: 'Error fetching pitches' });
  }
};