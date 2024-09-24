"use client";
import { apiBaseAtom, userAtom } from "@/logic/api/atoms";
import { axiosInstance } from "@/logic/api/api";
import { useAtom } from "jotai";
import { USERS_CURRENT } from "@/logic/api/endpoints";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setStaticApiBase, setStaticUser, staticApiBase, staticUser } from "@/logic/store/userStore";
import Loading from "./loading";

export default function AuthRedirector({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const [user, setUser] = useAtom(userAtom);
  const [fetchedApiBase, setFetchedApiBase] = useAtom(apiBaseAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (fetchedApiBase == null) {
      if (staticApiBase != null) {
        setFetchedApiBase(staticApiBase);
        return;
      }
    }

    fetch("/api/configuration")
      .then(res => {
        res.json().then(json => {
          const apiBase = json.apiBase;
          console.log(apiBase);
          setStaticApiBase(apiBase);
          setFetchedApiBase(apiBase);
        });
      });
  }, []);

  useEffect(() => {
    if (user == null) {
      if (staticUser != null) {
        setUser(staticUser);
        return;
      }

      if (fetchedApiBase != null) {
        axiosInstance.get(USERS_CURRENT)
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
    }
  }, [fetchedApiBase]);

  if ((user != null && fetchedApiBase != null) || pathname == "/login") {
    return children;
  }

  if (pathname == "/") {
    router.push("/panel");
  }

  if (staticApiBase != null) {
    setFetchedApiBase(staticApiBase);
  }

  if (staticUser != null) {
    setUser(staticUser);
  }

  return <Loading />;
};
