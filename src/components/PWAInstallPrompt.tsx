import React, { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setOpen(true);
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
        setOpen(false);
      }
    }
  };

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      message="Install VoxShield AI for a better experience!"
      action={
        <Button color="primary" onClick={handleInstall} variant="contained">
          Download App
        </Button>
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
};

export default PWAInstallPrompt;
