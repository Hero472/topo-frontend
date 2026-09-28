import { useEffect, useRef } from "react";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import { useGameStore } from "../../store/useGameStore";
import type { Action } from "../../types/types";
import { canDropOnTarget } from "../../utils/canDrop";
import { cardKey } from "../../utils/cardKey";
import { useHapticFeedback } from "../../hooks/useHapticFeedback"; 
import { useWakeLock } from "../../hooks/useWakeLock";
import CenterBoard from "./CenterBoard";
import OpponentBoard from "./OpponentBoard";
import PlayerBoard from "./PlayerBoard";
import TurnTimer from "./TurnTimer";

interface Props {
  sendAction: (action: Action) => void;
}

export default function GameBoard({ sendAction }: Readonly<Props>) {
  const fullState = useGameStore((s) => s.fullState);
  const canDraw = useGameStore((s) => s.canDraw);

  const { vibrateShort, vibrateLong, vibrateDraw, vibrateError } = useHapticFeedback();
  
  // Keep screen awake while the game state is loaded
  useWakeLock(!!fullState);

  const wasMyTurnRef = useRef(fullState?.your_turn ?? false);

  useEffect(() => {
    if (fullState) {
      if (wasMyTurnRef.current === true && fullState.your_turn === false) {
        vibrateLong();
      }
      wasMyTurnRef.current = fullState.your_turn;
    }
  }, [fullState?.your_turn, vibrateLong]);

  function handleDrop(event: CardDropEvent) {
    if (!fullState) return;
    if (!fullState.your_turn) return;
    
    if (!canDropOnTarget(fullState, event.card, event.targetStackId)) {
      vibrateError();
      return;
    }

    vibrateShort();

    switch (event.sourceStackId) {
      case "draw": {
        if (event.targetStackId === "hand" && canDraw) {
          vibrateDraw();
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
          if (event.card.value !== 13) return;
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
      sendAction({ type: "play_side", stack_idx: stackIdx, scale_idx: scaleIdx });
    }
  }

  if (!fullState) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <span className="text-foreground-tertiary animate-pulse font-medium">Loading game...</span>
      </div>
    );
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden">
      
      {/* Opponent Area: Fixed height, never shrinks */}
      <div className="w-full flex justify-center shrink-0">
        <OpponentBoard board={fullState.opponent} isMyTurn={!fullState.your_turn} />
      </div>

      {/* Timer Area: Fixed height, z-10 ensures it stays above cards if things get tight */}
      <div className="w-full flex justify-center shrink-0 z-10">
        <TurnTimer
          key={`${fullState.your_turn}-${fullState.turn_seconds_remaining}`}
          initialSeconds={fullState.turn_seconds_remaining}
          isMyTurn={fullState.your_turn}
        />
      </div>

      {/* Center Board Area: Takes up all remaining vertical space */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        <CenterBoard
          scales={fullState.scales}
          dealerCount={fullState.dealer_count}
          dealerPreview={fullState.dealer_preview}
          onDrop={handleDrop}
        />
      </div>

      {/* Player Area: Fixed height, never shrinks */}
      <div className="w-full flex justify-center shrink-0">
        <PlayerBoard
          board={fullState.your_board}
          onDrop={handleDrop}
          isMyTurn={fullState.your_turn}
        />
      </div>

    </main>
  );
}