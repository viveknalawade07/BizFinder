import { motion } from "motion/react";
import { LayoutDashboard, Lightbulb, Calculator, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onDashboardClick: () => void;
}

export default function Navbar({ activeTab, onTabChange, onDashboardClick }: NavbarProps) {
  const navItems = [
    { id: "discover", label: "Discover", icon: LayoutDashboard },
    { id: "ideas", label: "Ideas", icon: Lightbulb },
    { id: "estimator", label: "Estimator", icon: Calculator },
    { id: "schemes", label: "Schemes", icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl glass border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("discover")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-background font-black text-xl">B</span>
          </div>
          <span className="text-xl font-display font-bold tracking-tight">BizFinder</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                activeTab === item.id ? "text-primary" : "text-gray-400"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onDashboardClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-background font-bold text-sm transition-all"
          >
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
