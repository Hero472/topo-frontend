// import { JoinPage } from "./pages/JoinPage";
import GamePage from "./pages/GamePage";
import MainMenuPage from "./pages/MainMenuPage";
import { Route, Routes } from "react-router-dom";
import DebugPage from "./pages/DebugPage";
import CreateGamePage from "./pages/CreateGamePage";
import WaitingGamePage from "./pages/WaitingGamePage";
import { JoinPage } from "./pages/JoinPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/join" element={<CreateGamePage />} />
            <Route path="/game/:gameId/join" element={<JoinPage />} />
            <Route path="/game/:gameId/waiting" element={<WaitingGamePage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/debug" element={<DebugPage />} />
        </Routes>
    );
}