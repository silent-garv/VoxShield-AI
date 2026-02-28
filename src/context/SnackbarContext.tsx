import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface SnackbarContextProps {
  showMessage: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('info');

  const showMessage = (msg: string, sev: 'error' | 'warning' | 'info' | 'success' = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
};