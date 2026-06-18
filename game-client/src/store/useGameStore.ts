import { create } from "zustand";
import type { FullState, ServerEvent } from "../types/types";

interface GameStore {
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
      case "card_drawn": {
        const { player_idx, card } = evt;

        if (evt.card && s.your_board.player_idx === player_idx) {
          if (card) {
            s.your_board.hand.push(card);
            newCanDraw = false;
          }
        }
        break;
      }

      case "card_played_on_scale": {
        const { player_idx, card, scale_idx } = evt;

        if (s.your_board.player_idx === player_idx) {
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              (
                c.suit === card.suit &&
                c.value === card.value &&
                c.deck === card.deck
              ),
          );
          newCanDraw = false;
        }

        const scale = s.scales.find((sc) => sc.scale_idx === scale_idx);
        if (scale) {
          scale.cards.push(card);
        } else {
          s.scales.push({ scale_idx: scale_idx, cards: [card] });
        }
        break;
      }

      case "card_placed_on_side": {
        const { player_idx, card, stack_idx } = evt;

        if (s.your_board.player_idx === player_idx) {
          s.your_board.side[stack_idx].push(card);
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === card.suit &&
                c.value === card.value &&
                c.deck === card.deck
              ),
          );
          newCanDraw = false;
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

      case "scale_completed": {
        const scale = s.scales.find((sc) => sc.scale_idx === evt.scale_idx);
        if (scale) scale.completed = true;
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
          winnerIdx: state.winnerIdx,
          timeoutMessage,
          canDraw: newCanDraw,
        });
        return;
      }

      case "game_started": {
        s.your_turn = evt.current_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        newCanDraw = s.your_turn;
        break;
      }

      case "game_over": {
        set({
          fullState: s,
          winnerIdx: evt.winner_idx,
          timeoutMessage: null,
          canDraw: false,
        });
        return;
      }

      case "player_joined":
      case "player_left":
        break;

      default:
        console.warn("Unhandled event:", evt);
    }

    set({
      fullState: s,
      winnerIdx: state.winnerIdx,
      timeoutMessage: state.timeoutMessage,
      canDraw: newCanDraw,
    });
  },

  clearTimeoutMessage: () => set({ timeoutMessage: null }),
}));
