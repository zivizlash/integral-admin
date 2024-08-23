"use client";
import { userAtom } from "@/logic/api/atoms";
import axios from "@/logic/api/api";
import { useAtom } from "jotai";
import { USERS_CURRENT } from "@/logic/api/endpoints";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setStaticUser, staticUser } from "@/logic/store/userStore";
import Loading from "./loading";

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

  return <Loading />;
};
