import { db } from '../firebase/config';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
// import type { ScamAnalysis } from './geminiService';

export interface DetectionRecord {
	transcript?: string;
	riskScore: number;
	severity: string;
	explanation: string;
	detectedScamType: string;
	recommendedAction: string;
	timestamp: Date;
}

export async function saveDetection(record: DetectionRecord, privacyMode: boolean) {
	const data = {
		riskScore: record.riskScore,
		severity: record.severity,
		explanation: record.explanation,
		detectedScamType: record.detectedScamType,
		recommendedAction: record.recommendedAction,
		timestamp: Timestamp.fromDate(record.timestamp),
	};
	if (!privacyMode && record.transcript) {
		// Store transcript if privacy mode is OFF
		(data as any).transcript = record.transcript;
	}
	await addDoc(collection(db, 'detections'), data);
}

export async function fetchDetections(): Promise<DetectionRecord[]> {
	const snapshot = await getDocs(collection(db, 'detections'));
	return snapshot.docs.map(doc => {
		const d = doc.data();
		return {
			transcript: d.transcript,
			riskScore: d.riskScore,
			severity: d.severity,
			explanation: d.explanation,
			detectedScamType: d.detectedScamType,
			recommendedAction: d.recommendedAction,
			timestamp: d.timestamp?.toDate?.() || new Date(),
		};
	});
}