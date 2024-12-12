/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// server/routers/feedback.ts (assuming you have this file or similar)

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc"; // Adjust the import based on your setup
import { birads_classification } from "@prisma/client";

export const feedbackRouter = createTRPCRouter({
  getFeedbackByUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const feedback = await ctx.db.biradsFeedback.findMany({
        where: {
          user_email: input.userEmail,
        },
        include: {
          biradsResults: {
            include: {
              dicomMetadata: {
                select: {
                  patient_name: true, // Include patient_name from DicomMetadata
                },
              },
            },
          },
        },
      });

      if (!feedback || feedback.length === 0) {
        throw new Error("No feedback found for this user");
      }

      const uniquePatients = new Set(
        feedback
          .map((item) => item.biradsResults?.dicomMetadata?.patient_name)
          .filter((name) => name !== null && name !== undefined),
      );

      return { feedback, uniquePatientCount: uniquePatients.size };
    }),

  getAllUsersWithResults: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.users.findMany({});

    const feedback = await ctx.db.biradsFeedback.findMany({
      include: {
        biradsResults: {
          include: {
            dicomMetadata: {
              select: {
                patient_name: true, // Include patient_name
              },
            },
          },
        },
      },
    });

    const userResults = users.map((user) => {
      // Filter feedback for the current user
      const userFeedback = feedback.filter(
        (entry) => entry.user_email === user.email,
      );

      // Extract unique patient names
      const uniquePatients = new Set(
        userFeedback
          .map((entry) => entry.biradsResults?.dicomMetadata?.patient_name)
          .filter((name) => name !== null && name !== undefined), // Exclude null/undefined names
      );

      return {
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER", // Default to 'USER' if role is undefined
        feedback: userFeedback.map((entry) => ({
          study_uid: entry.study_uid || "",
          suspect_lesion: entry.suspect_lesion ?? false,
          shadow: entry.shadow ?? false,
          microcalcifications: entry.microcalcifications ?? false,
          symmetry: entry.symmetry ?? false,
          architectonics: entry.architectonics ?? false,
          birads_class: entry.birads_class || "na", // Default to 'na' if undefined
          createdAt: new Date(entry.createdAt || new Date()),
          biradsResults: entry.biradsResults
            ? {
                study_uid: entry.biradsResults.study_uid || "",
                model_1_result: entry.biradsResults.model_1_result || "0",
                patient_name:
                  entry.biradsResults.dicomMetadata?.patient_name || "", // Include patient_name
              }
            : { study_uid: "", model_1_result: "0", patient_name: "" },
        })),
        patientCount: uniquePatients.size, // Add patient count
      };
    });

    return userResults;
  }),

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
