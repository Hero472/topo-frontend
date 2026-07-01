// ── App.tsx ──
// import { JoinPage } from "./pages/JoinPage";
// import { DebugPage } from "./pages/DebugPage";
import GamePage from "./pages/GamePage";

export default function App() {
  // Grab the current URL query params
  // const params = new URLSearchParams(globalThis.location.search);
  // const room = params.get("room");
  // const username = params.get("username");

  // If both params exist, go to the game; otherwise show the join screen
  return <GamePage />;
}