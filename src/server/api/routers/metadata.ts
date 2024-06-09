import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { type PatientData } from "~/types";

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

  getMetadataById: publicProcedure
    .input(
      z.object({
        mammography_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const metadata = await ctx.db.dicomMetadata.findUnique({
        where: {
          mammography_id: input.mammography_id,
        },
        include: {
          biradsResults: true, // Include related data from biradsResults if necessary
        },
      });

      if (!metadata) {
        throw new Error("Metadata not found");
      }

      return {
        patientName: metadata.patient_name?.replace("^", " "),
        patientId: metadata.patient_id,
        id: metadata.mammography_id,
        acquisitionDate: metadata.acquisition_date,
        laterality: metadata.laterality,
        implant: metadata.implant,
        institution: metadata.institution,
        manufacturer: metadata.manufacturer,
        manufacturerModel: metadata.manufacturer_model,
        modelResult: metadata.biradsResults?.model_1_result, // Include model_1_result from biradsResults
        view: metadata.view,
      } as PatientData;
    }),

  getMetadataByRange: publicProcedure
    .input(
      z.object({
        gte: z.string().optional(), // start date
        lte: z.string(), // end date
        patient_id: z.string().optional(), // JMBG
        patient_name: z.string().optional(),
        laterality: z.enum(["L", "R"]).optional(),
        institution: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: Record<string, any> = {};

      whereClause.acquisition_date = {
        gte: input.gte,
        lte: input.lte,
      };

      if (input.patient_id) {
        whereClause.patient_id = input.patient_id;
      }
      if (input.laterality) {
        whereClause.laterality = input.laterality;
      }
      if (input.institution) {
        whereClause.institution = {
          contains: input.institution,
        };
      }
      if (input.patient_name) {
        whereClause.patient_name = {
          contains: input.patient_name.toUpperCase(),
        };
      }

      const metadata = await ctx.db.dicomMetadata.findMany({
        where: whereClause,
        include: {
          biradsResults: true, // Include related data from biradsResults
        },
      });

      return metadata.map((item) => {
        return {
          patientName: item.patient_name?.replace("^", " "),
          patientId: item.patient_id,
          id: item.mammography_id,
          acquisitionDate: item.acquisition_date,
          laterality: item.laterality,
          implant: item.implant,
          institution: item.institution,
          manufacturer: item.manufacturer,
          manufacturerModel: item.manufacturer_model,
          modelResult: item.biradsResults?.model_1_result, // Include model_1_result from biradsResults
          view: item.view,
        } as PatientData;
      });
    }),
});
