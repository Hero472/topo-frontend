import { create } from "zustand";
import type { FullState, ServerEvent } from "../types/types";

export interface GameStore {
  fullState: FullState | null;
  winnerId: string | null;
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

    const s: FullState = structuredClone(state.fullState);
    let newCanDraw = state.canDraw;

    switch (evt.type) {
      case "player_joined":
      case "player_left":
        break;

      case "game_started": {
        s.your_turn = evt.current_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        newCanDraw = s.your_turn;
        break;
      }

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

      case "card_played_on_scale": {
        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === evt.card.suit &&
                c.value === evt.card.value &&
                c.deck === evt.card.deck
              )
          );

          for (let index = 0; index < s.your_board.side.length; index++) {
            const stack = s.your_board.side[index];

            if (stack.length === 0) continue;

            const top = stack[stack.length - 1];

            if (
              top.suit === evt.card.suit &&
              top.value === evt.card.value &&
              top.deck === evt.card.deck
            ) {
              const side = [...s.your_board.side] as typeof s.your_board.side;
              side[index] = side[index].slice(0, -1);
              s.your_board.side = side;
              break;
            }
          }

          newCanDraw = false;
        }

        const { scale_idx, card } = evt;

        if (scale_idx >= 0 && scale_idx < s.scales.length) {
          const scale = s.scales[scale_idx];
          if (scale) {
            s.scales[scale_idx] = {
              ...scale,
              cards: [...scale.cards, card],
            };
          } else {
            s.scales[scale_idx] = {
              scale_idx,
              cards: [card],
            };
          }
        }
        break;
      }

      case "card_placed_on_side": {
        if (s.your_board.player_idx === evt.player_idx) {
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

      case "scale_completed": {
        const { scale_idx } = evt;
        if (scale_idx >= 0 && scale_idx < s.scales.length) {
          s.scales[scale_idx] = null;
        }
        break;
      }

      case "opponent_update": {
        s.opponent = {
          ...s.opponent,
          personal_count: evt.personal_count,
          personal_top: evt.personal_top,
          side: evt.side,
        };
        break;
      }

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

        set({
          fullState: s,
          timeoutMessage,
          canDraw: newCanDraw,
          winnerId: state.winnerId,
        });
        return;
      }

      case "game_over": {
        set({
          fullState: s,
          winnerId: evt.winner_id,
          timeoutMessage: null,
          canDraw: false,
        });
        return;
      }

      case "player_disconnected":
      case "player_reconnected":
        break;

      case "error":
        console.error(`Server error [${evt.code}]:`, evt.message, evt.details);
        break;

      default:
        console.warn("Unhandled event:");
    }

    set({
      fullState: s,
      winnerId: state.winnerId,
      timeoutMessage: state.timeoutMessage,
      canDraw: newCanDraw,
    });
  },

  clearTimeoutMessage: () => set({ timeoutMessage: null }),
}));