'use client';

import { useUserStore } from '@/hooks/store/useUserStore';
import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, IconButton, styled, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { data } = useSession();
  const buttonVariant = theme.palette.mode === 'dark' ? 'contained' : 'outlined';

  const userMID = useUserStore((state) => state.mid);
  const setMID = useUserStore((state) => state.setMID);

  useEffect(() => {
    if (data) setMID(Number(data.user.id));
  }, [data, setMID]);

  const handleClose = () => {
    onClose();
  };

  const handleGoogleSignIn = () => {
    signIn('google');
    handleClose();
  };

  const handleDiscordSignIn = () => {
    signIn('discord');
    handleClose();
  };

  const handleGitHubSignIn = () => {
    signIn('github');
    handleClose();
  };

  const handleFacebookSignIn = () => {
    signIn('facebook');
    handleClose();
  };

  const handleWKESSOSignIn = () => {
    signIn('wkesso');
    handleClose();
  };

  const LoginButton = styled(Button)({
    height: 50,
    width: 300,
  });

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoginButton
          variant={buttonVariant}
          color="primary"
          startIcon={<Image src={'/assets/icons/google.svg'} height={30} width={30} alt="google"></Image>}
          onClick={handleGoogleSignIn}
        >
          <div style={{ height: '50px', lineHeight: '50px' }}>Sign in with Google</div>
        </LoginButton>

        <LoginButton
          variant={buttonVariant}
          color="primary"
          startIcon={<Image src={'/assets/icons/discord.svg'} height={30} width={30} alt="discord"></Image>}
          onClick={handleDiscordSignIn}
        >
          <div style={{ height: '50px', lineHeight: '50px' }}>Sign in with Discord</div>
        </LoginButton>

        <LoginButton
          variant={buttonVariant}
          color="primary"
          startIcon={<Image src={'/assets/icons/facebook.svg'} height={30} width={30} alt="facebook"></Image>}
          onClick={handleFacebookSignIn}
        >
          <div style={{ height: '50px', lineHeight: '50px' }}>Sign in with Facebook</div>
        </LoginButton>

        <LoginButton
          variant={buttonVariant}
          color="primary"
          startIcon={<Image src={'/assets/icons/github.svg'} height={30} width={30} alt="github"></Image>}
          onClick={handleGitHubSignIn}
        >
          <div style={{ height: '50px', lineHeight: '50px' }}>Sign in with Github</div>
        </LoginButton>

        <LoginButton
          variant={buttonVariant}
          startIcon={<Image src={'/assets/icons/wkesso.ico'} height={30} width={30} alt="wkesso" />}
          onClick={handleWKESSOSignIn}
        >
          <div style={{ height: '50px', lineHeight: '50px' }}>Sign in with WKE SSO</div>
        </LoginButton>
      </DialogContent>

      <DialogActions>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default SignInModal;
