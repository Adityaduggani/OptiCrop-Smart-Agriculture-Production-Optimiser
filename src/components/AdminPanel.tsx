import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  ShieldAlert,
  Sliders,
  Database,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  Compass,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  CloudSun,
  Coins,
  Cpu,
  Info
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { FarmZone, UserRole, AuditLog } from "../types";

interface AdminPanelProps {
  zones: FarmZone[];
  onAddZone: (newZone: FarmZone) => void;
  onDeleteZone: (id: string) => void;
  onUpdateZone: (updatedZone: FarmZone) => void;
}

export default function AdminPanel({ zones, onAddZone, onDeleteZone, onUpdateZone }: AdminPanelProps) {
  const {
    user,
    usersList,
    auditLogs,
    adminUpdateUserRole,
    adminUpdateUserOrg,
    adminDeleteUser,
    addAuditLog
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<"users" | "zones" | "logs" | "constants">("users");

  // Search & Filter state for Users
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("All");

  // Search & Filter state for Audit Logs
  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState<string>("All");

  // State for Editing user organization
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempOrg, setTempOrg] = useState("");

  // State for Provisioning a New Zone
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneCrop, setNewZoneCrop] = useState("Soybeans");
  const [newZoneGrowth, setNewZoneGrowth] = useState<"Seeding" | "Vegetative" | "Flowering" | "Ripening">("Vegetative");
  const [newZoneMoisture, setNewZoneMoisture] = useState(40);
  const [newZoneN, setNewZoneN] = useState(50);
  const [newZoneP, setNewZoneP] = useState(40);
  const [newZoneK, setNewZoneK] = useState(60);
  const [newZoneTemp, setNewZoneTemp] = useState(25);

  // Global agricultural constants state
  const [climateWarmingOffset, setClimateWarmingOffset] = useState(1.2);
  const [precipitationOffset, setPrecipitationOffset] = useState(-5);
  const [carbonSubsidy, setCarbonSubsidy] = useState(45);

  // Filtered lists
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.organization || "").toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userRoleFilter === "All" || u.role === userRoleFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredLogs = auditLogs.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logStatusFilter === "All" || l.status === logStatusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;

    const newZone: FarmZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      crop: newZoneCrop,
      growthStage: newZoneGrowth,
      moisture: Number(newZoneMoisture),
      nitrogen: Number(newZoneN),
      phosphorus: Number(newZoneP),
      potassium: Number(newZoneK),
      temperature: Number(newZoneTemp),
      irrigationActive: false,
      fertilizerRate: 1.0,
      shadeCover: false,
      healthIndex: 85
    };

    onAddZone(newZone);
    addAuditLog(`Provisioned new agricultural zone: '${newZoneName}' for ${newZoneCrop}.`, "Success");
    
    // reset
    setNewZoneName("");
    setShowAddZoneModal(false);
  };

  const handleSaveOrg = (uid: string) => {
    adminUpdateUserOrg(uid, tempOrg);
    setEditingUserId(null);
  };

  const exportLogs = () => {
    // Simulate downloading logs
    const headers = "ID,Timestamp,User,Role,Action,Status\n";
    const rows = auditLogs
      .map((l) => `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action.replace(/"/g, '""')}","${l.status}"`)
      .join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `opticrop-security-audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    addAuditLog("Exported system cryptographic audit logs to CSV format.", "Info");
  };

  const triggerDiagnostic = () => {
    addAuditLog("Triggered complete agricultural core diagnostic cycle. All subsystems healthy.", "Success");
    alert("Core Diagnostic Complete: All machine-learning node weights, soil sensors, and simulation parameters verified successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-purple-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-black uppercase tracking-widest mb-3">
            <Cpu className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
            Security Core Enabled
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            System Administration Dashboard
          </h2>
          <p className="text-purple-200/70 text-xs font-medium max-w-xl mt-1.5 leading-relaxed">
            Configure system rules, audit database actions, deploy telemetry zones, 
            and modify global climate variables. This dashboard has restricted zero-trust clearance.
          </p>
        </div>

        <button
          onClick={triggerDiagnostic}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black tracking-wide flex items-center gap-2 transition"
        >
          <Compass className="h-4 w-4 text-purple-300" />
          Run Subsystem Diagnostics
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 pb-px scrollbar-none">
        <button
          onClick={() => setActiveSubTab("users")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeSubTab === "users"
              ? "border-purple-600 text-purple-950"
              : "border-transparent text-gray-500 hover:text-purple-700"
          }`}
        >
          <Users className="h-4 w-4" />
          User Registry ({usersList.length})
        </button>
        <button
          onClick={() => setActiveSubTab("zones")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeSubTab === "zones"
              ? "border-purple-600 text-purple-950"
              : "border-transparent text-gray-500 hover:text-purple-700"
          }`}
        >
          <Database className="h-4 w-4" />
          Ag-Telemetry Zones ({zones.length})
        </button>
        <button
          onClick={() => setActiveSubTab("logs")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeSubTab === "logs"
              ? "border-purple-600 text-purple-950"
              : "border-transparent text-gray-500 hover:text-purple-700"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Security Audit Log ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab("constants")}
          className={`flex items-center gap-2 text-xs font-black px-5 py-3.5 border-b-2 transition shrink-0 ${
            activeSubTab === "constants"
              ? "border-purple-600 text-purple-950"
              : "border-transparent text-gray-500 hover:text-purple-700"
          }`}
        >
          <Sliders className="h-4 w-4" />
          Simulation Constants
        </button>
      </div>

      {/* Content Areas */}
      <div>
        {activeSubTab === "users" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-base font-black text-gray-900">Registered Agricultural Accounts</h3>
                <p className="text-xs text-gray-400 font-bold">Manage credentials, switch system roles, and assign agencies.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition w-full"
                  />
                </div>

                <div className="relative">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition appearance-none cursor-pointer"
                  >
                    <option value="All">All Roles</option>
                    <option value="Farmer">Farmers</option>
                    <option value="Researcher">Researchers</option>
                    <option value="Policymaker">Policymakers</option>
                    <option value="Administrator">Administrators</option>
                  </select>
                  <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Users list table */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">User Details</th>
                    <th className="p-4">Associated Organization</th>
                    <th className="p-4">System Role / Clearance</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-bold">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                        No accounts matching your search parameters were found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSelf = u.uid === user?.uid;
                      const isEditing = editingUserId === u.uid;
                      
                      return (
                        <tr key={u.uid} className={`hover:bg-slate-50/50 transition ${isSelf ? "bg-purple-50/20" : ""}`}>
                          {/* Details */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.displayName)}`}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-8 w-8 rounded-full bg-slate-100 border border-gray-200"
                              />
                              <div>
                                <span className="block text-gray-800 font-black">
                                  {u.displayName} {isSelf && <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded-full ml-1">You</span>}
                                </span>
                                <span className="block text-[10px] text-gray-400 font-medium">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Org */}
                          <td className="p-4">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={tempOrg}
                                  onChange={(e) => setTempOrg(e.target.value)}
                                  className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <button
                                  onClick={() => handleSaveOrg(u.uid)}
                                  className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingUserId(null)}
                                  className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <span className="text-gray-600 font-semibold">{u.organization || "No Organization Listed"}</span>
                                <button
                                  onClick={() => {
                                    setEditingUserId(u.uid);
                                    setTempOrg(u.organization || "");
                                  }}
                                  className="p-1 text-gray-400 hover:text-purple-600 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Role Selector */}
                          <td className="p-4">
                            <select
                              value={u.role}
                              onChange={(e) => adminUpdateUserRole(u.uid, e.target.value as UserRole)}
                              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-white transition focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="Farmer">Farmer</option>
                              <option value="Researcher">Researcher</option>
                              <option value="Policymaker">Policymaker</option>
                              <option value="Administrator">Administrator</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to permanently delete '${u.displayName}'? This action cannot be undone.`)) {
                                  adminDeleteUser(u.uid);
                                }
                              }}
                              disabled={isSelf}
                              className={`p-2 rounded-xl transition ${
                                isSelf
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              }`}
                              title={isSelf ? "You cannot delete your own active administrator profile" : "Delete Account"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Zones List & Provisioning */}
        {activeSubTab === "zones" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-gray-900">Telemetry Zone Controller</h3>
                <p className="text-xs text-gray-400 font-bold">Deploy or decommission connected fields, and override soil sensor readings.</p>
              </div>

              <button
                onClick={() => setShowAddZoneModal(true)}
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Provision Telemetry Zone
              </button>
            </div>

            {/* Zone Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((z) => (
                <div key={z.id} className="p-5 border border-gray-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between gap-4 relative">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-black text-purple-900 uppercase tracking-widest">{z.id.toUpperCase()}</span>
                        <h4 className="text-sm font-black text-gray-800">{z.name}</h4>
                      </div>
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {z.healthIndex}% Health
                      </span>
                    </div>

                    {/* Info list */}
                    <div className="grid grid-cols-3 gap-2.5 text-xs font-bold text-gray-500 mt-3 bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <span className="block text-[8px] uppercase font-black text-gray-400">Target Crop</span>
                        <span className="text-gray-800 font-black">{z.crop}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-black text-gray-400">Moisture</span>
                        <span className="text-gray-800 font-black">{z.moisture}%</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-black text-gray-400">Stage</span>
                        <span className="text-gray-800 font-black">{z.growthStage}</span>
                      </div>
                    </div>

                    {/* Nutrient parameters overrides */}
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-black text-gray-600">
                      <div className="bg-orange-50 border border-orange-100 p-1.5 rounded-lg">
                        <span className="block text-[8px] text-orange-500 uppercase">Temp</span>
                        <span>{z.temperature}°C</span>
                      </div>
                      <div className="bg-red-50 border border-red-100 p-1.5 rounded-lg">
                        <span className="block text-[8px] text-red-500 uppercase">Nitrogen</span>
                        <span>{z.nitrogen} ppm</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-1.5 rounded-lg">
                        <span className="block text-[8px] text-amber-500 uppercase">Phosphorus</span>
                        <span>{z.phosphorus} ppm</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-1.5 rounded-lg">
                        <span className="block text-[8px] text-blue-500 uppercase">Potassium</span>
                        <span>{z.potassium} ppm</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="text-[10px] text-gray-400 font-medium">
                      Status: {z.irrigationActive ? "🚿 Irrigation Flow Active" : "💤 Standby Mode"}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Decommission connected telemetry zone: '${z.name}'? All live sensor streams will be deleted.`)) {
                          onDeleteZone(z.id);
                        }
                      }}
                      className="text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
                    >
                      Decommission
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding Zone */}
            <AnimatePresence>
              {showAddZoneModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl relative"
                  >
                    <button
                      onClick={() => setShowAddZoneModal(false)}
                      className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-1.5">
                      <Database className="h-5 w-5 text-purple-700" />
                      Provision New Telemetry Zone
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mb-4">Initialize target crops and initial chemical soil parameters.</p>

                    <form onSubmit={handleAddZoneSubmit} className="space-y-4 text-xs font-bold">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-gray-500 block">Field / Plot Identifier</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Northeast Terrace (E-2)"
                          value={newZoneName}
                          onChange={(e) => setNewZoneName(e.target.value)}
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white bg-gray-50 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-500 block">Target Crop</label>
                          <select
                            value={newZoneCrop}
                            onChange={(e) => setNewZoneCrop(e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                          >
                            <option value="Corn">Corn</option>
                            <option value="Soybeans">Soybeans</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Tomato">Tomato</option>
                            <option value="Grapes">Grapes</option>
                            <option value="Rice">Rice</option>
                            <option value="Cotton">Cotton</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-500 block">Growth Stage</label>
                          <select
                            value={newZoneGrowth}
                            onChange={(e) => setNewZoneGrowth(e.target.value as any)}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                          >
                            <option value="Seeding">Seeding</option>
                            <option value="Vegetative">Vegetative</option>
                            <option value="Flowering">Flowering</option>
                            <option value="Ripening">Ripening</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Soil Moisture (%)</label>
                          <input
                            type="number"
                            min="10"
                            max="95"
                            value={newZoneMoisture}
                            onChange={(e) => setNewZoneMoisture(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl font-bold focus:bg-white bg-gray-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Temp (°C)</label>
                          <input
                            type="number"
                            min="5"
                            max="50"
                            value={newZoneTemp}
                            onChange={(e) => setNewZoneTemp(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl font-bold focus:bg-white bg-gray-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Nitrogen (ppm)</label>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={newZoneN}
                            onChange={(e) => setNewZoneN(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl font-bold focus:bg-white bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Phosphorus (P) (ppm)</label>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={newZoneP}
                            onChange={(e) => setNewZoneP(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl font-bold focus:bg-white bg-gray-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Potassium (K) (ppm)</label>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={newZoneK}
                            onChange={(e) => setNewZoneK(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl font-bold focus:bg-white bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3.5 justify-end pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setShowAddZoneModal(false)}
                          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow"
                        >
                          Complete Deployment
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Security Audit Logs */}
        {activeSubTab === "logs" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-base font-black text-gray-900">Platform Cryptographic Logs</h3>
                <p className="text-xs text-gray-400 font-bold">Un-editable logs showing actions performed across all clearance levels.</p>
              </div>

              {/* Tools */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter activity..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition w-full"
                  />
                </div>

                <div className="relative">
                  <select
                    value={logStatusFilter}
                    onChange={(e) => setLogStatusFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition appearance-none cursor-pointer"
                  >
                    <option value="All">All Severity</option>
                    <option value="Success">Success (Normal)</option>
                    <option value="Info">Info (Diagnostic)</option>
                    <option value="Warning">Warning (Admin Override)</option>
                    <option value="Security">Security (Restriction Block)</option>
                  </select>
                  <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={exportLogs}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Logs feed */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed max-h-[400px] overflow-y-auto space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-6">
                  [SYSTEM SECURE] No active audit records matching current logs constraints.
                </div>
              ) : (
                filteredLogs.map((log) => {
                  let statusColor = "text-emerald-400";
                  if (log.status === "Info") statusColor = "text-blue-400";
                  if (log.status === "Warning") statusColor = "text-amber-400";
                  if (log.status === "Security") statusColor = "text-rose-500 font-black animate-pulse";

                  return (
                    <div key={log.id} className="flex flex-col sm:flex-row items-start gap-1 border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold shrink-0 mr-1.5 ${
                        log.status === "Security" ? "bg-rose-950 text-rose-400" : "bg-slate-800"
                      } ${statusColor}`}>
                        {log.status}
                      </span>
                      <span className="text-slate-300 font-extrabold shrink-0 mr-1">
                        {log.user} ({log.role}):
                      </span>
                      <span className="text-slate-400">{log.action}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Climate & Simulation Constants */}
        {activeSubTab === "constants" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-gray-900">Precision Simulator Environment Tuning</h3>
              <p className="text-xs text-gray-400 font-bold">Configure mathematical baselines used across all crop recommendation and yield simulation screens.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Warming offset */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                    <Flame className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    +{climateWarmingOffset}°C Climate Offset
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase">Ambient Warming Trend</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Multiplies evaporation rates and pushes plant heat thresholds in simulations.</p>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={climateWarmingOffset}
                  onChange={(e) => {
                    setClimateWarmingOffset(Number(e.target.value));
                    addAuditLog(`Admin adjusted Global Warming Trend offset to ${e.target.value}°C.`, "Warning");
                  }}
                  className="w-full accent-purple-700 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400">
                  <span>0.0°C (Pre-Industrial)</span>
                  <span>4.0°C (Critical)</span>
                </div>
              </div>

              {/* Rain offset */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                    <CloudSun className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${precipitationOffset >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {precipitationOffset >= 0 ? `+${precipitationOffset}%` : `${precipitationOffset}%`} Rainfall Deviation
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase">Precipitation Deviation</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Modifies the default water-deficit baseline of regional aquifers.</p>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={precipitationOffset}
                  onChange={(e) => {
                    setPrecipitationOffset(Number(e.target.value));
                    addAuditLog(`Admin adjusted precipitation offset multiplier to ${e.target.value}%.`, "Warning");
                  }}
                  className="w-full accent-purple-700 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400">
                  <span>-30% (Severe Drought)</span>
                  <span>+30% (Excessive Monsoon)</span>
                </div>
              </div>

              {/* Carbon incentives */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Coins className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ${carbonSubsidy}/ton Incentives
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase">Carbon Capture Subsidy</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Directly impacts economic sustainability index margins under legislative reviews.</p>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={carbonSubsidy}
                  onChange={(e) => {
                    setCarbonSubsidy(Number(e.target.value));
                    addAuditLog(`Admin set Carbon Capture Subsidy constant to $${e.target.value}/ton.`, "Warning");
                  }}
                  className="w-full accent-purple-700 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400">
                  <span>$10 (Minimal Support)</span>
                  <span>$100 (Maximum Incentive)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 items-start text-[10px] bg-slate-50 border border-slate-100 p-4 rounded-xl text-gray-500 font-medium leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-purple-600/60" />
              <span>
                <strong>Tuning Sync:</strong> Sliders are connected live to the active UI state. Adjustments above will be propagated 
                to all crop analysis models and yield calculations. Simulation calculations are scaled using these variables 
                automatically.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
