import type { Card, FullState, ServerEvent } from "../types/types";

/**
 * Pure reducer: (currentState, serverEvent) → nextState
 * 
 * Handles all server-to-client events that modify the game board.
 * Events that do not change FullState are returned as‑is.
 */
export function gameReducer(state: FullState, event: ServerEvent): FullState {
  switch (event.type) {
    // ----------------------------------------------------------
    // Events with NO game state change
    // ----------------------------------------------------------
    case "player_joined":
    case "player_left":
    case "player_disconnected":
    case "player_reconnected":
    case "error":
      return state;

    // ----------------------------------------------------------
    // Game lifecycle – only turn / timer info changes
    // ----------------------------------------------------------
    case "game_started": {
      const { current_player_idx, turn_seconds } = event;
      return {
        ...state,
        your_turn: current_player_idx === state.your_board.player_idx,
        turn_seconds_remaining: turn_seconds,
      };
    }

    // ----------------------------------------------------------
    // Private: cards drawn from deck
    // ----------------------------------------------------------
    case "hand_refill": {
      const { player_idx, cards } = event;

      if (player_idx !== state.your_board.player_idx)
        return state;

      return {
        ...state,
        your_board: {
          ...state.your_board,
          hand: cards,
        },
      };
    }

    // ----------------------------------------------------------
    // Public: personal pile updated (top card shown / count changed)
    // ----------------------------------------------------------
    case "personal_pile_updated": {

      const { player_idx, count, top } = event;

      if (player_idx !== state.your_board.player_idx) return state;
      return {
        ...state,
        your_board: {
          ...state.your_board,
          personal: {
            ...state.your_board.personal,
            count: count,
            top: top,
          },
        },
      };
    }

    // ----------------------------------------------------------
    // Public: card played from hand or side onto a scale
    // ----------------------------------------------------------
    case "card_played_on_scale": {
      const { player_idx, card, scale_idx } = event;
      let newBoard = state.your_board;

      if (player_idx === state.your_board.player_idx) {
        const newHand = state.your_board.hand.filter(
          (c) =>
            !(
              c.suit === card.suit &&
              c.value === card.value &&
              c.deck === card.deck
            )
        );

        const newSide = state.your_board.side.map((stack) => {
          if (stack.length > 0) {
            const top = stack[stack.length - 1];
            if (
              top.suit === card.suit &&
              top.value === card.value &&
              top.deck === card.deck
            ) {
              return stack.slice(0, -1);
            }
          }
          return stack;
        }) as [Card[], Card[], Card[], Card[]];

        newBoard = {
          ...state.your_board,
          hand: newHand,
          side: newSide,
        };
      }

      const scales = state.scales.map((scale, idx) => {
        if (idx !== scale_idx) return scale;
        if (scale) {
          return { ...scale, cards: [...scale.cards, card] };
        }
        return { scale_idx, cards: [card] };
      });

      return {
        ...state,
        your_board: newBoard,
        scales,
      };
    }

    // ----------------------------------------------------------
    // Public: card placed onto a side stack from hand/personal
    // ----------------------------------------------------------
    case "card_placed_on_side": {
      const { player_idx, card, stack_idx } = event;
      if (player_idx !== state.your_board.player_idx) return state;

      const newHand = state.your_board.hand.filter(
        (c) =>
          !(
            c.suit === card.suit &&
            c.value === card.value &&
            c.deck === card.deck
          )
      );
      const newSide = state.your_board.side.map((stack, idx) =>
        idx === stack_idx ? [...stack, card] : stack
      ) as [Card[], Card[], Card[], Card[]];

      return {
        ...state,
        your_board: {
          ...state.your_board,
          hand: newHand,
          side: newSide,
        },
      };
    }

    // ----------------------------------------------------------
    // Scale completed – celebration handled in the store,
    // actual clearing of the scale is done there after 2 seconds.
    // ----------------------------------------------------------
    case "scale_completed":
      return state;   // the scale remains visible for the celebration

    // ----------------------------------------------------------
    // Private: opponent's board information update
    // ----------------------------------------------------------
    case "opponent_update": {
      const { personal_count, personal_top, side } = event;
      return {
        ...state,
        opponent: {
          ...state.opponent,
          personal_count,
          personal_top,
          side,
        },
      };
    }

    // ----------------------------------------------------------
    // Turn ended – update active player and timer
    // ----------------------------------------------------------
    case "turn_ended": {
      const { next_player_idx, turn_seconds } = event;
      return {
        ...state,
        your_turn: next_player_idx === state.your_board.player_idx,
        turn_seconds_remaining: turn_seconds,
      };
    }

    // ----------------------------------------------------------
    // Game over – no direct FullState change, store sets winnerId
    // ----------------------------------------------------------
    case "game_over":
      return state;

    default:
      return state;
  }
}