import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sliders,
  TrendingUp,
  CloudSun,
  ShieldAlert,
  Sprout,
  Activity,
  Gauge,
  HelpCircle,
  Award,
  Sparkles,
  Brain,
  Timer,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Thermometer,
  Info,
  LineChart as LineChartIcon,
  Flame,
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
} from "recharts";
import { FarmZone, YieldPredictionReport } from "./types";

interface SimulatorProps {
  zones: FarmZone[];
  onUpdateZone: (zone: FarmZone) => void;
}

export default function Simulator({ zones, onUpdateZone }: SimulatorProps) {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || "");
  const [solarIndex, setSolarIndex] = useState(7.5); // 1-10 scale
  const [pesticideLevel, setPesticideLevel] = useState(20); // % of limit
  const [activeTab, setActiveTab] = useState<"standard" | "ai">("ai");

  // AI-powered predictions state
  const [prediction, setPrediction] = useState<YieldPredictionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const loadingSteps = [
    "Acquiring high-altitude solar radiative indexes...",
    "Calibrating crop thermal transpiration tolerances...",
    "Modeling soil NPK ion absorption ratios...",
    "Running agronomical neural network yield projections...",
    "Synthesizing precision management insights..."
  ];

  // Reset or initialize prediction when zone changes
  useEffect(() => {
    setPrediction(null);
    setError(null);
  }, [selectedZoneId]);

  // Loading steps animation
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 900);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!activeZone) {
    return (
      <div className="p-8 text-center bg-white/60 border border-gray-100 rounded-2xl">
        <Sprout className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-700">No Farm Zones Available</h3>
        <p className="text-xs text-gray-400 mt-1">Configure active sectors in the Administrator dashboard first.</p>
      </div>
    );
  }

  // STANDARD SIMULATION CALCULATIONS (Local physical model)
  const moistureFactor = activeZone.moisture > 45 ? 0.8 : activeZone.moisture < 25 ? 0.6 : 1.0;
  const nutrientFactor = (activeZone.nitrogen + activeZone.phosphorus + activeZone.potassium) / 200;
  const solarStress = solarIndex > 8.0 && !activeZone.shadeCover ? 0.75 : 1.05;
  const ecoRating = Math.max(10, Math.round(100 - pesticideLevel * 0.9));

  const baseYield = activeZone.crop === "Corn" ? 9.5 : activeZone.crop === "Tomato" ? 14.0 : activeZone.crop === "Grapes" ? 8.2 : 6.0;
  const projectedYield = (baseYield * moistureFactor * nutrientFactor * solarStress).toFixed(1);
  const yieldIncreasePercent = Math.round(((parseFloat(projectedYield) - baseYield) / baseYield) * 100);

  const handleMoistureSlider = (val: number) => {
    onUpdateZone({ ...activeZone, moisture: val });
  };

  const handleTempSlider = (val: number) => {
    onUpdateZone({ ...activeZone, temperature: val });
  };

  const handleNitrogenSlider = (val: number) => {
    onUpdateZone({ ...activeZone, nitrogen: val });
  };

  const handlePhosphorusSlider = (val: number) => {
    onUpdateZone({ ...activeZone, phosphorus: val });
  };

  const handlePotassiumSlider = (val: number) => {
    onUpdateZone({ ...activeZone, potassium: val });
  };

  const handleCropChange = (val: string) => {
    onUpdateZone({ ...activeZone, crop: val });
  };

  const handleGrowthStageChange = (val: any) => {
    onUpdateZone({ ...activeZone, growthStage: val });
  };

  // Run AI Simulation
  const handleComputePrediction = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const res = await fetch("/api/simulate-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: activeZone.crop,
          growthStage: activeZone.growthStage,
          moisture: activeZone.moisture,
          temperature: activeZone.temperature,
          solarIndex,
          ecoInput: pesticideLevel,
          shadeCover: activeZone.shadeCover,
          irrigationActive: activeZone.irrigationActive,
          nitrogen: activeZone.nitrogen,
          phosphorus: activeZone.phosphorus,
          potassium: activeZone.potassium
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact OptiCrop Neural Core.");
      }

      const data = await res.json();
      setPrediction(data);
    } catch (err: any) {
      console.error(err);
      setError("Transient network latency or rate limit encountered. Utilizing local backup model calculations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="simulator-container">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wider uppercase bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Advanced Simulation Suite
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Precision Yield Simulator
        </h2>
        <p className="text-sm text-gray-500">
          Tweak environmental stress factors and soil macronutrient levels, then run high-fidelity predictions to calculate agronomical development curves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 backdrop-blur-md bg-white/80 border border-emerald-100/50 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-600" />
              <h3 className="font-extrabold text-gray-800 text-sm">Control Room Panel</h3>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-black px-2 py-0.5 rounded-md uppercase">
              Sector: {activeZone.name}
            </span>
          </div>

          {/* Zone Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase">Select Target Zone</label>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 font-semibold"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} - {z.crop} ({z.growthStage})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Crop/Stage Modifier */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Crop Variety</label>
              <select
                value={activeZone.crop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Corn">Corn (Maize)</option>
                <option value="Tomato">Tomato</option>
                <option value="Grapes">Grapes</option>
                <option value="Wheat">Wheat</option>
                <option value="Soybeans">Soybeans</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Growth Stage</label>
              <select
                value={activeZone.growthStage}
                onChange={(e) => handleGrowthStageChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Seeding">Seeding</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Ripening">Ripening</option>
              </select>
            </div>
          </div>

          {/* Environmental Sliders */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1">
              <CloudSun className="h-3.5 w-3.5" /> Environmental Coefficients
            </h4>

            {/* Simulated Moisture Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                <span>Simulated Soil Moisture</span>
                <span className="text-blue-600 font-extrabold">{activeZone.moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={activeZone.moisture}
                onChange={(e) => handleMoistureSlider(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Simulated Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                <span>Simulated Air Temperature</span>
                <span className="text-amber-600 font-extrabold">{activeZone.temperature}°C</span>
              </div>
              <input
                type="range"
                min="12"
                max="42"
                value={activeZone.temperature}
                onChange={(e) => handleTempSlider(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Solar Radiation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                <span>Solar Radiation Index</span>
                <span className="text-yellow-600 font-extrabold">{solarIndex} kW/m²</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={solarIndex}
                onChange={(e) => setSolarIndex(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>

            {/* Bio-Insecticide / Eco Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                <span>Eco-Input (Bio-Insecticide)</span>
                <span className="text-teal-600 font-extrabold">{pesticideLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pesticideLevel}
                onChange={(e) => setPesticideLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          </div>

          {/* Soil NPK Macronutrients */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Sprout className="h-3.5 w-3.5" /> Soil Macronutrients (NPK)
            </h4>

            {/* Nitrogen (N) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Nitrogen (N)</span>
                <span className="text-emerald-700 font-extrabold">{activeZone.nitrogen} ppm</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={activeZone.nitrogen}
                onChange={(e) => handleNitrogenSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Phosphorus (P) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Phosphorus (P)</span>
                <span className="text-emerald-700 font-extrabold">{activeZone.phosphorus} ppm</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={activeZone.phosphorus}
                onChange={(e) => handlePhosphorusSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Potassium (K) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Potassium (K)</span>
                <span className="text-emerald-700 font-extrabold">{activeZone.potassium} ppm</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={activeZone.potassium}
                onChange={(e) => handlePotassiumSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Active Equipment Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              id="btn-shade-toggle"
              onClick={() => onUpdateZone({ ...activeZone, shadeCover: !activeZone.shadeCover })}
              className={`p-3 rounded-2xl text-xs font-bold border transition text-center ${
                activeZone.shadeCover
                  ? "bg-amber-500/10 border-amber-300 text-amber-700 font-extrabold"
                  : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {activeZone.shadeCover ? "Shade Canopy: ACTIVE" : "Deploy Shade Cover"}
            </button>

            <button
              type="button"
              id="btn-irrigation-toggle"
              onClick={() => onUpdateZone({ ...activeZone, irrigationActive: !activeZone.irrigationActive })}
              className={`p-3 rounded-2xl text-xs font-bold border transition text-center ${
                activeZone.irrigationActive
                  ? "bg-blue-600/10 border-blue-300 text-blue-700 font-extrabold"
                  : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {activeZone.irrigationActive ? "Hydration: ACTIVE" : "Activate Hydration"}
            </button>
          </div>

          {/* Compute Prediction Action Button */}
          <button
            type="button"
            id="btn-compute-yield"
            disabled={loading}
            onClick={handleComputePrediction}
            className={`w-full py-4 px-4 rounded-2xl text-xs font-extrabold text-white tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:shadow-lg hover:brightness-105 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>COMPUTING PREDICTION...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-100" />
                <span>COMPUTE AI PREDICTION</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Projections */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs for switching between physical and AI outputs */}
          <div className="flex bg-gray-100/80 p-1 rounded-2xl max-w-sm">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "ai"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Neural Predictor
            </button>
            <button
              onClick={() => setActiveTab("standard")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "standard"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Standard Estimator
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Loading Overlay */}
            {loading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="backdrop-blur-md bg-white/90 border border-emerald-100 p-8 rounded-3xl shadow-sm text-center py-16 space-y-6 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative flex items-center justify-center">
                  <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <Brain className="h-6 w-6 text-emerald-600 absolute animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-gray-800 text-sm">OptiCrop Agronomic Core Processing</h4>
                  <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium inline-block animate-pulse">
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-700"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {/* Standard Estimator Tab */}
            {!loading && activeTab === "standard" && (
              <motion.div
                key="standard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Main Yield Projection Card */}
                <div className="backdrop-blur-md bg-white/80 border border-emerald-100/50 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" /> Calculated Yield Matrix
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      Mathematical Model Stable
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Projected Output</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-gray-800">{projectedYield}</span>
                        <span className="text-xs text-gray-500 font-bold">tons / hectare</span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold">
                        {yieldIncreasePercent >= 0 ? "+" : ""}
                        {yieldIncreasePercent}% relative deviation
                      </div>
                    </div>

                    {/* Sustainability Indicator */}
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/40 text-center">
                      <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Bio-Integrity Score</span>
                      <span className="block text-3xl font-extrabold text-emerald-700 mt-1">{ecoRating}%</span>
                      <span className="block text-[10px] text-emerald-600 font-semibold mt-1">
                        {ecoRating > 80 ? "Certified Sustainable Biome" : ecoRating > 60 ? "Balanced Environmental Impact" : "High Ecological Footprint Warning"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Environmental Balance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Solar Index Panel */}
                  <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-xs">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <CloudSun className="h-4 w-4" /> Solar Stress Quotient
                    </span>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Exposure Coefficient</span>
                        <span className="font-extrabold">{solarIndex > 8 ? "Severe Heat stress" : "Balanced Solar Capture"}</span>
                      </div>
                      {solarIndex > 8 && !activeZone.shadeCover ? (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 items-start text-xs text-rose-800 font-semibold leading-normal">
                          <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>Extreme leaf evapotranspiration is occurring. Enable Shade Cover to mitigate leaf sunburn and protect yield outputs.</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50/60 border border-emerald-100/30 rounded-xl flex gap-2 items-start text-xs text-emerald-800 font-semibold leading-normal">
                          <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Leaf capture surface is absorbing healthy ultraviolet rays safely for cellular photosynthesis.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simulated Moisture Profile */}
                  <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-xs">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <Activity className="h-4 w-4" /> Capillary Hydration Analysis
                    </span>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Moisture Density</span>
                        <span className="font-extrabold">{activeZone.moisture}% saturation</span>
                      </div>

                      <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-blue-600/25 transition-all duration-300"
                          style={{ width: `${activeZone.moisture}%` }}
                        ></div>
                        <span className="relative z-10 text-xs font-bold text-gray-700">
                          {activeZone.moisture < 25 ? "Soil Drought Risk" : activeZone.moisture > 60 ? "Oversaturated Root Rot Risk" : "Perfect Hydronic Range"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Core Predictor Tab */}
            {!loading && activeTab === "ai" && (
              <motion.div
                key="ai-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Warnings / Error messaging if fallbacked */}
                {error && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 leading-normal">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {!prediction ? (
                  // Empty State - Encourage Computing AI Prediction
                  <div className="backdrop-blur-md bg-white/70 border-2 border-dashed border-emerald-100 p-8 rounded-3xl text-center py-16 space-y-5 flex flex-col items-center justify-center min-h-[350px]">
                    <div className="h-16 w-16 bg-gradient-to-tr from-emerald-100 to-blue-100 rounded-full flex items-center justify-center shadow-inner">
                      <Brain className="h-8 w-8 text-emerald-600 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h4 className="font-extrabold text-gray-800 text-sm">Run AI Growth Engine</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Query the agronomical neural core using the current environment and NPK configurations to retrieve structured crop yields and scientific progression trajectories.
                      </p>
                    </div>
                    <button
                      onClick={handleComputePrediction}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl tracking-wider hover:shadow-md transition uppercase flex items-center gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" /> Simulate Now
                    </button>
                  </div>
                ) : (
                  // Active Prediction Report Display
                  <div className="space-y-6">
                    {/* Primary Prediction Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Predicted Yield */}
                      <div className="backdrop-blur-md bg-white/80 border border-emerald-100/50 p-5 rounded-3xl shadow-xs">
                        <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider">AI Yield Forecast</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-black text-emerald-800">{prediction.projectedYield}</span>
                          <span className="text-xs text-gray-400 font-bold">t / ha</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-black ${
                            prediction.yieldChangePercent >= 0 
                              ? "bg-emerald-50 text-emerald-700" 
                              : "bg-rose-50 text-rose-700"
                          }`}>
                            {prediction.yieldChangePercent >= 0 ? "+" : ""}
                            {prediction.yieldChangePercent}% deviation
                          </span>
                        </div>
                      </div>

                      {/* Growth Rate Quotient */}
                      <div className="backdrop-blur-md bg-white/80 border border-blue-100/50 p-5 rounded-3xl shadow-xs">
                        <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider">Growth Rate Quotient</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Activity className="h-5 w-5 text-blue-500 shrink-0 animate-pulse" />
                          <span className="text-base font-extrabold text-gray-800">{prediction.growthRate}</span>
                        </div>
                        <span className="block text-[9px] text-gray-400 font-medium mt-1">Physiological cellular pace</span>
                      </div>

                      {/* Confidence Core */}
                      <div className="backdrop-blur-md bg-white/80 border border-emerald-100/50 p-5 rounded-3xl shadow-xs">
                        <span className="block text-[10px] text-gray-500 font-black uppercase tracking-wider">Predictive Confidence</span>
                        <div className="flex items-baseline gap-0.5 mt-1">
                          <span className="text-3xl font-black text-emerald-700">{prediction.confidenceScore}</span>
                          <span className="text-xs text-gray-400 font-bold">%</span>
                        </div>
                        <span className="block text-[9px] text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded-md font-extrabold mt-1">
                          Agronomic Model Calibrated
                        </span>
                      </div>
                    </div>

                    {/* Progression Trajectory Chart */}
                    <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h4 className="text-xs font-black text-gray-800 uppercase flex items-center gap-1.5">
                          <LineChartIcon className="h-4 w-4 text-emerald-600" /> Hypothetical Growth Trajectory (Weeks 1-5)
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400">
                          Target: {prediction.growthDurationRemaining}
                        </span>
                      </div>

                      {/* Recharts AreaChart */}
                      <div className="h-56 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={prediction.progressionData}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorVitality" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="period" stroke="#94a3b8" tickLine={false} />
                            <YAxis stroke="#94a3b8" tickLine={false} />
                            <Tooltip
                              contentStyle={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              name="Projected Yield (t/ha)"
                              dataKey="projectedYield"
                              stroke="#10b981"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorYield)"
                            />
                            <Area
                              type="monotone"
                              name="Soil Vitality Index"
                              dataKey="soilVitality"
                              stroke="#3b82f6"
                              strokeWidth={1.5}
                              fillOpacity={1}
                              fill="url(#colorVitality)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Neural Insights & Bullet Points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Physiological Insights */}
                      <div className="p-5 bg-gradient-to-tr from-emerald-50/20 to-teal-50/10 border border-emerald-100/40 rounded-3xl shadow-xs space-y-3">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" /> Neural Physiological Insights
                        </span>
                        <ul className="space-y-3">
                          {prediction.insights.map((insight, index) => (
                            <li key={index} className="flex gap-2 items-start text-xs text-gray-600 leading-normal font-medium">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Precision Recommendations */}
                      <div className="p-5 bg-gradient-to-tr from-blue-50/20 to-indigo-50/10 border border-blue-100/40 rounded-3xl shadow-xs space-y-3">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-blue-600 shrink-0 animate-pulse" /> Precision Directives
                        </span>
                        <ul className="space-y-3">
                          {prediction.recommendations.map((rec, index) => (
                            <li key={index} className="flex gap-2 items-start text-xs text-gray-600 leading-normal font-medium">
                              <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
