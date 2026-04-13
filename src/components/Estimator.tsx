import { motion } from "motion/react";
import { Calculator, ChevronRight, PieChart, DollarSign, Clock, CheckCircle2, AlertTriangle, FileText, TrendingUp, Download } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateFeasibilityReport } from "@/services/gemini";

interface EstimatorProps {
  location?: string;
}

export default function Estimator({ location }: EstimatorProps) {
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGetEstimation = async () => {
    if (!idea) return;
    setIsGenerating(true);
    const result = await generateFeasibilityReport(idea, location || "Your Area");
    setReport(result);
    setIsGenerating(false);
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    
    const doc = new jsPDF();
    const margin = 15;
    let yPos = 20;

    // Helper to add text and update yPos
    const addText = (text: string, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * (fontSize * 0.5)) + 5;
      
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Title
    addText(report.title, 22, true, [245, 158, 11]); // Primary color approx
    yPos += 5;

    // Intro
    addText(report.intro, 11);
    yPos += 5;

    // 1. Initial Investment
    addText("1. Initial Investment Required (Detailed Breakdown)", 14, true);
    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Description', 'Estimated Cost (INR)']],
      body: report.initialInvestment.items.map((item: any) => [
        item.item,
        item.description,
        item.cost.replace('₹', 'INR ')
      ]),
      foot: [['Total Initial Investment', '', report.initialInvestment.total.replace('₹', 'INR ')]],
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] },
      margin: { left: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;

    if (report.initialInvestment.note) {
      addText(`Note: ${report.initialInvestment.note}`, 9, false, [100, 100, 100]);
    }

    // 2. Monthly Operating Costs
    addText("2. Monthly Operating Costs", 14, true);
    autoTable(doc, {
      startY: yPos,
      head: [['Expense', 'Description', 'Monthly Cost (INR)']],
      body: report.operatingCosts.items.map((item: any) => [
        item.expense,
        item.description,
        item.cost.replace('₹', 'INR ')
      ]),
      foot: [['Total Monthly Operating Cost', '', report.operatingCosts.total.replace('₹', 'INR ')]],
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] },
      margin: { left: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // 3. Revenue Projections
    addText("3. Revenue Projections (First Year)", 14, true);
    addText(`Average Price per Unit: ${report.revenueProjections.pricePerUnit.replace('₹', 'INR ')}`, 11);
    addText(`Average Sales per Day: ${report.revenueProjections.salesPerDay}`, 11);
    
    addText("Average Monthly Revenue:", 11, true);
    addText(`1st Quarter: ${report.revenueProjections.quarterlyRevenue.q1.replace('₹', 'INR ')}`, 10);
    addText(`2nd Quarter: ${report.revenueProjections.quarterlyRevenue.q2.replace('₹', 'INR ')}`, 10);
    addText(`3rd-4th Quarter: ${report.revenueProjections.quarterlyRevenue.q3_q4.replace('₹', 'INR ')}`, 10);
    
    addText(`Average Annual Revenue: ${report.revenueProjections.annualRevenue.replace('₹', 'INR ')}`, 11, true);
    addText(report.revenueProjections.addOns, 10, false, [100, 100, 100]);
    yPos += 5;

    // 4. Break-even Analysis
    addText("4. Break-even Analysis", 14, true);
    addText(`Monthly Net Profit: ${report.breakEven.monthlyProfit.replace('₹', 'INR ')}`, 11);
    addText(`Break-even Point: ${report.breakEven.breakEvenPoint}`, 11);
    addText(`Realistic Timeline: ${report.breakEven.realisticTimeline}`, 11);
    yPos += 5;

    // 5. Target Audience
    addText("5. Target Audience", 14, true);
    report.targetAudience.forEach((audience: string) => {
      addText(`• ${audience}`, 11);
    });
    yPos += 5;

    // 6. Competition Analysis
    addText("6. Competition Analysis", 14, true);
    addText(`Direct Competitors: ${report.competition.direct.join(", ")}`, 11);
    addText(`Indirect Competitors: ${report.competition.indirect.join(", ")}`, 11);
    addText(`Competitive Advantage: ${report.competition.advantage}`, 11, true, [245, 158, 11]);
    yPos += 5;

    // 7. Key Success Factors
    addText("7. Key Success Factors", 14, true);
    report.successFactors.forEach((factor: string) => {
      addText(`• ${factor}`, 11);
    });
    yPos += 5;

    // 8. Potential Challenges
    addText("8. Potential Challenges", 14, true);
    report.challenges.forEach((challenge: string) => {
      addText(`• ${challenge}`, 11);
    });
    yPos += 5;

    // 9. Market Size and Growth Potential
    addText("9. Market Size and Growth Potential", 14, true);
    addText(`Market Size: ${report.marketPotential.size}`, 11);
    addText(`Growth Rate: ${report.marketPotential.growthRate}`, 11);
    addText(`Daily Spending: ${report.marketPotential.spending}`, 11);
    addText(`Growth Potential: ${report.marketPotential.potential}`, 11);
    yPos += 5;

    // 10. Recommended Next Steps
    addText("10. Recommended Next Steps", 14, true);
    addText("Immediate Actions:", 11, true);
    report.nextSteps.immediate.forEach((step: string) => {
      addText(`• ${step}`, 10);
    });
    addText("Expansion:", 11, true);
    report.nextSteps.expansion.forEach((step: string) => {
      addText(`• ${step}`, 10);
    });
    yPos += 10;

    // Summary
    addText("Summary", 16, true, [245, 158, 11]);
    addText(`Initial Investment: ${report.summary.investment.replace('₹', 'INR ')}`, 11);
    addText(`Monthly Cost: ${report.summary.monthlyCost.replace('₹', 'INR ')}`, 11);
    addText(`Monthly Revenue: ${report.summary.revenue.replace('₹', 'INR ')}`, 11);
    addText(`Monthly Profit: ${report.summary.profit.replace('₹', 'INR ')}`, 11);
    addText(`Break-even: ${report.summary.breakEven}`, 11);
    yPos += 10;

    // Conclusion
    addText("Conclusion", 14, true);
    addText(report.conclusion, 11);

    doc.save(`Feasibility_Report_${idea.replace(/\s+/g, '_')}.pdf`);
  };

  const categories = ["Retail", "Food & Beverage", "Tech / Digital", "Service", "Manufacturing", "Education", "Health & Wellness", "Agriculture"];

  return (
    <section id="estimator" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 no-print">
          <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Feasibility Engine</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Custom Business Estimator</h2>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl mb-12 no-print">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Describe your business idea...</label>
              <input
                type="text"
                placeholder="e.g., 'Cloud kitchen in Pune' or 'Organic soap brand'"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category (optional)</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleGetEstimation}
                disabled={isGenerating || !idea}
                className="w-full h-[50px] rounded-xl bg-primary hover:bg-primary-hover text-background font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? "Analyzing..." : "Get Estimation"}
              </button>
            </div>
          </div>
        </div>

        {report && (
          <motion.div
            ref={reportRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 p-8 rounded-3xl bg-card border border-border print:bg-white print:text-black print:p-0 print:border-0"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center print:border-primary">
                  <span className="text-primary font-black text-2xl">{report.score}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold print:text-black">{report.title}</h3>
                  <p className="text-gray-400 text-sm print:text-gray-600">{idea} - {report.score}/100 Feasibility</p>
                </div>
              </div>
              <div className="flex gap-3 no-print">
                <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Save to Dashboard
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-background text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed print:text-gray-800">{report.intro}</p>

            {/* 1. Initial Investment */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                <span className="text-primary">1.</span> Initial Investment Required
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border print:border-gray-300">
                      <th className="py-3 px-4 font-bold print:text-black">Item</th>
                      <th className="py-3 px-4 font-bold print:text-black">Description</th>
                      <th className="py-3 px-4 font-bold text-right print:text-black">Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.initialInvestment.items.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-white/5 print:border-gray-100">
                        <td className="py-3 px-4 print:text-gray-800">{item.item}</td>
                        <td className="py-3 px-4 text-gray-400 print:text-gray-600">{item.description}</td>
                        <td className="py-3 px-4 text-right font-mono print:text-black">{item.cost}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 font-bold">
                      <td colSpan={2} className="py-4 px-4 print:text-black">Total Initial Investment</td>
                      <td className="py-4 px-4 text-right text-primary print:text-black">{report.initialInvestment.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {report.initialInvestment.note && (
                <p className="text-xs text-gray-500 italic print:text-gray-600">{report.initialInvestment.note}</p>
              )}
            </div>

            {/* 2. Monthly Operating Costs */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                <span className="text-primary">2.</span> Monthly Operating Costs
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border print:border-gray-300">
                      <th className="py-3 px-4 font-bold print:text-black">Expense</th>
                      <th className="py-3 px-4 font-bold print:text-black">Description</th>
                      <th className="py-3 px-4 font-bold text-right print:text-black">Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.operatingCosts.items.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-white/5 print:border-gray-100">
                        <td className="py-3 px-4 print:text-gray-800">{item.expense}</td>
                        <td className="py-3 px-4 text-gray-400 print:text-gray-600">{item.description}</td>
                        <td className="py-3 px-4 text-right font-mono print:text-black">{item.cost}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 font-bold">
                      <td colSpan={2} className="py-4 px-4 print:text-black">Total Monthly Operating Cost</td>
                      <td className="py-4 px-4 text-right text-primary print:text-black">{report.operatingCosts.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Revenue Projections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">3.</span> Revenue Projections
                </h4>
                <div className="space-y-3 text-sm">
                  <p className="flex justify-between"><span className="text-gray-400 print:text-gray-600">Price per Unit:</span> <span className="font-bold print:text-black">{report.revenueProjections.pricePerUnit}</span></p>
                  <p className="flex justify-between"><span className="text-gray-400 print:text-gray-600">Sales per Day:</span> <span className="font-bold print:text-black">{report.revenueProjections.salesPerDay}</span></p>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Quarterly Estimates</p>
                    <p className="flex justify-between mb-1"><span>Q1:</span> <span className="font-mono print:text-black">{report.revenueProjections.quarterlyRevenue.q1}</span></p>
                    <p className="flex justify-between mb-1"><span>Q2:</span> <span className="font-mono print:text-black">{report.revenueProjections.quarterlyRevenue.q2}</span></p>
                    <p className="flex justify-between"><span>Q3-Q4:</span> <span className="font-mono print:text-black">{report.revenueProjections.quarterlyRevenue.q3_q4}</span></p>
                  </div>
                  <p className="pt-2 border-t border-white/5 flex justify-between font-bold text-primary">
                    <span>Annual Revenue:</span> <span>{report.revenueProjections.annualRevenue}</span>
                  </p>
                  <p className="text-xs text-gray-500 italic print:text-gray-600">{report.revenueProjections.addOns}</p>
                </div>
              </div>

              {/* 4. Break-even Analysis */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">4.</span> Break-even Analysis
                </h4>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 print:bg-gray-50 print:border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Monthly Net Profit</p>
                    <p className="text-xl font-bold text-green-400 print:text-green-700">{report.breakEven.monthlyProfit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Break-even Point</p>
                    <p className="text-xl font-bold print:text-black">{report.breakEven.breakEvenPoint}</p>
                  </div>
                  <p className="text-xs text-gray-400 print:text-gray-600">Realistic Timeline: {report.breakEven.realisticTimeline}</p>
                </div>
              </div>
            </div>

            {/* 5 & 6. Audience & Competition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">5.</span> Target Audience
                </h4>
                <ul className="space-y-2">
                  {report.targetAudience.map((a: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300 print:text-gray-800">
                      <div className="w-1 h-1 rounded-full bg-primary" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">6.</span> Competition Analysis
                </h4>
                <div className="space-y-3 text-sm">
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Direct:</span> <span className="text-gray-300 print:text-gray-800">{report.competition.direct.join(", ")}</span></p>
                  <p><span className="text-gray-500 font-bold uppercase text-[10px]">Indirect:</span> <span className="text-gray-300 print:text-gray-800">{report.competition.indirect.join(", ")}</span></p>
                  <p className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-primary italic print:text-black print:bg-gray-50">
                    Advantage: {report.competition.advantage}
                  </p>
                </div>
              </div>
            </div>

            {/* 7 & 8. Success & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">7.</span> Key Success Factors
                </h4>
                <ul className="space-y-2">
                  {report.successFactors.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300 print:text-gray-800">
                      <CheckCircle2 className="w-3 h-3 text-green-400" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                  <span className="text-primary">8.</span> Potential Challenges
                </h4>
                <ul className="space-y-2">
                  {report.challenges.map((c: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300 print:text-gray-800">
                      <AlertTriangle className="w-3 h-3 text-orange-400" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 9. Market Potential */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-200">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 print:text-black">
                <span className="text-primary">9.</span> Market Size & Growth Potential
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Market Size</p>
                  <p className="text-sm font-bold print:text-black">{report.marketPotential.size}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Growth Rate</p>
                  <p className="text-sm font-bold text-green-400 print:text-green-700">{report.marketPotential.growthRate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Avg Spending</p>
                  <p className="text-sm font-bold print:text-black">{report.marketPotential.spending}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Year 2 Potential</p>
                  <p className="text-sm font-bold text-primary print:text-black">{report.marketPotential.potential}</p>
                </div>
              </div>
            </div>

            {/* 10. Next Steps */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold flex items-center gap-2 print:text-black">
                <span className="text-primary">10.</span> Recommended Next Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase">Immediate Actions</p>
                  {report.nextSteps.immediate.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-300 print:text-gray-800">
                      <span className="text-primary font-bold">{i+1}.</span> {step}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase">Expansion Ideas</p>
                  {report.nextSteps.expansion.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-300 print:text-gray-800">
                      <TrendingUp className="w-4 h-4 text-primary shrink-0" /> {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary & Conclusion */}
            <div className="pt-12 border-t border-border space-y-8 print:border-gray-300">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Investment</p>
                  <p className="font-bold print:text-black">{report.summary.investment}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Monthly Cost</p>
                  <p className="font-bold print:text-black">{report.summary.monthlyCost}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Revenue</p>
                  <p className="font-bold print:text-black">{report.summary.revenue}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Profit</p>
                  <p className="font-bold text-green-400 print:text-green-700">{report.summary.profit}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Break-even</p>
                  <p className="font-bold print:text-black">{report.summary.breakEven}</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-primary text-background text-center">
                <h5 className="font-bold mb-2">Conclusion</h5>
                <p className="text-sm font-medium leading-relaxed">{report.conclusion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
