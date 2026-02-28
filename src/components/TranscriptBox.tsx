import React from 'react';

interface TranscriptBoxProps {
	transcript: string;
}

const TranscriptBox: React.FC<TranscriptBoxProps> = ({ transcript }) => (
	<div style={{ background: '#0F172A', color: '#fff', borderRadius: '8px', padding: '1rem', margin: '1rem 0', minHeight: '60px', fontFamily: 'monospace' }}>
		<div style={{ fontWeight: 'bold', color: '#2563EB', marginBottom: '0.5rem' }}>Live Transcript</div>
		<div>{transcript || <span style={{ color: '#64748b' }}>Waiting for speech...</span>}</div>
	</div>
);

export default TranscriptBox;