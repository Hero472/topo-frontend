import { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainMenuPage from "./pages/MainMenuPage";
import DebugPage from "./pages/DebugPage";
import CreateGamePage from "./pages/CreateGamePage";
import { JoinPage } from "./pages/JoinPage";
import GameSession from "./pages/GameSession";
import DragOverlay from "./components/overlay/DragOverlay";
import TutorialPage from "./pages/TutorialPage";

export default function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    // The 'dark' class on the root triggers the dark theme tokens in index.css
    <div className={`app-container ${isDark ? "dark" : ""}`}>
      
      {/* App Header */}
      <header className="app-header">
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {/* Using emojis for simplicity, but you can swap these for SVG icons */}
          {isDark ? "☀️" : "🌙"} 
        </button>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        <Suspense fallback={<div className="loading-state">Loading game...</div>}>
          <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/join" element={<CreateGamePage />} />
            <Route path="/game/:gameId/join" element={<JoinPage />} />
            <Route path="/game/:gameId/*" element={<GameSession />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/tutorial" element={<TutorialPage />} /> {/* Fixed missing slash */}
          </Routes>
        </Suspense>
      </main>
      
      <DragOverlay />
    </div>
  );
}