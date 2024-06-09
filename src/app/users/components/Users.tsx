"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import User from "./User";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { sort } from "fast-sort";

interface Props {
  users: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }[];
}

export default function Users({ users }: Props) {
  const searchParams = useSearchParams();
  const [usersState, setUsers] = useState(users);

  const onDelete = (userId: string) => {
    setUsers((currentUsers) => {
      const newUsers = currentUsers.filter((user) => user.id !== userId);
      return newUsers;
    });
  };

  useEffect(() => {
    const sortOrder = searchParams.toString().slice(10);
    setUsers((currentUsers) => {
      if (sortOrder === "role") {
        users = sort(currentUsers).asc((user) => user.role);
      } else if (sortOrder === "email") {
        users = sort(currentUsers).asc((user) => user.email);
      } else {
        users = sort(currentUsers).asc((user) => user.name.toLowerCase());
      }
      return users;
    });
  }, [searchParams]);

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
