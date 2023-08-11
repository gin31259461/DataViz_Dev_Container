'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import { trpc } from '@/server/trpc';
import { validateEmail } from '@/utils/validateEmail';
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography, useTheme } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';

export default function SignUp() {
  const { status } = useSession();
  const params = useSearchParams();
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);

  const provider = params.get('provider');
  const signedUsername = params.get('username');
  const signedEmail = params.get('email');
  const MID = params.get('MID');

  const isEmailUsed = trpc.user.isEmailUsed.useQuery(email).data ?? true;
  const isUsernameUsed = trpc.user.isUserNameUsed.useQuery(username).data ?? true;
  const enableUser = trpc.user.enable.useMutation();

  const signUpHandler = async () => {
    if (MID) enableUser.mutate({ email: email, username: username, MID: parseInt(MID) });
    if (provider) signIn(provider);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/management/profile');
    }
  }, [status]);

  useEffect(() => {
    if (signedEmail) setEmail(signedEmail);
    if (signedUsername) setUsername(signedUsername);
  }, [signedEmail, signedUsername]);

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: 'calc(100vh - 60px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '24px',
          gap: 2,
          maxWidth: 500,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          border: useSplitLineStyle(),
        }}
      >
        <Typography variant="h4">Sign up</Typography>
        <Paper sx={{ padding: 2 }}>
          You are about to use your
          <strong> {provider} </strong>
          account to join
          <strong> DataViz. </strong>
          As a final step, please complete the following form:
        </Paper>
        <Typography>
          <strong>Username</strong>
        </Typography>
        <TextField
          value={username}
          error={!isUsernameUsed || username.length <= 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
          }}
          helperText={
            <Fragment>
              {isUsernameUsed ? '' : 'Username cannot be used. Please choose another username.'}
              {username.length > 0 ? '' : 'Username cannot be null.'}
            </Fragment>
          }
        ></TextField>
        <Typography>
          <strong>E-mail</strong>
        </Typography>
        <TextField
          value={email}
          error={!isEmailUsed || !validateEmail(email)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
          helperText={
            <Fragment>
              {isEmailUsed
                ? ''
                : `An account already exists with this e-mail address. Please sign
                    in to that account first, then connect your ${provider} account.`}
              {validateEmail(email) ? '' : 'Invalid e-mail format. Please try another one.'}
            </Fragment>
          }
        ></TextField>
        <Button
          disabled={!isEmailUsed || !isUsernameUsed || username.length <= 0 || !validateEmail(email) || pending}
          color="info"
          variant="contained"
          onClick={async () => {
            setPending(true);
            await signUpHandler();
            setPending(false);
          }}
        >
          {pending ? <CircularProgress color="info" /> : 'Sign up'}
        </Button>
      </Box>
    </Container>
  );
}
