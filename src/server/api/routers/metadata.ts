import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { subDays, format } from "date-fns";

export const metadataRouter = createTRPCRouter({
  getMetadata: publicProcedure.query(async ({ ctx }) => {
    const metadata = await ctx.db.dicomMetadata.findMany();

    return metadata.map((item) => {
      return {
        name: item.patient_name?.replace("^", " "),
        jmbg: item.patient_id,
        id: item.mammography_id,
      };
    });
  }),

  getMetadataDays: publicProcedure
    .input(
      z.object({
        days: z.number().min(0).default(7), // Default to 7 days if not provided
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get current date
      const today = new Date();
      // Get date `input.days` days ago
      const pastDate = subDays(today, input.days);

      // Format dates as 'YYYYMMDD'
      const formatDate = (date: Date) => format(date, "yyyyMMdd");

      const todayStr = formatDate(today);
      const pastDateStr = formatDate(pastDate);

      // Query using Prisma
      const metadata = await ctx.db.dicomMetadata.findMany({
        where: {
          acquisition_date: {
            gte: pastDateStr,
            lte: todayStr,
          },
        },
      });

      return metadata;
    }),
});
