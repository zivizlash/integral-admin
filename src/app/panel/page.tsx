"use client";
import { userAtom } from "@/logic/api/atoms";
import { useAtom } from "jotai";

export default function Page() {
  const [user] = useAtom(userAtom);

  return (
    <h1>Hello, {user?.login}! Your role is {user?.role}</h1>
  );
}
