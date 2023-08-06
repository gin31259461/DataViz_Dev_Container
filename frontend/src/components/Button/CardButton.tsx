import { useSplitLineStyle } from '@/hooks/useStyles';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface CardButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function CardButton({ title, description, icon, onClick }: CardButtonProps) {
  return (
    <Card sx={{ maxWidth: 345, border: useSplitLineStyle() }}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex' }}>
          <div>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 30 }}>{icon}</div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
