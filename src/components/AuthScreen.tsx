import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  FlaskConical,
  Scale,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Info
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { UserRole } from "../types";

export default function AuthScreen() {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<UserRole>("Farmer");
  const [showPassword, setShowPassword] = useState(false);
  
  // States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-gray-200", width: "0%", score: 0 };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { label: "Weak", color: "bg-rose-500", width: "20%", score };
      case 2:
        return { label: "Fair", color: "bg-amber-500", width: "40%", score };
      case 3:
        return { label: "Good", color: "bg-blue-500", width: "60%", score };
      case 4:
        return { label: "Strong", color: "bg-emerald-500", width: "80%", score };
      case 5:
        return { label: "Excellent", color: "bg-teal-400", width: "100%", score };
      default:
        return { label: "Weak", color: "bg-rose-500", width: "10%", score };
    }
  };

  const strength = getPasswordStrength(password);

  // Pre-configured demo login profiles
  const demoProfiles = [
    {
      name: "Marcus Aurelius",
      role: "Farmer" as UserRole,
      email: "marcus.farm@organicways.com",
      icon: Sprout,
      desc: "Telemetry, Soil Logs, Yield Sim",
      color: "from-emerald-600/10 to-teal-600/10 hover:from-emerald-600/20 hover:to-teal-600/20 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "Dr. Sarah Green",
      role: "Researcher" as UserRole,
      email: "sarah.green@agri-research.org",
      icon: FlaskConical,
      desc: "Simulations, CSV Reports, Policy",
      color: "from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border-blue-100",
      iconBg: "bg-blue-100 text-blue-700"
    },
    {
      name: "Helena Sky",
      role: "Policymaker" as UserRole,
      email: "h.sky@agri-planning.gov",
      icon: Scale,
      desc: "Multi-Year Impact, Subsidy Plans",
      color: "from-sky-600/10 to-cyan-600/10 hover:from-sky-600/20 hover:to-cyan-600/20 border-sky-100",
      iconBg: "bg-sky-100 text-sky-700"
    },
    {
      name: "Admin Alex",
      role: "Administrator" as UserRole,
      email: "admin@opticrop.ai",
      icon: Shield,
      desc: "User Accounts, Audit Logs, System DB",
      color: "from-purple-600/10 to-fuchsia-600/10 hover:from-purple-600/20 hover:to-fuchsia-600/20 border-purple-100",
      iconBg: "bg-purple-100 text-purple-700"
    }
  ];

  const handleDemoClick = async (profile: typeof demoProfiles[0]) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await login(profile.email, "password123", profile.role);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: "error", text: "Please provide your email address." });
      return;
    }

    if (mode !== "forgot" && !password) {
      setMessage({ type: "error", text: "Please enter your password." });
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password, role);
        if (res.success) {
          setMessage({ type: "success", text: res.message });
        } else {
          setMessage({ type: "error", text: res.message });
        }
      } else if (mode === "register") {
        if (!displayName) {
          setMessage({ type: "error", text: "Please specify your full name." });
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters." });
          setLoading(false);
          return;
        }

        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`;
        const res = await register(email, password, displayName, role, organization, avatarUrl);
        if (res.success) {
          setMessage({ type: "success", text: res.message });
        } else {
          setMessage({ type: "error", text: res.message });
        }
      } else {
        const res = await resetPassword(email);
        setMessage({ type: "success", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
  };

  const roleDefinitions = [
    {
      id: "Farmer" as UserRole,
      label: "Farmer",
      desc: "Monitor farm soils, optimize NPK nutrients, manage active watering zones.",
      icon: Sprout,
      color: "border-emerald-500/30 text-emerald-800 bg-emerald-50/50"
    },
    {
      id: "Researcher" as UserRole,
      label: "Researcher",
      desc: "Publish experimental crop suitability plans and conduct yield forecasting models.",
      icon: FlaskConical,
      color: "border-blue-500/30 text-blue-800 bg-blue-50/50"
    },
    {
      id: "Policymaker" as UserRole,
      label: "Policymaker",
      desc: "Simulate legislative scenarios, balance food supply security, and design agricultural subsidies.",
      icon: Scale,
      color: "border-sky-500/30 text-sky-800 bg-sky-50/50"
    },
    {
      id: "Administrator" as UserRole,
      label: "Administrator",
      desc: "Oversee system operations, audit active accounts, and manage core farm telemetry database.",
      icon: Shield,
      color: "border-purple-500/30 text-purple-800 bg-purple-50/50"
    }
  ];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-6 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Brand presentation and benefits */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-black tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-600" style={{ animationDuration: "3s" }} />
            Precision Agriculture Core
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-[1.1]">
            Empowering <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
              Agronomical Intelligence
            </span>
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed max-w-md font-medium">
            OptiCrop synchronizes machine-learning soil diagnostics, multi-scenario yield simulations, 
            and automated smart irrigation controls to build an sustainable agro-ecosystem.
          </p>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-3 gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-sm max-w-md">
            <div>
              <span className="block text-xl font-extrabold text-emerald-900">98.2%</span>
              <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">NPK Precision</span>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <span className="block text-xl font-extrabold text-blue-900">+25%</span>
              <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Yield Impact</span>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <span className="block text-xl font-extrabold text-sky-900">&lt;10s</span>
              <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Diagnostics</span>
            </div>
          </div>

          {/* Quick Demo Login section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase text-emerald-900/60 tracking-widest flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Direct Simulator Profiles
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Click a role profile below to instantly log in and experience personalized features:
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              {demoProfiles.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.name}
                    disabled={loading}
                    onClick={() => handleDemoClick(p)}
                    className={`flex flex-col items-start text-left p-3 rounded-2xl border bg-white/80 backdrop-blur shadow-sm transition-all duration-300 ${p.color} hover:scale-[1.02] hover:shadow-md disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${p.iconBg}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {p.role}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{p.name}</span>
                    <span className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-1">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form with Glassmorphism Card */}
        <div className="lg:col-span-7">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-100/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"></div>

            {/* Toggle Modes */}
            <div className="flex border-b border-gray-100 pb-4 mb-6">
              <button
                onClick={() => {
                  setMode("login");
                  setMessage(null);
                }}
                className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  mode === "login"
                    ? "text-emerald-950 bg-emerald-50/70 border-b-2 border-emerald-600 shadow-sm"
                    : "text-gray-400 hover:text-emerald-700 hover:bg-gray-50/50"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setMessage(null);
                }}
                className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  mode === "register"
                    ? "text-emerald-950 bg-emerald-50/70 border-b-2 border-emerald-600 shadow-sm"
                    : "text-gray-400 hover:text-emerald-700 hover:bg-gray-50/50"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Notifications */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-start gap-2.5 p-4 rounded-2xl mb-6 text-xs font-bold border ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {message.type === "success" ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  )}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arthur Pendelton"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                      Security Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[11px] text-emerald-700 font-extrabold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-emerald-700 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>

                  {/* Password strength UI */}
                  {mode === "register" && password && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1 mt-1.5"
                    >
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Strength: {strength.label}</span>
                        <span>{strength.score}/5</span>
                      </div>
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        ></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Associated Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. USDA or Independent Cooperative"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </motion.div>
              )}

              {/* Role Selection Grid */}
              {mode !== "forgot" && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Select Your Security Role
                  </label>
                  <p className="text-[10px] text-gray-400 font-medium">
                    This determines your dashboard permissions and security tier.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {roleDefinitions.map((rd) => {
                      const Icon = rd.icon;
                      const isSelected = role === rd.id;
                      return (
                        <button
                          key={rd.id}
                          type="button"
                          onClick={() => setRole(rd.id)}
                          className={`flex items-start text-left p-2.5 rounded-xl border transition-all duration-300 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                              : "border-gray-100 hover:border-emerald-300 bg-gray-50/50 hover:bg-emerald-50/10 text-gray-600"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg mr-2 ${isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="block text-xs font-black leading-none mb-1">
                              {rd.label}
                            </span>
                            <span className="block text-[8px] leading-tight text-gray-400 font-medium line-clamp-2">
                              {rd.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-2xl font-bold text-xs shadow-md hover:from-emerald-800 hover:to-teal-800 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "login"
                        ? `Sign In as ${role}`
                        : mode === "register"
                        ? "Complete Account Registration"
                        : "Send Security Reset Link"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footnote information */}
            {mode === "forgot" && (
              <button
                onClick={() => {
                  setMode("login");
                  setMessage(null);
                }}
                className="w-full text-center mt-4 text-xs font-bold text-gray-500 hover:text-emerald-700"
              >
                Back to Sign In
              </button>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2 items-start text-[10px] text-gray-400 font-medium">
              <Info className="h-4 w-4 shrink-0 text-emerald-600/60" />
              <span>
                To satisfy the strict agricultural zero-trust mandate, sessions are cryptographically managed and roles 
                automatically restrict data tables and simulation triggers.
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
