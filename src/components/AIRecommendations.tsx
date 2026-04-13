import { motion } from "motion/react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  description: string;
  investment: string;
  demand: string;
  score: number;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <section id="ideas" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider block">AI Suggestions</span>
            <h2 className="text-3xl font-display font-bold">Startup Ideas for Your Area</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{rec.title}</h3>
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {rec.score}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {rec.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Investment</span>
                  <p className="text-sm font-bold">{rec.investment}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Demand</span>
                  <p className="text-sm font-bold text-green-400">{rec.demand}</p>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2">
                View Opportunity Score <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
