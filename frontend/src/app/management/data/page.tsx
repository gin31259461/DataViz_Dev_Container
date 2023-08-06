import Dashboard from '@/components/Dashboard';
import Loader from '@/components/Loading/Loader';
import { env } from '@/env.mjs';
import { Suspense } from 'react';
import { DataPanel } from './DataPanel';

export default function DataPage() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Dashboard>
          <div style={{ width: '100%' }}>
            <Suspense fallback={<Loader />}>
              <DataPanel flaskServer={env.FLASK_URL}></DataPanel>
            </Suspense>
          </div>
        </Dashboard>
      </Suspense>
    </div>
  );
}
