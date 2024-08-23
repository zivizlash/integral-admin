"use client";

import { Provider } from "jotai";
import AuthRedirector from "./auth-redirector";

export const Providers = ({ children }: any) => {
  return (
    <Provider>
      <AuthRedirector>
        {children}
      </AuthRedirector>
    </Provider>
  );
};
