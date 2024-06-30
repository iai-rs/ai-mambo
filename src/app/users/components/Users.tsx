"use client";

import { type Role } from "@prisma/client";
import { useEffect, useState } from "react";
import User from "./User";
import { useSearchParams } from "next/navigation";
import { sort } from "fast-sort";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ChevronsUpDown } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [usersState, setUsers] = useState(users);

  const handleDelete = (userId: string) => {
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
    <div className="overflow-auto p-4">
      <h1 className="mb-2 text-2xl font-bold">
        {"Lista korisnika".toUpperCase()}
      </h1>
      <Input
        type="text"
        placeholder="Pretraži korisnike po imenu ili emailu"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      ></Input>
      <br />
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={handleClickName}>
                  <ChevronsUpDown className="h-4" />
                  {"Ime"}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={handleClickEmail}>
                  <ChevronsUpDown className="h-4" />
                  {"Email"}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={handleClickRole}>
                  <ChevronsUpDown className="h-4" />
                  {"Rola"}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersState.map((user) => (
              <User
                key={user.id}
                user={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                }}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
