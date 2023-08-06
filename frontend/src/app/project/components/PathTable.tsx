import { useProjectStore } from '@/hooks/store/useProjectStore';
import { trpc } from '@/server/trpc';
import { DecisionTreePath } from '@/utils/parsePath';
import { tokens } from '@/utils/theme';
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import HtmlTooltip from '../../../components/HtmlTooltip';

interface TableSortableProps {
  columns: string[];
  rows: React.ReactNode[][];
  paths: DecisionTreePath[];
}

const PathTable: React.FC<TableSortableProps> = ({ columns, rows, paths }) => {
  const [orderby, setOrderby] = useState(columns[0]);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [infoOpen, setInfoOpen] = useState(false);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const tableName = trpc.analysis.getTableName.useQuery(selectedDataOID);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const rangeColor0_25 = colors.blueAccent[800];
  const rangeColor26_50 = colors.blueAccent[500];
  const rangeColor51_75 = colors.greenAccent[500];
  const rangeColor76_100 = colors.redAccent[600];
  const colorBlock = (color: string) => {
    return (
      <div
        style={{
          width: 25,
          height: 25,
          backgroundColor: color,
          borderRadius: 2,
        }}
      ></div>
    );
  };

  const handleSort = (currentOrderby: string) => {
    setOrderDirection((prev) => {
      return currentOrderby !== orderby ? prev : prev === 'asc' ? 'desc' : 'asc';
    });
    setOrderby(currentOrderby);
  };

  return (
    <TableContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {colorBlock(rangeColor0_25)}
            <Typography variant="subtitle1">0% ~ 25%</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {colorBlock(rangeColor26_50)}
            <Typography variant="subtitle1">26% ~ 50%</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {colorBlock(rangeColor51_75)}
            <Typography variant="subtitle1">51% ~ 75%</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {colorBlock(rangeColor76_100)}
            <Typography variant="subtitle1">76% ~ 100%</Typography>
          </Box>
          <Button color="info" variant="outlined" onClick={() => setInfoOpen((prev) => !prev)}>
            Info
          </Button>
        </Box>
        <Collapse in={infoOpen}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginBottom: 2,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography>資料表 : {tableName.data?.CName}</Typography>
            <Typography>目標 : {target}</Typography>
            <Typography>特徵 : {features?.join(', ')}</Typography>
          </Box>
        </Collapse>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, i) => {
              return (
                <TableCell key={i}>
                  <div>
                    {column}
                    <TableSortLabel
                      active={orderby === column}
                      direction={orderDirection}
                      onClick={() => handleSort(column)}
                    ></TableSortLabel>
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        {/*
          0% - 25%, 26 % - 50%, 51% - 75%, 76% - 100%
        */}
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow key={i}>
                {row.map((cell, j) => {
                  if (j >= 2 && j <= 4) {
                    const value = cell as number;
                    if (value >= 0 && value <= 25)
                      return (
                        <TableCell
                          key={j}
                          sx={{
                            backgroundColor: rangeColor0_25,
                          }}
                        >
                          {(cell as number).toFixed(0).toString() + '%'}
                        </TableCell>
                      );
                    else if (value >= 26 && value <= 50)
                      return (
                        <TableCell
                          key={j}
                          sx={{
                            backgroundColor: rangeColor26_50,
                          }}
                        >
                          {(cell as number).toFixed(0).toString() + '%'}
                        </TableCell>
                      );
                    else if (value >= 51 && value <= 75)
                      return (
                        <TableCell
                          key={j}
                          sx={{
                            backgroundColor: rangeColor51_75,
                          }}
                        >
                          {(cell as number).toFixed(0).toString() + '%'}
                        </TableCell>
                      );
                    else if (value >= 76 && value <= 100)
                      return (
                        <TableCell
                          key={j}
                          sx={{
                            backgroundColor: rangeColor76_100,
                          }}
                        >
                          {(cell as number).toFixed(0).toString() + '%'}
                        </TableCell>
                      );
                  } else if (j == 1) {
                    return (
                      <HtmlTooltip
                        key={j}
                        title={paths[i].path.map((nodeID, k) => {
                          const currentNodeID = paths[i].path[k - 1];
                          return (
                            <Typography key={k}>
                              {'Node ' + nodeID + ' : '}
                              {k > 0
                                ? paths[i].nodeLabel[currentNodeID] && paths[i].nodeLabel[currentNodeID][1]
                                : 'Root'}
                            </Typography>
                          );
                        })}
                      >
                        <TableCell
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {cell}
                        </TableCell>
                      </HtmlTooltip>
                    );
                  }
                  return <TableCell key={j}>{cell}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PathTable;
