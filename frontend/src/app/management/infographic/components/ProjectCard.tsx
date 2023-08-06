'use client';

import { type InfoProject } from '@/types/InfoProject';
import { tokens } from '@/utils/theme';
import { Card, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';

interface ProjectCardProps {
  project: InfoProject;
  active: boolean;
}

export default function ProjectCard({ project, active }: ProjectCardProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        maxWidth: 345,
        border: active ? `2px solid ${theme.palette.info.main}` : theme.palette.background.paper,
      }}
    >
      <CardActionArea>
        {/* <CardMedia component="img" height="140" image={project.image} alt={project.name} /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {project.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
