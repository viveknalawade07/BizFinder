import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OpportunitySection from "./components/OpportunitySection";
import CompetitorAnalyzer from "./components/CompetitorAnalyzer";
import AIRecommendations from "./components/AIRecommendations";
import Estimator from "./components/Estimator";
import NameValidator from "./components/NameValidator";
import Schemes from "./components/Schemes";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import { generateBusinessIdeas } from "./services/gemini";

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [showDashboard, setShowDashboard] = useState(false);
  const [location, setLocation] = useState("");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchLocation: string) => {
    setLocation(searchLocation);
    setIsSearching(true);
    const result = await generateBusinessIdeas(searchLocation);
    setOpportunities(result.opportunities || []);
    setIsSearching(false);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleGenerateReport = (idea: string) => {
    setActiveTab("estimator");
    const estimatorSection = document.getElementById("estimator");
    if (estimatorSection) {
      estimatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Mock initial opportunities - removed to show real AI results
  useEffect(() => {
    if (location) return;
    // Initial empty state or placeholder
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-background">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onDashboardClick={() => setShowDashboard(true)} 
      />
      
      <main>
        <Hero onSearch={handleSearch} />
        
        {location && (
          <div id="results">
            {isSearching ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">AI is analyzing local market data...</p>
              </div>
            ) : (
              <>
                <OpportunitySection 
                  opportunities={opportunities} 
                  onGenerateReport={handleGenerateReport}
                />
                <CompetitorAnalyzer />
                <AIRecommendations recommendations={opportunities.slice(0, 3)} />
              </>
            )}
          </div>
        )}

        <Estimator location={location} />
        <NameValidator />
        <Schemes />
      </main>

      <Footer />
    </div>
  );
}
