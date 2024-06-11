"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import User from "./User";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { sort } from "fast-sort";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import clsx from "clsx";

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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [usersState, setUsers] = useState(users);
  let sortByNameAscending = true;

  const onDelete = (userId: string) => {
    setUsers((currentUsers) => {
      const newUsers = currentUsers.filter((user) => user.id !== userId);
      return newUsers;
    });
  };

  const sortUsersBy = (sortOrder: string) => {
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
  };

  useEffect(() => {
    const sortOrder = searchParams.toString().slice(10);
    sortUsersBy(sortOrder);
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

  useEffect(() => {
    setUsers((currentUsers) => {
      const sortedUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return sortedUsers;
    });
    const sortOrder = searchParams.toString().slice(10);
    sortUsersBy(sortOrder);
  }, [searchTerm]);

  const handleClickName = () => {
    setUsers((currentUsers) => {
      return sort(currentUsers).asc((user) => user.name.toLowerCase());
    });
  };

  const handleClickEmail = () => {
    setUsers((currentUsers) => {
      return sort(currentUsers).asc((user) => user.email.toLowerCase());
    });
  };

  const handleClickRole = () => {
    setUsers((currentUsers) => {
      return sort(currentUsers).asc((user) => user.role.toLowerCase());
    });
  };

  return (
    <>
      <h1>List of users:</h1>
      <Input
        type="text"
        placeholder="Search users by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      ></Input>
      <br />
      <table className="w-full">
        <thead>
          <tr>
            <th>
              <Button onClick={handleClickName}>Name</Button>
            </th>
            <th>
              <Button onClick={handleClickEmail}>Email</Button>
            </th>
            <th>
              <Button onClick={handleClickRole}>Role</Button>
            </th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </>
  );
}
