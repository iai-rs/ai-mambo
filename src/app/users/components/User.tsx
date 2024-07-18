import { Role } from "@prisma/client";
import { useState } from "react";
import MSelect from "~/components/common/MSelect";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { ADMINS } from "~/constants";
import { api } from "~/trpc/react";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  onDelete: (a: string) => void;
}

export default function User({ user, onDelete }: Props) {
  const { toast } = useToast();
  const deleteUserMutation = api.users.deleteUserById.useMutation();
  const changeUserRoleMutation = api.users.updateUserRole.useMutation();
  const [userState, setUser] = useState(user);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRoleChange = (userId: string, newRole: Role) => {
    changeUserRoleMutation.mutate(
      { id: userId, role: newRole },
      {
        onSuccess({ role, email }) {
          setUser({ ...user, role });
          toast({
            title: "USPEH",
            description: `Promenili ste rolu za ${email} na ${role}`,
          });
        },
      },
    );
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(
      { id: userId },
      {
        onSuccess: ({ id, email }) => {
          onDelete(id);
          toast({
            title: "USPEH",
            description: `Obrisali ste korisnika ${email}.`,
          });
        },
      },
    );
  };

  return (
    <>
      <TableRow key={userState.id}>
        <TableCell>{userState.name}</TableCell>
        <TableCell>{userState.email}</TableCell>
        <TableCell>
          <MSelect
            disabled={ADMINS.includes(user.email)}
            className="min-w-[130px]"
            selectedItem={userState.role}
            onValueChange={(value) =>
              handleRoleChange(userState.id, value as Role)
            }
            items={Object.values(Role).map((r) => ({ key: r, label: r }))}
          />
        </TableCell>
        <TableCell>
          <Button
            disabled={ADMINS.includes(user.email)}
            onClick={() => setOpenDialog(true)}
          >
            Obriši korisnika
          </Button>
        </TableCell>
      </TableRow>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Da li ste sigurni?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {
                "Ova radnja ne može biti poništena. Ovo će trajno obrisati nalog i ukloniti podatke sa naših servera."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{"Obustavi"}</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(userState.id)}
            >
              {"Nastavi"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
