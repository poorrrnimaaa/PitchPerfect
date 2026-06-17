const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scenarioType: {
    type: String,
    enum: ['startup', 'product-demo', 'fundraising'],
    required: true,
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  scores: {
    delivery: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    logic: { type: Number, default: 0 },
    persuasion: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  feedback: String,
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

module.exports = mongoose.model('Pitch', pitchSchema);