import { env } from '@/env.mjs';
import { bigIntToString } from '@/lib/toString';
import { nodeDataProps } from '@/utils/parsePath';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

type analysisTable = {
  TableName: string;
  ColumnName: string;
  DataType: string;
  Kn: number;
  N: number;
  Position: number;
  Ratio: number;
};

export interface analysisResult {
  dimension: analysisTable[];
  measure: analysisTable[];
}

export const analysisRouter = createTRPCRouter({
  columnAnalysis: publicProcedure.input(z.number().nullish()).query(async ({ input, ctx }) => {
    if (input === undefined) return [];
    await ctx.prisma.$queryRaw`EXEC RawDB.dbo.sp_dimension_measure_analysis ${input}`;
    const dimension = `RawDB.dbo.vd_D${input}_Dimension`;
    const measure = `RawDB.dbo.vd_D${input}_Measure`;
    const vd_dimension = await ctx.prisma.$queryRawUnsafe<analysisTable[]>(`SELECT * FROM ${dimension}`);
    const vd_measure = await ctx.prisma.$queryRawUnsafe<analysisTable[]>(`SELECT * FROM ${measure}`);
    const result: analysisResult = {
      dimension: vd_dimension,
      measure: vd_measure,
    };
    return result;
  }),
  decisionTreeAnalysis: publicProcedure
    .input(
      z.object({
        oid: z.number().optional(),
        target: z.string().optional(),
        features: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!(input.oid && input.target && input.features)) return [];
      const result = await fetch(
        `${env.FLASK_URL}/api/decisionTree?` +
          `oid=${input.oid}` +
          `&target=${input.target}` +
          `&features=${input.features}`,
      );
      const graph = await result.json();
      return graph;
    }),
  getTableName: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return undefined;
    const tableName = await ctx.prisma.object.findFirst({
      select: { CName: true },
      where: { OID: input },
    });
    return tableName;
  }),
  getColumnDistinctValue: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return undefined;
    const columnDistinctValue = `RawDB.dbo.D${input}_ColDistinctValue`;
    const result = await ctx.prisma.$queryRawUnsafe<{ value: string }[]>(`SELECT * FROM ${columnDistinctValue}`);
    return result[0];
  }),
  getSplitDataFromPath: publicProcedure
    .input(
      z.object({
        oid: z.number().nullish(),
        target: z.string().nullish(),
        decisionTreePath: z.object({
          path: z.array(z.number()).nullish(),
          nodeLabel: z.record(z.string(), z.array(z.string())).nullish(),
        }),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!(input.decisionTreePath.path && input.decisionTreePath.nodeLabel && input.oid && input.target)) return [];

      const path = input.decisionTreePath.path;
      const nodeLabel = input.decisionTreePath.nodeLabel;

      let currentQueryWhere = '';
      let nodeData: nodeDataProps = {};

      for (let i = 0; i + 1 < path.length; i++) {
        const feature = nodeLabel[path[i]][0];
        const condition1 = nodeLabel[path[i]][1];
        const condition2 = nodeLabel[path[i]][2];
        const query = `
          select * from
          (
            select "${feature}", "${input.target}" from RawDB.dbo.D${input.oid}
            where
            ${condition2} ${currentQueryWhere}
          ) as t
          pivot (
            sum("${input.target}")
            for ${condition1}
          ) as p
        `;
        currentQueryWhere += ' and ' + condition2;
        const data = await ctx.prisma.$queryRawUnsafe<Object[]>(query);
        const convertedData = data.map((obj) => bigIntToString(obj));
        nodeData[path[i + 1]] = convertedData as Object[];
      }
      return nodeData;
    }),
});
