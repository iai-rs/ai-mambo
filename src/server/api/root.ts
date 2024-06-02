import { biradsRouter, minioRouter } from "~/server/api/routers/minio";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { metadataRouter } from "./routers/metadata";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  birads: biradsRouter,
  minio: minioRouter,
  users: usersRouter,
  metadata: metadataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
