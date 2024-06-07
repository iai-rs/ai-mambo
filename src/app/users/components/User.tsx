"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { changeUserRole, deleteUser } from "~/app/lib/actions";
import { api } from "~/trpc/react";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  onDelete: Function;
}

export default function User({ user, onDelete }: Props) {
  const deleteUserMutation = api.users.deleteUserById.useMutation();
  const changeUserRoleMutation = api.users.updateUserRole.useMutation();
  const [userState, setUser] = useState(user);

  const handleRoleChange = (userId: string, newRole: Role) => {
    changeUserRoleMutation.mutate({ id: userId, role: newRole });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate({ id: userId });
  };

  useEffect(() => {
    if (changeUserRoleMutation.data) {
      setUser({ ...user, role: changeUserRoleMutation.data?.role });
    }
  }, [changeUserRoleMutation.isSuccess]);

  useEffect(() => {
    onDelete(deleteUserMutation.data?.id);
  }, [deleteUserMutation.isSuccess]);

  return (
    <tr key={userState.id}>
      <td>{userState.name}</td>
      <td>{userState.email}</td>
      <td>
        <select
          value={userState.role}
          onChange={(e) =>
            handleRoleChange(userState.id, e.target.value as Role)
          }
        >
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button onClick={() => handleDeleteUser(userState.id)}>
          Delete user
        </button>
      </td>
    </tr>
  );
}
