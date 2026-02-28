import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Detect', icon: <SearchIcon />, path: '/detect' },
  { label: 'History', icon: <HistoryIcon />, path: '/history' },
  { label: 'Learn', icon: <SchoolIcon />, path: '/learn' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const VoxBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <Paper sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1201,
      borderRadius: '2em 2em 0 0',
      background: 'var(--surface-dark)',
      boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.25)'
    }} elevation={8}>
      <BottomNavigation
        value={currentIndex === -1 ? 0 : currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        showLabels
        sx={{
          background: 'var(--surface-dark)',
          borderRadius: '2em 2em 0 0',
          height: '64px',
        }}
      >
        {navItems.map((item, idx) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={React.cloneElement(item.icon as React.ReactElement, {
              style: {
                color: currentIndex === idx ? 'var(--accent-orange)' : '#b0b3c7',
                fontSize: 28
              }
            })}
            sx={{
              color: currentIndex === idx ? 'var(--accent-orange)' : '#b0b3c7',
              fontWeight: 700,
              fontSize: '1.05em',
              borderRadius: '1.2em',
              mx: 0.5,
              transition: 'color 0.2s, background 0.2s',
              background: currentIndex === idx ? 'rgba(255,126,41,0.08)' : 'transparent',
              '&.Mui-selected': {
                color: 'var(--accent-orange)',
                background: 'rgba(255,126,41,0.12)'
              }
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default VoxBottomNavigation;
