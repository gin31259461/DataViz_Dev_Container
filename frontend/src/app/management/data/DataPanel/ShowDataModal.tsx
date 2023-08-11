import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';

interface ShowDataModalProps {
  open: boolean;
  onClose: () => void;
  title: string | null | undefined;
  description: string | null | undefined;
  dataInfo: string | null | undefined;
  children: React.ReactNode;
}

export default function ShowDataModal({ open, onClose, title, description, dataInfo, children }: ShowDataModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        <Typography>{title}</Typography>
        <Typography
          sx={{
            paddingTop: 3,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {description}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>{dataInfo}</Typography>
        {children}
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
