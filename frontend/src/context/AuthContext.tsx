import { type ReactNode, createContext, useState, useContext } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  email: string | null;
  login: (tok: string, username: string, email: string) => void;
  logout: () => void;
  verified: boolean;
  updateUser: (username: string, email: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  email: null,
  login: () => {},
  logout: () => {},
  verified: false,
  updateUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );

  const [verified, setVerified] = useState(false);

  const login = (tok: string, username: string, email: string) => {
    setToken(tok);
    setUsername(username);
    setEmail(email);
    localStorage.setItem("token", tok);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setEmail(null);
    setVerified(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  const updateUser = (newUsername: string, newEmail: string) => {
    setUsername(newUsername);
    setEmail(newEmail);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("email", newEmail);
  };

  return (
    <AuthContext.Provider
      value={{ token, username, login, logout, verified, email, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
