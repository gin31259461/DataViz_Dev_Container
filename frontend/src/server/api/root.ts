import { createTRPCRouter } from '@/server/api/trpc';
import { analysisRouter } from './routers/analysis';
import { userRouter } from './routers/user';
import { dataObjectRouter } from './routers/user-data';

export const appRouter = createTRPCRouter({
  dataObject: dataObjectRouter,
  analysis: analysisRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
