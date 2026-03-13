import { GEMINI_API_URL } from '../config/geminiConfig';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ScamAnalysis {
	riskScore: number;
	severity: 'Safe' | 'Suspicious' | 'High Risk';
	explanation: string;
	detectedScamType: 'OTP scam' | 'Bank scam' | 'Fraud' | 'Safe';
	recommendedAction: string;
}

export async function analyzeScamWithGemini(transcript: string): Promise<ScamAnalysis | null> {
	const prompt = `Analyze the following phone call transcript for scam risk.\n\nReturn response in JSON format:\n{\n\"riskScore\": number (0-100),\n\"severity\": \"Safe\" | \"Suspicious\" | \"High Risk\",\n\"explanation\": \"plain language explanation\",\n\"detectedScamType\": \"OTP scam | Bank scam | Fraud | Safe\",\n\"recommendedAction\": \"what user should do\"\n}\n\nTranscript:\n\"${transcript}\"`;
	try {
		const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{
					role: 'user',
					parts: [{ text: prompt }],
				}],
			}),
		});
		const data = await res.json();
		// Gemini returns text, parse JSON from text
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
		const parsed = JSON.parse(text);
		return parsed as ScamAnalysis;
	} catch (error) {
		console.error('Gemini API error:', error);
		return null;
	}
}

export async function generateSecurityTip(): Promise<string | null> {
	const prompt = 'Generate a short cybersecurity tip for students to prevent scam calls.';
	try {
		const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{
					role: 'user',
					parts: [{ text: prompt }],
				}],
			}),
		});
		const data = await res.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
		return text.trim();
	} catch (error) {
		console.error('Gemini API error:', error);
		return null;
	}
}

export async function sendChatMessage(userMessage: string): Promise<string> {
	try {
		const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
		const res = await fetch(`${backendUrl}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: userMessage,
			}),
		});

		if (!res.ok) {
			throw new Error(`API error: ${res.statusText}`);
		}

		const data = await res.json();
		return data.message || 'No response from server';
	} catch (error) {
		console.error('Chat error:', error);
		throw error;
	}
}