import Dashboard from '@/components/Dashboard';
import { authOptions } from '@/server/auth/auth';
import { Container, Divider, Typography } from '@mui/material';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import {
  AccountListItem,
  AccountListItemCenter,
  AccountListItemContainer,
  AccountListItemLeft,
  AccountListItemRight,
} from './components/AccountList';

const AccountPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Dashboard>
      <Container sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div>
          <Typography variant="h5">Account information</Typography>
          <AccountListItemContainer>
            <AccountListItemLeft>
              <Typography variant="subtitle1">Nick name</Typography>
            </AccountListItemLeft>
            <AccountListItemCenter>
              <Typography variant="subtitle1">{session?.user.name}</Typography>
            </AccountListItemCenter>
            <AccountListItemRight></AccountListItemRight>
          </AccountListItemContainer>
          <Divider />
          <AccountListItemContainer>
            <AccountListItemLeft>
              <Typography variant="subtitle1">User id</Typography>
            </AccountListItemLeft>
            <AccountListItemCenter>
              <Typography variant="subtitle1">{session?.user.username}</Typography>
            </AccountListItemCenter>
            <AccountListItemRight></AccountListItemRight>
          </AccountListItemContainer>
          <Divider />
          <AccountListItemContainer>
            <AccountListItemLeft>
              <Typography variant="subtitle1">Email</Typography>
            </AccountListItemLeft>
            <AccountListItemCenter>
              <Typography variant="subtitle1">{session?.user.email}</Typography>
            </AccountListItemCenter>
            <AccountListItemRight></AccountListItemRight>
          </AccountListItemContainer>
          <Divider />
          <AccountListItemContainer>
            <AccountListItemLeft>
              <Typography variant="subtitle1">Password</Typography>
            </AccountListItemLeft>
            <AccountListItemCenter></AccountListItemCenter>
            <AccountListItemRight></AccountListItemRight>
          </AccountListItemContainer>
          <Divider />
        </div>
        <div>
          <Typography variant="h5">Connect account</Typography>
          <AccountListItem
            startIcon={<Image src={'/assets/icons/google.svg'} height={30} width={30} alt="google"></Image>}
            provider="google"
          ></AccountListItem>
          <Divider />
          <AccountListItem
            startIcon={<Image src={'/assets/icons/discord.svg'} height={30} width={30} alt="discord"></Image>}
            provider="discord"
          ></AccountListItem>
          <Divider />
          <AccountListItem
            startIcon={<Image src={'/assets/icons/facebook.svg'} height={30} width={30} alt="facebook"></Image>}
            provider="facebook"
          ></AccountListItem>
          <Divider />
          <AccountListItem
            startIcon={<Image src={'/assets/icons/github.svg'} height={30} width={30} alt="github"></Image>}
            provider="github"
          ></AccountListItem>
          <Divider />
          <AccountListItem
            startIcon={<Image src={'/assets/icons/wkesso.ico'} height={30} width={30} alt="wkesso"></Image>}
            provider="wkesso"
          ></AccountListItem>
          <Divider />
        </div>
      </Container>
    </Dashboard>
  );
};

export default AccountPage;
