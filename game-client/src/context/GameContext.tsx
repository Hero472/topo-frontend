import { type Action, type GameState } from "./gameContextCore";
import type { FullState } from "../types";

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "FULL_STATE": {
      console.log("🔄 Replacing full state, your_turn:", action.payload.your_turn);
      return { fullState: action.payload, winnerId: null };
    }

    case "APPLY_EVENT": {
      if (!state.fullState) return state;

      // Deep‑clone the full state so we can mutate it safely
      const s: FullState = structuredClone(state.fullState);
      const evt = action.payload;
      console.log("⚡ Applying event:", evt.type, evt);

      switch (evt.type) {
        // ── Drawing a card (only sent to the player who drew) ───────────
        case "card_drawn": {
          if (evt.card && s.your_board.player_idx === evt.player_id) {
            s.your_board.hand.push(evt.card);
          }
          break;
        }

        // ── Playing a card onto a scale ─────────────────────────────────
        case "card_played_on_scale": {
          const { player_id, card, scale_id, completed } = evt;
          // Remove from own hand if we are the actor
          if (s.your_board.player_idx === player_id) {
            const idx = s.your_board.hand.findIndex(
              (c) => c.suit === card.suit && c.value === card.value
            );
            if (idx !== -1) s.your_board.hand.splice(idx, 1);
          }
          // Find or create the scale
          const scale = s.scales.find((sc) => sc.id === scale_id);
          if (scale) {
            scale.cards.push(card);
            scale.completed = completed;
          } else {
            s.scales.push({
              id: scale_id,
              cards: [card],
              completed,
              owner: player_id,
            });
          }
          break;
        }

        // ── Placing a card on a side stack ──────────────────────────────
        case "card_placed_on_side": {
          const { player_id, card, stack } = evt;
          // Add to the correct player's side stack
          if (s.your_board.player_idx === player_id) {
            s.your_board.side[stack].push(card);
            // Remove from hand (most side plays come from hand)
            const idx = s.your_board.hand.findIndex(
              (c) => c.suit === card.suit && c.value === card.value
            );
            if (idx !== -1) s.your_board.hand.splice(idx, 1);
            // Note: if the card came from personal, the OpponentUpdate
            // will fix personal counts for the opponent later.
          }
          // Opponent side stacks are fully replaced by OpponentUpdate,
          // so we don't manually update them here.
          break;
        }

        // ── Opponent visible state update ──────────────────────────────
        case "opponent_update": {
          s.opponent = {
            ...s.opponent,
            personal_count: evt.personal_count,
            personal_top: evt.personal_top,
            side: evt.side,
          };
          break;
        }

        // ── A scale was completed ──────────────────────────────────────
        case "scale_completed": {
          const scale = s.scales.find((sc) => sc.id === evt.scale_id);
          if (scale) {
            scale.completed = true;
          }
          break;
        }

        // ── Turn handling ───────────────────────────────────────────────
        case "turn_ended": {
          s.your_turn = evt.next_player_id === s.your_board.player_idx;
          // Also update the turn seconds so the timer resets correctly
          s.turn_seconds_remaining = evt.turn_seconds;
          console.log("🌀 Turn ended – your turn:", s.your_turn);
          break;
        }

        case "game_started": {
          s.your_turn = evt.current_player_id === s.your_board.player_idx;
          s.turn_seconds_remaining = evt.turn_seconds;
          break;
        }

        // ── Game over ──────────────────────────────────────────────────
        case "game_over": {
          return { ...state, winnerId: evt.winner_id };
        }

        // ── Events that don’t modify game state ────────────────────────
        case "player_joined":
        case "player_left":
          break;

        default: {
          console.warn("❓ Unhandled event type:", evt);
          break;
        }
      }
      return { fullState: s, winnerId: state.winnerId };
    }

    default:
      return state;
  }
}