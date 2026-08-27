import MainMenuPage from "./pages/MainMenuPage";
import { Route, Routes } from "react-router-dom";
import DebugPage from "./pages/DebugPage";
import CreateGamePage from "./pages/CreateGamePage";
import { JoinPage } from "./pages/JoinPage";
import GameSession from "./pages/GameSession";
import DragOverlay from "./components/overlay/DragOverlay";

export default function App() {
    return (
        <>
        <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/join" element={<CreateGamePage />} />
            <Route path="/game/:gameId/join" element={<JoinPage />} />
            <Route path="/game/:gameId/*" element={<GameSession />} />
            <Route path="/debug" element={<DebugPage />} />
        </Routes>
        <DragOverlay/>
        </>
    );
}