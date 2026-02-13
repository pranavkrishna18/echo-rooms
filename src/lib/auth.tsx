import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  name: string;
  email: string;
  joined: string;
}

const ADMIN_EMAIL = "tarunadithya2006@gmail.com";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  userName: string | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function formatJoinedDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const VALID_CREDENTIALS = [
  { name: "Tarun Adithya", email: "tarunadithya2006@gmail.com", password: "Adithya123", joined: "Jan 2025" },
  { name: "Pranav", email: "pranavkrishna2796@gmail.com", password: "pk@29", joined: "Jan 2025" },
  { name: "Thapan", email: "thapan23@gmail.com", password: "pachipulusu@7", joined: "Feb 2025" },
  { name: "Lokesh", email: "lokesh1@gmail.com", password: "loki@23", joined: "Feb 2025" },
];

function getRegisteredUsers(): Array<{ name: string; email: string; password: string; joined: string }> {
  try {
    const stored = localStorage.getItem("echoroom_registered_users");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getAllCredentials() {
  return [...VALID_CREDENTIALS, ...getRegisteredUsers()];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const loadProfile = (email: string) => {
    const cred = getAllCredentials().find(c => c.email === email);
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
    const cred = getAllCredentials().find(c => c.email === email && c.password === password);
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

  const register = (name: string, email: string, password: string): boolean => {
    const allCreds = getAllCredentials();
    if (allCreds.find(c => c.email === email)) return false;
    const newUser = { name, email, password, joined: formatJoinedDate(new Date()) };
    const registered = getRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem("echoroom_registered_users", JSON.stringify(registered));
    return true;
  };

  const logout = () => {
    localStorage.removeItem("echoroom_auth");
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    setUserProfile(null);
  };

  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, userEmail, userName, userProfile, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
