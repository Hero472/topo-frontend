import { JoinPage } from "./pages/JoinPage";
import GamePage from "./pages/GamePage";
import MainMenuPage from "./pages/MainMenuPage";
import { Route, Routes } from "react-router-dom";
import DebugPage from "./pages/DebugPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/debug" element={<DebugPage />} />
        </Routes>
    );
}