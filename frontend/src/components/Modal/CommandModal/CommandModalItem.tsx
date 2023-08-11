'use client';

import { styled, useTheme } from '@mui/material';
import { Command } from 'cmdk';

interface CommandModalItemProps {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
  value?: string;
}

export const CommandModalItem: React.FC<CommandModalItemProps> = ({
  children,
  shortcut,
  onSelect = () => {},
  value,
}) => {
  const theme = useTheme();

  const StyledCommandItem = styled(Command.Item)({
    '&[data-selected=true]': {
      backgroundColor: theme.palette.action.hover,
    },

    '&[data-disabled=true]': {
      color: theme.palette.action.disabled,
      cursor: 'not-allowed',
    },
    '&:active': {
      transitionProperty: 'background',
      backgroundColor: theme.palette.action.focus,
    },
  });

  return (
    <StyledCommandItem value={value} onSelect={onSelect}>
      {children}
      {shortcut && (
        <div cmdk-vercel-shortcuts="">
          {shortcut.split(' ').map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </StyledCommandItem>
  );
};
