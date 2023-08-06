import { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react';

interface CommandModalContextProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  pages: string[];
  setPages: Dispatch<SetStateAction<string[]>>;
}

export const CommandModalContext = createContext<CommandModalContextProps>({
  isOpen: false,
  setOpen: () => {},
  toggle: () => {},
  pages: [],
  setPages: () => {},
});

export const useCommandModal = () => {
  const [pages, setPages] = useState<string[]>(['home']);
  const [open, setOpen] = useState(false);

  const ControlCommandModal = useMemo<CommandModalContextProps>(() => {
    return {
      isOpen: open,
      setOpen: setOpen,
      toggle: () => setOpen((prev) => !prev),
      pages: pages,
      setPages: setPages,
    };
  }, [open, pages]);
  return ControlCommandModal;
};
