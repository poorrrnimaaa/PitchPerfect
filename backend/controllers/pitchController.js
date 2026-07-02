const Pitch = require('../models/Pitch');
const { GoogleGenAI } = require('@google/genai');
const { getScenarioById } = require('../../shared/scenarios.cjs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash';

async function generateAIText(prompt) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return response.text;
}

function normalizeSetup(body) {
  const scenarioType = body.scenarioType || body.selectedScenario;
  const scenario = getScenarioById(scenarioType);

  if (!scenario) {
    return null;
  }

  return {
    selectedScenario: scenario.id,
    scenarioType: scenario.id,
    roleApplyingFor: body.roleApplyingFor || scenario.defaultRole,
    experienceLevel: body.experienceLevel || 'Fresher',
    companyType: body.companyType || 'Startup',
    difficulty: body.difficulty || scenario.difficulty,
    interviewerPersonality: body.interviewerPersonality || scenario.aiPersonality,
    interviewDuration: body.interviewDuration || scenario.estimatedDuration,
    additionalContext: body.additionalContext || '',
    scenario,
  };
}

function buildSystemPrompt(pitch) {
  const scenario = getScenarioById(pitch.selectedScenario || pitch.scenarioType);
  const role = pitch.roleApplyingFor || scenario?.defaultRole || 'Candidate';
  const experience = pitch.experienceLevel || 'Fresher';
  const company = pitch.companyType || 'Startup';
  const difficulty = pitch.difficulty || scenario?.difficulty || 'Medium';
  const personality = pitch.interviewerPersonality || scenario?.aiPersonality || 'Professional Interviewer';
  const duration = pitch.interviewDuration || scenario?.estimatedDuration || '10-15 min';
  const context = pitch.additionalContext ? `Additional context from the user: ${pitch.additionalContext}` : 'No additional context was provided.';

  return `${scenario?.systemPrompt || 'You are a professional communication practice partner.'}

Act as: ${personality}.
Scenario: ${scenario?.title || pitch.scenarioType}.
Candidate or speaker role: ${role}.
Experience level: ${experience}.
Company or conversation type: ${company}.
Difficulty: ${difficulty}.
Target duration: ${duration}.
${context}

Adapt every question to these setup choices. Keep responses concise, realistic, and in character. Ask one focused follow-up at a time.`;
}

exports.startPitch = async (req, res) => {
  try {
    const setup = normalizeSetup(req.body);

    if (!setup) {
      return res.status(400).json({ error: 'Invalid scenario type' });
    }

    const pitch = new Pitch({
      userId: req.user.userId,
      scenarioType: setup.scenarioType,
      selectedScenario: setup.selectedScenario,
      roleApplyingFor: setup.roleApplyingFor,
      experienceLevel: setup.experienceLevel,
      companyType: setup.companyType,
      difficulty: setup.difficulty,
      interviewerPersonality: setup.interviewerPersonality,
      interviewDuration: setup.interviewDuration,
      additionalContext: setup.additionalContext,
      messages: [],
      status: 'ongoing',
    });

    await pitch.save();

    try {
      const prompt = `${buildSystemPrompt(pitch)}

Start the session with this scenario opening if it fits naturally:
"${setup.scenario.openingPrompt}"

Give a brief opening in 2-3 sentences, then ask the first question.`;

      const aiMessage = await generateAIText(prompt);

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
    const { pitchId } = req.params;
    const { message } = req.body;

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
      const prompt = `${buildSystemPrompt(pitch)}
      
      Conversation so far:
      ${conversationText}
      
      Continue as the character. Ask a follow-up question (1-2 sentences).`;

      const aiMessage = await generateAIText(prompt);

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
      const scoringPrompt = `${buildSystemPrompt(pitch)}

Analyze this practice session and score the user on 0-100 scale.

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

      let scoreText = (await generateAIText(scoringPrompt)).trim();

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
