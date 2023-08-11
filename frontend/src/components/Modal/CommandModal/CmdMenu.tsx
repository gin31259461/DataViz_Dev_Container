'use client';

import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { CommandModalItem } from './CommandModalItem';
import { CommandModalContext } from './Provider';

const usePageItemSelected = () => {
  const router = useRouter();
  const ControlCommandModal = useContext(CommandModalContext);

  return (path: string) => {
    router.push(path);
    ControlCommandModal.setOpen(false);
  };
};

export const NavigationGroup = () => {
  const selectedHandler = usePageItemSelected();
  return (
    <Command.Group heading="Navigation">
      <CommandModalItem value="home" shortcut="G H" onSelect={() => selectedHandler('/')}>
        <HomeOutlinedIcon />
        Home
      </CommandModalItem>
      <CommandModalItem value="data" onSelect={() => selectedHandler('/management/data')}>
        <DatasetOutlinedIcon />
        Data
      </CommandModalItem>
      <CommandModalItem value="infographic" onSelect={() => selectedHandler('/management/infographic')}>
        <ShowChartOutlinedIcon />
        Infographic
      </CommandModalItem>
      <CommandModalItem value="profile" onSelect={() => selectedHandler('/management/profile')}>
        <AccountBoxOutlinedIcon />
        Profile
      </CommandModalItem>
      <CommandModalItem value="settings" onSelect={() => selectedHandler('/management/settings')}>
        <SettingsOutlinedIcon />
        Settings
      </CommandModalItem>
    </Command.Group>
  );
};

export const ProjectGroup = () => {
  const ControlCommandModal = useContext(CommandModalContext);
  const selectedHandler = usePageItemSelected();

  return (
    <Command.Group heading="Project">
      <CommandModalItem
        value="search project"
        shortcut="S P"
        onSelect={() => ControlCommandModal.setPages([...ControlCommandModal.pages, 'project'])}
      >
        <SearchOutlinedIcon />
        Search Project
      </CommandModalItem>
      <CommandModalItem value="new project" shortcut="N P" onSelect={() => selectedHandler('/project')}>
        <AddOutlinedIcon />
        New Project
      </CommandModalItem>
    </Command.Group>
  );
};

export const SearchProjectPage = () => {
  return (
    <Command.Group>
      <CommandModalItem value="test1">test1</CommandModalItem>
      <CommandModalItem value="test2">test2</CommandModalItem>
    </Command.Group>
  );
};
