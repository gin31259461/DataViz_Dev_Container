'use client';

import effect from '@/styles/effect.module.scss';
import { tokens } from '@/utils/theme';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

export default function TypingText() {
  const [typingAnimation, setTypingAnimation] = useState(true);
  const [textFlag, setTextFlag] = useState(true);
  const [stopTypingFlag, setStopTypingFlag] = useState(false);
  const theme = useTheme();
  const color = tokens(theme.palette.mode);

  useEffect(() => {
    let intervalID: NodeJS.Timer;
    let timeoutID: NodeJS.Timer;
    if (typingAnimation) {
      setTextFlag((prev) => !prev);
      intervalID = setInterval(() => {
        setTypingAnimation(() => false);
      }, 5000);
      timeoutID = setTimeout(() => {
        setStopTypingFlag(true);
      }, 500);
    } else {
      setStopTypingFlag(false);
      intervalID = setInterval(() => {
        setTypingAnimation(() => true);
      }, 500);
    }
    return () => {
      clearInterval(intervalID);
      clearInterval(timeoutID);
    };
  }, [typingAnimation]);

  useEffect(() => {
    if (document.getElementById('typing-text') !== null) {
      document.getElementById('typing-text')?.style.setProperty('--cursor-color', color.greenAccent[500]);
      document.getElementById('typing-text')?.style.setProperty('--background-color', theme.palette.background.default);
    }
  }, [theme.palette.mode, theme.palette.background, color.greenAccent]);

  return (
    <div
      id={'typing-text'}
      className={
        effect['typing-effect'] +
        ' ' +
        (typingAnimation ? effect['typing'] : effect['deleting']) +
        ' ' +
        (stopTypingFlag ? effect['flash-border'] : '')
      }
    >
      {textFlag ? 'Data Visualization' : 'Beautiful Infographic'}
    </div>
  );
}
