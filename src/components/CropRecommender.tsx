import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Sprout,
  Compass,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Droplet,
  Thermometer,
  CloudRain,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  Layers,
  Percent,
} from "lucide-react";
import { CropRecommendationReport } from "../types";

export default function CropRecommender() {
  const [nitrogen, setNitrogen] = useState<number>(50);
  const [phosphorus, setPhosphorus] = useState<number>(45);
  const [potassium, setPotassium] = useState<number>(60);
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(60);
  const [ph, setPh] = useState<number>(6.5);
  const [rainfall, setRainfall] = useState<number>(180);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CropRecommendationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    "Synthesizing NPK elemental soil concentration ratios...",
    "Querying regional precipitation index & relative humidity matrices...",
    "Applying crop-specific bio-physiological tolerance algorithms...",
    "Compiling sustainable crop recommendations...",
  ];

  const presets = [
    {
      name: "Saturated Tropical Clay (Wet)",
      nitrogen: 80,
      phosphorus: 55,
      potassium: 70,
      temperature: 28,
      humidity: 85,
      ph: 6.2,
      rainfall: 280,
    },
    {
      name: "Arid Desert Land (Dry/Hot)",
      nitrogen: 15,
      phosphorus: 20,
      potassium: 35,
      temperature: 36,
      humidity: 20,
      ph: 7.8,
      rainfall: 35,
    },
    {
      name: "Acidic Mountain Soil (Cool)",
      nitrogen: 45,
      phosphorus: 30,
      potassium: 40,
      temperature: 15,
      humidity: 50,
      ph: 5.1,
      rainfall: 120,
    },
    {
      name: "Optimal Tempered Loam",
      nitrogen: 90,
      phosphorus: 80,
      potassium: 90,
      temperature: 22,
      humidity: 65,
      ph: 6.7,
      rainfall: 160,
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setNitrogen(p.nitrogen);
    setPhosphorus(p.phosphorus);
    setPotassium(p.potassium);
    setTemperature(p.temperature);
    setHumidity(p.humidity);
    setPh(p.ph);
    setRainfall(p.rainfall);
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const response = await fetch("/api/recommend-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen,
          phosphorus,
          potassium,
          temperature,
          humidity,
          ph,
          rainfall,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        throw new Error(data.error || "Recommendation model response failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Precision analysis failed to build.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Intro */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-xl">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-600/35 blur-3xl"></div>
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-teal-600/35 blur-3xl"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/50 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30">
            <Sparkles className="h-3 w-3 text-emerald-300" />
            OptiCrop Feature Premium
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Smart Crop Recommendation Engine
          </h2>
          <p className="text-emerald-100/90 text-sm font-medium leading-relaxed">
            Enter chemical soil nutrition metrics and environmental/meteorological values below. Our AI/ML predictive system will compute biological suitability index matrices to isolate the highest-yield, eco-stable crop for your acreage.
          </p>
        </div>
      </div>

      {/* Preset Buttons Quick Panel */}
      <div className="backdrop-blur-md bg-white/70 border border-emerald-100/50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Layers className="h-4 w-4 text-emerald-600" /> Autofill Standard Soil Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 font-bold py-2 px-3.5 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all shadow-3xs"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Input Parameters Form */}
        <form
          onSubmit={handleRecommend}
          className="lg:col-span-5 backdrop-blur-md bg-white/80 border border-emerald-100 p-6 rounded-3xl shadow-sm space-y-5"
        >
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-600" />
              Soil & Meteorological Properties
            </h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase">7 Factors</span>
          </div>

          {/* N-P-K Mineral Inputs */}
          <div className="space-y-4">
            <span className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
              Primary Macronutrient Concentrates (N, P, K)
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Nitrogen (N)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 text-center focus:outline-none focus:border-emerald-500"
                  placeholder="ppm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Phosphorous(P)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 text-center focus:outline-none focus:border-emerald-500"
                  placeholder="ppm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase">Potassium (K)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={potassium}
                  onChange={(e) => setPotassium(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 text-center focus:outline-none focus:border-emerald-500"
                  placeholder="ppm"
                />
              </div>
            </div>
          </div>

          {/* Meteorological Elements */}
          <div className="space-y-4 pt-3 border-t border-gray-100">
            <span className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
              Ambient Environment Metrics
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase flex justify-between">
                  <span>Temperature</span>
                  <span className="text-amber-700">{temperature}°C</span>
                </label>
                <input
                  type="number"
                  min="-10"
                  max="55"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase flex justify-between">
                  <span>Humidity</span>
                  <span className="text-blue-700">{humidity}%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase flex justify-between">
                  <span>Soil pH</span>
                  <span className="text-emerald-700 font-extrabold">{ph}</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={ph}
                  onChange={(e) => setPh(Math.min(14, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-gray-600 uppercase flex justify-between">
                  <span>Rainfall</span>
                  <span className="text-cyan-700 font-extrabold">{rainfall} mm</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={rainfall}
                  onChange={(e) => setRainfall(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing Models...
              </>
            ) : (
              <>
                Determine Optimal Crop Fit
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Right Side: Prediction Visual Outcome */}
        <div className="lg:col-span-7 h-full flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="backdrop-blur-md bg-white/75 border border-emerald-100 p-12 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping"></div>
                  <div className="relative p-6 bg-emerald-50 text-emerald-600 rounded-full">
                    <Sprout className="h-10 w-10 animate-bounce" />
                  </div>
                </div>
                <h4 className="font-extrabold text-xl text-gray-800 mb-2">Executing Crop Recommendation Core</h4>
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
                className="backdrop-blur-md bg-white/50 border border-dashed border-gray-300 p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <Sparkles className="h-16 w-16 text-emerald-400 mb-4 animate-pulse" />
                <h4 className="font-bold text-gray-700 text-lg">Engine Standby</h4>
                <p className="text-xs text-gray-400 max-w-xs mt-2 leading-relaxed">
                  Autofill a preset scenario or specify custom parameters on the left, then click the button to trigger AI evaluation.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-md bg-red-50/50 border border-red-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
                <h4 className="font-bold text-red-800 text-lg">Simulation Failure</h4>
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
                {/* Main Hero Prediction Card */}
                <div className="backdrop-blur-md bg-white/90 border border-emerald-100 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-emerald-600 text-white rounded-bl-2xl text-xs font-extrabold flex items-center gap-1">
                    <Award className="h-4 w-4" /> Recommended Crop
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                    {/* Circle Score Meter */}
                    <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                      <svg className="absolute transform -rotate-90 w-full h-full">
                        <circle cx="56" cy="56" r="45" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="56"
                          cy="56"
                          r="45"
                          stroke="#059669"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 45}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - report.primaryRecommendation.confidenceScore / 100)}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-2xl font-black text-emerald-950">{report.primaryRecommendation.confidenceScore}%</span>
                        <span className="block text-[8px] text-gray-400 font-extrabold uppercase">Match</span>
                      </div>
                    </div>

                    <div className="text-center md:text-left space-y-1.5 flex-1">
                      <h3 className="text-3xl font-black text-emerald-950 tracking-tight">
                        {report.primaryRecommendation.cropName}
                      </h3>
                      <p className="text-xs font-mono text-emerald-700 italic font-bold">
                        {report.primaryRecommendation.scientificName}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {report.primaryRecommendation.suitabilityReason}
                      </p>
                    </div>
                  </div>

                  {/* Primary Specific parameters list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-700">
                    <div className="p-3 bg-gray-50 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Growth Duration</span>
                      <span className="text-emerald-900 font-bold mt-1">{report.primaryRecommendation.growthDuration}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Water Requirement</span>
                      <span className="text-blue-900 font-bold mt-1">{report.primaryRecommendation.waterRequirement}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Nutritional Needs</span>
                      <span className="text-amber-900 font-bold mt-1 leading-normal text-[11px]">
                        {report.primaryRecommendation.nutritionalIntakeDetails}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Alternatives */}
                {report.secondaryRecommendations && report.secondaryRecommendations.length > 0 && (
                  <div className="backdrop-blur-md bg-white/80 border border-emerald-100 p-5 rounded-3xl shadow-sm space-y-3">
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Viable Secondary Crop Alternatives
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.secondaryRecommendations.map((sec, idx) => (
                        <div key={idx} className="p-3.5 border border-emerald-50 rounded-2xl bg-emerald-50/20 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-emerald-950 text-sm">{sec.cropName}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                              {sec.growthDuration}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            {sec.suitabilityReason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Environment Context Analyses */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-1">
                    <span className="block text-[10px] font-extrabold text-amber-600 uppercase flex items-center gap-1">
                      <Thermometer className="h-3.5 w-3.5" /> Thermal Evaluation
                    </span>
                    <p className="text-gray-600 leading-relaxed">{report.environmentalContext.temperatureStatus}</p>
                  </div>

                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-1">
                    <span className="block text-[10px] font-extrabold text-blue-600 uppercase flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5" /> Transpiration Index
                    </span>
                    <p className="text-gray-600 leading-relaxed">{report.environmentalContext.humidityStatus}</p>
                  </div>

                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-1">
                    <span className="block text-[10px] font-extrabold text-emerald-600 uppercase flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" /> Soil pH Solubility
                    </span>
                    <p className="text-gray-600 leading-relaxed">{report.environmentalContext.phClassification}</p>
                  </div>
                </div>

                {/* Cultivation Quick Guide */}
                {report.cultivationGuide && report.cultivationGuide.length > 0 && (
                  <div className="backdrop-blur-md bg-white/85 border border-emerald-100 p-5 rounded-3xl shadow-sm">
                    <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <BookOpen className="h-4.5 w-4.5" /> Precision Agronomic Cultivation Steps
                    </h4>
                    <div className="space-y-2">
                      {report.cultivationGuide.map((step, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-gray-700 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
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
