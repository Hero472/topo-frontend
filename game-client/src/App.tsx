import { JoinPage } from "./pages/JoinPage";
import GamePage from "./pages/GamePage";

export default function App() {
  const params = new URLSearchParams(globalThis.location.search);
  const room = params.get("room");
  const username = params.get("username");

  return room && username ? <GamePage /> : <JoinPage/>;
}