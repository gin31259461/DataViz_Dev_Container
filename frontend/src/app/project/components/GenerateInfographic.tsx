'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { trpc } from '@/server/trpc';
import { Pie } from '@D3Chart';
import { Typography } from '@mui/material';
import LoadingWithTitle from '../../../components/Loading/LoadingWithTitle';
import TabSlider, { TabItem } from '../../../components/Slider/TabSlider';

const GenerateInfographic = () => {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const selectedPath = useProjectStore((state) => state.selectedPath);
  const nodes = trpc.analysis.getSplitDataFromPath.useQuery({
    oid: selectedDataOID,
    target: target,
    decisionTreePath: {
      path: selectedPath?.path,
      nodeLabel: selectedPath?.nodeLabel,
    },
  });

  const infographic: TabItem[] = [];
  let currentNode: number;

  selectedPath?.path.forEach((node, i) => {
    if (!nodes.data) return;
    else if (i == 0) {
      currentNode = node;
      return;
    }

    const distribution = selectedPath.nodeLabel[node][selectedPath.nodeLabel[node].length - 1]
      .replace(/[\[\],]/g, '')
      .split(' ')
      .slice(2);

    console.log(distribution);

    // const nodeData = nodes.data[node];
    // const xyData = objectToXYData(nodeData[0]);
    const data = [
      { x: '低', y: Number(distribution[0]) },
      { x: '中', y: Number(distribution[1]) },
      { x: '高', y: Number(distribution[2]) },
    ];

    infographic.push({
      label: node.toString(),
      content: (
        <div key={node} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Pie
            data={data}
            mapper={{
              getX: (d: any) => d.x,
              getY: (d: any) => d.y,
            }}
            base={{
              width: 1000,
              height: 500,
              color: undefined,
            }}
          />
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
            {selectedPath.nodeLabel[currentNode] && selectedPath.nodeLabel[currentNode][1]}
          </Typography>
        </div>
      ),
    });
    currentNode = node;
  });

  return nodes.isLoading ? (
    <LoadingWithTitle title="Generating infographic" />
  ) : (
    <TabSlider tabs={infographic}></TabSlider>
  );
};

export default GenerateInfographic;
