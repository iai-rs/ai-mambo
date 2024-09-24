import React from "react";
import { LogOut, Mail, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth, signOut } from "~/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import { iconHeight } from "~/constants";
import Link from "next/link";
import { Role } from "@prisma/client";

const UserMenu = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const role = session?.user?.role ?? "";

  const isAdmin = role === Role.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback className="bg-slate-400">
            {name?.[0]?.toUpperCase() ?? "-"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Name */}
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* email */}
        <DropdownMenuItem className="flex gap-4">
          <Mail height={iconHeight} />
          {email}
        </DropdownMenuItem>
        {/* users */}
        {isAdmin && (
          <DropdownMenuItem className="flex gap-4">
            <Users height={iconHeight} />
            <Link href="/users">Korisnici</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {/* theme */}
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Logout */}
        <DropdownMenuItem>
          <LogOut height={iconHeight} />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button className="h-5" variant="ghost">
              Odjavi se
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
