import { create } from "zustand";

import type { FullState, ServerEvent } from "../types/types";

export interface GameStore {
  fullState: FullState | null;

  gameStarted: boolean;
  waitingForPlayer: boolean;

  winnerId: string | null;
  timeoutMessage: string | null;

  canDraw: boolean;

  // Player who has requested a rematch.
  playAgainRequestedBy: string | null;

  applyFullState: (payload: FullState) => void;
  applyEvent: (payload: ServerEvent) => void;
  clearTimeoutMessage: () => void;
  clearPlayAgainRequest: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  fullState: null,

  gameStarted: false,
  waitingForPlayer: false,

  winnerId: null,
  timeoutMessage: null,

  canDraw: false,

  playAgainRequestedBy: null,

  applyFullState: (payload) => {
    console.log("FULL STATE:", payload);
    console.log("DEALER PREVIEW:", payload.dealer_preview);

    set({
      fullState: payload,
      gameStarted: true,
      waitingForPlayer: false,
      winnerId: null,
      timeoutMessage: null,
      canDraw: payload.your_turn,
      playAgainRequestedBy: null,
    });
  },

  applyEvent: (evt) => {
    const state = get();

    // ─────────────────────────────────────────────
    // Lobby
    // ─────────────────────────────────────────────

    if (evt.type === "waiting_for_player") {
      set({
        waitingForPlayer: true,
        gameStarted: false,
      });

      return;
    }

    // ─────────────────────────────────────────────
    // Game started
    // ─────────────────────────────────────────────

    if (evt.type === "game_started") {
      set({
        waitingForPlayer: false,
        gameStarted: true,
        playAgainRequestedBy: null,
      });

      if (!state.fullState) {
        return;
      }

      const s: FullState = structuredClone(state.fullState);

      s.your_turn = evt.current_player_idx === s.your_board.player_idx;

      s.turn_seconds_remaining = evt.turn_seconds;

      set({
        fullState: s,
        canDraw: s.your_turn,
      });

      return;
    }

    // ─────────────────────────────────────────────
    // Events that don't require FullState
    // ─────────────────────────────────────────────

    if (evt.type === "play_again") {
      set({
        playAgainRequestedBy: evt.player_id,
      });

      return;
    }

    if (evt.type === "opponent_left") {
      set({
        gameStarted: false,
        waitingForPlayer: false,
        canDraw: false,
        timeoutMessage: "Your opponent left the game.",
      });

      return;
    }

    // ─────────────────────────────────────────────
    // Everything below requires FullState
    // ─────────────────────────────────────────────

    if (!state.fullState) {
      return;
    }

    const s: FullState = structuredClone(state.fullState);

    let newCanDraw = state.canDraw;

    switch (evt.type) {
      case "player_joined":
      case "player_left": {
        break;
      }

      case "hand_refill": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        if (s.your_board.player_idx === evt.player_idx) {
          s.your_board.hand.push(...evt.cards);

          newCanDraw = false;
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

          // The card may have come from the top
          // of one of the side stacks.
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
        s.turn_seconds_remaining = evt.turn_seconds_remaining;

        // Make sure this update belongs to the
        // opponent currently represented in FullState.
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

      case "player_disconnected": {
        break;
      }

      case "player_reconnected": {
        s.turn_seconds_remaining = evt.turn_seconds_remaining;
        break;
      }

      case "error": {
        console.error(`Server error [${evt.code}]:`, evt.message, evt.details);

        break;
      }

      default: {
        console.warn("Unhandled event:", evt);
        break;
      }
    }

    set({
      fullState: s,
      winnerId: state.winnerId,
      timeoutMessage: state.timeoutMessage,
      canDraw: newCanDraw,
      playAgainRequestedBy: state.playAgainRequestedBy,
    });
  },

  clearTimeoutMessage: () => {
    set({
      timeoutMessage: null,
    });
  },

  clearPlayAgainRequest: () => {
    set({
      playAgainRequestedBy: null,
    });
  },
}));
