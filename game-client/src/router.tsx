import { createBrowserRouter } from "react-router-dom";
import MainMenuPage from "./pages/MainMenuPage";
import DebugPage from "./pages/DebugPage";
import CreateGamePage from "./pages/CreateGamePage";
import { JoinPage } from "./pages/JoinPage";
import GameSession from "./pages/GameSession";
import TutorialPage from "./pages/TutorialPage";
import RootLayout from "./layouts/RootLayout";

export const router = createBrowserRouter([
  {
    // This is the new "Layout Route". It wraps everything in your Header/Theme logic.
    element: <RootLayout />,
    children: [
      { path: "/", element: <MainMenuPage /> },
      { path: "/join", element: <CreateGamePage /> },
      { path: "/game/:gameId/join", element: <JoinPage /> },
      { path: "/game/:gameId/*", element: <GameSession /> },
      { path: "/debug", element: <DebugPage /> },
      { path: "/tutorial", element: <TutorialPage /> },
      
      // Example of the NEW stuff: Using a Loader!
      // {
      //   path: "/game/:gameId",
      //   element: <GameSession />,
      //   loader: async ({ params }) => {
      //     // Fetch game data BEFORE the component renders!
      //     const res = await fetch(`/api/game/${params.gameId}`);
      //     return res.json();
      //   },
      //   // If the loader fails, it automatically goes here:
      //   errorElement: <div>Game not found!</div> 
      // }
    ],
  },
]);