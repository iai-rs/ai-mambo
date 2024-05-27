import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.users.findMany();
  }),

  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.users.findUnique({
        where: {
          email: input.email, // Assuming 'input' is the email passed to the query
        },
      });
    }),

  addUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        password: z.string(),
        email: z.string().email(),
        change_password_secret_key: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.users.create({
        data: {
          id: input.id,
          name: input.name,
          password: input.password,
          email: input.email,
          change_password_secret_key: input.change_password_secret_key,
        },
      });
    }),

  updateUserPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update the user's password
      const updatedUser = await ctx.db.users.update({
        where: { email: input.email },
        data: {
          password: input.newPassword,
          change_password_secret_key: null,
        },
      });

      return updatedUser;
    }),
});
