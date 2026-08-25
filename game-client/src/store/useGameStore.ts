import { create } from "zustand";

import type { FullState, ServerEvent } from "../types/types";

export interface GameStore {
  fullState: FullState | null;
  canDraw: boolean;
  turnTimeoutMessage: string | null;

  applyFullState: (payload: FullState) => void;
  applyEvent: (evt: ServerEvent) => void;
  clearTurnTimeoutMessage: () => void;
  reset: () => void;
}

const initialState = {
  fullState: null as FullState | null,
  canDraw: false,
  turnTimeoutMessage: null as string | null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  applyFullState: (payload) => {
    set({
      fullState: payload,
      canDraw: payload.your_turn,
      turnTimeoutMessage: null,
    });
  },

  applyEvent: (evt) => {
    const state = get();

    if (!state.fullState) {
      return;
    }

    const s: FullState = structuredClone(state.fullState);
    let canDraw = state.canDraw;
    let turnTimeoutMessage = state.turnTimeoutMessage;

    switch (evt.type) {
      case "game_started": {
        s.your_turn = evt.current_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        canDraw = s.your_turn;
        turnTimeoutMessage = null;
        break;
      }

      case "hand_refill": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.hand.push(...evt.cards);
          canDraw = false;
        }
        break;
      }

      case "personal_pile_updated": {
        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.personal = evt.personal_view;
        }
        break;
      }

      case "card_played_on_scale": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        if (s.your_board.player_idx === evt.player_idx) {
          // Remove the card from the hand.
          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === evt.card.suit &&
                c.value === evt.card.value &&
                c.deck === evt.card.deck
              ),
          );

          // The card may have come from the top of one of the side stacks.
          for (let index = 0; index < s.your_board.side.length; index++) {
            const stack = s.your_board.side[index];

            if (stack.length === 0) {
              continue;
            }

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

          canDraw = false;
        }

        const { scale_idx, card } = evt;

        if (scale_idx >= 0 && scale_idx < s.scales.length) {
          const scale = s.scales[scale_idx];

          s.scales[scale_idx] = scale
            ? { ...scale, cards: [...scale.cards, card] }
            : { scale_idx, cards: [card] };
        }

        break;
      }

      case "card_placed_on_side": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        if (s.your_board.player_idx === evt.player_idx) {
          if (evt.stack_idx >= 0 && evt.stack_idx < s.your_board.side.length) {
            s.your_board.side[evt.stack_idx].push(evt.card);
          }

          s.your_board.hand = s.your_board.hand.filter(
            (c) =>
              !(
                c.suit === evt.card.suit &&
                c.value === evt.card.value &&
                c.deck === evt.card.deck
              ),
          );

          canDraw = false;
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
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        // Make sure this update belongs to the opponent currently
        // represented in FullState.
        if (s.opponent.player_idx !== evt.player_idx) {
          break;
        }

        s.opponent = {
          ...s.opponent,
          personal_count: evt.personal_count,
          personal_top: evt.personal_top,
          hand: evt.hand,
          side: evt.side,
        };

        break;
      }

      case "turn_ended": {
        s.your_turn = evt.next_player_idx === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        canDraw = s.your_turn;

        turnTimeoutMessage =
          evt.timed_out_player_id == null
            ? null
            : evt.timed_out_player_idx === s.your_board.player_idx
              ? "You ran out of time!"
              : "Your opponent ran out of time!";

        break;
      }

      case "player_reconnected": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;
        break;
      }

      case "game_over": {
        canDraw = false;
        break;
      }

      case "error": {
        console.error(`Server error [${evt.code}]:`, evt.message, evt.details);
        break;
      }

      default: {
        // Room-level event (lobby roster, ready state, rematch voting,
        // disconnect banner, etc.) - not this store's concern. See
        // roomStore.ts.
        break;
      }
    }

    set({ fullState: s, canDraw, turnTimeoutMessage });
  },

  clearTurnTimeoutMessage: () => set({ turnTimeoutMessage: null }),

  reset: () => set(initialState),
}));