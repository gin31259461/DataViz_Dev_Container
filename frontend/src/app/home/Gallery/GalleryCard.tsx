import { CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import GalleryCardContainer from './GalleryCardContainer';

interface GalleryCardProps {
  title: string;
  src: string;
  href: string;
}

export default function GalleryCard({ title, src, href }: GalleryCardProps) {
  return (
    <GalleryCardContainer>
      <CardActionArea href={href}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ height: 5 }}>
            {title}
          </Typography>
        </CardContent>
        <CardMedia component="img" height="340" image={src} alt={title} sx={{ padding: 2 }} />
      </CardActionArea>
    </GalleryCardContainer>
  );
}
