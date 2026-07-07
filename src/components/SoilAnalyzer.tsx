import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Droplet,
  Compass,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Info,
  Layers,
  FileText,
} from "lucide-react";
import { SoilReport } from "../types";

export default function SoilAnalyzer() {
  const [region, setRegion] = useState("Midwest Plains, US");
  const [soilType, setSoilType] = useState("Loamy");
  const [crop, setCrop] = useState("Corn");
  const [temperature, setTemperature] = useState("24");
  const [moisture, setMoisture] = useState("32");
  const [nitrogen, setNitrogen] = useState("55");
  const [phosphorus, setPhosphorus] = useState("42");
  const [potassium, setPotassium] = useState("68");
  const [irrigationType, setIrrigationType] = useState("Drip Irrigation");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<SoilReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Contacting OptiCrop Cloud Core...",
    "Analyzing soil mineral composition (N, P, K ratios)...",
    "Simulating moisture evaporation profiles...",
    "Synthesizing optimal agronomical recommendation models...",
  ];

  // Presets to populate the form instantly for ease of exploration
  const presets = [
    {
      name: "High-Yield Corn (Midwest)",
      region: "Midwest Plains, US",
      soilType: "Loamy",
      crop: "Corn",
      temperature: "24",
      moisture: "32",
      nitrogen: "55",
      phosphorus: "42",
      potassium: "68",
      irrigationType: "Drip Irrigation",
    },
    {
      name: "Greenhouse Tomatoes (Dry Soils)",
      region: "California Valley, US",
      soilType: "Sandy Clay",
      crop: "Tomato",
      temperature: "28",
      moisture: "18",
      nitrogen: "35",
      phosphorus: "70",
      potassium: "45",
      irrigationType: "Subsurface Irrigation",
    },
    {
      name: "Vineyard Grapes (High Potassium)",
      region: "Rhone Valley, FR",
      soilType: "Silty Loam",
      crop: "Grapes",
      temperature: "22",
      moisture: "28",
      nitrogen: "25",
      phosphorus: "30",
      potassium: "110",
      irrigationType: "Micro-sprinklers",
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setRegion(p.region);
    setSoilType(p.soilType);
    setCrop(p.crop);
    setTemperature(p.temperature);
    setMoisture(p.moisture);
    setNitrogen(p.nitrogen);
    setPhosphorus(p.phosphorus);
    setPotassium(p.potassium);
    setIrrigationType(p.irrigationType);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    setLoadingStep(0);

    // Cycle through loading step texts for realism
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const response = await fetch("/api/analyze-soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          soilType,
          crop,
          temperature: parseFloat(temperature),
          moisture: parseFloat(moisture),
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          irrigationType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        // Fallback on error (gracefully handles lack of API key or limits)
        if (data.fallback) {
          setReport(data.fallback);
        } else {
          throw new Error(data.error || "Soil analysis engine offline");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check connection.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          AI Crop & Soil Chemistry Optimizer
        </h2>
        <p className="text-sm text-gray-500">
          Submit live field values to obtain personalized organic nutrient schedules, estimated yields, and irrigation plans formulated by OptiCrop AI.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2">Try Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="text-xs bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-semibold py-1.5 px-3 rounded-full border border-gray-200 hover:border-emerald-200 transition shadow-2xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Form and Report Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameter Inputs */}
        <form
          onSubmit={handleAnalyze}
          className="lg:col-span-5 backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-3xl shadow-sm space-y-5"
        >
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-800">Field Parameter Set</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600 uppercase">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Corn">Corn / Maize</option>
                <option value="Wheat">Wheat</option>
                <option value="Soybean">Soybean</option>
                <option value="Tomato">Greenhouse Tomato</option>
                <option value="Grapes">Grape Vines</option>
                <option value="Rice">Rice Paddy</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600 uppercase">Soil Classification</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Loamy">Loamy (Balanced)</option>
                <option value="Clay">Clay (High Density)</option>
                <option value="Sandy">Sandy (Low Retention)</option>
                <option value="Silty Loam">Silty Loam</option>
                <option value="Sandy Clay">Sandy Clay</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600 uppercase">Irrigation System</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Micro-sprinklers">Micro-sprinklers</option>
                <option value="Subsurface Irrigation">Subsurface Irrigation</option>
                <option value="Manual Flooding">Manual Flooding</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600 uppercase">Region / Location</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 font-medium"
                placeholder="e.g. Rhone Valley, FR"
              />
            </div>
          </div>

          {/* Numeric sliders */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Temp & Moisture Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                  <span>Temperature</span>
                  <span className="text-emerald-700">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                  <span>Moisture</span>
                  <span className="text-blue-700">{moisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {/* Nutrient Sliders (N, P, K) */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                  <span className="flex items-center gap-1">Nitrogen <span className="text-[10px] text-gray-400 font-normal">(N ppm)</span></span>
                  <span className="text-emerald-600">{nitrogen} ppm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                  <span className="flex items-center gap-1">Phosphorus <span className="text-[10px] text-gray-400 font-normal">(P ppm)</span></span>
                  <span className="text-teal-600">{phosphorus} ppm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                  <span className="flex items-center gap-1">Potassium <span className="text-[10px] text-gray-400 font-normal">(K ppm)</span></span>
                  <span className="text-amber-600">{potassium} ppm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Optimizing...
              </>
            ) : (
              <>
                Compute Precision Model
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Right Diagnostic Report Output */}
        <div className="lg:col-span-7 h-full flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="backdrop-blur-md bg-white/75 border border-emerald-100 p-12 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping"></div>
                  <div className="relative p-6 bg-emerald-50 text-emerald-600 rounded-full">
                    <Sparkles className="h-10 w-10 animate-spin" />
                  </div>
                </div>
                <h4 className="font-extrabold text-xl text-gray-800 mb-2">Calculating Optimized Biome Plan</h4>
                <p className="text-sm text-gray-500 max-w-sm mb-4 h-10">
                  {steps[loadingStep]}
                </p>
                <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {!loading && !report && !error && (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-md bg-white/50 border border-dashed border-gray-300 p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h4 className="font-bold text-gray-700 text-lg">Diagnostics Standby</h4>
                <p className="text-xs text-gray-400 max-w-xs mt-2">
                  Configure soil parameters on the left and trigger optimization to generate your real-time AI agricultural blueprint.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-md bg-red-50/50 border border-red-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
                <h4 className="font-bold text-red-800 text-lg">Analysis Error</h4>
                <p className="text-sm text-red-700 mt-2">{error}</p>
              </motion.div>
            )}

            {report && !loading && (
              <motion.div
                key="report-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score & Status Ring */}
                <div className="backdrop-blur-md bg-white/80 border border-emerald-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-6">
                  {/* Gauge Ring */}
                  <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                    <svg className="absolute transform -rotate-90 w-full h-full">
                      <circle
                        cx="56"
                        cy="56"
                        r="45"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="45"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - report.healthScore / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-3xl font-extrabold text-gray-800">{report.healthScore}</span>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Index</span>
                    </div>
                  </div>

                  {/* Description text */}
                  <div className="space-y-1.5 text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span
                        className={`text-xs uppercase font-extrabold px-3 py-0.5 rounded-full ${
                          report.healthStatus === "Optimized" || report.healthStatus === "Good"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        Crop Health: {report.healthStatus}
                      </span>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" /> {report.estimatedYieldImpact}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 pt-1">OptiCrop Agronomical Diagnosis</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{report.soilAnalysis}</p>
                  </div>
                </div>

                {/* N, P, K Breakdown Detail */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Nitrogen Balance</span>
                    <p className="text-xs text-gray-700 mt-2 font-medium leading-relaxed">{report.npkAnalysis.nitrogen}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600">Phosphorus Balance</span>
                    <p className="text-xs text-gray-700 mt-2 font-medium leading-relaxed">{report.npkAnalysis.phosphorus}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Potassium Balance</span>
                    <p className="text-xs text-gray-700 mt-2 font-medium leading-relaxed">{report.npkAnalysis.potassium}</p>
                  </div>
                </div>

                {/* Watering & Actions Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Watering Hydration Panel */}
                  <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                        <Droplet className="h-4 w-4" /> Hydration Optimization
                      </span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium mt-1">
                        {report.irrigationOptimization}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-[11px] text-gray-500 font-bold">
                      <span>Method: {irrigationType}</span>
                      <span className="text-blue-600">Dynamic Schedule Sync Ready</span>
                    </div>
                  </div>

                  {/* Actions Recommendations List */}
                  <div className="backdrop-blur-md bg-white/75 border border-emerald-100 p-5 rounded-3xl shadow-sm">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-3">
                      <Activity className="h-4 w-4" /> Priority Actions
                    </span>
                    <div className="space-y-3">
                      {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-gray-700 leading-normal">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">{rec}</span>
                        </div>
                      ))}
                    </div>
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
