import { Menu, MenuItem, PopoverPosition } from '@mui/material';
import { useState } from 'react';

interface ContextMenuProps {
  id: string;
  children: React.ReactNode;
  maxWidth?: number | string;
}

export default function ContextMenu({ children, maxWidth, id }: ContextMenuProps) {
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition | undefined>(undefined);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorPosition({
      top: event.pageY - window.scrollY,
      left: event.pageX - 20,
    });
  };

  const handleCloseMenu = () => {
    setAnchorPosition(undefined);
  };

  const handleMenuItemClick = () => {
    // Handle menu item click
    handleCloseMenu();
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ maxWidth: maxWidth }}>
      <div>{children}</div>

      <Menu
        anchorReference={'anchorPosition'}
        anchorPosition={anchorPosition}
        open={Boolean(anchorPosition)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleMenuItemClick}>Open</MenuItem>
        <MenuItem onClick={handleMenuItemClick}>Rename</MenuItem>
        <MenuItem onClick={handleMenuItemClick}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
