import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel, open, title, children, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    handleClose();
    setLoading(false);
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button sx={{ color: 'inherit' }} onClick={handleCancel}>
          Cancel
        </Button>
        <Button sx={{ color: 'inherit' }} onClick={handleConfirm}>
          {loading ? <CircularProgress color="info" size={20} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
