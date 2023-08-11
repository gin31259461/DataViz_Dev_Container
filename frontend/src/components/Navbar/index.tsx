'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import style from '@/styles/navbar.module.scss';
import { ColorModeContext } from '@/utils/theme';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import Avatar from '../Avatar';
import DataVizIcon from '../Icon/DataVizIcon';
import Loader from '../Loading/Loader';
import OpenCMDKButton, { CtrlK } from '../Modal/CommandModal/OpenCMDKButton';
import { ConfirmModal } from '../Modal/ConfirmModal';
import SignInModal from '../Modal/SignInModal';
import AccountMenu from './AccountMenu';
import { NavbarMenu, NavbarMenuButton, NavbarMenuItem } from './NavbarMenu';

export default function Navbar() {
  const { data, status } = useSession();
  const theme = useTheme();
  const splitPathName = usePathname().split('/');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);

  const handleClose = () => {
    setMenuOpen(false);
  };

  const AvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const AvatarMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLoginOut = () => {
    if (status === 'unauthenticated') setSignInModalOpen(true);
    else if (status === 'authenticated') setSignOutModalOpen(true);
  };

  return (
    <div
      className={style['container']}
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(20, 27, 45, 0.7)' : 'rgb(252, 252, 252, 0.8)',
        borderBottom: `${useSplitLineStyle()}`,
      }}
    >
      <div className={style['navbar-container']}>
        <div>
          <Link onClick={handleClose} href={'/'} className={style['link']} title={''}>
            <DataVizIcon color={theme.palette.primary.main}></DataVizIcon>
          </Link>
        </div>

        <h2 style={{ marginLeft: '12px' }}>
          <Link onClick={handleClose} href={'/'} className={style['link']} title={''}>
            Data Viz
          </Link>
        </h2>

        {/*---------- Navbar menu separator ----------*/}
        <div className={style['navMenu']}>
          <div className={style['navMenuFirst']}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <NavbarMenuButton
                // active={splitPathName.length >= 2 && splitPathName[2] === 'profile' ? true : false}
                href="/"
              >
                Chart library
              </NavbarMenuButton>
              <NavbarMenuButton
                active={splitPathName.length >= 2 && splitPathName[2] === 'data' ? true : false}
                href="/management/data"
              >
                Data
              </NavbarMenuButton>
              <NavbarMenuButton
                active={splitPathName.length >= 2 && splitPathName[2] === 'infographic' ? true : false}
                href="/management/infographic"
              >
                Infographic
              </NavbarMenuButton>
              <NavbarMenuButton
                active={splitPathName.length >= 2 && splitPathName[2] === 'settings' ? true : false}
                href="/management/settings"
              >
                Settings
              </NavbarMenuButton>
            </div>
          </div>

          <div className={style['navMenuSecond']}>
            <div className={style['navMenuSecond-1']}>
              <Button sx={{ border: useSplitLineStyle(), textTransform: 'none' }} color="primary">
                Feedback
              </Button>
              {status === 'unauthenticated' && (
                <Button
                  sx={{
                    textTransform: 'none',
                  }}
                  color="primary"
                  variant="contained"
                  onClick={handleLoginOut}
                >
                  Login
                </Button>
              )}
              <OpenCMDKButton />
            </div>

            <CtrlK className={style['CMDK']} />

            <IconButton onClick={() => colorMode.toggleColorMode()}>
              {theme.palette.mode === 'dark' ? (
                <DarkModeOutlinedIcon fontSize={'medium'}></DarkModeOutlinedIcon>
              ) : (
                <LightModeOutlinedIcon fontSize={'medium'}></LightModeOutlinedIcon>
              )}
            </IconButton>

            <IconButton className={style['navMenuListButton']} onClick={handleMenuOpen}>
              {menuOpen ? (
                <CloseOutlinedIcon fontSize={'medium'}></CloseOutlinedIcon>
              ) : (
                <MenuOutlinedIcon fontSize={'medium'}></MenuOutlinedIcon>
              )}
            </IconButton>

            <IconButton
              sx={{
                width: 36,
                height: 36,
              }}
              onClick={AvatarClick}
            >
              <Avatar src={data?.user.image ?? undefined} />
            </IconButton>

            <AccountMenu
              anchorEl={anchorEl}
              open={anchorEl ? true : false}
              handleClose={AvatarMenuClose}
              avatar={<Avatar src={data?.user.image ?? undefined} />}
              userName={data?.user.name}
              authenticated={status === 'authenticated' ? true : false}
              handleLoginOut={handleLoginOut}
            ></AccountMenu>
          </div>
        </div>
      </div>
      {/*---------- Navbar menu separator ----------*/}

      {/*---------- Menu list open separator ----------*/}
      <NavbarMenu className={menuOpen ? style['navMenuOpen'] : style['navMenuClose']} onClose={handleClose}>
        <NavbarMenuItem href="/">Chart library</NavbarMenuItem>
        <NavbarMenuItem href="/management/data">Data</NavbarMenuItem>
        <NavbarMenuItem href="/management/infographic">Infographic</NavbarMenuItem>
        <NavbarMenuItem href="/management/settings">Settings</NavbarMenuItem>
        <NavbarMenuItem href="/">Feedback</NavbarMenuItem>

        {status === 'unauthenticated' && (
          <NavbarMenuItem onClick={() => setSignInModalOpen(true)}>Login</NavbarMenuItem>
        )}
      </NavbarMenu>

      {menuOpen && (
        <div
          className={style['backdrop']}
          onClick={() => {
            setMenuOpen(false);
          }}
        ></div>
      )}
      {/*---------- Menu list open separator ----------*/}

      {/*---------- SignIn SignOut separator ----------*/}
      <SignInModal
        open={signInModalOpen}
        onClose={() => {
          setSignInModalOpen(false);
        }}
      ></SignInModal>

      <ConfirmModal
        open={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={async () => await signOut()}
        title="Logout"
      >
        Are you sure to logout?
      </ConfirmModal>
      {/*---------- SignIn SignOut separator ----------*/}

      {status === 'loading' && <Loader />}
    </div>
  );
}
