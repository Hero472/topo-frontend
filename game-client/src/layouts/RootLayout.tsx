import { useState } from "react";
import { Outlet, Link } from "react-router-dom"; // <-- Import Link
import { Switch } from "../components/ui/Switch";
import DragOverlay from "../components/overlay/DragOverlay";
import LanguageSelector from "../components/language/LanguageSelector";

export default function RootLayout() {
  const [isDark, setIsDark] = useState(true);

  return (
    // The 'dark' class here triggers all dark: variants in Tailwind v4
    <div className={`min-h-screen flex flex-col bg-background-primary text-foreground-secondary transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-primary bg-background-primary/80 backdrop-blur-md transition-colors duration-300">
        
        {/* Left: Brand / Logo (Now Clickable!) */}
        <Link 
          to="/" 
          className="text-xl font-bold text-foreground-primary tracking-tight hover:text-brand-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md px-1 -ml-1"
        >
          Topo
        </Link>

        {/* Right: Controls Group */}
        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSelector />
          
          {/* Subtle vertical divider (hidden on mobile to save space) */}
          <div className="hidden sm:block h-6 w-px bg-border-primary" />
          
          {/* Theme Toggle */}
          <Switch 
            checked={isDark} 
            onCheckedChange={setIsDark} 
            label={
              <span className="hidden sm:inline text-sm font-medium text-foreground-secondary select-none">
                {isDark ? "Dark" : "Light"}
              </span>
            }
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors duration-300">
        {/* <Outlet /> renders the matched child route */}
        <Outlet /> 
      </main>
      
      {/* Global Overlays (like drag-and-drop) */}
      <DragOverlay />
    </div>
  );
}