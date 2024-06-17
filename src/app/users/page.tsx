import { type Metadata } from "next";
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
    <main className="mt-4 flex flex-wrap justify-center gap-4">
      <InviteUserForm />
      <Users users={usersWithFilteredData} />
    </main>
    // <main className="grid grid-cols-12 gap-4">
    //   <div className="col-span-4 bg-gray-200 p-4">
    //     <InviteUserForm />
    //   </div>

    //   <div className="bg-bacground col-span-8 w-full p-4">
    //     <Users users={usersWithFilteredData} />
    //   </div>
    // </main>
  );
}
