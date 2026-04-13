import { motion } from "motion/react";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NameValidator() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleCheck = () => {
    if (!name) return;
    setStatus("checking");
    setTimeout(() => {
      const isAvailable = Math.random() > 0.5;
      setStatus(isAvailable ? "available" : "taken");
      
      // Generate suggestions
      const base = name.split(' ')[0];
      const suffixes = ["Hub", "Pro", "Next", "Flow", "Sphere", "Logic", "Craft", "Solutions"];
      const newSuggestions = suffixes
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(s => `${base}${s}`);
      setSuggestions(newSuggestions);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Brand Intelligence</span>
          <h2 className="text-3xl font-display font-bold">Business Name Validator</h2>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter your proposed business name..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-all"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setStatus("idle");
                  setSuggestions([]);
                }}
              />
              {status === "checking" && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={status === "checking" || !name}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-background font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Validate Name <Search className="w-4 h-4" />
            </button>
          </div>

          {status !== "idle" && status !== "checking" && (
            <div className="mt-8 space-y-6">
              {status === "available" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Great choice! This name is likely available and has high brand potential.</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">This name might be taken or has low brandability. Try something more unique!</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Related Suggestions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setName(suggestion);
                        setStatus("idle");
                        setSuggestions([]);
                      }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
