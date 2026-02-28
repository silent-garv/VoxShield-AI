// import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { DetectionProvider } from './context/DetectionContext';
import { SnackbarProvider } from './context/SnackbarContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DetectionProvider>
      <SnackbarProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </SnackbarProvider>
    </DetectionProvider>
  </StrictMode>,
)
