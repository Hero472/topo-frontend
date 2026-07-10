import type { CardDropEvent } from "../hooks/useDropTarget";
import { useGameStore } from "../store/useGameStore";
import type { Action } from "../types/types";
import { canDropOnTarget } from "../utils/canDrop";
import { cardKey } from "../utils/cardKey";
import CenterBoard from "./CenterBoard";
import OpponentBoard from "./OpponentBoard";
import PlayerBoard from "./PlayerBoard";

interface Props {
  sendAction: (action: Action) => void;
}

export default function GameBoard({ sendAction }: Readonly<Props>) {

  const fullState = useGameStore((s) => s.fullState);
  const canDraw = useGameStore((s) => s.canDraw);

  function handleDrop(event: CardDropEvent) {

    if (!fullState) return;
    if (!fullState.your_turn) return;

    if (!canDropOnTarget(fullState, event.card, event.targetStackId)) return;


    switch (event.sourceStackId) {
      case "draw": {
        if (event.targetStackId === "hand" && canDraw) {
          sendAction({ type: "draw" });
        }
        return;
      }


      case "hand": {
        const handIdx = fullState.your_board.hand.findIndex(
          (c) => cardKey(c) === cardKey(event.card)
        );
        if (handIdx === -1) return;

        if (event.targetStackId.startsWith("center-")) {
          const scaleIdx = Number(event.targetStackId.split("-")[1]) - 1;
          const scale = fullState.scales[scaleIdx];

          if (scale === null) {
            sendAction({ type: "open_scale", hand_idx: handIdx });
          } else {
            sendAction({ type: "play_hand", hand_idx: handIdx, scale_idx: scaleIdx });
          }
          return;
        }

        if (event.targetStackId.startsWith("side-")) {
          const stackIdx = Number(event.targetStackId.split("-")[1]) - 1;
          sendAction({ type: "move_to_side", hand_idx: handIdx, stack_idx: stackIdx });
          return;
        }

        return;
      }


      case "personal": {
        if (event.targetStackId.startsWith("center-")) {
          const scaleIdx = Number(event.targetStackId.split("-")[1]) - 1;
          sendAction({ type: "play_personal", scale_idx: scaleIdx });
          return;
        }

        if (event.targetStackId.startsWith("side-")) {
          if (event.card.value !== 13) return; // only King moves personal to side
          const stackIdx = Number(event.targetStackId.split("-")[1]) - 1;
          sendAction({ type: "move_personal_to_side", stack_idx: stackIdx });
          return;
        }

        return;
      }

    }


    if (event.sourceStackId.startsWith("side-")) {
      if (!event.targetStackId.startsWith("center-")) return;
      const stackIdx = Number(event.sourceStackId.split("-")[1]) - 1;
      const scaleIdx = Number(event.targetStackId.split("-")[1]) - 1;
      // canDropOnTarget already blocks non-Ace cards from opening an empty scale
      sendAction({ type: "play_side", stack_idx: stackIdx, scale_idx: scaleIdx });
    }
  }

  if (!fullState) {
    return <div>Loading...</div>;
  }

  return (
    <main
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: "2rem",
        width: "100%",
        height: "100vh",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      <OpponentBoard board={fullState.opponent} isMyTurn={!fullState.your_turn} />

      <CenterBoard
        scales={fullState.scales}
        dealerCount={fullState.dealer_count}
        dealerTop={fullState.dealer_top}
        onDrop={handleDrop}
      />

      <PlayerBoard
        board={fullState.your_board}
        onDrop={handleDrop}
        isMyTurn={fullState.your_turn}
      />
    </main>
  );
}