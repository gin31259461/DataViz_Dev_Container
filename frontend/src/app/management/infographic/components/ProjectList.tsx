import { Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useEffect } from 'react';

interface ProjectListProps {
  children: React.ReactNode;
}

export default function ProjectList({ children }: ProjectListProps) {
  const theme = useTheme();

  useEffect(() => {
    const TableHead = document.getElementById('project-list-table');
    if (TableHead !== null) {
      TableHead.style.top = `${TableHead.getBoundingClientRect().top + window.scrollY / 2}px`;
    }
  }, []);

  return (
    <Table sx={{ position: 'relative' }}>
      <TableHead
        id="project-list-table"
        sx={{
          position: 'sticky',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Last viewed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
}
