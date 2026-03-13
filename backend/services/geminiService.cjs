// Service to call Google Gemini API for scam analysis (CommonJS)
const axios = require('axios');

exports.analyzeTranscript = async (transcript) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  
  const prompt = `Analyze the following conversation text and determine if it is a scam call. Return response as JSON with these fields:
{
  "riskScore": number (0-100),
  "severity": "Safe" | "Suspicious" | "High Risk",
  "explanation": "plain language explanation",
  "detectedScamType": "OTP scam" | "Bank scam" | "Fraud" | "Safe",
  "recommendedAction": "what user should do"
}

Transcript: "${transcript}"`;

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await axios.post(`${endpoint}?key=${apiKey}`, body);
    const text = response.data.candidates[0].content.parts[0].text;
    
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const riskScore = parseInt(text.match(/risk score.*?(\d+)/i)?.[1] || '0', 10);
      const category = /scam/i.test(text) ? 'scam' : 'safe';
      result = { riskScore, category, explanation: text, severity: riskScore > 70 ? 'High Risk' : riskScore > 40 ? 'Suspicious' : 'Safe' };
    }
    return result;
  } catch (err) {
    console.error('Gemini API error:', err.response?.status, err.response?.data?.error?.message || err.message);
    return { riskScore: 50, severity: 'Suspicious', explanation: 'AI analysis temporarily unavailable', detectedScamType: 'Unknown', recommendedAction: 'Please try again later' };
  }
};

exports.sendChatMessage = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return { success: false, message: 'API configuration error' };
  }

  const systemPrompt = `You are an expert security and scam prevention assistant for VoxShield AI. Your role is to:
1. Educate users about online safety and common scams
2. Explain fraud prevention techniques in simple, understandable language
3. Provide practical tips to stay safe online
4. Be empathetic if users have fallen victim to scams
5. Give actionable advice they can implement immediately

Keep your responses:
- Clear and concise (2-3 paragraphs max)
- Free of technical jargon
- Focused on practical prevention strategies
- Encouraging and supportive

User question: "${userMessage}"`;

  const body = {
    contents: [{
      parts: [{ text: systemPrompt }]
    }]
  };

  try {
    console.log('📤 Sending to Gemini API:', endpoint);
    const response = await axios.post(`${endpoint}?key=${apiKey}`, body);
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Invalid response from Gemini:', response.data);
      return { success: false, message: 'Invalid response from AI' };
    }
    
    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Got response from Gemini');
    return { success: true, message: text.trim() };
  } catch (err) {
    console.error('❌ Gemini API error:', {
      status: err.response?.status,
      message: err.response?.data?.error?.message || err.message
    });
    
    // Fallback response if API fails
    const fallbackAnswers = {
      scam: "A scam is a fraudulent scheme designed to deceive people into giving money or personal information. Common types include phishing, OTP scams, tech support scams, and job/investment fraud. Never share passwords, OTPs, or banking details with unknown callers or unverified sources.",
      phishing: "Phishing is when scammers send fake emails, text messages, or create fraudulent websites to steal your credentials and personal information. Always verify the sender's email address, check links before clicking them, enable two-factor authentication, and never enter sensitive information without independently confirming the request.",
      fraud: "Fraud involves deliberately deceiving someone to gain an unfair advantage, typically financial. Protect yourself by verifying identities before sharing information, never paying upfront for unsolicited offers, checking official websites directly (not through links), and monitoring your bank statements regularly for unauthorized activity.",
      password: "Create strong passwords with 12+ characters mixing uppercase, lowercase, numbers, and symbols. Use different passwords for each account and enable two-factor authentication (2FA) whenever available. Never share passwords via email or calls, and use a password manager to keep them secure.",
      auth: "Two-Factor Authentication (2FA) adds an extra security layer by requiring something you know (password) plus something you have (phone/app). Even if someone gets your password, they can't access your account without the second factor. Enable 2FA on all important accounts - email, banking, social media.",
      default: "I'm VoxShield AI's security expert! I can help you learn about phishing scams, OTP fraud, password security, two-factor authentication, protecting your personal information, spotting fake websites, and more. What security topic would you like to know about?"
    };
    
    let response = fallbackAnswers.default;
    const question = userMessage.toLowerCase();
    if (question.includes('scam')) response = fallbackAnswers.scam;
    else if (question.includes('phishing') || question.includes('email')) response = fallbackAnswers.phishing;
    else if (question.includes('fraud') || question.includes('fake')) response = fallbackAnswers.fraud;
    else if (question.includes('password')) response = fallbackAnswers.password;
    else if (question.includes('2fa') || question.includes('factor') || question.includes('authentication')) response = fallbackAnswers.auth;
    
    return { success: true, message: response };
  }
};
