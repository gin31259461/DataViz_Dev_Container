'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { useUserStore } from '@/hooks/store/useUserStore';
import { trpc } from '@/server/trpc';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useMemo } from 'react';
import AutoCompleteSelect from '../../../components/Select/AutoCompleteSelect';
import ObjectTable from '../../../components/Table/ObjectTable';

export default function SelectData() {
  const mid = useUserStore((state) => state.mid);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setDataOID = useProjectStore((state) => state.setDataOID);
  const clear = useProjectStore((state) => state.clear);
  const allData = trpc.dataObject.getAllUserData.useQuery(mid);
  const userDataTable = trpc.dataObject.getTop100FromDataTable.useQuery(selectedDataOID);
  const dataTableCount = trpc.dataObject.getCountFromDataTable.useQuery(selectedDataOID);

  const handleSelectChange = (value: string) => {
    if (allData.isSuccess) {
      clear();
      setDataOID(Number(value.split('.')[0]));
    }
  };

  const dataTableInfo = useMemo(() => {
    return (
      <Typography sx={{ padding: 2 }} variant="h6">
        Total row : <strong>{dataTableCount.data}</strong>, only show top <strong>100</strong> row
      </Typography>
    );
  }, [dataTableCount]);

  return (
    <Box
      sx={{
        overflowY: 'auto',
        padding: 2,
        width: '100%',
      }}
    >
      <AutoCompleteSelect
        options={
          allData.data
            ?.sort((a, b) => {
              return b.OID - a.OID;
            })
            .map((d, i) => d.OID.toString() + '. ' + d.CName) ?? []
        }
        initialValueIndex={allData.data?.findIndex((d) => d.OID == selectedDataOID) ?? 0}
        onChange={handleSelectChange}
        loading={allData.isLoading}
      ></AutoCompleteSelect>
      {selectedDataOID !== -1 && userDataTable.isLoading && <LinearProgress color="info" sx={{ top: 10 }} />}
      {userDataTable.data && userDataTable.data.length > 0 && (
        <div>
          {dataTableInfo}
          <ObjectTable headerID="selected-data-table" data={userDataTable.data} />
        </div>
      )}
    </Box>
  );
}
