"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { changeUserRole, deleteUser } from "~/app/lib/actions";
import { api } from "~/trpc/react";
import User from "./User";

interface Props {
  users: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }[];
}

export default function Users({ users }: Props) {
  const getUsersQuery = api.users.getUsers.useQuery();
  const [usersState, setUsers] = useState(users);

  const onDelete = (userId: string) => {
    setUsers((currentUsers) => {
      const newUsers = currentUsers.filter((user) => user.id !== userId);
      return newUsers;
    });
  };

  return (
    <>
      {usersState.map((user) => (
        <User
          key={user.id}
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
