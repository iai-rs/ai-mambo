import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { type MetadataResponse } from "~/types";
import { parseMetadata } from "~/utils/parseMetadata";

export const metadataRouter = createTRPCRouter({
  getMetadataByDateAndPatientId: publicProcedure
    .input(
      z.object({
        patient_id: z.string(),
        acquisition_date: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const metadata = await ctx.db.dicomMetadata.findMany({
        where: {
          acquisition_date: input.acquisition_date,
          patient_id: input.patient_id,
        },
        include: {
          biradsResults: {
            include: {
              feedback: true,
            },
          }, // Include related data from biradsResults if necessary
        },
      });

      if (!metadata) {
        throw new Error("Metadata not found");
      }

      return metadata.map((m) => parseMetadata(m));
    }),

  getMetadataByRange: publicProcedure
    .input(
      z.object({
        gte: z.string().optional(), // start date (optional, can be ignored)
        lte: z.string().optional(), // end date (optional, can be ignored)
        patient_id: z.string().optional(), // JMBG
        patient_name: z.string().optional(),
        laterality: z.enum(["L", "R"]).optional(),
        institution: z.string().optional(),
        limit: z.number().optional(), // Number of items to fetch
        sort: z.enum(["asc", "desc"]).optional().default("desc"), // Sorting order
      }),
    )
    .query(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: Record<string, any> = {};

      // If time range filters (gte/lte) are provided, add them to the where clause
      if (input.gte || input.lte) {
        whereClause.acquisition_date = {
          ...(input.gte && { gte: input.gte }),
          ...(input.lte && { lte: input.lte }),
        };
      }

      // Filter by patient ID if provided
      if (input.patient_id) {
        whereClause.patient_id = input.patient_id;
      }

      // Filter by laterality if provided
      if (input.laterality) {
        whereClause.laterality = input.laterality;
      }

      // Filter by institution with case-insensitive search
      if (input.institution) {
        whereClause.institution = {
          contains: input.institution,
          mode: "insensitive", // Case-insensitive search
        };
      }

      // Filter by patient name with normalization for NAME^SURNAME and SURNAME^NAME formats
      if (input.patient_name) {
        const names = input.patient_name
          .split(" ")
          .map((name) => name.toUpperCase());
        if (names.length === 2) {
          const [name1, name2] = names;
          whereClause.OR = [
            { patient_name: { contains: `${name1}^${name2}` } },
            { patient_name: { contains: `${name2}^${name1}` } },
          ];
        } else {
          // Fallback for single name or other formats
          whereClause.patient_name = {
            contains: names.join("^"),
          };
        }
      }

      // Fetch metadata with the specified filters, sort order, and limit
      const metadata = await ctx.db.dicomMetadata.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined, // Ignore filters if none are provided
        include: {
          biradsResults: {
            include: {
              feedback: true,
            },
          },
        },
        orderBy: {
          acquisition_date: input.sort, // Sort by acquisition_date
        },
        take: input.limit ?? 1000, // Default to 1000 items if no limit is provided
      });
      console.log("metadata", metadata);

      // Group metadata by patient ID and acquisition date
      const groupedMetadata = metadata.reduce<Record<string, MetadataResponse>>(
        (acc, item) => {
          const key = `${item.patient_id}-${item.acquisition_date}`;
          if (!acc[key]) {
            acc[key] = {
              patientName: item.patient_name?.replace("^", " "),
              patientId: item.patient_id,
              institution: item.institution,
              acquisitionDate: item.acquisition_date,
              manufacturer: item.manufacturer,
              manufacturerModel: item.manufacturer_model,
              modelResult: item.biradsResults?.model_1_result
                ? Number(item.biradsResults.model_1_result)
                : 0,
              records: [],
            };
          } else {
            const currentMaxResult = acc[key]?.modelResult ?? 0;
            const newResult = item.biradsResults?.model_1_result
              ? Number(item.biradsResults.model_1_result)
              : 0;
            if (newResult > currentMaxResult) {
              acc[key]!.modelResult = newResult;
            }
          }

          // Add the current item to the records array
          acc[key]?.records.push(parseMetadata(item));

          return acc;
        },
        {},
      );

      // Convert the grouped metadata object into an array
      const result = Object.values(groupedMetadata);

      return result;
    }),
});
