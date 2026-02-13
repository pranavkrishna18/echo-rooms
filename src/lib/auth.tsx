import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS = [
  { email: "tarunadithya2006@gmail.com", password: "Adithya123" },
  { email: "pranavkrishna2796@gmail.com", password: "pk@29" },
  { email: "thapan23@gmail.com", password: "pachipulusu@7" },
  { email: "lokesh1@gmail.com", password: "loki@23" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("echoroom_auth");
    if (stored) {
      setIsLoggedIn(true);
      setUserEmail(stored);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (VALID_CREDENTIALS.some(c => c.email === email && c.password === password)) {
      localStorage.setItem("echoroom_auth", email);
      setIsLoggedIn(true);
      setUserEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("echoroom_auth");
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
