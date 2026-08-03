import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import * as AuthService from "../services/authService";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  xp: number;
  level: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await AuthService.getProfile(token);

        setUser(res.user);
      } catch (err) {
        AuthService.logout();
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (
    email: string,
    password: string
  ) => {
    const res = await AuthService.login(
      email,
      password
    );

    localStorage.setItem("token", res.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.user)
    );

    setToken(res.token);
    setUser(res.user);
  };

    const register = async (
    fullName: string,
    email: string,
    password: string
    ) => {
    await AuthService.register(
        fullName,
        email,
        password
    );

    // Don't log the user in automatically.
    };

  const logout = () => {
    AuthService.logout();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);