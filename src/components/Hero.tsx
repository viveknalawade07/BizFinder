import { motion } from "motion/react";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  onSearch: (location: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [location, setLocation] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              // Extract a cleaner address (e.g., Neighborhood, City, State)
              const addr = data.address;
              const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || "";
              const city = addr.city || addr.town || addr.village || "";
              const state = addr.state || "";
              
              const cleanLocation = [neighborhood, city, state].filter(Boolean).join(", ");
              setLocation(cleanLocation || data.display_name);
            } else {
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            alert("Could not determine address. Using coordinates instead.");
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          setIsDetecting(false);
          console.error("Geolocation error:", error);
          alert("Location access denied or unavailable.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <section id="discover" className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
        >
          <Sparkles className="w-3 h-3" />
          AI-Powered Business Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6"
        >
          Find Your Perfect <br />
          <span className="text-primary">Business Opportunity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          Discover local market gaps, get AI-driven startup ideas, and generate full
          feasibility reports — tailored to your exact location.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-3 p-2 rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <MapPin className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Enter city, area, or pincode..."
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50"
            >
              <MapPin className="w-4 h-4" />
              {isDetecting ? "Detecting..." : "Detect Location"}
            </button>

            <button
              onClick={() => onSearch(location)}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-background font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Explore Opportunities
            </button>
          </div>
          
          {location && !isDetecting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Detected: {location}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
