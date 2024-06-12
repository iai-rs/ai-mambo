import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Role } from "@prisma/client";

const RoleEnum = z.nativeEnum(Role);

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

  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.users.findUnique({
        where: {
          id: input.id, // Assuming 'input' is the id passed to the query
        },
      });
    }),

  addUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        change_password_secret_key: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.users.create({
        data: {
          id: input.id,
          name: input.name,
          password: "",
          email: input.email,
          change_password_secret_key: input.change_password_secret_key,
        },
      });
    }),

  deleteUserById: publicProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const deletedUser = await ctx.db.users.delete({
            where: {
                id: input.id,
            },
        });

        return deletedUser;
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

  updateUserRole: publicProcedure
    .input(
      z.object({
        id: z.string(),
        role: RoleEnum,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.users.update({
        where: { id: input.id },
        data: {
          role: input.role,
        },
      });

      return updatedUser;
    }),
});
