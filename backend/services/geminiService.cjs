// Service to call Google Gemini API for scam analysis (CommonJS)
const axios = require('axios');

exports.analyzeTranscript = async (transcript) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not configured');
    return { riskScore: 50, severity: 'Suspicious', explanation: 'AI service unavailable. Please check configuration.', detectedScamType: 'Unknown', recommendedAction: 'Please try again later' };
  }

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
    console.log('📤 Analyzing transcript with Gemini API...');
    const response = await axios.post(`${endpoint}?key=${apiKey}`, body, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Got response from Gemini');
    
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
    console.error('❌ Gemini API error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      message: err.response?.data?.error?.message || err.message,
      fullError: err.response?.data
    });
    return { riskScore: 50, severity: 'Suspicious', explanation: 'AI analysis temporarily unavailable', detectedScamType: 'Unknown', recommendedAction: 'Please try again later' };
  }
};

exports.sendChatMessage = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    return { success: false, message: 'API configuration error: Missing GEMINI_API_KEY' };
  }

  const prompt = `You are VoxShield AI - an expert security and scam prevention assistant. Help users learn about online safety.

Instructions:
- Answer questions about phishing, OTP scams, fraud, password security, and cybersecurity
- Format response as 4-6 concise key points using bullet points (•)
- Make each point short and easy to understand (1-2 sentences max)
- Use simple language, avoid technical jargon
- Be empathetic and supportive
- Focus on actionable tips users can implement immediately
- Use practical examples where relevant

User Question: "${userMessage}"

Provide response as key points (use • for bullets):`;

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    console.log('📤 Sending chat message to Gemini API...');
    console.log('📨 Message:', userMessage);
    
    const response = await axios.post(`${endpoint}?key=${apiKey}`, body, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Invalid response structure from Gemini:', JSON.stringify(response.data));
      return { success: false, message: 'Invalid response from AI service' };
    }
    
    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Got response from Gemini');
    console.log('📝 Response length:', text.length);
    
    return { success: true, message: text.trim() };
  } catch (err) {
    console.error('❌ Gemini API error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      message: err.response?.data?.error?.message || err.message,
      fullError: err.response?.data,
      code: err.code
    });
    
    // Fallback response if API fails
    const fallbackAnswers = {
      scam: "• A scam is a fraudulent scheme designed to deceive people into giving money or personal information\n• Common types: phishing, OTP scams, tech support scams, and job/investment fraud\n• Never share passwords, OTPs, or banking details with unknown callers\n• Always verify identities before sharing sensitive information\n• Don't trust unsolicited calls or emails asking for personal data\n• Report suspicious activity to the relevant authorities immediately",
      phishing: "• Phishing is when scammers send fake emails or texts to steal your credentials\n• Check the sender's email address carefully - scammers mimic legitimate companies\n• Hover over links before clicking to see the actual URL destination\n• Enable two-factor authentication on all important accounts\n• Never enter passwords or personal info without verifying the request\n• Use official websites directly, not through email links",
      fraud: "• Fraud involves deliberately deceiving someone for financial gain\n• Always verify identities before sharing personal or financial information\n• Never pay upfront for unsolicited job offers or investment opportunities\n• Check official websites directly (not through links in emails)\n• Monitor your bank statements regularly for unauthorized charges\n• Be skeptical of too-good-to-be-true offers",
      password: "• Create strong passwords: 12+ characters with uppercase, lowercase, numbers, and symbols\n• Use different passwords for each important account\n• Never share passwords via email, text, or phone calls\n• Use a password manager to securely store all your passwords\n• Change passwords immediately if you suspect unauthorized access\n• Enable two-factor authentication for extra security",
      auth: "• Two-Factor Authentication (2FA) requires something you know (password) + something you have (phone/app)\n• Even if someone cracks your password, they can't access your account without 2FA\n• Common 2FA methods: SMS codes, authentication apps, biometric verification\n• Enable 2FA on all important accounts - email, banking, social media\n• Use authenticator apps like Google Authenticator instead of SMS when possible\n• Save backup codes in a secure location",
      mobile: "• Mobile phishing often comes through SMS (smishing) or fake apps\n• Never click links in text messages from unknown senders\n• Download apps only from official app stores (Apple App Store, Google Play)\n• Verify sender identity before responding to suspicious messages\n• Enable 2FA on your phone account to prevent SIM swapping\n• Keep your phone's operating system and apps updated with latest security patches",
      default: "• I'm VoxShield AI's security expert and can help you stay safe online\n• I can answer questions about phishing, OTP fraud, password security, two-factor authentication\n• Ask me about spotting fake websites, protecting your personal information, or recognizing scams\n• I provide practical tips in key points that are easy to understand and remember\n• Always verify information from official sources when making important decisions\n• What security topic would you like to learn about?"
    };
    
    let response = fallbackAnswers.default;
    const question = userMessage.toLowerCase();
    if (question.includes('scam')) response = fallbackAnswers.scam;
    else if (question.includes('phishing') || question.includes('email')) response = fallbackAnswers.phishing;
    else if (question.includes('fraud') || question.includes('fake')) response = fallbackAnswers.fraud;
    else if (question.includes('password')) response = fallbackAnswers.password;
    else if (question.includes('2fa') || question.includes('factor') || question.includes('authentication')) response = fallbackAnswers.auth;
    else if (question.includes('mobile') || question.includes('sms') || question.includes('text')) response = fallbackAnswers.mobile;
    
    console.log('⚠️ Using fallback response');
    return { success: true, message: response };
  }
};
