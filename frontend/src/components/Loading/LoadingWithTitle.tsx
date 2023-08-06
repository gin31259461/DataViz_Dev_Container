import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingWithTitleProps {
  title: string;
}

const LoadingWithTitle: React.FC<LoadingWithTitleProps> = ({ title }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <CircularProgress color="info" />
    </Box>
  );
};

export default LoadingWithTitle;
