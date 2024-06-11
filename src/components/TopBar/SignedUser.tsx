import React from "react";
import { LogOut, Mail } from "lucide-react";

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

const iconHeight = 18;

const SignedUser = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

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
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-4">
          <Mail height={iconHeight} />
          {email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut height={iconHeight} />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button className="h-5" variant="ghost">
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SignedUser;
