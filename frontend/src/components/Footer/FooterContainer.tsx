'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import { Container, useTheme } from '@mui/material';

interface FooterContainerProps {
  children: React.ReactNode;
}

export default function FooterContainer({ children }: FooterContainerProps) {
  const theme = useTheme();

  return (
    <footer
      style={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6, 0),
      }}
    >
      <Container maxWidth="lg" sx={{ borderTop: useSplitLineStyle(), paddingTop: '2vh' }}>
        {children}
      </Container>
    </footer>
  );
}
