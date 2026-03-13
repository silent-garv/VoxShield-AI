// Handles /api/detect and /api/history endpoints (CommonJS)
const express = require('express');
const router = express.Router();
const detectController = require('../controllers/detectController.cjs');

// POST /api/detect
router.post('/detect', detectController.analyzeTranscript);

// GET /api/history
router.get('/history', detectController.getHistory);

// POST /api/chat - for chatbot messages
router.post('/chat', detectController.sendChatMessage);

module.exports = router;
