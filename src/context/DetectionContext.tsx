import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { getConsentStatus, setConsentStatus } from '../services/consentService';

interface DetectionContextProps {
	privacyMode: boolean;
	setPrivacyMode: (mode: boolean) => void;
	consented: boolean;
	setConsented: (status: boolean) => void;
}

const DetectionContext = createContext<DetectionContextProps | undefined>(undefined);

export const DetectionProvider = ({ children }: { children: ReactNode }) => {
	const [privacyMode, setPrivacyMode] = useState(false);
	const [consented, setConsentedState] = useState(getConsentStatus());

	const setConsented = (status: boolean) => {
		setConsentedState(status);
		setConsentStatus(status);
	};

	return (
		<DetectionContext.Provider value={{ privacyMode, setPrivacyMode, consented, setConsented }}>
			{children}
		</DetectionContext.Provider>
	);
};

export const useDetectionContext = () => {
	const context = useContext(DetectionContext);
	if (!context) throw new Error('useDetectionContext must be used within DetectionProvider');
	return context;
};