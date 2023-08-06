'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { useSplitLineStyle } from '@/hooks/useStyles';
import { numberToStringPercentage } from '@/lib/toString';
import { trpc } from '@/server/trpc';
import { Box, Grow, Typography } from '@mui/material';
import SummaryPaper from '../../../components/SummaryPaper';

const Summary = () => {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const tableName = trpc.analysis.getTableName.useQuery(selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const selectedPath = useProjectStore((state) => state.selectedPath);
  const borderStyle = useSplitLineStyle();
  const summary = [
    <SummaryPaper key={0} title="Selected data">
      <Typography variant="body1">
        {'資料 id : ' + selectedDataOID?.toString()}
        <br />
        {'資料名稱 : ' + tableName.data?.CName}
      </Typography>
    </SummaryPaper>,
    <SummaryPaper key={1} title="Target">
      <Typography variant="body1">{target}</Typography>
    </SummaryPaper>,
    <SummaryPaper key={2} title="Features">
      <Typography variant="body1">
        {features?.map((feature, i) => (i !== features.length - 1 ? feature + ', ' : feature))}
      </Typography>
    </SummaryPaper>,
    <SummaryPaper key={3} title="Selected path">
      {selectedPath &&
        selectedPath.path.map((nodeID, i) => {
          const currentNodeID = selectedPath.path[i - 1];
          return (
            <Typography key={i} variant="body1" sx={{ overflowWrap: 'break-word' }}>
              {'Node ' +
                nodeID +
                ' : ' +
                (i > 0 ? selectedPath.nodeLabel[currentNodeID] && selectedPath.nodeLabel[currentNodeID][1] : 'Root')}
            </Typography>
          );
        })}
      <Typography variant="body1">
        {'目標分布 (低) : ' + numberToStringPercentage(selectedPath?.targetValueDistribution.low)} <br />
        {'目標分布 (中) : ' + numberToStringPercentage(selectedPath?.targetValueDistribution.medium)} <br />
        {'目標分布 (高) : ' + numberToStringPercentage(selectedPath?.targetValueDistribution.high)}
      </Typography>
    </SummaryPaper>,
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflowX: 'auto',
        padding: 2,
      }}
    >
      <Typography variant="h4">Summary analysis result</Typography>
      <Box
        sx={{
          marginTop: 5,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {summary.map((paper, i) => {
          return (
            <Grow key={i} in={true} timeout={i * 500}>
              <Box sx={{ border: borderStyle, borderRadius: 2, width: '100%' }}>{paper}</Box>
            </Grow>
          );
        })}
      </Box>
    </Box>
  );
};

export default Summary;
