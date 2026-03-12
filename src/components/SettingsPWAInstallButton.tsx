import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';

const SettingsPWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    let installable = true;
    let reasonMsg = '';
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      installable = false;
      reasonMsg = 'App is already installed or running in standalone mode.';
    }
    // Check if HTTPS or localhost
    if (!(window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      installable = false;
      reasonMsg = 'App must be served over HTTPS or localhost.';
    }
    // Check if manifest is present
    const manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      installable = false;
      reasonMsg = 'Web app manifest is missing or not linked in index.html.';
    }
    // Listen for beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallAvailable(true);
      setReason('');
      console.log('beforeinstallprompt event fired: PWA is installable.');
    };
    window.addEventListener('beforeinstallprompt', handler);
    // If not installable, set reason
    if (!installable) {
      setInstallAvailable(false);
      setReason(reasonMsg);
      console.warn('PWA not installable:', reasonMsg);
    }
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstallAvailable(false);
      }
    }
  };

  let tooltipMsg = 'Install the app to your device';
  if (!installAvailable) {
    tooltipMsg = reason || 'App can only be installed if your browser supports PWA and it is not already installed.';
  }

  return (
    <Tooltip
      title={tooltipMsg}
      placement="top"
      arrow
    >
      <span>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleInstall}
          sx={{ my: 2 }}
          disabled={!installAvailable}
        >
          Download VoxShield App
        </Button>
      </span>
    </Tooltip>
  );
};

export default SettingsPWAInstallButton;
