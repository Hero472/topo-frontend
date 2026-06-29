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
      case "hand_refill": {
        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.hand.push(...evt.cards);
          newCanDraw = false;
        }
        break;
      }

      case "personal_pile_updated": {
        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.personal.count = evt.count;
          s.your_board.personal.top = evt.top;
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

          for (const stack of s.your_board.side) {
            if (stack.length > 0) {
              const top = stack[stack.length - 1];
              if (
                top.suit === evt.card.suit &&
                top.value === evt.card.value &&
                top.deck === evt.card.deck
              ) {
                stack.pop();
                break; // card found and removed – stop looking
              }
            }
          }

          newCanDraw = false;
        }

        const { scale_idx, card } = evt;

        if (scale_idx >= 0 && scale_idx < s.scales.length) {
          const scale = s.scales[scale_idx];
          if (scale) {
            // Slot already has a scale – just push the card
            scale.cards.push(card);
          } else {
            s.scales[scale_idx] = {
              scale_idx,
              cards: [card],
            };
          }
        }
        break;
      }

      // ── Public: card placed on a side stack ──
      case "card_placed_on_side": {
        if (s.your_board.player_idx === evt.player_idx) {
          // The side array is always fully initialized (4 empty arrays)
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
        const { scale_idx } = evt;
        if (scale_idx >= 0 && scale_idx < s.scales.length) {
          s.scales[scale_idx] = null;
        }
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