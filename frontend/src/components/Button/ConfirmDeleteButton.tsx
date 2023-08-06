import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

interface ConfirmDeleteButtonProps {
  deleteID: number;
  onConfirm: (dataSetId: number) => Promise<void>;
  onCancel?: () => void;
}

export default function ConfirmDeleteButton({ deleteID, onConfirm, onCancel }: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(deleteID);
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
    <>
      <Tooltip title={'Delete data'}>
        <IconButton onClick={handleOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete?</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button sx={{ color: 'inherit' }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button sx={{ color: 'inherit' }} onClick={handleConfirm}>
            {loading ? <CircularProgress color="info" size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
