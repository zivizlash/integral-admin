"use client";

import { useUserContext } from "@/logic/state/authState";

export default function Page()
{
  const userCtx = useUserContext();

  return (
    <h1>Hello, {userCtx.user?.login}!</h1>
  );
}
