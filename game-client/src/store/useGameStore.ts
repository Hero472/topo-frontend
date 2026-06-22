import { create } from "zustand";
import type { FullState, ServerEvent } from "../types/types";

interface GameStore {
  fullState: FullState | null;
  winnerId: string | null;
  // winnerIdx: number | null;
  timeoutMessage: string | null;
  canDraw: boolean;

  applyFullState: (payload: FullState) => void;
  applyEvent: (payload: ServerEvent) => void;
  clearTimeoutMessage: () => void;
}
export const useGameStore = create<GameStore>((set, get) => ({
  fullState: null,
  winnerId: null,
  timeoutMessage: null,
  canDraw: false,

  applyFullState: (payload) =>
    set({
      fullState: payload,
      winnerId: null,
      timeoutMessage: null,
      canDraw: payload.your_turn,
    }),

  applyEvent: (evt) => {
    const state = get();
    if (!state.fullState) return;

    // Deep clone to avoid direct mutation
    const s: FullState = structuredClone(state.fullState);
    let newCanDraw = state.canDraw;

    switch (evt.type) {
      // ── Lobby events (no state change needed) ──
      case "player_joined":
      case "player_left":
        break;

      // ── Game lifecycle ──
      case "game_started": {
        s.your_turn = evt.current_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        newCanDraw = s.your_turn;
        break;
      }

      // ── Private: drawn card ──
      case "card_drawn": {
        // evt.card is null if deck & personal pile are empty (shouldn’t happen here)
        if (evt.card && s.your_board.player_idx === evt.player_idx) {
          s.your_board.hand.push(evt.card);
          newCanDraw = false;
        }
        break;
      }

      // ── Public: card played on a scale ──
      case "card_played_on_scale": {
        if (s.your_board.player_idx === evt.player_idx) {
          // Remove the played card from hand
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === evt.card.suit &&
                c.value === evt.card.value &&
                c.deck === evt.card.deck
              )
          );
          newCanDraw = false;
        }

        // Add card to the scale (create if it doesn’t exist yet)
        const scale = s.scales.find((sc) => sc.scale_idx === evt.scale_idx);
        if (scale) {
          scale.cards.push(evt.card);
        } else {
          s.scales.push({ scale_idx: evt.scale_idx, cards: [evt.card] });
        }
        break;
      }

      // ── Public: card placed on a side stack ──
      case "card_placed_on_side": {
        if (s.your_board.player_idx === evt.player_idx) {
          // The side array is always fully initialised (4 empty arrays)
          s.your_board.side[evt.stack_idx].push(evt.card);
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === evt.card.suit &&
                c.value === evt.card.value &&
                c.deck === evt.card.deck
              )
          );
          newCanDraw = false;
        }
        break;
      }

      // ── Public: scale completed ──
      case "scale_completed": {
        const scale = s.scales.find((sc) => sc.scale_idx === evt.scale_idx);
        // Safety: mark completed only if the scale exists
        if (scale) scale.completed = true;
        break;
      }

      // ── Private: opponent update ──
      case "opponent_update": {
        // Merge only the fields sent; hand_count stays as before
        s.opponent = {
          ...s.opponent,
          personal_count: evt.personal_count,
          personal_top: evt.personal_top,
          side: evt.side,
        };
        break;
      }

      // ── Turn ended ──
      case "turn_ended": {
        s.your_turn = evt.next_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        newCanDraw = s.your_turn;

        let timeoutMessage: string | null = null;
        if (evt.timed_out_player_id != null) {
          timeoutMessage =
            evt.timed_out_player_idx === s.your_board.player_idx
              ? "You ran out of time!"
              : "Your opponent ran out of time!";
        }

        // Early return because we need to set timeoutMessage without winnerId change
        set({
          fullState: s,
          timeoutMessage,
          canDraw: newCanDraw,
          winnerId: state.winnerId,   // preserve previous winnerId
        });
        return;
      }

      // ── Game over ──
      case "game_over": {
        set({
          fullState: s,
          winnerId: evt.winner_id,
          timeoutMessage: null,
          canDraw: false,
        });
        return;
      }

      // ── Connection events (no state change, maybe log) ──
      case "player_disconnected":
      case "player_reconnected":
        break;

      // ── Server error (log it, no state needed) ──
      case "error":
        console.error(`Server error [${evt.code}]:`, evt.message, evt.details);
        break;

      default:
        console.warn("Unhandled event:");
    }

    // For all non‑returning cases, update the state preserving winnerId
    set({
      fullState: s,
      winnerId: state.winnerId,
      timeoutMessage: state.timeoutMessage,
      canDraw: newCanDraw,
    });
  },

  clearTimeoutMessage: () => set({ timeoutMessage: null }),
}));