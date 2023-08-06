import { useSplitLineStyle } from '@/hooks/useStyles';
import { Box, Card, CardActionArea, CardContent, Tooltip } from '@mui/material';

interface IconCardButtonProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}
export default function IconCardButton({ children, title, onClick }: IconCardButtonProps) {
  return (
    <Tooltip title={title}>
      <Card sx={{ height: 'max-content', border: useSplitLineStyle() }} onClick={onClick}>
        <CardActionArea>
          <CardContent sx={{ padding: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
