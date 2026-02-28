import React from 'react';

const Alert: React.FC = () => (
	<div style={{ background: '#EF4444', color: '#fff', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
		<h2>High Risk Warning</h2>
		<p>This call has been detected as high risk. Please follow the recommended action and stay safe.</p>
		<div style={{ marginTop: '1rem', fontWeight: 'bold', color: '#2563EB' }}>Gemini explanation will appear here.</div>
	</div>
);

export default Alert;