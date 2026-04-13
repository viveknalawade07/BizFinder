import { 
  LayoutDashboard, 
  Heart, 
  FileText, 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const stats = [
    { label: "Saved Ideas", value: "3", icon: Heart, color: "text-red-400" },
    { label: "Reports Generated", value: "2", icon: FileText, color: "text-blue-400" },
    { label: "Locations Explored", value: "4", icon: MapPin, color: "text-green-400" },
    { label: "Avg Opportunity Score", value: "78", icon: Star, color: "text-primary" },
  ];

  const recentActivity = [
    { type: "Explored", title: "Opportunities in Rajarampuri", time: "Just now" },
    { type: "Generated", title: "Report for 'Tea Stall'", time: "2m ago" },
    { type: "Saved", title: "Organic Farm-to-Table Restaurant", time: "1h ago" },
    { type: "Explored", title: "Opportunities in Shahupuri", time: "3h ago" },
  ];

  const savedIdeas = [
    { title: "Organic Farm-to-Table Restaurant", investment: "₹15 - ₹25 Lakhs", score: 85 },
    { title: "Cloud Kitchen (Asian Cuisine)", investment: "₹5 - ₹8 Lakhs", score: 92 },
    { title: "Mobile Car Detail Service", investment: "₹1 - ₹2 Lakhs", score: 78 },
  ];

  const reports = [
    { title: "Feasibility Report: Tea Stall", date: "Apr 12, 2026", score: 88 },
    { title: "Market Analysis: Boutique Hotel", date: "Apr 10, 2026", score: 72 },
  ];

  const sidebarItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Saved Ideas", icon: Heart },
    { label: "Reports", icon: FileText },
    { label: "History", icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-right border-border bg-card p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-background font-black text-xl">B</span>
          </div>
          <span className="text-xl font-display font-bold tracking-tight">BizFinder</span>
        </div>

        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.label 
                  ? "bg-primary text-background" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onBack}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">{activeTab}</h1>
            <p className="text-gray-400 text-sm">Welcome back, Vivek! Here's your personalized business hub.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold">VN</span>
            </div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => (
                <button 
                  key={stat.label} 
                  onClick={() => setActiveTab(stat.label)}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all text-left"
                >
                  <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
                  <p className="text-3xl font-display font-black mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{stat.label}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 rounded-3xl bg-card border border-border">
                  <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                  <div className="space-y-6">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            activity.type === "Explored" ? "bg-green-400" : 
                            activity.type === "Generated" ? "bg-blue-400" : "bg-red-400"
                          )} />
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.type} • {activity.time}</p>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                  <h2 className="text-xl font-bold mb-4">Pro Tip</h2>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Save ideas to your dashboard to compare them side-by-side and see which one has the best market fit.
                  </p>
                  <button 
                    onClick={onBack}
                    className="w-full py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary-hover transition-all"
                  >
                    Explore More
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "Saved Ideas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map((idea, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{idea.title}</h3>
                  <span className="text-primary font-bold text-sm">{idea.score}%</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Investment: {idea.investment}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-primary text-background font-bold text-xs">View Details</button>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 group transition-all">
                    <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Reports" && (
          <div className="space-y-4">
            {reports.map((report, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">{report.title}</h3>
                    <p className="text-xs text-gray-500">{report.date} • Score: {report.score}/100</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
                  Open Report
                </button>
              </div>
            ))}
          </div>
        )}

        {(activeTab === "History" || activeTab === "Locations Explored" || activeTab === "Avg Opportunity Score") && (
          <div className="p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Section Coming Soon</h3>
            <p className="text-sm text-gray-500 mt-2">We're working on bringing more insights to your dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
}
