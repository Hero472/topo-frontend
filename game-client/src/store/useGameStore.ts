import { create } from "zustand";
import type { FullState, ServerEvent, Action } from "../types/types";
import { gameReducer } from "../utils/gameReducer";

let _send: ((action: Action) => void) | null = null;

export interface GameStore {
  fullState: FullState | null;
  winnerId: string | null;
  timeoutMessage: string | null;
  canDraw: boolean;
  completedScaleIdx: number | null;

  applyFullState: (payload: FullState) => void;
  applyEvent: (payload: ServerEvent) => void;
  clearTimeoutMessage: () => void;

  drawCard: () => void;
  openScale: (handIdx: number) => void;
  playHand: (handIdx: number, scaleIdx: number) => void;
  playPersonal: (scaleIdx: number) => void;
  playSide: (stackIdx: number, scaleIdx: number) => void;
  moveToSide: (handIdx: number, stackIdx: number) => void;
  movePersonalToSide: (stackIdx: number) => void;

  _setSend: (fn: ((action: Action) => void) | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  fullState: null,
  winnerId: null,
  timeoutMessage: null,
  canDraw: false,
  completedScaleIdx: null,

  applyFullState: (payload) =>
    set({
      fullState: payload,
      winnerId: null,
      timeoutMessage: null,
      canDraw: payload.your_turn,
      completedScaleIdx: null,
    }),

  applyEvent: (evt) => {
    const current = get();
    if (!current.fullState) return;

    const nextState = gameReducer(current.fullState, evt);

    let newCanDraw = current.canDraw;
    let winnerId = current.winnerId;
    let timeoutMessage = current.timeoutMessage;
    let completedScaleIdx = current.completedScaleIdx;

    switch (evt.type) {
      case "game_started":
        newCanDraw = nextState.your_turn;
        break;

      case "hand_refill":
      case "card_played_on_scale":
      case "card_placed_on_side":
        if (evt.player_idx === current.fullState.your_board.player_idx) {
          newCanDraw = false;
        }
        break;

      case "scale_completed":
        completedScaleIdx = evt.scale_idx;
        setTimeout(() => {
          set((prev) => {
            if (!prev.fullState) return prev;
            const cleared = prev.fullState.scales.map((s, i) =>
              i === evt.scale_idx ? null : s
            );
            return {
              fullState: { ...prev.fullState, scales: cleared },
              completedScaleIdx: null,
            };
          });
        }, 2000);
        break;

      case "turn_ended":
        newCanDraw = nextState.your_turn;
        if (evt.timed_out_player_id != null) {
          timeoutMessage =
            evt.timed_out_player_idx === current.fullState.your_board.player_idx
              ? "You ran out of time!"
              : "Your opponent ran out of time!";
        }
        break;

      case "game_over":
        winnerId = evt.winner_id;
        newCanDraw = false;
        break;

      default:
        break;
    }

    // 3. Commit the new state
    set({
      fullState: nextState,
      winnerId,
      timeoutMessage,
      canDraw: newCanDraw,
      completedScaleIdx,
    });
  },

  drawCard: () => _send?.({ type: "draw" }),
  openScale: (handIdx) => _send?.({ type: "open_scale", hand_idx: handIdx }),
  playHand: (handIdx, scaleIdx) =>
    _send?.({ type: "play_hand", hand_idx: handIdx, scale_idx: scaleIdx }),
  playPersonal: (scaleIdx) =>
    _send?.({ type: "play_personal", scale_idx: scaleIdx }),
  playSide: (stackIdx, scaleIdx) =>
    _send?.({ type: "play_side", stack_idx: stackIdx, scale_idx: scaleIdx }),
  moveToSide: (handIdx, stackIdx) =>
    _send?.({ type: "move_to_side", hand_idx: handIdx, stack_idx: stackIdx }),
  movePersonalToSide: (stackIdx) =>
    _send?.({ type: "move_personal_to_side", stack_idx: stackIdx }),

  _setSend: (fn) => { _send = fn; },

  clearTimeoutMessage: () => set({ timeoutMessage: null }),
}));