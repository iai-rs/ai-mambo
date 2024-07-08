/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// server/routers/feedback.ts (assuming you have this file or similar)

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc"; // Adjust the import based on your setup
import { birads_classification } from "@prisma/client";

export const feedbackRouter = createTRPCRouter({
  createFeedback: publicProcedure
    .input(
      z.object({
        study_uid: z.string(),
        suspect_lesion: z.boolean(),
        shadow: z.boolean(),
        microcalcifications: z.boolean(),
        symmetry: z.boolean(),
        architectonics: z.boolean(),
        birads_class: z.enum([
          birads_classification.birads_0,
          birads_classification.birads_1,
          birads_classification.birads_2,
          birads_classification.birads_3,
          birads_classification.birads_4a,
          birads_classification.birads_4b,
          birads_classification.birads_4c,
          birads_classification.birads_5,
          birads_classification.birads_6,
        ]),
        user_email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.biradsFeedback.create({
        data: {
          study_uid: input.study_uid,
          suspect_lesion: input.suspect_lesion,
          shadow: input.shadow,
          microcalcifications: input.microcalcifications,
          symmetry: input.symmetry,
          architectonics: input.architectonics,
          birads_class: input.birads_class as birads_classification,
          user_email: input.user_email,
        },
      });
    }),
  updateFeedback: publicProcedure
    .input(
      z.object({
        id: z.number(), // Assuming you have an `id` field to uniquely identify the record
        study_uid: z.string(),
        suspect_lesion: z.boolean(),
        shadow: z.boolean(),
        microcalcifications: z.boolean(),
        symmetry: z.boolean(),
        architectonics: z.boolean(),
        birads_class: z.enum([
          birads_classification.birads_0,
          birads_classification.birads_1,
          birads_classification.birads_2,
          birads_classification.birads_3,
          birads_classification.birads_4a,
          birads_classification.birads_4b,
          birads_classification.birads_4c,
          birads_classification.birads_5,
          birads_classification.birads_6,
          birads_classification.na,
        ]),
        user_email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.biradsFeedback.update({
        where: {
          id: input.id, // Use the unique identifier for the update
        },
        data: {
          study_uid: input.study_uid,
          suspect_lesion: input.suspect_lesion,
          shadow: input.shadow,
          microcalcifications: input.microcalcifications,
          symmetry: input.symmetry,
          architectonics: input.architectonics,
          birads_class: input.birads_class as birads_classification,
          user_email: input.user_email,
          createdAt: new Date(),
        },
      });
    }),
});

// Include the feedbackRouter in your main router file
