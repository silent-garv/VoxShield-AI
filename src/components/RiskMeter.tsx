import React from 'react';

interface RiskMeterProps {
	riskScore: number;
	severity: 'Safe' | 'Suspicious' | 'High Risk';
}


const getColor = (severity: string) => {
	switch (severity) {
		case 'Safe': return 'var(--accent-blue)';
		case 'Suspicious': return 'var(--accent-yellow)';
		case 'High Risk': return 'var(--accent-red)';
		default: return 'var(--accent-blue)';
	}
};


const badgeStyle = (severity: string) => ({
	display: 'inline-block',
	padding: '0.25em 1em',
	borderRadius: '1em',
	fontWeight: 700,
	fontSize: '0.95em',
	background: getColor(severity),
	color: severity === 'Suspicious' ? '#23243a' : '#fff',
	marginLeft: '0.7em',
	boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)'
});

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore, severity }) => {
	return (
		<div style={{ margin: '1.5rem 0', textAlign: 'center', background: 'var(--surface-card)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', padding: '1.2em 0.5em' }}>
			<div style={{ fontSize: '1.15rem', color: '#b0b3c7', fontWeight: 600, marginBottom: 6 }}>
				Risk Score
				<span style={badgeStyle(severity)}>{riskScore}/100</span>
			</div>
			<div style={{ fontSize: '1.05rem', color: getColor(severity), fontWeight: 700, marginBottom: 8 }}>{severity}</div>
			<div style={{ width: '90%', height: '14px', background: '#23243a', borderRadius: '7px', margin: '0.5rem auto 0 auto', boxShadow: '0 1px 6px 0 #0002' }}>
				<div style={{ width: `${riskScore}%`, height: '100%', background: getColor(severity), borderRadius: '7px', transition: 'width 0.3s' }}></div>
			</div>
		</div>
	);
};

export default RiskMeter;