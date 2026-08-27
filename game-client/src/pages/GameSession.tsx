import { useParams } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import { useRoomStore } from "../store/useRoomStore";
import GamePage from "./GamePage";
import WaitingGamePage from "./WaitingGamePage";

export default function GameSession() {
  const { gameId } = useParams<{ gameId: string }>();
  const username = sessionStorage.getItem("game-username") ?? "";

  // ✅ ONE single WebSocket connection for the entire game session
  const socket = useGameSocket(gameId ?? "", username);

  const phase = useRoomStore((state) => state.phase);

  // ✅ Conditionally render based on phase, WITHOUT navigating away
  if (phase === "playing" || phase === "over") {
    return <GamePage socket={socket} />;
  }

  return <WaitingGamePage socket={socket} />;
}