'use client';

import { trpc } from '@/server/trpc';
import { Button, CircularProgress, styled } from '@mui/material';
import { BuiltInProviderType } from 'next-auth/providers';
import { LiteralUnion, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AccountListItemProps {
  provider: string;
  startIcon?: React.ReactNode;
}

export const AccountListItem: React.FC<AccountListItemProps> = (props) => {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<LiteralUnion<BuiltInProviderType> | undefined>(undefined);
  const accounts = trpc.user.getLinkedAccount.useQuery(data ? parseInt(data?.user.id) : undefined).data;
  const connectStatus = accounts?.findIndex((account) => account.provider === props.provider) === -1 ? false : true;
  const unLinkAccount = trpc.user.unLinkAccount.useMutation();

  const handleConnect = async () => {
    setLoading(true);
    setActiveProvider(props.provider);
    await signIn(props.provider);
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setActiveProvider(props.provider);
    if (data) unLinkAccount.mutateAsync({ MID: parseInt(data.user.id), provider: props.provider });
  };

  useEffect(() => {
    setLoading(false);
    setActiveProvider(undefined);
  }, [connectStatus]);

  return (
    <AccountListItemContainer>
      <AccountListItemLeft>
        {props.startIcon}
        {props.provider}
      </AccountListItemLeft>
      <AccountListItemCenter>{connectStatus ? 'Connected' : 'Not Connected'}</AccountListItemCenter>
      <AccountListItemRight>
        <Button
          sx={{
            width: '100px',
            height: '32px',
            textTransform: 'none',
          }}
          variant="outlined"
          color="info"
          disabled={loading}
          onClick={connectStatus ? handleDisconnect : handleConnect}
        >
          {loading && activeProvider === props.provider ? (
            <CircularProgress size={20} color="info" />
          ) : connectStatus ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </AccountListItemRight>
    </AccountListItemContainer>
  );
};

export const AccountListItemContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '60px',
});

export const AccountListItemLeft = styled('div')({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: '200px',
  width: '20%',
});

export const AccountListItemCenter = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: '600px',
  width: '50%',
});

export const AccountListItemRight = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: '400px',
  width: '30%',
});
