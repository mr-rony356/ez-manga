"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "@/types";

export type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({
  children,
  userData,
}: {
  children: ReactNode;
  userData: User | null;
}) => {
  const [user, setUser] = useState(userData || null);
  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
