import React, { useState } from 'react';
import { Box, Typography, Paper, Fab, CircularProgress } from '@mui/material';
import { Grid } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useSnackbar } from '../context/SnackbarContext';

const Detect: React.FC = () => {
	const [listening, setListening] = useState(false);
	const [transcript, setTranscript] = useState('');
	const [riskScore, setRiskScore] = useState<number | null>(null);
	const { showMessage } = useSnackbar();

	const handleStart = () => {
		setListening(true);
		setTranscript('Listening...');
		showMessage('Microphone activated. Speak now!', 'info');
		// TODO: Integrate real speechService
		setTimeout(() => {
			setTranscript('This is a sample scam call transcript.');
			setRiskScore(85);
			setListening(false);
			showMessage('Detection complete!', 'success');
		}, 3000);
	};

	const handleStop = () => {
		setListening(false);
		setTranscript('');
		showMessage('Detection stopped.', 'warning');
	};

	return (
		<React.Fragment>
			<Box>
				<Typography variant="h5" fontWeight={700} mb={2} textAlign="center">
					Scam Detection
				</Typography>
				<Grid container spacing={2} justifyContent="center">
					<Grid item xs={12}>
						<Paper elevation={3} sx={{ p: 3, mb: 2, minHeight: 100, textAlign: 'center' }}>
							<Typography variant="subtitle1" color="text.secondary">
								{transcript || 'Press the mic to start detection.'}
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						{riskScore !== null && (
							<Box textAlign="center" mb={2}>
								<Typography variant="h6" color={riskScore > 70 ? 'error' : 'success.main'}>
									Risk Score: {riskScore}
								</Typography>
								<CircularProgress
									variant="determinate"
									value={riskScore}
									size={80}
									color={riskScore > 70 ? 'error' : 'success'}
									sx={{ mt: 1 }}
								/>
							</Box>
						)}
					</Grid>
				</Grid>
			</Box>
			<Fab
				color={listening ? 'error' : 'primary'}
				aria-label={listening ? 'Stop detection' : 'Start detection'}
				onClick={listening ? handleStop : handleStart}
				sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1201 }}
			>
				{listening ? <StopIcon /> : <MicIcon />}
			</Fab>
		</React.Fragment>
	);
};

export default Detect;
// Removed duplicate and invalid JSX and export statements after the main Detect component.