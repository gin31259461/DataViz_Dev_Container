'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import { CommandModalContext } from './Provider';
import '@/styles/command-modal.scss';
import { styled, useTheme } from '@mui/material';
import { useContext } from 'react';

interface CtrlKProps {
  className: string;
}

export const CtrlK: React.FC<CtrlKProps> = ({ className }) => {
  const theme = useTheme();
  const ControlCommandModal = useContext(CommandModalContext);

  const Container = styled('div')({
    border: useSplitLineStyle(),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  });

  return (
    <Container className={className} onClick={ControlCommandModal.toggle}>
      <kbd>CtrlK</kbd>
    </Container>
  );
};

export default function OpenCMDKButton() {
  const theme = useTheme();
  const ControlCommandModal = useContext(CommandModalContext);

  //FIXME : here has a bug, when we set background color into style property, hover is no working
  const StyledButton = styled('button')({
    '&:hover': {
      backgroundColor: theme.palette.action.focus,
    },
  });

  return (
    <StyledButton
      className="open-cmdk-button"
      onClick={ControlCommandModal.toggle}
      style={{
        // backgroundColor: theme.palette.grey[200],
        color: theme.palette.grey[500],
      }}
    >
      Search something...
      <kbd
        style={{
          border: useSplitLineStyle(),
          backgroundColor: theme.palette.background.default,
          color: theme.palette.getContrastText(theme.palette.background.default),
        }}
      >
        CtrlK
      </kbd>
    </StyledButton>
  );
}
