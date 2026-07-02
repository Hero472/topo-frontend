import { useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/useGameStore";
import GameBoard from "../components/GameBoard";

export default function GamePage() {
  const room = new URLSearchParams(globalThis.location.search).get("room") ?? "";
  const username = new URLSearchParams(globalThis.location.search).get("username") ?? "";

  const { sendAction, status } = useGameSocket(room, username);
  const setSendAction = useGameStore((s) => s.setSendAction);
  const fullState = useGameStore((s) => s.fullState);

  useEffect(() => {
    setSendAction(sendAction);
  }, [sendAction, setSendAction]);

  if (!fullState || status !== "open") {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", backgroundColor: "#0a2e0a", color: "#fff", fontSize: "1.5rem"
      }}>
        {status === "connecting" ? "Connecting…" : "Waiting for game state…"}
      </div>
    );
  }

  return <GameBoard />;
}