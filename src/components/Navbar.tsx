import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDetectionContext } from '../context/DetectionContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

interface NavbarProps {
	mode: 'light' | 'dark';
	setMode: (mode: 'light' | 'dark') => void;
}

const navLinks = [
	{ to: '/', label: 'Home', icon: <HomeIcon /> },
	{ to: '/detect', label: 'Detect', icon: <SecurityIcon /> },
	{ to: '/history', label: 'History', icon: <HistoryIcon /> },
	{ to: '/learn', label: 'Learn', icon: <SchoolIcon /> },
];

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
	const { privacyMode, setPrivacyMode } = useDetectionContext();
	const location = useLocation();
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<AppBar position="sticky" color="primary" sx={{ borderRadius: 0, boxShadow: 2 }}>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={() => setDrawerOpen(true)}
					sx={{ mr: 2, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
					VoxShield AI
				</Typography>
				<Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
					{navLinks.map(link => (
						<Link
							key={link.to}
							to={link.to}
							style={{
								color: location.pathname === link.to ? '#10B981' : '#fff',
								textDecoration: 'none',
								fontWeight: location.pathname === link.to ? 700 : 500,
								display: 'flex',
								alignItems: 'center',
								gap: 4,
							}}
						>
							{link.icon}
							<span>{link.label}</span>
						</Link>
					))}
				</Box>
				<Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
					<IconButton color="inherit" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
						{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
					</IconButton>
				</Tooltip>
				<Tooltip title="Privacy Mode">
					<Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
						<PrivacyTipIcon color={privacyMode ? 'success' : 'error'} />
						<Switch
							checked={privacyMode}
							onChange={e => setPrivacyMode(e.target.checked)}
							color="success"
							inputProps={{ 'aria-label': 'privacy mode toggle' }}
						/>
					</Box>
				</Tooltip>
			</Toolbar>
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				sx={{ display: { sm: 'none' } }}
			>
				<Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
					<List>
						{navLinks.map(link => (
							<ListItem key={link.to} disablePadding>
								<ListItemButton component={Link} to={link.to} selected={location.pathname === link.to}>
									<ListItemIcon>{link.icon}</ListItemIcon>
									<ListItemText primary={link.label} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
					<List>
						<ListItem>
							<ListItemIcon><PrivacyTipIcon color={privacyMode ? 'success' : 'error'} /></ListItemIcon>
							<ListItemText primary="Privacy Mode" />
							<Switch
								checked={privacyMode}
								onChange={e => setPrivacyMode(e.target.checked)}
								color="success"
								inputProps={{ 'aria-label': 'privacy mode toggle' }}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
							<ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
							<Switch
								checked={mode === 'dark'}
								onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
								color="primary"
								inputProps={{ 'aria-label': 'theme mode toggle' }}
							/>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</AppBar>
	);
};

export default Navbar;