import { motion } from "motion/react";
import { Map, BarChart3, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CompetitorAnalyzer() {
  const [radius, setRadius] = useState("3km");
  
  const competitors = [
    { name: "Grocery / Kirana Stores", count: 5, saturation: "Medium", trend: "Moderate competition" },
    { name: "Restaurants / Dhabas", count: 8, saturation: "High", trend: "Strong demand" },
    { name: "Coaching / Tuition Centers", count: 3, saturation: "Low", trend: "Good opportunity" },
    { name: "Mobile Repair Shops", count: 4, saturation: "Medium", trend: "Growing demand" },
    { name: "Medical / Pharmacy", count: 2, saturation: "Low", trend: "High growth potential" },
  ];

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Market Analysis</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Competitor Density Analyzer</h2>
          </div>

          <div className="flex items-center gap-4 bg-card p-1 rounded-xl border border-border">
            <span className="text-xs font-bold text-gray-500 px-3">Radius:</span>
            {["1km", "3km", "5km"].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  radius === r ? "bg-primary text-background" : "text-gray-400 hover:text-white"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {competitors.map((comp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-card border border-border flex flex-col"
            >
              <h3 className="text-sm font-bold text-gray-300 mb-4 h-10">{comp.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-display font-black text-primary">{comp.count}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Businesses within {radius}</span>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Saturation:</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    comp.saturation === "Low" ? "bg-green-500/10 text-green-400" : 
                    comp.saturation === "Medium" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
                  )}>
                    {comp.saturation}
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                  <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 leading-tight">{comp.trend}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
