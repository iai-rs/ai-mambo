import { type Metadata } from "next";
import { api } from "~/trpc/server";
import InviteUserForm from "./components/invite-user-form";
import { auth } from "~/auth";
import { Role } from "@prisma/client";
import Users from "./components/Users";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

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
    <main className="container mt-4 flex flex-col gap-4">
      <Breadcrumb className="mt-2 font-bold">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Početna</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lista korisnika</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap">
        <InviteUserForm />
        <Users users={usersWithFilteredData} />
      </div>
    </main>
  );
}
