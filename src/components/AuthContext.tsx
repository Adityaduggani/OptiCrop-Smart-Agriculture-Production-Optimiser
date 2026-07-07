import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuditLog } from "../types";

interface AuthContextType {
  user: User | null;
  usersList: User[];
  auditLogs: AuditLog[];
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, displayName: string, role: UserRole, organization: string, avatarUrl: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (name: string, displayName: string, organization: string, avatarUrl: string, role: UserRole) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  // Admin only methods
  adminUpdateUserRole: (uid: string, role: UserRole) => void;
  adminUpdateUserOrg: (uid: string, org: string) => void;
  adminDeleteUser: (uid: string) => void;
  addAuditLog: (action: string, status: "Success" | "Info" | "Warning" | "Security", userName?: string, userRole?: UserRole) => void;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to fetch latest users and audit logs from backend
  const refreshData = async () => {
    try {
      const [usersRes, logsRes] = await Promise.all([
        fetch("/api/auth/users"),
        fetch("/api/auth/audit-logs")
      ]);
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }
      
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData);
      }
    } catch (err) {
      console.error("Failed to sync auth data from server:", err);
    }
  };

  // Initialize and load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Load active session from local storage
        const activeUser = localStorage.getItem("opticrop_active_user");
        if (activeUser) {
          setUser(JSON.parse(activeUser));
        }
        
        // Sync with backend database
        await refreshData();
      } catch (err) {
        console.error("Failed to load initial auth schemas:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Helper to add audit log via server
  const addAuditLog = async (
    action: string,
    status: "Success" | "Info" | "Warning" | "Security",
    overrideName?: string,
    overrideRole?: UserRole
  ) => {
    try {
      const logUser = overrideName || user?.displayName || "Anonymous User";
      const logRole = overrideRole || user?.role || "Farmer";
      
      const res = await fetch("/api/auth/audit-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, status, user: logUser, role: logRole })
      });
      
      if (res.ok) {
        const newLog = await res.json();
        setAuditLogs((prev) => [newLog, ...prev].slice(0, 150));
      }
    } catch (err) {
      console.error("Failed to add audit log to backend:", err);
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        // Log unauthorized or failed attempt
        addAuditLog(`Failed authentication attempt for email: ${email}`, "Security", "Unverified Client", role);
        return { success: false, message: data.error || "Authentication failed." };
      }

      setUser(data.user);
      localStorage.setItem("opticrop_active_user", JSON.stringify(data.user));

      // Log successful login
      addAuditLog(`User '${data.user.displayName}' logged in securely as ${role}.`, "Success", data.user.displayName, role);
      
      // Refresh cached users
      await refreshData();
      
      return { success: true, message: `Welcome back, ${data.user.displayName}!` };
    } catch (err) {
      console.error("Login API error:", err);
      return { success: false, message: "Server connection failed during login." };
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    organization: string,
    avatarUrl: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName, role, organization, avatarUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Registration failed." };
      }

      setUser(data.user);
      localStorage.setItem("opticrop_active_user", JSON.stringify(data.user));

      // Log registered action
      addAuditLog(`New account created & logged in: ${displayName} (${role}) under '${organization || "Independent"}'.`, "Success", displayName, role);
      
      // Refresh cached users
      await refreshData();
      
      return { success: true, message: `Account created successfully! Welcome, ${displayName}.` };
    } catch (err) {
      console.error("Register API error:", err);
      return { success: false, message: "Server connection failed during registration." };
    }
  };

  const logout = async () => {
    if (user) {
      await addAuditLog(`User '${user.displayName}' logged out.`, "Info");
    }
    setUser(null);
    localStorage.removeItem("opticrop_active_user");
  };

  const updateProfile = async (
    name: string,
    displayName: string,
    organization: string,
    avatarUrl: string,
    role: UserRole
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, name, displayName, organization, avatarUrl, role })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("opticrop_active_user", JSON.stringify(data.user));
        
        await addAuditLog(`User profile updated: ${displayName} as ${role}.`, "Success", displayName, role);
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
    return false;
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await addAuditLog(`Reset password link requested for ${email}`, "Warning", "Anonymous Client");
      return {
        success: true,
        message: "A password reset token has been simulated and dispatched to your email address."
      };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  // Administrator tools
  const adminUpdateUserRole = async (uid: string, role: UserRole) => {
    if (user?.role !== "Administrator") return;
    const targetUser = usersList.find((u) => u.uid === uid);
    if (!targetUser) return;

    try {
      const res = await fetch("/api/auth/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role })
      });

      if (res.ok) {
        await addAuditLog(`Administrator changed role of '${targetUser.displayName}' to ${role}.`, "Warning");
        
        // If updating self, update local state too
        if (user.uid === uid) {
          const updatedMe = { ...user, role };
          setUser(updatedMe);
          localStorage.setItem("opticrop_active_user", JSON.stringify(updatedMe));
        }
        await refreshData();
      }
    } catch (err) {
      console.error("Failed to admin-update role:", err);
    }
  };

  const adminUpdateUserOrg = async (uid: string, org: string) => {
    if (user?.role !== "Administrator") return;
    const targetUser = usersList.find((u) => u.uid === uid);
    if (!targetUser) return;

    try {
      const res = await fetch("/api/auth/admin/update-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, organization: org })
      });

      if (res.ok) {
        await addAuditLog(`Administrator updated organization of '${targetUser.displayName}' to '${org}'.`, "Info");
        
        if (user.uid === uid) {
          const updatedMe = { ...user, organization: org };
          setUser(updatedMe);
          localStorage.setItem("opticrop_active_user", JSON.stringify(updatedMe));
        }
        await refreshData();
      }
    } catch (err) {
      console.error("Failed to admin-update organization:", err);
    }
  };

  const adminDeleteUser = async (uid: string) => {
    if (user?.role !== "Administrator") return;
    const targetUser = usersList.find((u) => u.uid === uid);
    if (!targetUser) return;

    if (user.uid === uid) {
      await addAuditLog("Admin attempted self-deletion. Action blocked.", "Security");
      return;
    }

    try {
      const res = await fetch(`/api/auth/admin/user/${uid}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await addAuditLog(`Administrator permanently deleted user account: '${targetUser.displayName}' (${targetUser.email}).`, "Security");
        await refreshData();
      }
    } catch (err) {
      console.error("Failed to admin-delete user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        auditLogs,
        loading,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        adminUpdateUserRole,
        adminUpdateUserOrg,
        adminDeleteUser,
        addAuditLog,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
