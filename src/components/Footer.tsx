import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-background font-black text-xl">B</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight">BizFinder</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 BizFinder. Built with AI for Bharat.
          </p>
        </div>
      </div>
    </footer>
  );
}
