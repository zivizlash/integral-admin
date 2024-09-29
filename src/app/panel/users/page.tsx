"use client";
import AuthLoading from "@/app/components/auth-loading";
import axios from "@/logic/api/api";
import { ADMIN_GETUSERS } from "@/logic/api/endpoints";
import { User } from "@/logic/models/definition";
import { formatDate, formatRole } from "@/logic/tools/formatters";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get(ADMIN_GETUSERS)
      .then(res => {
        setUsers(res.data.value.map((user: User) => {
          return {
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          };
        }));
      });
  }, []);

  return (
    <div>
      <Link href="/panel/users/create" className={clsx(
        'text-center block w-full rounded-lg border-2 border-zinc-700 hover:border-zinc-600 hover:bg-white/5 mb-1.5 py-1.5 px-3 text-sm/6 text-white',
        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
      )}>
        Создать пользователя
      </Link>
      <div className="p-3">
        <ul>
          {users.length == 0
            ? <AuthLoading />
            : users.map((user) => (
              <li key={user.id} className="relative rounded-xl p-4 text-sm/6 transition hover:bg-white/5">
                <Link href={`/panel/users/${user.id}`}
                  className="font-semibold text-white"
                >
                  <span className="absolute inset-0"></span>
                  {user.login}
                </Link>
                <span className={clsx({
                  'ml-1.5': true,
                  "text-green-500/50": user.role === 0, 
                  "text-amber-500/50": user.role === 1, 
                  "text-rose-500/50": user.role === 2 
                }
                )}>
                  {formatRole(user.role)}
                </span>
                <ul className="flex gap-2 text-white/50" aria-hidden="true">
                  <li>Добавлен {formatDate(user.createdAt)}</li>
                  <li aria-hidden="true">&middot;</li>
                  <li>Обновлен {formatDate(user.updatedAt)}</li>
                </ul>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
