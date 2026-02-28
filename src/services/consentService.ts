const CONSENT_KEY = 'voxshield_consent';

export function getConsentStatus(): boolean {
	return localStorage.getItem(CONSENT_KEY) === 'true';
}

export function setConsentStatus(consented: boolean) {
	localStorage.setItem(CONSENT_KEY, consented ? 'true' : 'false');
}

export function clearConsentStatus() {
	localStorage.removeItem(CONSENT_KEY);
}