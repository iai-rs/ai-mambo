import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "../../../env";
import { Client } from "minio";
import { z } from "zod";

export const biradsRouter = createTRPCRouter({
  getBiradsResults: publicProcedure.query(({ ctx }) => {
    return ctx.db.biradsResults.findMany();
  }),
});

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.users.findMany();
  }),

  getUserByEmail: publicProcedure.input(z.object({
    email: z.string().email()
  }))
  .query(({ ctx, input }) => {
    return ctx.db.users.findUnique({
      where: {
        email: input.email // Assuming 'input' is the email passed to the query
      }
    });
  }),

  addUser: publicProcedure.input(z.object({
    id: z.string(),
    name: z.string(),
    password: z.string(),
    email: z.string().email()
  }))
  .mutation(({ ctx, input }) => {
    return ctx.db.users.create({
      data: {
        id: input.id,
        name: input.name,
        password: input.password,
        email: input.email
      }
    })
  })
});

// pages/api/getImage.js

const temp_img =
  "DXm.1.2.276.0.7230010.3.1.2.1834151193.3620.1690353389.855.2.1";

// Initialize MinIO Client
const minioClient = new Client({
  // endPoint: "127.0.0.1",
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: env.MINI_ACCESS_KEY,
  secretKey: env.MINI_SECRET_KEY,
});

// MinIO tRPC router
export const minioRouter = createTRPCRouter({
  getMinio: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const expiry = 24 * 60 * 60; // URL valid for 1 day
      const url = await minioClient.presignedGetObject(
        "firstbucket",
        input,
        // temp_img,
        expiry,
      );
      return { url };
    } catch (error) {
      console.log("HOJOOOOOO", error);
      throw new Error("Failed to generate signed URL");
    }
  }),
});
