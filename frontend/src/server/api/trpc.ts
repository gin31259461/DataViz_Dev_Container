import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db';

type Context = inferAsyncReturnType<typeof createContext>;

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return createContext();
};

const t = initTRPC.context<Context>().create();

export const createContext = async (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;

  return {
    req,
    res,
    prisma,
  };
};

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
