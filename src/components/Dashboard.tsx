import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Droplet,
  Thermometer,
  Sprout,
  Sparkles,
  TrendingUp,
  Sun,
  AlertTriangle,
  Activity,
  CheckCircle,
  Clock,
  Gauge,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { FarmZone } from "../types";

interface DashboardProps {
  zones: FarmZone[];
  onToggleIrrigation: (id: string) => void;
  onToggleShade: (id: string) => void;
  onUpdateFertilizer: (id: string, value: number) => void;
  onSelectZone: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function Dashboard({
  zones,
  onToggleIrrigation,
  onToggleShade,
  onUpdateFertilizer,
  onSelectZone,
  onNavigateToTab,
}: DashboardProps) {
  const [logs, setLogs] = useState<string[]>([
    "06:30 AM - OptiCrop Engine calculated crop water requirements for all zones.",
    "06:15 AM - Automated drip irrigation activated in Zone B due to soil moisture falling below 30%.",
    "05:00 AM - Nitrogen levels in Zone A flagged as moderately low (35 ppm). Suggested urea feed.",
    "Yesterday - Weather sync completed: Solar exposure index forecast is 8.5/10. Shade control standby.",
  ]);

  // Aggregate stats
  const avgMoisture = Math.round(zones.reduce((acc, z) => acc + z.moisture, 0) / zones.length);
  const avgHealth = Math.round(zones.reduce((acc, z) => acc + z.healthIndex, 0) / zones.length);
  const activeIrrigationCount = zones.filter((z) => z.irrigationActive).length;
  const avgTemp = (zones.reduce((acc, z) => acc + z.temperature, 0) / zones.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-600/30 blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-teal-600/30 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-emerald-300" />
              Autonomous Engine Active
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              OptiCrop Intelligent Core
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-xl font-medium">
              Real-time biome optimization, automated soil mineral chemistry balances, and AI-driven agricultural planning models are active.
            </p>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <span className="block text-xs text-emerald-200 uppercase font-bold tracking-wider mb-0.5">Farm Health</span>
              <span className="text-3xl font-extrabold">{avgHealth}%</span>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <span className="block text-xs text-emerald-200 uppercase font-bold tracking-wider mb-0.5">Water Savings</span>
              <span className="text-3xl font-extrabold text-emerald-300">+28%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Telemetry Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Droplet className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Soil Moisture</span>
            <span className="text-2xl font-bold text-gray-800">{avgMoisture}%</span>
            <span className="block text-xs text-emerald-600 font-semibold mt-0.5">Optimal Range: 30-45%</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Mean Bio-Temp</span>
            <span className="text-2xl font-bold text-gray-800">{avgTemp}°C</span>
            <span className="block text-xs text-gray-500 font-semibold mt-0.5">Ideal Crop Growth</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Active Zones</span>
            <span className="text-2xl font-bold text-gray-800">{zones.length} Fields</span>
            <span className="block text-xs text-emerald-600 font-semibold mt-0.5">Multi-Crop Monitoring</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Irrigation Valves</span>
            <span className="text-2xl font-bold text-gray-800">{activeIrrigationCount} Open</span>
            <span className="block text-xs text-cyan-600 font-semibold mt-0.5">{activeIrrigationCount > 0 ? "Delivering Water" : "Pipes Standby"}</span>
          </div>
        </div>
      </div>

      {/* Primary Workspace Grid: Zones & Diagnostic Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Zone Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-emerald-600" />
                  Crop Zones Real-Time Telemetry
                </h2>
                <p className="text-xs text-gray-500 mt-1">Direct control over active hydration and solar protective canopies per zone.</p>
              </div>
              <button
                onClick={() => onNavigateToTab("simulator")}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                Simulator Mode <Sliders className="h-3 w-3" />
              </button>
            </div>

            {/* Zone List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md hover:border-emerald-200 transition relative overflow-hidden group"
                >
                  {/* Visual health bar gradient */}
                  <div
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${zone.healthIndex}%` }}
                  ></div>

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-emerald-700 transition">
                        {zone.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Sprout className="h-3 w-3 text-emerald-500" />
                        {zone.crop} ({zone.growthStage})
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        zone.healthIndex > 80
                          ? "bg-emerald-50 text-emerald-700"
                          : zone.healthIndex > 60
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {zone.healthIndex}% Health
                    </span>
                  </div>

                  {/* Core Stats inside Zone */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-2.5 rounded-xl text-center text-xs font-medium text-gray-600 mb-4">
                    <div>
                      <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Moisture</span>
                      <span className="font-bold text-gray-800">{zone.moisture}%</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Temp</span>
                      <span className="font-bold text-gray-800">{zone.temperature}°C</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Fertilizer</span>
                      <span className="font-bold text-gray-800">{zone.fertilizerRate} L/h</span>
                    </div>
                  </div>

                  {/* Controls per Zone */}
                  <div className="flex gap-2 justify-between">
                    <button
                      onClick={() => onToggleIrrigation(zone.id)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        zone.irrigationActive
                          ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <Droplet className={`h-3.5 w-3.5 ${zone.irrigationActive ? "animate-bounce" : ""}`} />
                      {zone.irrigationActive ? "Irrigation ON" : "Irrigate"}
                    </button>
                    <button
                      onClick={() => onToggleShade(zone.id)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        zone.shadeCover
                          ? "bg-amber-500 text-white shadow-xs hover:bg-amber-600"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5" />
                      {zone.shadeCover ? "Shade ON" : "Shade Off"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Logs & Activity */}
        <div className="space-y-6">
          <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-3xl shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-emerald-600" />
              Engine Log Ticker
            </h2>
            <p className="text-xs text-gray-500 mb-4">Live feedback stream of the automated agricultural optimization controllers.</p>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed group">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-125 transition mt-1.5"></div>
                    {idx < logs.length - 1 && <div className="w-0.5 bg-gray-100 flex-1 my-1"></div>}
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium group-hover:text-emerald-800 transition">{log}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> System Synced
              </span>
              <button
                onClick={() => setLogs(prev => ["just now - Dynamic sensor scan triggered manually.", ...prev])}
                className="text-xs text-gray-400 hover:text-emerald-600 transition flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="h-3 w-3" /> Refresh Diagnostics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA to AI Assistant */}
      <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">Need specific soil chemistry diagnosis?</h3>
            <p className="text-xs text-emerald-700 mt-1">Let our server-side deep learning model evaluate your field and suggest NPK balancing inputs.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab("soil")}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center gap-2 group whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          Diagnose Soil with AI <Play className="h-3 w-3 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
}
