import { SpeechService } from './speechService';
import type { SpeechResult } from './speechService';
import { analyzeScamWithGemini } from './geminiService';
import type { ScamAnalysis } from './geminiService';
import { saveDetection } from './firestoreService';

export interface DetectionPipelineOptions {
	privacyMode: boolean;
}

export class ScamDetectionService {
	private speechService: SpeechService;
	private transcript: string = '';
	// Removed unused analysis property
	private privacyMode: boolean = false;

	constructor(options: DetectionPipelineOptions) {
		this.speechService = new SpeechService();
		this.privacyMode = options.privacyMode;
	}

	startDetection(
		onAnalysis: (analysis: ScamAnalysis) => void,
		onTranscript: (transcript: string) => void,
		onStatusChange?: (status: string) => void
	) {
		this.transcript = '';
		this.speechService.start((result: SpeechResult) => {
			this.transcript += result.transcript;
			onTranscript(this.transcript);
			if (result.isFinal) {
				this.analyzeTranscript(onAnalysis);
			}
		}, onStatusChange);
	}

	stopDetection() {
		this.speechService.stop();
	}

	async analyzeTranscript(onAnalysis: (analysis: ScamAnalysis) => void) {
		if (!this.transcript) return;
		const analysis = await analyzeScamWithGemini(this.transcript);
		// this.analysis = analysis;
		onAnalysis(analysis!);
		// Save detection to Firestore
		await saveDetection({
			transcript: this.transcript,
			riskScore: analysis?.riskScore ?? 0,
			severity: analysis?.severity ?? 'Safe',
			explanation: analysis?.explanation ?? '',
			detectedScamType: analysis?.detectedScamType ?? 'Safe',
			recommendedAction: analysis?.recommendedAction ?? '',
			timestamp: new Date(),
		}, this.privacyMode);
	}
}