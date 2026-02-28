import React from 'react';
import { useDetectionContext } from '../context/DetectionContext';

const Consent: React.FC = () => {
	 const { setConsented } = useDetectionContext();
	return (
		<div style={{ background: '#1e293b', color: '#fff', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
			<h2>Consent Required</h2>
			<p>To use VoxShield AI, you must approve microphone access and AI analysis. Your privacy is protected and you can toggle Privacy Mode at any time.</p>
			<button
				style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', padding: '1rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}
				onClick={() => setConsented(true)}
			>
				Approve & Start Protection
			</button>
		</div>
	);
};

export default Consent;