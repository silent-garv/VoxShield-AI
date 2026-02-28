// removed duplicate useState import
import VoxBottomNavigation from './components/BottomNavigation';
import LaunchScreen from './components/LaunchScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';

import React, { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detect from './pages/Detect';
import History from './pages/History';
import Learn from './pages/Learn';
import Consent from './pages/Consent';
import Alert from './pages/Alert';
import Settings from './pages/Settings';
import { useDetectionContext } from './context/DetectionContext';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery, Box, Container } from '@mui/material';


const App: React.FC = () => {
  const { consented } = useDetectionContext();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: '#2563EB' },
        secondary: { main: '#10B981' },
        background: {
          default: mode === 'dark' ? '#0F172A' : '#f5f6fa',
          paper: mode === 'dark' ? '#1e293b' : '#fff',
        },
      },
      shape: { borderRadius: 12 },
      typography: { fontFamily: 'Roboto, Arial, sans-serif' },
    }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LaunchScreen />
      <PWAInstallPrompt />
      <Box minHeight="100vh" bgcolor="background.default" color="text.primary">
        <Navbar mode={mode} setMode={setMode} />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={consented ? <Detect /> : <Navigate to="/consent" />} />
            <Route path="/history" element={<History />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/settings" element={<Settings mode={mode} setMode={setMode} />} />
          </Routes>
        </Container>
        <VoxBottomNavigation />
      </Box>
    </ThemeProvider>
  );
};

export default App;
