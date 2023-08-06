import { Alert, AlertColor, Snackbar, SnackbarProps, Typography } from '@mui/material';

interface MessageSnackbarProps extends Omit<SnackbarProps, 'open'> {
  open: boolean;
  onClose: () => void;
  message?: string;
  status?: AlertColor;
}

export default function MessageSnackbar({
  open,
  onClose,
  message = 'Upload Success',
  status = 'info',
  ...props
}: MessageSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      message={message}
      key={{ vertical: 'bottom', horizontal: 'right' }}
      {...props}
    >
      <Alert
        onClose={onClose}
        severity={status}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
        elevation={6}
        variant="filled"
      >
        <Typography variant="h6">{message}</Typography>
      </Alert>
    </Snackbar>
  );
}
