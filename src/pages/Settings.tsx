import React from 'react';
import { Typography, Switch, FormControlLabel, Divider, Button, Paper } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import SettingsPWAInstallButton from '../components/SettingsPWAInstallButton';

interface SettingsProps {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ mode, setMode }) => {
  // const theme = useTheme();
  const handleToggle = () => setMode(mode === 'dark' ? 'light' : 'dark');

  return (
    <Paper sx={{ p: 3, mt: 2 }} elevation={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <SettingsPWAInstallButton />
      <FormControlLabel
        control={<Switch checked={mode === 'dark'} onChange={handleToggle} />}
        label="Dark Mode"
        aria-label="Toggle dark/light mode"
      />
      <Typography variant="body2" color="text.secondary" mb={2}>
        Auto-detects system preference. Uses theme palette colors only.
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Button variant="outlined" color="error" sx={{ mb: 2 }}>
        Clear All Data
      </Button>
      <Typography variant="body2" color="text.secondary" mb={2}>
        This will delete all detection history and preferences.
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Privacy Mode
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Privacy Mode disables history tracking and enables extra privacy features. See Privacy Policy for details.
      </Typography>
      <Divider sx={{ mt: 2 }} />
      <Button variant="text" color="primary" sx={{ mt: 2 }}>
        View Privacy Policy
      </Button>
    </Paper>
  );
};

export default Settings;
