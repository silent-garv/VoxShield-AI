
import React from 'react';
import ShieldIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';


import './Home.css';

const Home: React.FC = () => (
	<div className="home-root">
		<div className="home-header">
			<span className="home-shield">
				<ShieldIcon style={{ fontSize: 56, color: 'var(--accent-blue)' }} />
			</span>
			<h1 className="home-title">Scam Call Guardian</h1>
			<p className="home-subtitle">Stay Protected from Scam Calls!</p>
			<p className="home-desc">Advanced AI powered scam call protection</p>
			<Button
				component={RouterLink}
				to="/detect"
				variant="contained"
				color="primary"
				size="large"
				sx={{
					borderRadius: 'var(--border-radius)',
					fontWeight: 700,
					fontSize: '1.1em',
					background: 'var(--accent-orange)',
					color: '#fff',
					boxShadow: 'var(--shadow)',
					mt: 2,
					'&:hover': {
						background: 'var(--accent-red)'
					}
				}}
			>
				START CALL MONITORING
			</Button>
		</div>
		<div className="home-alerts">
			<div className="home-alert-card">
				<NotificationsActiveIcon style={{ color: 'var(--accent-orange)', fontSize: 28, marginRight: 8 }} />
				<div>
					<div className="home-alert-title">Latest Scam Alerts</div>
					<ul className="home-alert-list">
						<li>AI Call Screening</li>
						<li>Advanced Scam Identification</li>
						<li>Phone Number Reputation Check</li>
					</ul>
				</div>
			</div>
			<div className="home-alert-card home-alert-news">
				<WarningAmberIcon style={{ color: 'var(--accent-red)', fontSize: 28, marginRight: 8 }} />
				<div>
					<div className="home-alert-title">High-Risk Bank Scam</div>
					<div className="home-alert-news-desc">Pic emitat! Fuga Insig! Recent: Piero e Rodisei Reputation Check</div>
				</div>
			</div>
		</div>
		<div className="home-footer">
			<nav className="home-nav">
				<RouterLink to="/history">History</RouterLink>
				<RouterLink to="/community">Community</RouterLink>
				<RouterLink to="/settings">Settings</RouterLink>
			</nav>
		</div>
	</div>
);

export default Home;