
import React from 'react';
import './History.css';

const dummyHistory = [
	{ name: 'Shalini', number: '+91 91234 23456', status: 'HIGH RISK', time: 'Today 10:18 AM' },
	{ name: 'Mobifone', number: '+91 91234 56789', status: 'SUSPICIOUS', time: 'Today 10:16 AM' },
	{ name: 'Amazon Support', number: '+91 92386 38866', status: 'SUSPICIOUS', time: 'Today 10:10 PM' },
	{ name: 'ICIC Bank', number: '+91 92383 38896', status: 'BLOCKED', time: 'Today 10:09 PM' },
	{ name: 'Unknown Caller', number: '+91 91234 00000', status: 'HIGH RISK', time: 'Yesterday 9:45 AM' },
];

const statusColor = (status: string) => {
	switch (status) {
		case 'HIGH RISK': return 'var(--accent-red)';
		case 'SUSPICIOUS': return 'var(--accent-yellow)';
		case 'BLOCKED': return 'var(--accent-blue)';
		default: return '#b0b3c7';
	}
};

const History: React.FC = () => (
	<div className="history-root">
		<h2 className="history-title">Call History</h2>
		<div className="history-chart-placeholder">
			{/* Replace with real chart component */}
			<div className="history-chart-bar">
				<div className="bar bar-high"></div>
				<div className="bar bar-suspicious"></div>
				<div className="bar bar-scam"></div>
				<div className="bar bar-scam"></div>
				<div className="bar bar-suspicious"></div>
				<div className="bar bar-high"></div>
				<div className="bar bar-blocked"></div>
			</div>
			<div className="history-chart-labels">
				<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
			</div>
		</div>
		<div className="history-list">
			{dummyHistory.map((item, idx) => (
				<div className="history-list-item" key={idx}>
					<div className="history-list-main">
						<span className="history-list-name">{item.name}</span>
						<span className="history-list-number">{item.number}</span>
					</div>
					<div className="history-list-meta">
						<span className="history-list-status" style={{ background: statusColor(item.status) }}>{item.status}</span>
						<span className="history-list-time">{item.time}</span>
					</div>
				</div>
			))}
		</div>
	</div>
);

export default History;