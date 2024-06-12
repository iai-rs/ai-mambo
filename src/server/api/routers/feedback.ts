/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// server/routers/feedback.ts (assuming you have this file or similar)

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc"; // Adjust the import based on your setup
import { type birads_classification } from "@prisma/client";

export const feedbackRouter = createTRPCRouter({
  addFeedback: publicProcedure
    .input(
      z.object({
        study_uid: z.string(),
        suspect_lesion: z.boolean(),
        shadow: z.boolean(),
        microcalcifications: z.boolean(),
        symmetry: z.boolean(),
        architectonics: z.boolean(),
        birads_class: z.enum(["1", "2", "3", "4a", "4b", "4c", "5", "6"]),
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
});

// Include the feedbackRouter in your main router file
