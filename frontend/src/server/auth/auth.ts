import { env } from '@/env.mjs';
import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../db';
import { I3SPrismaAdapter } from './I3SPrismaAdapter';
import WKESSOProvider from './WKESSOProvider';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    // ...other properties
    // role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    newUser: '/management/profile',
  },
  callbacks: {
    session: async ({ session, user }) => {
      const member = await prisma.member.findUnique({
        select: {
          Account: true,
        },
        where: {
          EMail: user.email,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: member?.Account,
        },
      };
    },
    signIn: async ({ user, account }) => {
      const signedAccount = await prisma.account.findUnique({
        select: {
          provider: true,
          providerAccountId: true,
        },
        where: {
          provider_providerAccountId: {
            provider: account?.provider ?? '',
            providerAccountId: account?.providerAccountId ?? '',
          },
        },
      });

      const signedMember = await prisma.member.findUnique({
        select: {
          MID: true,
          Account: true,
          EMail: true,
          Valid: true,
        },
        where: {
          EMail: user.email ?? '',
        },
      });

      const loggedInMember = await prisma.mSession.findFirst({
        select: {
          SID: true,
          MID: true,
        },
        where: {
          MID: signedMember?.MID,
          ExpiredDT: {
            gt: new Date(),
          },
        },
      });

      if (!signedMember || loggedInMember) return true;
      else if (!signedAccount && account) {
        const obj = await prisma.object.create({
          data: {
            Type: 2,
            CName: user.name,
            Member: {
              create: {
                Valid: false,
                Status: 1,
                Image: user.image,
              },
            },
          },
          select: {
            OID: true,
          },
        });

        await prisma.account.create({
          data: {
            MID: obj.OID,
            ...account,
          },
        });
        return `/signup?provider=${account?.provider}&username=${signedMember.Account}&email=${signedMember.EMail}&MID=${obj.OID}`;
      } else if (signedAccount && !signedMember.Valid) {
        return `/signup?provider=${account?.provider}&MID=${signedMember.MID}`;
      }

      return true;
    },
  },
  adapter: I3SPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 5000,
      },
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    WKESSOProvider({
      clientId: env.WKESSO_CLIENT_ID,
      clientSecret: env.WKESSO_CLIENT_SECRET,
    }),
  ],
};
