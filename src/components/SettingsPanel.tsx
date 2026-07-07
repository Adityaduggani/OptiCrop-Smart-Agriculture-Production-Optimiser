import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  User as UserIcon,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Mail,
  Building,
  Shield,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Plus,
  UserCheck
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { User, UserRole } from "../types";

export default function SettingsPanel() {
  const {
    user,
    usersList,
    updateProfile,
    adminDeleteUser,
    refreshData,
    addAuditLog
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"my-profile" | "user-directory">("my-profile");

  // State for updating current profile
  const [profileName, setProfileName] = useState(user?.name || user?.displayName || "");
  const [profileDisplayName, setProfileDisplayName] = useState(user?.displayName || "");
  const [profileOrg, setProfileOrg] = useState(user?.organization || "");
  const [profileRole, setProfileRole] = useState<UserRole>(user?.role || "Farmer");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatarUrl || "");
  const [myProfileSuccess, setMyProfileSuccess] = useState("");
  const [myProfileError, setMyProfileError] = useState("");

  // Directory Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Farmer");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createError, setCreateError] = useState("");

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Farmer");
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) return null;

  // Handle Current User Profile Update
  const handleUpdateMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMyProfileSuccess("");
    setMyProfileError("");

    // Form Validations
    if (profileName.trim().length < 2) {
      setMyProfileError("Full Name must be at least 2 characters long.");
      return;
    }
    if (profileDisplayName.trim().length < 3) {
      setMyProfileError("Display Name (Username) must be at least 3 characters.");
      return;
    }

    try {
      const avatarSeed = encodeURIComponent(profileDisplayName.trim());
      const finalAvatar = profileAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
      
      const success = await updateProfile(
        profileName.trim(),
        profileDisplayName.trim(),
        profileOrg.trim(),
        finalAvatar,
        profileRole
      );

      if (success) {
        setMyProfileSuccess("Your profile details have been securely updated in the database.");
        // Clear message after 3s
        setTimeout(() => setMyProfileSuccess(""), 4000);
      } else {
        setMyProfileError("Failed to update profile. Server rejected changes.");
      }
    } catch (err) {
      setMyProfileError("Connection error while updating profile.");
    }
  };

  // Handle Creating a New User Profile (Create)
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSuccess("");
    setCreateError("");

    // Validations
    if (newName.trim().length < 2) {
      setCreateError("Full Name must be at least 2 characters.");
      return;
    }
    if (newDisplayName.trim().length < 3) {
      setCreateError("Display Name must be at least 3 characters.");
      return;
    }
    if (!newEmail.includes("@")) {
      setCreateError("Please enter a valid email address.");
      return;
    }
    if (newPassword.length < 6) {
      setCreateError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const seed = encodeURIComponent(newDisplayName.trim());
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          name: newName.trim(),
          displayName: newDisplayName.trim(),
          role: newRole,
          organization: newOrg.trim() || "Independent",
          avatarUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "An error occurred during account registration.");
        return;
      }

      setCreateSuccess(`Account for ${newName.trim()} created successfully!`);
      addAuditLog(`Created new user account: ${newDisplayName.trim()} as ${newRole}.`, "Success", user.displayName, user.role);
      
      // Refresh user registry lists
      await refreshData();

      // Reset Create Form
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewDisplayName("");
      setNewOrg("");
      setNewRole("Farmer");

      // Auto dismiss modal shortly after
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess("");
      }, 2000);
    } catch (err) {
      setCreateError("Failed to connect to directory services.");
    }
  };

  // Handle Editing an Existing User Profile (Update)
  const handleOpenEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setEditName(targetUser.name || targetUser.displayName);
    setEditDisplayName(targetUser.displayName);
    setEditOrg(targetUser.organization || "");
    setEditRole(targetUser.role);
    setEditSuccess("");
    setEditError("");
    setShowEditModal(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditSuccess("");
    setEditError("");

    // Validations
    if (editName.trim().length < 2) {
      setEditError("Full Name must be at least 2 characters.");
      return;
    }
    if (editDisplayName.trim().length < 3) {
      setEditError("Display Name must be at least 3 characters.");
      return;
    }

    try {
      const seed = encodeURIComponent(editDisplayName.trim());
      const finalAvatar = editingUser.avatarUrl?.includes("dicebear") 
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}` 
        : editingUser.avatarUrl || "";

      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: editingUser.uid,
          name: editName.trim(),
          displayName: editDisplayName.trim(),
          organization: editOrg.trim(),
          role: editRole,
          avatarUrl: finalAvatar
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to save profile changes.");
        return;
      }

      setEditSuccess("Profile updated successfully!");
      addAuditLog(`Modified profile of user: ${editDisplayName.trim()} (${editRole}).`, "Warning", user.displayName, user.role);
      
      // If editing self, update the context user on client-side too!
      if (editingUser.uid === user.uid) {
        // Trigger a fake profile update locally
        await updateProfile(editName.trim(), editDisplayName.trim(), editOrg.trim(), finalAvatar, editRole);
      }

      await refreshData();

      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess("");
      }, 1500);
    } catch (err) {
      setEditError("Network error while trying to update profile.");
    }
  };

  // Handle Deleting a User Profile (Delete)
  const handleDeleteUser = async (targetUid: string, targetName: string) => {
    if (targetUid === user.uid) {
      alert("Self-deletion block: You cannot delete your own active session profile.");
      return;
    }

    const confirmed = window.confirm(
      `CRITICAL CONFIRMATION Required:\nAre you absolutely sure you want to permanently delete '${targetName}'? All credentials and security parameters for this user will be removed.`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/auth/admin/user/${targetUid}`, {
        method: "DELETE"
      });

      if (res.ok) {
        addAuditLog(`Deleted user account permanently: '${targetName}' (${targetUid}).`, "Security", user.displayName, user.role);
        await refreshData();
      } else {
        const data = await res.json();
        alert(data.error || "An error occurred. User could not be deleted.");
      }
    } catch (err) {
      alert("Failed to reach identity server.");
    }
  };

  // Filter and Search Lists
  const filteredUsersList = usersList.filter((u) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchLower) ||
      u.displayName.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      (u.organization || "").toLowerCase().includes(searchLower);

    const matchesFilter = roleFilter === "All" || u.role === roleFilter;

    return matchesSearch && matchesFilter;
  });

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-3">
            <Settings className="h-3.5 w-3.5 text-emerald-400 animate-spin-slow" />
            Config Module Active
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Settings & Profile Management Suite
          </h2>
          <p className="text-emerald-200/70 text-xs font-medium max-w-xl mt-1.5 leading-relaxed">
            Modify authorization parameters, create/delete secure user accounts, assign clearances,
            and monitor cryptographic data registries. All adjustments are tracked in real-time.
          </p>
        </div>

        <button
          onClick={handleForceRefresh}
          disabled={isRefreshing}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 border border-white/10 rounded-2xl text-xs font-black tracking-wide flex items-center gap-2 transition"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-300 ${isRefreshing ? "animate-spin" : ""}`} />
          Force Sync Database
        </button>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab("my-profile")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeTab === "my-profile"
              ? "border-emerald-600 text-emerald-950"
              : "border-transparent text-gray-500 hover:text-emerald-700"
          }`}
        >
          <UserIcon className="h-4 w-4" />
          My Profile settings
        </button>
        <button
          onClick={() => setActiveTab("user-directory")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeTab === "user-directory"
              ? "border-emerald-600 text-emerald-950"
              : "border-transparent text-gray-500 hover:text-emerald-700"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          User Registry Dashboard ({usersList.length})
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
        <AnimatePresence mode="wait">
          {activeTab === "my-profile" ? (
            <motion.div
              key="my-profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-xl space-y-6"
            >
              <div>
                <h3 className="text-base font-black text-gray-900">Personal Profile Credentials</h3>
                <p className="text-xs text-gray-400 font-bold">Configure authorized credentials and organizational affiliations.</p>
              </div>

              <form onSubmit={handleUpdateMyProfile} className="space-y-4 text-xs font-bold">
                {myProfileError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{myProfileError}</span>
                  </div>
                )}

                {myProfileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{myProfileSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Display Name (Username)</label>
                    <input
                      type="text"
                      required
                      value={profileDisplayName}
                      onChange={(e) => setProfileDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                      placeholder="e.g. johndoe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Associated Organization</label>
                    <input
                      type="text"
                      value={profileOrg}
                      onChange={(e) => setProfileOrg(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                      placeholder="e.g. Independent, BioTech Corp"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Security Role / Clearance</label>
                    <select
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 cursor-pointer"
                    >
                      <option value="Farmer">Farmer</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Policymaker">Policymaker</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 block">Avatar Style Seed</label>
                  <input
                    type="text"
                    placeholder="e.g. lucky-seed"
                    value={profileAvatar.includes("dicebear") ? decodeURIComponent(profileAvatar.split("seed=")[1] || "") : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileAvatar(val ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(val)}` : "");
                    }}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">Leave empty to auto-generate based on your Display Name seed.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm transition"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="user-directory-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base font-black text-gray-900">Registered Agricultural Accounts</h3>
                  <p className="text-xs text-gray-400 font-bold">Manage credentials, switch system roles, and assign agencies.</p>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 transition shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create User Profile
                </button>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-wrap gap-2.5">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Name, Display Name, Email, or Org..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition w-full"
                  />
                </div>

                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer"
                  >
                    <option value="All">All Clearance Levels</option>
                    <option value="Farmer">Farmers</option>
                    <option value="Researcher">Researchers</option>
                    <option value="Policymaker">Policymakers</option>
                    <option value="Administrator">Administrators</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Accounts Directory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsersList.length === 0 ? (
                  <div className="col-span-2 p-12 text-center border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl text-gray-400 font-bold">
                    No matching user profiles found in the registry.
                  </div>
                ) : (
                  filteredUsersList.map((u) => {
                    const isSelf = u.uid === user.uid;
                    return (
                      <div
                        key={u.uid}
                        className={`p-5 border border-gray-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between gap-4 relative hover:shadow-md transition ${
                          isSelf ? "ring-2 ring-emerald-600/20 bg-emerald-50/10" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.displayName)}`}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-12 w-12 rounded-full border border-gray-200 bg-white"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-black text-gray-800">
                                  {u.name || u.displayName}
                                </span>
                                {isSelf && (
                                  <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="block text-[10px] text-gray-400 font-semibold">
                                @{u.displayName}
                              </span>
                              <span className="block text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {u.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                              u.role === "Administrator"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : u.role === "Policymaker"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : u.role === "Researcher"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}>
                              {u.role}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Associated Org */}
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold bg-white px-3 py-2 rounded-xl border border-gray-200/50">
                          <Building className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            Organization: <strong>{u.organization || "Independent / Agency Group"}</strong>
                          </span>
                        </div>

                        {/* Profile CRUD Controls */}
                        <div className="flex gap-2 justify-end border-t border-gray-200/50 pt-3">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition flex items-center gap-1"
                            title="Edit User Profile"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit details</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.uid, u.name || u.displayName)}
                            disabled={isSelf}
                            className={`p-1.5 text-xs font-black rounded-xl transition flex items-center gap-1 ${
                              isSelf
                                ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                                : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                            }`}
                            title={isSelf ? "Cannot delete your own active administrator profile" : "Delete Account Profile"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>De-authorize</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CREATE NEW PROFILE MODAL (CRUD - Create) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-1.5">
                <UserPlus className="h-5 w-5 text-emerald-700" />
                Register New User Profile
              </h3>
              <p className="text-xs text-gray-400 font-bold mb-4">Initialize fresh credentials and clearances directly in the local cluster.</p>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs font-bold">
                {createError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{createError}</span>
                  </div>
                )}

                {createSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-emerald-600 animate-bounce" />
                    <span>{createSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adeline Smith"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Display Name (Username)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. adeline_s"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. adeline@company.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Secure Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Midwest Cooperative"
                      value={newOrg}
                      onChange={(e) => setNewOrg(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Clearance level (Role)</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 cursor-pointer"
                    >
                      <option value="Farmer">Farmer</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Policymaker">Policymaker</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT EXISTING PROFILE MODAL (CRUD - Update) */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-1.5">
                <Edit2 className="h-5 w-5 text-emerald-700" />
                Edit Profile parameters
              </h3>
              <p className="text-xs text-gray-400 font-bold mb-4">Modify account specifications for @{editingUser.displayName}.</p>

              <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs font-bold">
                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{editError}</span>
                  </div>
                )}

                {editSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{editSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Display Name (Username)</label>
                    <input
                      type="text"
                      required
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Associated Organization</label>
                    <input
                      type="text"
                      value={editOrg}
                      onChange={(e) => setEditOrg(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Security Role Clearance</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 cursor-pointer"
                    >
                      <option value="Farmer">Farmer</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Policymaker">Policymaker</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
