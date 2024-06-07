import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import InviteUserForm from "../register/components/invite-user-form";
import { auth } from "~/auth";
import { Role } from "@prisma/client";
import Users from "./components/Users";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersServer() {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) return <div>No user</div>;
  const user = await api.users.getUserByEmail({ email: userEmail });
  const userRole = user?.role;
  if (!userRole || userRole !== Role.ADMIN) {
    return <div>You are not allowed to access this page</div>;
  }

  const users = await api.users.getUsers();
  const usersWithFilteredData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return (
    <main className="">
      <InviteUserForm />
      <hr />
      <h1>List of users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete user</th>
          </tr>
        </thead>
        <tbody>
          <Users users={usersWithFilteredData} />
        </tbody>
      </table>
    </main>
  );
}
