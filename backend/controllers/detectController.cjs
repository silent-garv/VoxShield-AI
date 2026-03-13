// Controller for detection and history endpoints (CommonJS)
const geminiService = require('../services/geminiService.cjs');
const riskAnalyzer = require('../services/riskAnalyzer.cjs');
const Detection = require('../models/detectionModel.cjs');

// Analyze transcript for scam risk
exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript required' });

    // Rule-based risk analysis
    const ruleResult = riskAnalyzer.analyze(transcript);
    let aiResult = null;
    let finalResult = { ...ruleResult };

    // If rule-based risk is not high, use Gemini AI
    if (ruleResult.riskScore < riskAnalyzer.HIGH_RISK_THRESHOLD) {
      aiResult = await geminiService.analyzeTranscript(transcript);
      finalResult = aiResult;
    }

    // Save to Firestore
    await Detection.saveDetection({
      transcript,
      ...finalResult,
      timestamp: Date.now()
    });

    res.json(finalResult);
  } catch (err) {
    console.error('Detection error:', err);
    res.status(500).json({ error: 'Detection failed' });
  }
};

// Fetch detection history
exports.getHistory = async (req, res) => {
  try {
    const history = await Detection.getHistory();
    res.json(history);
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Handle chat messages for learning/education
exports.sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const result = await geminiService.sendChatMessage(message);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, message: 'Chat failed' });
  }
};
