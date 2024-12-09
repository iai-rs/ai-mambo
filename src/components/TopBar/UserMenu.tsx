import React from "react";
import {
  LogOut,
  Mail,
  Users,
  FileSpreadsheet,
  MessageCircleQuestionIcon,
} from "lucide-react";

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
import { api } from "~/trpc/server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const UserMenu = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const role = session?.user?.role ?? "";

  const isAdmin = role === Role.ADMIN;

  const results = await api.feedback.getFeedbackByUser({ userEmail: email });

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
        <DropdownMenuLabel>
          <div className="flex items-center justify-between leading-none">
            {name}
            {!!results?.length && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="rounded-sm bg-red-50 p-1 text-red-400">
                      {results.length}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="font-normal">
                      {`Ukupan broj analiziranih pacijenata za `}
                      <span className="font-bold">{email}</span>
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* email */}
        <DropdownMenuItem className="flex gap-4">
          <Mail height={iconHeight} />
          {email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* users */}
        {isAdmin && (
          <DropdownMenuItem className="flex gap-4">
            <Users height={iconHeight} />
            <Link href="/users">Korisnici</Link>
          </DropdownMenuItem>
        )}
        {/* reports */}
        <DropdownMenuItem className="flex gap-4">
          <FileSpreadsheet height={iconHeight} />
          <Link href="/reports">{"Izveštaji"}</Link>
        </DropdownMenuItem>
        {/* help */}
        <DropdownMenuItem className="flex gap-4">
          <MessageCircleQuestionIcon height={iconHeight} />
          <Link href="/help">{"Pomoć"}</Link>
        </DropdownMenuItem>
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
              {"Odjavi se"}
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
