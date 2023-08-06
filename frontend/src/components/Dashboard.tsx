'use client';

import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(180);
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setDrawerWidth(180);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setDrawerWidth(50);
    }
  }, [open]);

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        variant="persistent"
        anchor="left"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            width: drawerWidth,
            transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
            height: 'calc(100vh - 60px)',
            top: '60px',
            zIndex: 10,
            overflow: 'hidden',
          },
        }}
        open
      >
        <Divider />
        <div style={{ padding: 3 }}>
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          )}
        </div>
        <Divider />
        <List>
          <ListItemButton href="/management/data">
            <ListItemIcon>
              <DatasetRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Data" />
          </ListItemButton>
          <ListItemButton href="/management/infographic">
            <ListItemIcon>
              <ShowChartRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Infographic" sx={{ whiteSpace: 'nowrap' }} />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton href="/management/profile">
            <ListItemIcon>
              <AccountBoxRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton href="/management/account">
            <ListItemIcon>
              <ManageAccountsRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
          <ListItemButton href="/management/settings">
            <ListItemIcon>
              <SettingsRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Settings"></ListItemText>
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <main style={{ width: '100%' }}>{children}</main>
    </Box>
  );
}
