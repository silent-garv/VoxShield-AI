// Rule-based scam keyword analyzer
const scamKeywords = require('../utils/scamKeywords');

const HIGH_RISK_THRESHOLD = 70;

exports.HIGH_RISK_THRESHOLD = HIGH_RISK_THRESHOLD;

exports.analyze = (transcript) => {
  let riskScore = 0;
  let reason = '';
  const lower = transcript.toLowerCase();
  const found = scamKeywords.filter(word => lower.includes(word));
  if (found.length > 0) {
    riskScore = Math.min(100, found.length * 20); // Each keyword +20 risk
    reason = `Keywords detected: ${found.join(', ')}`;
  }
  const category = riskScore >= HIGH_RISK_THRESHOLD ? 'scam' : 'safe';
  return { riskScore, category, reason };
};
