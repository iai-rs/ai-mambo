import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const biradsRouter = createTRPCRouter({
  getBiradsResults: publicProcedure.query(({ ctx }) => {
    return ctx.db.biradsResults.findMany();
  }),
});
