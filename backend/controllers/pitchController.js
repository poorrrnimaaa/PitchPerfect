const Pitch = require('../models/Pitch');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function getScenarioPrompt(scenarioType) {
  const prompts = {
    startup: `You are a tough investor listening to a startup pitch.
Ask challenging questions about the business model, market size, and competition.
Be realistic but fair.
Keep responses concise (1-2 sentences).`,

    'product-demo': `You are a potential customer considering this product.
Ask about features, pricing, and alternatives.
Be realistic and somewhat skeptical.
Keep responses concise (1-2 sentences).`,

    fundraising: `You are a venture capitalist reviewing an investment.
Ask about unit economics, team experience, and competitive advantages.
Be professional but tough.
Keep responses concise (1-2 sentences).`,
  };

  return prompts[scenarioType] || prompts.startup;
}

// START PITCH
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

    const prompt = `
You are starting a ${scenarioType.replace('-', ' ')} pitch session.

${getScenarioPrompt(scenarioType)}

Give a brief opening message and ask the first question.
`;

    const aiMessage = "Welcome to PitchPerfect! Please introduce your startup/product in 60 seconds.";

    await pitch.save();

    res.status(201).json({
      pitchId: pitch._id,
      message: aiMessage,
    });
  } catch (error) {
    console.error('Start pitch error:', error);
    res.status(500).json({
      error: 'Error starting pitch session',
    });
  }
};

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const pitchId = req.params.pitchId;
    const { message } = req.body;

    const pitch = await Pitch.findById(pitchId);

    if (!pitch) {
      return res.status(404).json({
        error: 'Pitch not found',
      });
    }

    pitch.messages.push({
      sender: 'user',
      text: message,
    });

    const conversationText = pitch.messages
      .map(
        (msg) =>
          `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
      )
      .join('\n\n');

    const prompt = `
${getScenarioPrompt(pitch.scenarioType)}

Conversation:

${conversationText}

Continue the conversation naturally and ask a follow-up question.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const aiMessage = "Interesting. Can you explain your target customers and revenue model?";

    await pitch.save();

    res.json({
      message: aiMessage,
      messageCount: pitch.messages.length,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Error sending message',
    });
  }
};

// GET PITCH
exports.getPitch = async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.pitchId);

    if (!pitch) {
      return res.status(404).json({
        error: 'Pitch not found',
      });
    }

    res.json(pitch);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching pitch',
    });
  }
};

// COMPLETE PITCH
exports.completePitch = async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.pitchId);

    if (!pitch) {
      return res.status(404).json({
        error: 'Pitch not found',
      });
    }

    const transcript = pitch.messages
      .map(
        (msg) =>
          `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
      )
      .join('\n\n');

    const scoringPrompt = `
Analyze this pitch practice session.

Transcript:
${transcript}

Return ONLY valid JSON:

{
  "delivery": 85,
  "confidence": 80,
  "logic": 90,
  "persuasion": 82,
  "overall": 84,
  "feedback": "Short feedback"
}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: scoringPrompt,
    });

    let scoreText = result.text.trim();

    scoreText = scoreText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let scores;

    try {
      scores = JSON.parse(scoreText);
    } catch {
      scores = {
        delivery: 70,
        confidence: 70,
        logic: 75,
        persuasion: 75,
        overall: 72,
        feedback: 'Good effort! Keep practicing.',
      };
    }

    pitch.scores = {
      delivery: scores.delivery || 70,
      confidence: scores.confidence || 70,
      logic: scores.logic || 75,
      persuasion: scores.persuasion || 75,
      overall: scores.overall || 72,
    };

    pitch.feedback =
      scores.feedback || 'Good practice session!';

    pitch.status = 'completed';
    pitch.completedAt = new Date();

    await pitch.save();

    res.json({
      scores: pitch.scores,
      feedback: pitch.feedback,
    });
  } catch (error) {
    console.error('Complete pitch error:', error);

    res.status(500).json({
      error: 'Error completing pitch',
    });
  }
};

// USER PITCHES
exports.getUserPitches = async (req, res) => {
  try {
    const pitches = await Pitch.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(pitches);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error fetching pitches',
    });
  }
};