import React from 'react';

interface ExplanationBoxProps {
	explanation: string;
	recommendedAction: string;
}

const ExplanationBox: React.FC<ExplanationBoxProps> = ({ explanation, recommendedAction }) => (
	<div style={{ background: '#1e293b', color: '#fff', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
		<div style={{ fontWeight: 'bold', color: '#2563EB', marginBottom: '0.5rem' }}>Gemini Explanation</div>
		<div style={{ marginBottom: '0.5rem' }}>{explanation}</div>
		<div style={{ color: '#10B981', fontWeight: 'bold' }}>Recommended Action: {recommendedAction}</div>
	</div>
);

export default ExplanationBox;