import { useState } from "react";
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
    <div className={isDark ? "dark" : ""}> 
      
      <button
        type="button"
        onClick={() => setIsDark(!isDark)}
        className="btn theme-toggle"
      >
        {isDark ? "Light" : "Dark"}
      </button>

      <Routes>
        <Route path="/" element={<MainMenuPage />} />
        <Route path="/join" element={<CreateGamePage />} />
        <Route path="/game/:gameId/join" element={<JoinPage />} />
        <Route path="/game/:gameId/*" element={<GameSession />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="tutorial" element={<TutorialPage />} />
      </Routes>
      
      <DragOverlay />
    </div>
  );
}