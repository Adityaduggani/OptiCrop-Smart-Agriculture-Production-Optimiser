import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Compass,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Globe,
  DollarSign,
  HeartPulse,
  Leaf,
  BarChart2,
  FileText,
  HelpCircle,
  Briefcase,
  Activity,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { PolicyAnalyticsReport } from "../types";

export default function PolicyAnalytics() {
  const [region, setRegion] = useState<string>("Midwest Plains");
  const [policyObjective, setPolicyObjective] = useState<string>("Water Conservation");
  const [cropFocus, setCropFocus] = useState<string>("Cereals & Grains");
  const [climateThreat, setClimateThreat] = useState<string>("Prolonged Drought");

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<PolicyAnalyticsReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Harvesting regional meteorological historical indexes...",
    "Simulating policy-driven macro-economic adaptation factors...",
    "Modeling multi-year resource depletion and carbon curves...",
    "Assembling strategic subsidy models and insights...",
  ];

  const presets = [
    {
      name: "Arid Belt Aquifer Protection Initiative",
      region: "Arid Highlands",
      policyObjective: "Water Conservation",
      cropFocus: "Cereals & Grains",
      climateThreat: "Prolonged Drought",
    },
    {
      name: "Delta Soil Recovery & Salinity Mitigation",
      region: "Humid Delta",
      policyObjective: "Soil Carbon Sequestration",
      cropFocus: "Legumes & Pulses",
      climateThreat: "Soil Salinization",
    },
    {
      name: "Coastal Erosion & Storm Resilience Action",
      region: "Pacific Coastline",
      policyObjective: "Drought Resilience",
      cropFocus: "Root Crops & Tubers",
      climateThreat: "Unpredictable Flooding",
    },
    {
      name: "High-Yield Low-Emission Grain Compact",
      region: "Midwest Plains",
      policyObjective: "Minimize Fertilizer Runoff",
      cropFocus: "Cereals & Grains",
      climateThreat: "Extreme Heatwaves",
    },
  ];

  // Map Region polygons / nodes
  const mapZones = [
    { id: "Midwest Plains", name: "Zone 1: Midwest Plains", path: "M 40 40 L 140 40 L 120 120 L 40 100 Z", fill: "fill-emerald-800/15 hover:fill-emerald-800/30", stroke: "stroke-emerald-600" },
    { id: "Pacific Coastline", name: "Zone 2: Pacific Coastline", path: "M 10 30 L 35 30 L 35 150 L 10 150 Z", fill: "fill-blue-800/15 hover:fill-blue-800/30", stroke: "stroke-blue-600" },
    { id: "Arid Highlands", name: "Zone 3: Arid Highlands", path: "M 40 100 L 120 120 L 100 180 L 30 170 Z", fill: "fill-amber-800/15 hover:fill-amber-800/30", stroke: "stroke-amber-600" },
    { id: "Humid Delta", name: "Zone 4: Humid Delta", path: "M 140 40 L 240 50 L 220 150 L 120 120 Z", fill: "fill-teal-800/15 hover:fill-teal-800/30", stroke: "stroke-teal-600" },
    { id: "Subtropical Valley", name: "Zone 5: Subtropical Valley", path: "M 120 120 L 220 150 L 200 190 L 100 180 Z", fill: "fill-green-800/15 hover:fill-green-800/30", stroke: "stroke-green-600" },
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1100);

    try {
      const response = await fetch("/api/policy-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          policyObjective,
          cropFocus,
          climateThreat,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        throw new Error(data.error || "Policy analytics simulation failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Model failed to produce high-fidelity projections.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const applyPreset = (p: typeof presets[0]) => {
    setRegion(p.region);
    setPolicyObjective(p.policyObjective);
    setCropFocus(p.cropFocus);
    setClimateThreat(p.climateThreat);
  };

  return (
    <div className="space-y-8 text-gray-800">
      {/* Policy Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-blue-950 p-8 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
            <Globe className="h-3.5 w-3.5 text-teal-300" />
            Strategic Research Division
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
            Agricultural Research & Policy Analytics
          </h2>
          <p className="text-teal-100/90 text-sm font-medium leading-relaxed max-w-3xl">
            This module provides researchers, government agencies, and agricultural organizations with 
            deep climate-crop relational models. Analyze land-use suitability, project production yields 
            under policy regimes, minimize ecological footprints, and design smart subsidy plans.
          </p>
        </div>
      </div>

      {/* Preset Initiatives Section */}
      <div className="backdrop-blur-md bg-white/70 border border-emerald-100/60 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="h-4.5 w-4.5 text-emerald-700" /> Rapid Policy Templates:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 font-bold py-2 px-3 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all shadow-3xs"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel: Policy Constraints & Interactive Map */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleAnalyze}
            className="backdrop-blur-md bg-white/90 border border-emerald-100/70 p-6 rounded-3xl shadow-xs space-y-4"
          >
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-600" />
                Scenario Specifications
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Model Parameters</span>
            </div>

            {/* Parameter Selections */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Target Agro-Climatic Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Midwest Plains">Midwest Plains (Zone 1 - High Fertility)</option>
                  <option value="Pacific Coastline">Pacific Coastline (Zone 2 - Maritime Cool)</option>
                  <option value="Arid Highlands">Arid Highlands (Zone 3 - Low Rain / High Elevation)</option>
                  <option value="Humid Delta">Humid Delta (Zone 4 - Wetlands / Saturated)</option>
                  <option value="Subtropical Valley">Subtropical Valley (Zone 5 - High Heat / Humid)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Policy / Conservation Objective</label>
                <select
                  value={policyObjective}
                  onChange={(e) => setPolicyObjective(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Water Conservation">Water Conservation (Optimize Water Resource index)</option>
                  <option value="Soil Carbon Sequestration">Soil Carbon Sequestration (Maximize Organic Matter)</option>
                  <option value="Minimize Fertilizer Runoff">Minimize Fertilizer Runoff (Prevent Nitrogen Sinks)</option>
                  <option value="Drought Resilience">Drought Resilience (Cultivar Adaptations)</option>
                  <option value="Maximize Economic Yield">Maximize Economic Yield (Agribusiness Expansion)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Focus Crop Category</label>
                <select
                  value={cropFocus}
                  onChange={(e) => setCropFocus(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cereals & Grains">Cereals & Grains (Wheat, Barley, Maize, Rice)</option>
                  <option value="Legumes & Pulses">Legumes & Pulses (Soybeans, Lentils, Peas)</option>
                  <option value="Root Crops & Tubers">Root Crops & Tubers (Potatoes, Cassava)</option>
                  <option value="Cash Crops (Cotton, Tobacco)">Cash Crops (Cotton, Sugarcane)</option>
                  <option value="Orchard Fruits & Nuts">Orchard Fruits & Nuts (Almonds, Apples, Oranges)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Climate Threat Profile</label>
                <select
                  value={climateThreat}
                  onChange={(e) => setClimateThreat(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Prolonged Drought">Prolonged Drought (Severe Aquifer Depletion)</option>
                  <option value="Extreme Heatwaves">Extreme Heatwaves (Transpiration Spikes / Wilting)</option>
                  <option value="Unpredictable Flooding">Unpredictable Flooding (Soil Saturation & Anoxia)</option>
                  <option value="Soil Salinization">Soil Salinization (Salty Subsurfaces / Osmotic Lock)</option>
                  <option value="Pest Infestations">Pest Infestations (Migration Patterns under Warming)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-teal-800 via-emerald-800 to-blue-900 hover:from-teal-900 hover:to-blue-950 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Running Predictive Models...
                </>
              ) : (
                <>
                  Run Policy Analytics Modeling
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Elegant Interactive SVG Vector Map Card */}
          <div className="backdrop-blur-md bg-white/90 border border-emerald-100/70 p-5 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                <Globe className="h-4 w-4 text-emerald-700" /> Regional Zoning Map
              </span>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                Click Zone to Select
              </span>
            </div>

            <p className="text-[11px] text-gray-500 leading-normal">
              Select your region quickly by clicking or tapping any highlightable agricultural zone on the regional layout schematic below:
            </p>

            <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-4 flex items-center justify-center relative">
              <svg viewBox="0 0 250 200" className="w-full max-w-[320px] h-auto">
                {/* Background grid representation */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="250" height="200" fill="url(#grid)" className="rounded-lg" />

                {/* Land masses / boundaries */}
                {mapZones.map((zone) => {
                  const isActive = region === zone.id;
                  return (
                    <g key={zone.id} className="cursor-pointer" onClick={() => setRegion(zone.id)}>
                      <path
                        d={zone.path}
                        className={`${zone.fill} transition-all duration-300 ${
                          isActive
                            ? "fill-emerald-600/40 stroke-emerald-600 stroke-2 filter drop-shadow-sm"
                            : "stroke-gray-300 stroke-1"
                        }`}
                      />
                      {/* Interactive indicator pin for active zone */}
                      {isActive && (
                        <circle
                          cx={zone.id === "Midwest Plains" ? "90" : zone.id === "Pacific Coastline" ? "22" : zone.id === "Arid Highlands" ? "75" : zone.id === "Humid Delta" ? "180" : "160"}
                          cy={zone.id === "Midwest Plains" ? "70" : zone.id === "Pacific Coastline" ? "90" : zone.id === "Arid Highlands" ? "135" : zone.id === "Humid Delta" ? "95" : "155"}
                          r="5"
                          className="fill-emerald-600 animate-pulse stroke-white stroke-2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip legend for map */}
              <div className="absolute bottom-2 left-2 text-[9px] text-gray-500 space-y-0.5 bg-white/95 border border-gray-100 p-1.5 rounded-md shadow-2xs">
                {mapZones.map((z) => (
                  <div key={z.id} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${region === z.id ? "bg-emerald-600" : "bg-gray-300"}`} />
                    <span className={`${region === z.id ? "font-bold text-gray-800" : "text-gray-400"}`}>{z.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Simulation Outcomes, Analytics, Charts */}
        <div className="lg:col-span-7 h-full flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-policy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="backdrop-blur-md bg-white/80 border border-emerald-100 p-12 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center min-h-[550px] space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping"></div>
                  <div className="relative p-6 bg-emerald-50 text-emerald-800 rounded-full">
                    <Activity className="h-10 w-10 animate-spin" />
                  </div>
                </div>
                <h4 className="font-extrabold text-xl text-gray-800">Synthesizing Macro Agriculture Engine</h4>
                <p className="text-xs text-gray-500 max-w-sm h-10">
                  {loadingSteps[loadingStep]}
                </p>
                <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {!loading && !report && !error && (
              <motion.div
                key="empty-policy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-md bg-white/50 border border-dashed border-gray-300 p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[550px] space-y-4"
              >
                <div className="p-5 bg-emerald-50 text-emerald-800 rounded-full">
                  <BarChart2 className="h-12 w-12 animate-pulse" />
                </div>
                <h4 className="font-extrabold text-gray-700 text-lg">Awaiting Analytics Target Parameters</h4>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Autofill an agro-policy template from the quick panel or specify custom environmental threats on the left, then trigger the modeling engine to produce predictive charts and AI policy insights.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-policy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-md bg-red-50/50 border border-red-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[550px]"
              >
                <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
                <h4 className="font-black text-red-800 text-lg">Analytics Engine Failure</h4>
                <p className="text-xs text-red-700 mt-2 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {report && !loading && (
              <motion.div
                key="policy-report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Scorecards summary box */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-3xs text-center space-y-1">
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Policy Impact Score</span>
                    <span className="text-3xl font-black text-emerald-950 block">{report.policyImpactScore}/100</span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${report.policyImpactScore}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl shadow-3xs text-center space-y-1">
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Sustainability Index</span>
                    <span className="text-3xl font-black text-teal-950 block">{report.sustainabilityIndex}/100</span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full" style={{ width: `${report.sustainabilityIndex}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl shadow-3xs text-center space-y-1">
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Economic Viability</span>
                    <span className="text-lg font-black text-blue-950 block pt-1">{report.economicViability}</span>
                    <span className="block text-[8px] text-gray-400 font-bold uppercase mt-1">Expected Return</span>
                  </div>
                </div>

                {/* AI Policy Insights Box */}
                <div className="backdrop-blur-md bg-white/90 border border-emerald-100 p-5 rounded-3xl shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Lightbulb className="h-4.5 w-4.5 text-amber-500" /> Evaluated AI Strategic Insights
                  </h4>
                  <div className="space-y-2.5">
                    {report.insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-700 font-medium leading-relaxed">
                        <span className="text-emerald-700 bg-emerald-50 rounded-full p-1 text-[10px] font-extrabold shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Analytics Graphs Tab Content */}
                <div className="backdrop-blur-md bg-white/95 border border-emerald-100 p-5 rounded-3xl shadow-xs space-y-6">
                  {/* Chart 1: Historical Yield Trends Area Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-700" /> Multi-Year Production Yield Projection
                      </h4>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Index Base 100</span>
                    </div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={report.chartsData.historicalYield}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorUnderPolicy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="year" tickLine={false} style={{ fontSize: "10px", fontWeight: "bold", fill: "#6b7280" }} />
                          <YAxis domain={['auto', 'auto']} tickLine={false} style={{ fontSize: "10px", fontWeight: "bold", fill: "#6b7280" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px", fontWeight: "bold" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "8px" }} />
                          <Area type="monotone" name="With Policy Intervention" dataKey="underPolicy" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUnderPolicy)" />
                          <Area type="monotone" name="Projected Climate Threat" dataKey="projected" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={0} />
                          <Area type="monotone" name="Baseline (Business as usual)" dataKey="baseline" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorBaseline)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Before vs After Policy Resource Efficiency */}
                  <div className="space-y-2 border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                        <Layers className="h-4 w-4 text-teal-700" /> Resource Efficiency & Leakage Comparisons
                      </h4>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Efficiency Index %</span>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={report.chartsData.resourceEfficiency}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px", fontWeight: "bold", fill: "#6b7280" }} />
                          <YAxis tickLine={false} style={{ fontSize: "10px", fontWeight: "bold", fill: "#6b7280" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px", fontWeight: "bold" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "8px" }} />
                          <Bar name="Before Policy" dataKey="before" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                          <Bar name="After proposed Policy" dataKey="after" fill="#0d9488" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Policy Action Plan & Subsidy recommendations */}
                <div className="backdrop-blur-md bg-white/95 border border-emerald-100 p-5 rounded-3xl shadow-xs space-y-4">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <BookOpen className="h-4.5 w-4.5 text-teal-700" /> Precision Policy Action Plan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.recommendedActionPlan.map((actionPoint, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-emerald-50/15 border border-emerald-100/40 rounded-2xl flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-block">
                            {actionPoint.phase}
                          </span>
                          <p className="text-xs font-bold text-gray-800 leading-normal">
                            {actionPoint.action}
                          </p>
                        </div>

                        <div className="border-t border-emerald-100/40 pt-2 flex items-start gap-1">
                          <DollarSign className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="block text-[8px] uppercase text-gray-400 font-extrabold tracking-wider">Subsidy Plan</span>
                            <span className="text-[10px] font-extrabold text-emerald-950 leading-tight block">
                              {actionPoint.subsidyRecommendation}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
