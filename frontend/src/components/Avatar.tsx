import { tokens } from '@/utils/theme';
import { useTheme } from '@mui/material';
import MUIAvatar from '@mui/material/Avatar';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.reduce((result, word) => result + (word[0] ? word[0].toUpperCase() : ''), '');
};

export default function Avatar({ src, alt, initials, size = 30 }: AvatarProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (src) {
    return <MUIAvatar src={src} alt={alt} sx={{ width: size, height: size }} />;
  }

  if (initials) {
    return (
      <MUIAvatar
        sx={{
          width: size,
          height: size,
          bgcolor: colors.greenAccent[500],
          textAlign: 'center',
        }}
      >
        {getInitials(initials)}
      </MUIAvatar>
    );
  }

  return <MUIAvatar sx={{ width: size, height: size }} />;
}
