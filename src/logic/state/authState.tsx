"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { User } from "@/logic/models/definition";

export interface IUserContextProps {
  user?: User,
  setUser: Dispatch<SetStateAction<User>>
}

export const UserContext = createContext<IUserContextProps>(undefined!);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<User>(undefined!);

  const v: IUserContextProps = { user, setUser };

  return (
    <UserContext.Provider
      value={v}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext(): IUserContextProps {
  const context = useContext(UserContext);

  if (typeof context == "undefined") {
    throw new Error("useUserContext should be used within UserContext.Provider");
  }

  return context;
}
