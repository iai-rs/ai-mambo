"use client";

import { Role } from "@prisma/client";
import { useState } from "react";
import { changeUserRole } from "~/app/lib/actions";

interface Props {
    user: {
        id: string,
        name: string,
        email: string,
        role: Role
    },
}

export default function User( {user} : Props ) {
    const [userState, setUser] = useState(user);

    const handleRoleChange = (userId: string, newRole: Role) => {
        const changeRole = changeUserRole(userId, newRole);
        setUser({...user, role: newRole});
    }
  return (
    <tr key={userState.id}>
        <td>{userState.name}</td>
        <td>{userState.email}</td>
        <td>
            <select
                value={userState.role}
                onChange={(e) => handleRoleChange(userState.id, e.target.value as Role)}>
                {Object.values(Role).map(role => (
                    <option key={role} value={role}>
                        {role}
                    </option>
                ))}
            </select>
        </td>
        <td>
            <button>Delete user</button>
        </td>
    </tr>
  )
}
