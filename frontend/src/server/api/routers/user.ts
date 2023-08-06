import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export interface CreateUserProps {
  name: string;
  email: string;
  emailVerified: string;
  image: string;
}

export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const AccountZodSchema = z.record(z.unknown()).and(
  z.object({
    access_token: z.string().optional(),
    token_type: z.string().optional(),
    id_token: z.string().optional(),
    refresh_token: z.string().optional(),
    scope: z.string().optional(),
    expires_at: z.number().optional(),
    session_state: z.string().optional(),
    providerAccountId: z.string(),
    userId: z.string().optional(),
    provider: z.string(),
    type: z.union([z.literal('oauth'), z.literal('email'), z.literal('credentials')]),
  }),
);

export const userRouter = createTRPCRouter({
  isEmailUsed: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const member = await ctx.prisma.member.findUnique({
      select: {
        EMail: true,
      },
      where: {
        EMail: input,
      },
    });

    if (member?.EMail) return false;
    return true;
  }),
  isUserNameUsed: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.member.findUnique({
      select: {
        Account: true,
      },
      where: {
        Account: input,
      },
    });

    if (user?.Account) return false;
    return true;
  }),
  enable: publicProcedure
    .input(
      z
        .object({
          username: z.string(),
          email: z.string(),
          MID: z.number(),
        })
        .optional(),
    )
    .mutation(async ({ input, ctx }) => {
      if (!input) return;

      await ctx.prisma.member.update({
        data: {
          Account: input.username,
          Valid: true,
          EMail: input.email,
        },
        where: {
          MID: input.MID,
        },
      });

      return;
    }),
  unLinkAccount: publicProcedure
    .input(
      z.object({
        MID: z.number(),
        provider: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        select: {
          providerAccountId: true,
        },
        where: {
          MID: input.MID,
          provider: input.provider,
        },
      });

      if (!account?.providerAccountId) return;

      await ctx.prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider: input.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });
    }),
  getLinkedAccount: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (!input) return [];

    const res = await ctx.prisma.account.findMany({
      select: {
        provider: true,
      },
      where: {
        MID: input,
      },
    });

    return res;
  }),
});
