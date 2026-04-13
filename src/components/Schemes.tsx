import { motion } from "motion/react";
import { BookOpen, ExternalLink, Filter, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Scheme {
  title: string;
  category: string;
  subsidy: string;
  loan: string;
  link: string;
  businessTypes: string[];
  investmentLevels: string[];
}

export default function Schemes() {
  const [businessType, setBusinessType] = useState("");
  const [investmentLevel, setInvestmentLevel] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);

  const allSchemes: Scheme[] = [
    {
      title: "PMEGP (Prime Minister's Employment Generation Programme)",
      category: "Manufacturing / Service",
      subsidy: "15% - 35%",
      loan: "Up to ₹50 Lakhs",
      link: "#",
      businessTypes: ["Manufacturing", "Service Sector"],
      investmentLevels: ["₹10L - ₹50 Lakhs", "Above ₹50 Lakhs"]
    },
    {
      title: "Stand-Up India Scheme",
      category: "SC/ST & Women Entrepreneurs",
      subsidy: "Varies",
      loan: "₹10 Lakhs - ₹1 Crore",
      link: "#",
      businessTypes: ["Manufacturing", "Service Sector", "Retail Trade"],
      investmentLevels: ["₹10L - ₹50 Lakhs", "Above ₹50 Lakhs"]
    },
    {
      title: "MUDRA Loans (Shishu)",
      category: "Micro Enterprises",
      subsidy: "N/A",
      loan: "Up to ₹50,000",
      link: "#",
      businessTypes: ["Retail Trade", "Service Sector"],
      investmentLevels: ["Below ₹10 Lakhs"]
    },
    {
      title: "MUDRA Loans (Kishore)",
      category: "Micro Enterprises",
      subsidy: "N/A",
      loan: "₹50,000 - ₹5 Lakhs",
      link: "#",
      businessTypes: ["Retail Trade", "Service Sector", "Manufacturing"],
      investmentLevels: ["Below ₹10 Lakhs"]
    },
    {
      title: "MUDRA Loans (Tarun)",
      category: "Micro Enterprises",
      subsidy: "N/A",
      loan: "₹5 Lakhs - ₹10 Lakhs",
      link: "#",
      businessTypes: ["Retail Trade", "Service Sector", "Manufacturing"],
      investmentLevels: ["Below ₹10 Lakhs"]
    },
    {
      title: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
      category: "MSME",
      subsidy: "N/A",
      loan: "Up to ₹2 Crore",
      link: "#",
      businessTypes: ["Manufacturing", "Service Sector"],
      investmentLevels: ["Above ₹50 Lakhs"]
    }
  ];

  const handleFindSchemes = () => {
    setHasSearched(true);
    const filtered = allSchemes.filter(scheme => {
      const matchesType = !businessType || scheme.businessTypes.includes(businessType);
      const matchesLevel = !investmentLevel || scheme.investmentLevels.includes(investmentLevel);
      return matchesType && matchesLevel;
    });
    setFilteredSchemes(filtered);
  };

  return (
    <section id="schemes" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Government Support</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Schemes & Subsidies for You</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filter Schemes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Business Type</label>
                  <select 
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Select Business Type</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Service Sector">Service Sector</option>
                    <option value="Retail Trade">Retail Trade</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Investment Level</label>
                  <select 
                    value={investmentLevel}
                    onChange={(e) => setInvestmentLevel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Select Investment Level</option>
                    <option value="Below ₹10 Lakhs">Below ₹10 Lakhs</option>
                    <option value="₹10L - ₹50 Lakhs">₹10L - ₹50 Lakhs</option>
                    <option value="Above ₹50 Lakhs">Above ₹50 Lakhs</option>
                  </select>
                </div>
                <button 
                  onClick={handleFindSchemes}
                  className="w-full py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary-hover transition-all mt-4"
                >
                  Find Schemes
                </button>
              </div>
            </div>
          </div>

          <div className="lg:flex-1 space-y-4">
            {!hasSearched ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                <Search className="w-12 h-12 text-gray-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-400 mb-2">Find Related Schemes</h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  Select your business type and investment level to see government subsidies and loan schemes tailored for you.
                </p>
              </div>
            ) : filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{scheme.title}</h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-gray-400 uppercase">
                        {scheme.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/10 text-primary uppercase">
                        Subsidy: {scheme.subsidy}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 uppercase">
                        Loan: {scheme.loan}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all whitespace-nowrap">
                    View Details <ExternalLink className="w-3 h-3" />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                <Filter className="w-12 h-12 text-gray-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-400 mb-2">No Schemes Found</h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  Try adjusting your filters to find more government support options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
