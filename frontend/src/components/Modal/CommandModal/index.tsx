'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import '@/styles/command-modal.scss';
import opacityToHexString from '@/utils/opacityToHexString';
import { styled, useTheme } from '@mui/material';
import { Command } from 'cmdk';
import { Fragment, KeyboardEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NavigationGroup, ProjectGroup, SearchProjectPage } from './CmdMenu';
import { CommandModalContext } from './Provider';

export const CommandModal = () => {
  const theme = useTheme();
  const border = useSplitLineStyle();
  const ref = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const ControlCommandModal = useContext(CommandModalContext);

  const activePage = ControlCommandModal.pages[ControlCommandModal.pages.length - 1];
  const isHome = activePage === 'home';

  const activePageStyle = {
    color: theme.palette.info.main,
    backgroundColor: theme.palette.info.main + opacityToHexString(10),
    border: `1px solid ${theme.palette.info.main}`,
  };

  const popPage = useCallback(() => {
    ControlCommandModal.setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, [ControlCommandModal]);

  const bounce = () => {
    if (ref.current) {
      ref.current.style.transform = 'scale(0.96)';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = '';
        }
      }, 100);

      setInputValue('');
    }
  };

  const CommandDialogKeydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      bounce();
    }

    if (isHome || inputValue.length > 0) {
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      popPage();
      bounce();
    }
  };

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    function down(this: Document, event: globalThis.KeyboardEvent) {
      const e = event;
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        ControlCommandModal.toggle();
      }
    }

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [ControlCommandModal]);

  return (
    <div>
      <CommandModalContainer
        className="command-menu"
        style={{
          display: ControlCommandModal.isOpen ? 'flex' : 'none',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0, 0.3)' : 'rgb(252, 252, 252, 0.3)',
        }}
        ref={ref}
        sx={{
          '[cmdk-root]': {
            border: useSplitLineStyle(),
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fcfcfc',
          },
          '[cmdk-separator]': {
            backgroundColor: theme.palette.divider,
          },
          '[cmdk-input]': {
            caretColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fcfcfc',
            '&::placeholder': {
              color: theme.palette.grey[500],
            },
          },
          '[cmdk-vercel-badge]': {
            border: theme.palette.mode === 'light' ? border : '1px solid #fcfcfc',
            textAlign: 'center',
          },
          '[cmdk-vercel-shortcuts]': {
            kbd: {
              color: theme.palette.grey[600],
              backgroundColor: theme.palette.grey[200],
            },
          },
          // '[cmdk-group-heading]': {
          //   color: theme.palette.grey[700],
          // },
        }}
      ></CommandModalContainer>
      <Command.Dialog
        open={ControlCommandModal.isOpen}
        onOpenChange={ControlCommandModal.setOpen}
        container={ref.current ?? undefined}
        onKeyDown={CommandDialogKeydownHandler}
      >
        <div>
          {ControlCommandModal.pages.map((p) => (
            <div
              key={p}
              cmdk-vercel-badge=""
              onClick={() =>
                ControlCommandModal.setPages(
                  ControlCommandModal.pages.slice(0, ControlCommandModal.pages.findIndex((page) => page === p) + 1),
                )
              }
              style={p === activePage ? activePageStyle : {}}
            >
              {p}
            </div>
          ))}
        </div>
        <div
          style={{
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
            marginBottom: '8px',
          }}
        >
          <Command.Input
            autoFocus
            placeholder="What do you need?"
            onValueChange={(value) => {
              setInputValue(value);
            }}
          />
          <div cmdk-vercel-badge="">esc</div>
        </div>
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {activePage === 'home' && (
            <Fragment>
              <ProjectGroup />
              <NavigationGroup />
            </Fragment>
          )}
          {activePage === 'project' && <SearchProjectPage />}
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

const CommandModalContainer = styled('div')({
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 200,
  position: 'fixed',
});
