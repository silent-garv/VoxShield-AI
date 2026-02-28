export type SpeechStatus = 'idle' | 'listening' | 'stopped' | 'error';

export interface SpeechResult {
	transcript: string;
	isFinal: boolean;
}

export class SpeechService {
	private recognition: any = null;
	private status: SpeechStatus = 'idle';
	private onResult?: (result: SpeechResult) => void;
	private onStatusChange?: (status: SpeechStatus) => void;

	   constructor() {
		   // @ts-ignore
		   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		   if (SpeechRecognition) {
			   this.recognition = new SpeechRecognition();
			   this.recognition.continuous = true;
			   this.recognition.interimResults = true;
			   this.recognition.lang = 'en-US';
			   this.recognition.onresult = (event: any) => {
				   let transcript = '';
				   let isFinal = false;
				   for (let i = event.resultIndex; i < event.results.length; ++i) {
					   transcript += event.results[i][0].transcript;
					   isFinal = event.results[i].isFinal;
				   }
				   this.onResult && this.onResult({ transcript, isFinal });
			   };
			   this.recognition.onstart = () => {
				   this.setStatus('listening');
			   };
			   this.recognition.onend = () => {
				   this.setStatus('stopped');
			   };
			   this.recognition.onerror = () => {
				   this.setStatus('error');
			   };
		   }
	   }

	setStatus(status: SpeechStatus) {
		this.status = status;
		this.onStatusChange && this.onStatusChange(status);
	}

	start(onResult: (result: SpeechResult) => void, onStatusChange?: (status: SpeechStatus) => void) {
		this.onResult = onResult;
		this.onStatusChange = onStatusChange;
		if (this.recognition) {
			this.recognition.start();
		} else {
			this.setStatus('error');
		}
	}

	stop() {
		if (this.recognition) {
			this.recognition.stop();
		}
		this.setStatus('stopped');
	}

	getStatus() {
		return this.status;
	}
}