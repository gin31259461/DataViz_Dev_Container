'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { roundNumberToDecimalPlaces } from '@/lib/math';
import { trpc } from '@/server/trpc';
import { parsePath } from '@/utils/parsePath';
import { FormControlLabel, Radio } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import LoadingWithTitle from '../../../components/Loading/LoadingWithTitle';
import PathTable from './PathTable';

export default function PathAnalysis() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const graph = trpc.analysis.decisionTreeAnalysis.useQuery({
    oid: selectedDataOID,
    target: target,
    features: features,
  });
  const paths = parsePath(graph.data).sort((a, b) => a.path.length - b.path.length);
  const setPathID = useProjectStore((state) => state.setPathID);
  const setPath = useProjectStore((state) => state.setPath);
  const selectedPathID = useProjectStore((state) => state.selectedPathID);

  const [ratioChecked, setRatioChecked] = useState<string | undefined>(selectedPathID);

  const handleRatioChange = (value: string, event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setRatioChecked(value);
      setPathID(value);
      setPath(paths[Number(value)]);
    }
  };

  const columns = ['ID', '路徑長度', '目標分布 (低)', '目標分布 (中間)', '目標分布 (高)', '選擇路徑'];

  const rows = paths.map((o, i) => {
    return [
      i,
      o.path.length,
      roundNumberToDecimalPlaces(o.targetValueDistribution.low, 2) * 100,
      roundNumberToDecimalPlaces(o.targetValueDistribution.medium, 2) * 100,
      roundNumberToDecimalPlaces(o.targetValueDistribution.high, 2) * 100,
      <FormControlLabel
        key={i}
        control={
          <Radio
            onChange={(event, checked) => handleRatioChange(i.toString(), event, checked)}
            checked={ratioChecked == i.toString()}
            color="info"
          />
        }
        label=""
      ></FormControlLabel>,
    ];
  });

  return graph.isLoading ? (
    <LoadingWithTitle title="Analyzing data"></LoadingWithTitle>
  ) : (
    <PathTable columns={columns} rows={rows} paths={paths}></PathTable>
  );
}
