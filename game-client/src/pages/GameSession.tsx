import { useParams } from "react-router-dom";
import { useGameSocket, type GameSocket } from "../hooks/useGameSocket";
import { useRoomStore } from "../store/useRoomStore";
import GamePage from "./GamePage";
import WaitingGamePage from "./WaitingGamePage";

export default function GameSession() {
  const { gameId } = useParams<{ gameId: string }>();
  const username = sessionStorage.getItem("game-username") ?? "";

  const socket: GameSocket = useGameSocket(gameId ?? "", username);
  const phase = useRoomStore((state) => state.phase);

  if (phase === "playing" || phase === "game_over") {
    return <GamePage socket={socket} />;
  }

  return <WaitingGamePage socket={socket} />;
}