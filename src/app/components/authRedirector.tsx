"use client";
import { userAtom } from "@/logic/api/atoms";
import axios from "@/logic/api/api";
import { useAtom } from "jotai";
import { USERS_CURRENT } from "@/logic/api/endpoints";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setStaticUser, staticUser } from "@/logic/store/userStore";

export default function AuthRedirector({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user == null) {
      if (staticUser != null) {
        setUser(staticUser);
        return;
      }

      axios.get(USERS_CURRENT)
        .then(res => {
          const currentUser = res.data.value;
          setStaticUser(currentUser);
          setUser(currentUser);
        })
        .catch(err => {
          console.error("error while fetching user", err);
          router.push("/login");
        });
    }
  }, []);

  if (user != null || pathname == "/login") {
    return children;
  }

  if (staticUser != null) {
    setUser(staticUser);
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className="fixed text-2xl left-0 top-0 flex w-full justify-center border-b 
        border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 
        dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 
        lg:p-4 lg:dark:bg-zinc-800/30">
        Загрузка...
        {/* <code className="font-mono font-bold">src/app/page.tsx</code> */}
      </p>

    </div>
  )
};
