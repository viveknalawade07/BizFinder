import { motion } from "motion/react";
import { TrendingUp, Users, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Opportunity {
  title: string;
  description: string;
  investment: string;
  investmentLevel?: "Low" | "Mid" | "High";
  demand: string;
  competition: string;
  score: number;
  market: string;
  usp: string;
}

interface OpportunitySectionProps {
  opportunities: Opportunity[];
  onGenerateReport: (idea: string) => void;
}

export default function OpportunitySection({ opportunities, onGenerateReport }: OpportunitySectionProps) {
  const [selectedRange, setSelectedRange] = useState("All");
  const investmentRanges = ["All", "Under ₹50,000", "₹50k - ₹5 Lakhs", "Above ₹10 Lakhs"];

  const filteredOpportunities = opportunities.filter(opp => {
    if (selectedRange === "All") return true;
    if (selectedRange === "Under ₹50,000") return opp.investmentLevel === "Low" || opp.investment.includes("50,000") || opp.investment.toLowerCase().includes("under");
    if (selectedRange === "₹50k - ₹5 Lakhs") return opp.investmentLevel === "Mid";
    if (selectedRange === "Above ₹10 Lakhs") return opp.investmentLevel === "High";
    return true;
  });

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Local Market</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Business Opportunities Near You</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {investmentRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                  selectedRange === range 
                    ? "bg-primary text-background" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{opp.title}</h3>
                  <span className="text-primary font-bold text-sm">{opp.investment}</span>
                </div>
                <div className="opportunity-score-ring w-12 h-12 border-primary/20">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={113}
                      strokeDashoffset={113 - (113 * opp.score) / 100}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold">{opp.score}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                {opp.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Market</span>
                  <p className="text-xs font-medium">{opp.market}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">USP</span>
                  <p className="text-xs font-medium">{opp.usp}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-2">
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    opp.demand === "High" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                  )}>
                    {opp.demand} Demand
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    opp.competition === "Low" ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"
                  )}>
                    {opp.competition} Competition
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </button>
                  <button 
                    onClick={() => onGenerateReport(opp.title)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-background font-bold text-xs hover:bg-primary-hover transition-all"
                  >
                    Report <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
