// Controller for detection and history endpoints
const geminiService = require('../services/geminiService');
const riskAnalyzer = require('../services/riskAnalyzer');
const Detection = require('../models/detectionModel');
const { validateInput } = require('../middleware/security.cjs');

// Analyze transcript for scam risk
exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    
    // Input validation
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (transcript.length > 10000) {
      return res.status(400).json({ error: 'Transcript exceeds maximum length of 10000 characters' });
    }

    const sanitizedTranscript = validateInput(transcript, 10000);

    // Rule-based risk analysis
    const ruleResult = riskAnalyzer.analyze(sanitizedTranscript);
    let aiResult = null;
    let finalResult = { ...ruleResult };

    // If rule-based risk is not high, use Gemini AI
    if (ruleResult.riskScore < riskAnalyzer.HIGH_RISK_THRESHOLD) {
      aiResult = await geminiService.analyzeTranscript(sanitizedTranscript);
      finalResult = aiResult;
    }

    // Save to Firestore
    await Detection.saveDetection({
      transcript: sanitizedTranscript,
      ...finalResult,
      timestamp: Date.now(),
      ipAddress: req.ip,
    });

    res.json(finalResult);
  } catch (err) {
    console.error('Detection error:', err);
    res.status(500).json({ error: 'Detection analysis failed. Please try again later.' });
  }
};

// Fetch detection history
exports.getHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 500); // Max 500 records
    const history = await Detection.getHistory(limit);
    res.json(history);
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch detection history' });
  }
};

// Handle chat messages for learning/education
exports.sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Input validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 2000 characters' });
    }

    const sanitizedMessage = validateInput(message, 2000);

    const result = await geminiService.sendChatMessage(sanitizedMessage);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, message: 'Chat service temporarily unavailable' });
  }
};
