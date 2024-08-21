"use client";

import { Provider } from "jotai";
import AuthRedirector from "./authRedirector";

export const Providers = ({ children }: any) => {
  return (
    <Provider>
      <AuthRedirector>
        {children}
      </AuthRedirector>
    </Provider>
  );
};
