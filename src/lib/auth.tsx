import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  name: string;
  email: string;
  joined: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS = [
  { name: "Tarun Adithya", email: "tarunadithya2006@gmail.com", password: "Adithya123", joined: "Feb 2025" },
  { name: "Pranav", email: "pranavkrishna2796@gmail.com", password: "pk@29", joined: "Mar 2025" },
  { name: "Thapan", email: "thapan23@gmail.com", password: "pachipulusu@7", joined: "Mar 2025" },
  { name: "Lokesh", email: "lokesh1@gmail.com", password: "loki@23", joined: "Apr 2025" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const loadProfile = (email: string) => {
    const cred = VALID_CREDENTIALS.find(c => c.email === email);
    if (cred) {
      setUserName(cred.name);
      setUserProfile({ name: cred.name, email: cred.email, joined: cred.joined });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("echoroom_auth");
    if (stored) {
      setIsLoggedIn(true);
      setUserEmail(stored);
      loadProfile(stored);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const cred = VALID_CREDENTIALS.find(c => c.email === email && c.password === password);
    if (cred) {
      localStorage.setItem("echoroom_auth", email);
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserName(cred.name);
      setUserProfile({ name: cred.name, email: cred.email, joined: cred.joined });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("echoroom_auth");
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, userName, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
