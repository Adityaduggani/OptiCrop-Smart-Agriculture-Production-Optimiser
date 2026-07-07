import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  Sprout,
  User,
  Bot,
  AlertCircle,
  HelpCircle,
  Bug,
  RotateCcw,
} from "lucide-react";
import { ChatMessage } from "../types";
import { useAuth } from "./AuthContext";

export default function OptiBot() {
  const { user } = useAuth();
  
  const getWelcomeMessage = () => {
    if (user) {
      return `Hello, **${user.displayName}**! As a registered **${user.role}** ${user.organization ? `representing **${user.organization}**` : ""}, I have customized my expertise to support your needs. Ask me anything about crop diagnostics, sustainable biological pest management, weed control, or precision nutrient schedules!`;
    }
    return "Hello! I am **OptiBot**, your AI virtual agronomist. I specialize in crop diagnostics, sustainable biological pest management, weed control, and precision nutrient schedules. Ask me anything, or describe symptoms you notice on your leaves or soil!";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize messages on load or user change
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: getWelcomeMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [user]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    { label: "Leaf discoloration tips", icon: Sprout },
    { label: "Aphid natural bio-control", icon: Bug },
    { label: "Optimal NPK for tomatoes", icon: Sparkles },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map entire state history for standard chat context
      const formattedHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/chat-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
          userName: user?.displayName,
          userRole: user?.role,
          userOrg: user?.organization
        }),
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: "model",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || "Model returned invalid format");
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "model",
          text: error.message || "I apologize, but I am currently experiencing connection difficulties. However, based on standard precision agronomy, I recommend ensuring your crops receive balanced NPK fertilization, maintain moisture levels above 30%, and monitor leaf undersides closely for early detection of mite or aphid activity. How else can I assist you?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (chipText: string) => {
    handleSend(chipText);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: getWelcomeMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Informative Guidance Panel */}
      <div className="lg:col-span-4 backdrop-blur-md bg-white/75 border border-emerald-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Bug className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-800">Crop Health Diagnostics</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Diagnose diseases instantly. Describe leaf symptoms like rust-colored spots, yellowing veins, or stunted shoots. Our model matches patterns to provide:
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700 font-medium pl-1">
            <li className="flex gap-2">
              <span className="text-emerald-500 font-extrabold">•</span> Biological Pest Mitigation (Aphids, Spider Mites)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-extrabold">•</span> Fungal Treatment Protocols (Powdery Mildew, Blight)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-extrabold">•</span> Safe Companion Planting & Organic Bio-Stimulants
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-6 space-y-3">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Quick Tips</span>
          <div className="flex flex-col gap-2">
            {suggestionChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(chip.label)}
                  className="flex items-center gap-2 text-left text-xs text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 p-2 rounded-xl transition border border-transparent hover:border-emerald-100 font-semibold"
                >
                  <Icon className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-8 backdrop-blur-md bg-white/75 border border-emerald-100 rounded-3xl shadow-sm flex flex-col h-[550px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Bot className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">OptiBot Agronomy Virtual</h3>
              <span className="block text-[10px] text-emerald-200 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Offline/Online Neural Proxy
              </span>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Reset Chat history"
            className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-200 hover:text-white transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/35">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center ${
                  msg.role === "user" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.role === "user"
                      ? "bg-emerald-700 text-white shadow-xs rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 shadow-xs rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {/* Simplistic renderer for bold headers and lists within bot replies */}
                  {msg.role === "model" ? (
                    <div className="space-y-1">
                      {msg.text.split("\n").map((line, lIdx) => {
                        // Check for list bullet format e.g. "- **Item**" or "* Item" or "1. Item"
                        let cleanLine = line;
                        let isBullet = false;
                        if (line.trim().startsWith("-") || line.trim().startsWith("*") || /^\d+\./.test(line.trim())) {
                          isBullet = true;
                          cleanLine = line.replace(/^[\-\*\d\.]+\s+/, "");
                        }

                        // Super simple bold text matcher
                        const boldParts = cleanLine.split(/\*\*([^*]+)\*\*/g);

                        const formattedText = boldParts.map((part, pIdx) => {
                          if (pIdx % 2 === 1) {
                            return <strong key={pIdx} className="font-extrabold text-emerald-950">{part}</strong>;
                          }
                          return part;
                        });

                        return (
                          <p key={lIdx} className={`${isBullet ? "pl-4 py-0.5 relative" : ""}`}>
                            {isBullet && <span className="absolute left-1 text-emerald-600">•</span>}
                            {formattedText}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="block text-[9px] text-gray-400 font-bold px-1 text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 h-9 w-9 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-100 text-gray-500 shadow-xs rounded-tl-none flex items-center gap-1 text-xs">
                <span>OptiBot is thinking</span>
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="e.g. Yellow spots on greenhouse cucumber leaves..."
            className="flex-1 text-xs p-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-emerald-600 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 text-white disabled:text-gray-400 p-3 rounded-xl transition shadow-xs shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
