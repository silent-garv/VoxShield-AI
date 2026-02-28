import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LaunchScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={visible} timeout={600} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={64} color="primary" sx={{ mb: 3 }} />
        <Typography variant="h4" color="primary" fontWeight={700}>
          VoxShield AI
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mt={1}>
          Protecting you from scams
        </Typography>
      </Box>
    </Fade>
  );
};

export default LaunchScreen;
