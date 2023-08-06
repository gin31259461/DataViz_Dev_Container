'use client';

import { Box, CircularProgress, styled, useTheme } from '@mui/material';

interface LoaderProps {
  floating?: boolean;
}

export default function Loader({ floating }: LoaderProps) {
  const theme = useTheme();
  const LoaderContainer = styled(Box)({
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backdropFilter: 'blur(10px)',
    display: floating ? 'fixed' : 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    position: 'fixed',
  });

  return (
    <LoaderContainer
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0, 0.3)' : 'rgb(252, 252, 252, 0.3)',
      }}
    >
      <div>
        <CircularProgress color={'info'} size={80}></CircularProgress>
      </div>
    </LoaderContainer>
  );
}
