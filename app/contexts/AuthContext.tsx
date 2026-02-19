"use client";
import { User, RoleContext } from "@/src/api/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roleContexts: RoleContext[];
  requiresRoleSelection: boolean;
  selectedRoleContext: RoleContext | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setRoleContexts: (contexts: RoleContext[]) => void;
  setSelectedRoleContext: (context: RoleContext | null) => void;
  login: (user: User, token?: string | null, roleContexts?: RoleContext[], requiresRoleSelection?: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  roleContexts:[],
  requiresRoleSelection: false,
  selectedRoleContext: null,
  setToken: () => {},
  setUser: () => {},
  setRoleContexts: () => {},
  setSelectedRoleContext: () => {},
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [user, setUserState] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleContexts, setRoleContextsState] = useState<RoleContext[]>([]);
  const [requiresRoleSelection, setRequiresRoleSelection] = useState(false);
  const [selectedRoleContext, setSelectedRoleContextState] = useState<RoleContext | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userJson = localStorage.getItem("user");
      const storedUser = userJson ? JSON.parse(userJson) : null;
      const storedToken = localStorage.getItem("token");
      const roleContextsJson = localStorage.getItem("roleContexts");
      const storedRoleContexts = roleContextsJson ? JSON.parse(roleContextsJson) : [];
      const selectedRoleContextJson = localStorage.getItem("selectedRoleContext");
      const storedSelectedRoleContext = selectedRoleContextJson ? JSON.parse(selectedRoleContextJson) : null;

      if (storedUser) setUserState(storedUser);
      if (storedToken) setJwtToken(storedToken);
      if (storedRoleContexts) setRoleContextsState(storedRoleContexts);
      if (storedSelectedRoleContext) setSelectedRoleContextState(storedSelectedRoleContext);

      setIsLoading(false);
    }
  }, []);

  // ✅ Allows setting or clearing user
  const setUser = (newUser: User | null) => {
    setUserState(newUser);

    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    }
  };

  const setToken = (token: string | null) => {
    setJwtToken(token);

    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  };

  const setRoleContexts = (contexts: RoleContext[]) => {
    setRoleContextsState(contexts);

    if (typeof window !== "undefined") {
      localStorage.setItem("roleContexts", JSON.stringify(contexts));
    }
  };

  const setSelectedRoleContext = (context: RoleContext | null) => {
    setSelectedRoleContextState(context);

    if (typeof window !== "undefined") {
      if (context) {
        localStorage.setItem("selectedRoleContext", JSON.stringify(context));
      } else {
        localStorage.removeItem("selectedRoleContext");
      }
    }
  };

  const login = (user: User, token?: string | null, roleContexts?: RoleContext[], requiresRoleSelection?: boolean) => {
    setUserState(user);
    setIsLoading(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Handle role contexts
    if (roleContexts) {
      setRoleContextsState(roleContexts);
      if (typeof window !== "undefined") {
        localStorage.setItem("roleContexts", JSON.stringify(roleContexts));
      }
    }

    // Handle role selection requirement
    if (requiresRoleSelection !== undefined) {
      setRequiresRoleSelection(requiresRoleSelection);
    }

    // Handle token
    if (token) {
      setJwtToken(token);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    } else {
      setJwtToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
  };

  const logout = () => {
    setUserState(null);
    setJwtToken(null);
    setRoleContextsState([]);
    setRequiresRoleSelection(false);
    setSelectedRoleContextState(null);

    if (typeof window !== "undefined") {
      localStorage.clear();
    }

    setTimeout(() => {
      router.push("/login");
    }, 0);
  };

  const value: AuthContextType = {
    user,
    token: jwtToken,
    isAuthenticated: !!user && !!jwtToken,
    isLoading,
    roleContexts,
    requiresRoleSelection,
    selectedRoleContext,
    setUser,
    setToken,
    setRoleContexts,
    setSelectedRoleContext,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const 
useAuth = () => useContext(AuthContext);
