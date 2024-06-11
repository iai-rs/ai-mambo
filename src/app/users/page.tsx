import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import InviteUserForm from "./components/invite-user-form";
import { auth } from "~/auth";
import { Role } from "@prisma/client";
import Users from "./components/Users";
import { notFound } from "next/navigation";

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
    notFound();
  }

  const users = await api.users.getUsers();
  const usersWithFilteredData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return (
    <main className="grid grid-cols-12 gap-4">
      <div className="col-span-4 bg-gray-200 p-4">
        <InviteUserForm />
      </div>

      <div className="col-span-8 w-full bg-gray-200 p-4">
        <Users users={usersWithFilteredData} />

        {/*
        <table className="w-full">
          <thead>
            <tr>
              <th>
                <Link href="/users?sortOrder=name">Name</Link>
              </th>
              <th>
                <Link href="/users?sortOrder=email">Email</Link>
              </th>
              <th>
                <Link href="/users?sortOrder=role">Role</Link>
              </th>
              <th>Delete user</th>
            </tr>
          </thead>
          <tbody>
            <Users users={usersWithFilteredData} />
          </tbody>
        </table>
  */}
      </div>
    </main>
  );
}
