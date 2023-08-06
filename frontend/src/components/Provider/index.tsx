'use client';

import { ColorModeContext, useMode } from '@/utils/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { CommandModalContext, useCommandModal } from '../Modal/CommandModal/Provider';

interface ProviderProps {
  children: React.ReactNode;
  session: Session;
}

export function Provider({ children, session }: ProviderProps) {
  const { theme, colorMode } = useMode();
  const ControlCommandModal = useCommandModal();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={session}>
          <CommandModalContext.Provider value={ControlCommandModal}>
            <div>{children}</div>
          </CommandModalContext.Provider>
        </SessionProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
