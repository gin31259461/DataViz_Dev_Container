'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import { Card } from '@mui/material';

interface GalleryCardContainerProps {
  children: React.ReactNode;
}

export default function GalleryCardContainer({ children }: GalleryCardContainerProps) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 345,
        border: useSplitLineStyle(),
      }}
    >
      {children}
    </Card>
  );
}
