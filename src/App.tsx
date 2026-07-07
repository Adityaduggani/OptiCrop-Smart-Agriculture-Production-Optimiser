import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  Activity,
  Sparkles,
  Bot,
  Sliders,
  HelpCircle,
  Menu,
  X,
  RefreshCw,
  Sun,
  Droplet,
  Info,
  BarChart2,
  Shield,
  Lock,
  LogOut,
  Settings,
  Building,
  Check,
  Globe,
  User as UserIcon,
} from "lucide-react";
import { FarmZone, UserRole } from "./types";
import Dashboard from "./components/Dashboard";
import SoilAnalyzer from "./components/SoilAnalyzer";
import OptiBot from "./components/OptiBot";
import Simulator from "./Simulator";
import CropRecommender from "./components/CropRecommender";
import PolicyAnalytics from "./components/PolicyAnalytics";
import { useAuth } from "./components/AuthContext";
import AuthScreen from "./components/AuthScreen";
import AdminPanel from "./components/AdminPanel";
import SettingsPanel from "./components/SettingsPanel";

export default function App() {
  const { user, logout, updateProfile } = useAuth();
  
  // Profile dropdown open state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // Edit profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Farmer");
  const [editAvatar, setEditAvatar] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("recommendation");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default seed zones representing realistic agricultural plots
  const [zones, setZones] = useState<FarmZone[]>([
    {
      id: "zone-a",
      name: "North Field (A-1)",
      crop: "Corn",
      growthStage: "Vegetative",
      moisture: 38,
      nitrogen: 55,
      phosphorus: 42,
      potassium: 68,
      temperature: 24,
      irrigationActive: false,
      fertilizerRate: 1.5,
      shadeCover: false,
      healthIndex: 88,
    },
    {
      id: "zone-b",
      name: "Valley Orchard (B-3)",
      crop: "Tomato",
      growthStage: "Flowering",
      moisture: 26,
      nitrogen: 35,
      phosphorus: 70,
      potassium: 45,
      temperature: 29,
      irrigationActive: true,
      fertilizerRate: 3.2,
      shadeCover: true,
      healthIndex: 74,
    },
    {
      id: "zone-c",
      name: "Southern Hills (C-2)",
      crop: "Grapes",
      growthStage: "Ripening",
      moisture: 42,
      nitrogen: 25,
      phosphorus: 30,
      potassium: 110,
      temperature: 21,
      irrigationActive: false,
      fertilizerRate: 0.8,
      shadeCover: false,
      healthIndex: 92,
    },
    {
      id: "zone-d",
      name: "Delta Paddies (D-1)",
      crop: "Rice",
      growthStage: "Seeding",
      moisture: 82,
      nitrogen: 60,
      phosphorus: 50,
      potassium: 75,
      temperature: 26,
      irrigationActive: true,
      fertilizerRate: 2.0,
      shadeCover: false,
      healthIndex: 85,
    },
  ]);

  // Command control handlers for the zones
  const handleToggleIrrigation = (id: string) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === id
          ? {
              ...zone,
              irrigationActive: !zone.irrigationActive,
              moisture: zone.irrigationActive
                ? Math.max(10, zone.moisture - 5)
                : Math.min(95, zone.moisture + 10),
              healthIndex: Math.min(100, zone.healthIndex + (zone.irrigationActive ? -2 : 3)),
            }
          : zone
      )
    );
  };

  const handleToggleShade = (id: string) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === id
          ? {
              ...zone,
              shadeCover: !zone.shadeCover,
              temperature: zone.shadeCover ? zone.temperature + 2 : zone.temperature - 3,
              healthIndex: Math.min(100, zone.healthIndex + (zone.shadeCover ? -1 : 2)),
            }
          : zone
      )
    );
  };

  const handleUpdateFertilizer = (id: string, value: number) => {
    setZones((prev) =>
      prev.map((zone) => (zone.id === id ? { ...zone, fertilizerRate: value } : zone))
    );
  };

  const handleUpdateZone = (updatedZone: FarmZone) => {
    setZones((prev) => prev.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
  };

  const handleAddZone = (newZone: FarmZone) => {
    setZones((prev) => [...prev, newZone]);
  };

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const handleOpenProfileModal = () => {
    if (!user) return;
    setEditName(user.name || user.displayName);
    setEditDisplayName(user.displayName);
    setEditOrg(user.organization || "");
    setEditRole(user.role);
    setEditAvatar(user.avatarUrl || "");
    setProfileSaveSuccess(false);
    setShowProfileModal(true);
    setProfileDropdownOpen(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate inputs
    if (editName.trim().length < 2) {
      alert("Full Name must be at least 2 characters long.");
      return;
    }
    if (editDisplayName.trim().length < 3) {
      alert("Display Name must be at least 3 characters long.");
      return;
    }

    const success = await updateProfile(editName, editDisplayName, editOrg, editAvatar, editRole);
    if (success) {
      setProfileSaveSuccess(true);
      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSaveSuccess(false);
      }, 1000);
    } else {
      alert("Failed to update profile. Please try again.");
    }
  };

  // If there's no authenticated user, show lock screen
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/35 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-sky-100/35 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-md flex items-center justify-center">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xl font-black text-emerald-950 tracking-tight">
                    OptiCrop
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest">
                    Agricultural Optimization Engine
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                <Lock className="h-4 w-4 text-emerald-600" />
                Secure Identity Gateway
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full flex items-center justify-center py-6">
          <AuthScreen />
        </main>

        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400 font-bold">
            &copy; {new Date().getFullYear()} OptiCrop – Intelligent Agronomical Core & Precision Diagnostics.
          </div>
        </footer>
      </div>
    );
  }

  // Navigation tabs based on user role
  const tabs = [
    { id: "recommendation", label: "Crop Suitability AI", icon: Sprout },
    { id: "dashboard", label: "Telemetry Dashboard", icon: Activity },
    { id: "soil", label: "Soil & Crop Optimizer", icon: Sparkles },
    { id: "chatbot", label: "OptiBot AI Assistant", icon: Bot },
    { id: "simulator", label: "Yield Simulator", icon: Sliders },
    { id: "policy", label: "Research & Policy", icon: BarChart2 },
    { id: "settings", label: "Profile Settings", icon: Settings },
  ];

  if (user.role === "Administrator") {
    tabs.push({ id: "admin", label: "System Admin", icon: Shield });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans relative">
      {/* Dynamic Earth-Toned Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/35 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-sky-100/35 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-md flex items-center justify-center">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xl font-black text-emerald-950 tracking-tight">
                  OptiCrop
                </span>
                <span className="block text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest">
                  Agricultural Optimization Engine
                </span>
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <nav className="hidden md:flex space-x-1 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition ${
                      isSelected
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-gray-600 hover:text-emerald-700 hover:bg-gray-200/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Profile Menu Widget */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100/85 border border-emerald-100 rounded-full transition bg-white"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.displayName)}`}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full bg-slate-50 border border-emerald-100"
                  />
                  <div className="text-left leading-tight shrink-0">
                    <span className="block text-xs font-black text-gray-800">{user.displayName}</span>
                    <span className="block text-[9px] text-emerald-700 font-extrabold uppercase tracking-widest">{user.role}</span>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      {/* Click outside backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-xl py-3 z-50 text-xs font-bold text-gray-750"
                      >
                        <div className="px-4 py-2.5 border-b border-gray-50 pb-3 mb-2 text-left">
                          <span className="block text-gray-400 text-[8px] uppercase font-black">Authorized Organization</span>
                          <span className="block text-emerald-950 text-sm font-black line-clamp-1">{user.organization || "Independent Cooperative"}</span>
                          <span className="block text-[10px] text-gray-450 font-semibold mt-0.5">{user.email}</span>
                        </div>

                        <button
                          onClick={handleOpenProfileModal}
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-950 transition flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4 text-emerald-600" />
                          Quick Edit Details
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("settings");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-950 transition flex items-center gap-2"
                        >
                          <UserIcon className="h-4 w-4 text-emerald-600" />
                          Profile Settings Hub
                        </button>

                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-rose-50 hover:text-rose-700 text-rose-600 transition flex items-center gap-2 border-t border-gray-50 mt-2 pt-2.5"
                        >
                          <LogOut className="h-4 w-4 text-rose-500" />
                          Sign Out Session
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-emerald-100 bg-white"
            >
              <div className="px-4 py-3 space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 text-xs font-bold p-3 rounded-xl transition ${
                        isSelected
                          ? "bg-emerald-700 text-white"
                          : "text-gray-600 hover:text-emerald-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {/* Mobile Session Profile Section */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.displayName)}`}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full border border-emerald-200"
                    />
                    <div className="text-left leading-tight">
                      <span className="block text-xs font-black text-gray-800">{user.displayName}</span>
                      <span className="block text-[9px] text-emerald-700 font-extrabold uppercase tracking-widest">{user.role}</span>
                      <span className="block text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-1">{user.organization}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleOpenProfileModal();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-black text-gray-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <Settings className="h-3.5 w-3.5 text-gray-500" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Primary Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "recommendation" && <CropRecommender />}

            {/* Role locked checking for Policy and Research */}
            {activeTab === "policy" && (
              user.role === "Farmer" ? (
                <div className="max-w-2xl mx-auto bg-white border border-emerald-100/80 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                  
                  <div className="inline-flex p-4 bg-sky-50 rounded-2xl text-sky-700 border border-sky-100 mb-4">
                    <Lock className="h-8 w-8 text-sky-600" />
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 mb-2">
                    Research & Policy Module Restricted
                  </h3>
                  
                  <p className="text-xs text-gray-500 font-semibold mb-6 leading-relaxed">
                    Access to high-fidelity agricultural simulation models, multi-year yield data, 
                    and legislative policy formulation tools is restricted to <strong>Agricultural Researchers</strong>, 
                    <strong>Policymakers</strong>, and <strong>Administrators</strong>.
                  </p>
                  
                  <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2 mb-6">
                    <span className="block text-[10px] text-gray-400 uppercase font-black tracking-wider">How to unlock access:</span>
                    <p className="text-xs text-gray-600 font-bold leading-relaxed">
                      You can experience these advanced tools instantly by clicking your profile picture at the top right, 
                      selecting <strong>Edit Profile Details</strong>, changing your Security Role to 
                      <strong>Researcher</strong> or <strong>Policymaker</strong>, and saving your changes.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab("recommendation")}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black transition shadow-md"
                  >
                    Return to Crop Suitability AI
                  </button>
                </div>
              ) : (
                <PolicyAnalytics />
              )
            )}

            {activeTab === "dashboard" && (
              <Dashboard
                zones={zones}
                onToggleIrrigation={handleToggleIrrigation}
                onToggleShade={handleToggleShade}
                onUpdateFertilizer={handleUpdateFertilizer}
                onSelectZone={(id) => {
                  setActiveTab("simulator");
                }}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                }}
              />
            )}

            {activeTab === "soil" && <SoilAnalyzer />}

            {activeTab === "chatbot" && <OptiBot />}

            {activeTab === "simulator" && (
              <Simulator zones={zones} onUpdateZone={handleUpdateZone} />
            )}

            {activeTab === "settings" && (
              <SettingsPanel />
            )}

            {activeTab === "admin" && user.role === "Administrator" && (
              <AdminPanel
                zones={zones}
                onAddZone={handleAddZone}
                onDeleteZone={handleDeleteZone}
                onUpdateZone={handleUpdateZone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-1.5">
                <Settings className="h-5 w-5 text-emerald-700" />
                Edit Profile Details
              </h3>
              <p className="text-xs text-gray-400 font-bold mb-4">Modify your authorized user profile parameters.</p>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold">
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

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 block">Associated Organization</label>
                  <input
                    type="text"
                    value={editOrg}
                    onChange={(e) => setEditOrg(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Security Role</label>
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
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 block">Avatar Style Seed</label>
                    <input
                      type="text"
                      placeholder="e.g. happy-seed"
                      value={editAvatar.includes("dicebear") ? decodeURIComponent(editAvatar.split("seed=")[1] || "") : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(val || editName)}`);
                      }}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-gray-50 transition"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {profileSaveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4 text-emerald-600" />
                      Profile changes updated securely.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
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

      {/* Status Bar Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-bold">
            &copy; {new Date().getFullYear()} OptiCrop – Intelligent Agronomical Core & Precision Diagnostics.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Precision Cloud Online
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5 text-blue-500" /> Moisture Balance Guarded
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
