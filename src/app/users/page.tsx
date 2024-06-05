import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import InviteUserForm from "../register/components/invite-user-form";
import { auth } from "~/auth";
import { Role } from "@prisma/client";
import User from "./components/User";

export const metadata: Metadata = {
  title: "Users",
};

export default async function Users() {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail)
    return <div>No user</div>
  const user = await api.users.getUserByEmail({email: userEmail});
  const userRole = user?.role;
  if (!userRole || userRole !== Role.ADMIN) {
    return <div>You are not allowed to access this page</div>
  }

  const users = await api.users.getUsers();

  return (
    <main className="">
        <InviteUserForm />
        <hr/>
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
                {users.map(user => (
                    <User user={{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }}/>
                ))}
            </tbody>
        </table>
    </main>
  );
}
