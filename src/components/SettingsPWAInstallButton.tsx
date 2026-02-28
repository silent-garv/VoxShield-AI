import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const SettingsPWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setVisible(false);
      }
    }
  };

  if (!visible) return null;

  return (
    <Button variant="contained" color="primary" fullWidth onClick={handleInstall} sx={{ my: 2 }}>
      Download VoxShield App
    </Button>
  );
};

export default SettingsPWAInstallButton;
