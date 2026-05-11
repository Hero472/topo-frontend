import { type Action, type GameState } from "./gameContextCore";
import type { FullState } from "../types";

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "FULL_STATE":
      return { fullState: action.payload, winnerId: null };

    case "APPLY_EVENT": {
      if (!state.fullState) return state;
      const s: FullState = structuredClone(state.fullState);
      const evt = action.payload;

      switch (evt.type) {
        // ── Drawing a card ──────────────────────────────────────────────
        case "CardDrawn":
          if (evt.card && s.your_board.player_idx === evt.player_id) {
            s.your_board.hand.push(evt.card);
          }
          break;

        // ── Playing a card onto a scale ─────────────────────────────────
        case "CardPlayedOnScale": {
          const card = evt.card;
          // Remove from own hand if we are the actor
          if (s.your_board.player_idx === evt.player_id) {
            const idx = s.your_board.hand.findIndex(
              c => c.suit === card.suit && c.value === card.value
            );
            if (idx !== -1) s.your_board.hand.splice(idx, 1);
          }
          // Find or create the scale
          const scale = s.scales.find(sc => sc.id === evt.scale_id);
          if (scale) {
            scale.cards.push(card);
            scale.completed = evt.completed;
          } else {
            s.scales.push({
              id: evt.scale_id,
              cards: [card],
              completed: evt.completed,
              owner: evt.player_id,
            });
          }
          break;
        }

        // ── Placing a card on a side stack ──────────────────────────────
        case "CardPlacedOnSide": {
          const { player_id, card, stack } = evt;
          // Add the card to the right player's side stack
          if (s.your_board.player_idx === player_id) {
            s.your_board.side[stack].push(card);
            // Remove it from hand (most common for MoveToSide)
            const handIdx = s.your_board.hand.findIndex(
              c => c.suit === card.suit && c.value === card.value
            );
            if (handIdx !== -1) s.your_board.hand.splice(handIdx, 1);
            // If it came from personal, the count will be corrected by an OpponentUpdate later,
            // so we don't change personal.count here.
          } else {
            // Opponent side will be fully replaced by OpponentUpdate, so we skip.
          }
          break;
        }

        // ── Opponent update (full side stacks, personal counts) ─────────
        case "OpponentUpdate": {
          s.opponent = {
            ...s.opponent,
            personal_count: evt.personal_count,
            personal_top: evt.personal_top,
            side: evt.side,
          };
          break;
        }

        // ── Turn handling ───────────────────────────────────────────────
        case "TurnEnded":
          s.your_turn = evt.next_player_id === s.your_board.player_idx;
          break;

        case "GameStarted":
          s.your_turn = evt.current_player_id === s.your_board.player_idx;
          break;

        // ── Game over ───────────────────────────────────────────────────
        case "GameOver":
          return { ...state, winnerId: evt.winner_id };

        // ── Events that don't change state ──────────────────────────────
        case "PlayerJoined":
        case "PlayerLeft":
        case "TurnTimedOut":
          break;

        default:
          break;
      }
      return { fullState: s, winnerId: state.winnerId };
    }
    default:
      return state;
  }
}