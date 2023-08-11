'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';

export interface AccountMenuProps {
  avatar: React.ReactElement;
  userName: string | undefined | null;
  anchorEl: HTMLElement | null;
  open: boolean;
  authenticated: boolean;
  handleClose: () => void;
  handleLoginOut: () => void;
}

export default function AccountMenu({
  anchorEl,
  open,
  avatar,
  userName,
  authenticated,
  handleClose,
  handleLoginOut,
}: AccountMenuProps) {
  const router = useRouter();

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            router.push('/management/profile');
            handleClose();
          }}
        >
          {avatar}
          {userName ? userName : 'Profile'}
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={() => {
            router.push('/management/settings');
            handleClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={handleLoginOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {authenticated ? 'Logout' : 'Login'}
        </MenuItem>
      </Menu>
    </>
  );
}
