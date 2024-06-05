"use client";

import { Role } from "@prisma/client";
import { getUsers } from "~/app/lib/actions";

interface Props {
    user: {
        id: string,
        name: string,
        email: string,
        role: Role
    },
}

export default function User( {user} : Props ) {
  return (
    <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
            <select
                value={user.role}
                onChange={(e) => {}}>
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
