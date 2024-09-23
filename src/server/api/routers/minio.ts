import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "../../../env";
import { Client } from "minio";

import { z } from "zod";

export const biradsRouter = createTRPCRouter({
  getBiradsResults: publicProcedure.query(({ ctx }) => {
    return ctx.db.biradsResults.findMany();
  }),
});

// Initialize MinIO Client
const minioClient = new Client({
  endPoint:
    env.MINIO_ENDPOINT ||
    "Set endpoint, accessKey and secretKey in order to use minio client",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY || "",
  secretKey: env.MINIO_SECRET_KEY || "",
});

// MinIO tRPC router
export const minioRouter = createTRPCRouter({
  getMinio: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const expiry = 24 * 60 * 60; // URL valid for 1 day
      const url = await minioClient.presignedGetObject(
        "firstbucket",
        input,
        expiry,
      );
      return { url };
    } catch (error) {
      throw new Error("Failed to generate signed URL: " + String(error));
    }
  }),
  getMinioHeat: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const expiry = 24 * 60 * 60; // URL valid for 1 day
      const url = await minioClient.presignedGetObject(
        "heatmaps",
        input,
        expiry,
      );
      return { url };
    } catch (error) {
      throw new Error("Failed to generate signed URL: " + String(error));
    }
  }),
});
