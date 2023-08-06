import { Box, Paper, Typography } from '@mui/material';

interface SummaryPaperProps {
  title: string;
  children?: React.ReactNode;
}

const SummaryPaper: React.FC<SummaryPaperProps> = ({ title, children }) => {
  return (
    <Paper elevation={3}>
      <Box
        p={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {children}
      </Box>
    </Paper>
  );
};

export default SummaryPaper;
