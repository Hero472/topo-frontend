import { type Action, type GameState } from "./gameContextCore";

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "FULL_STATE":
      return { fullState: action.payload, winnerId: null };
    case "APPLY_EVENT": {
      if (!state.fullState) return state;
      const s = structuredClone(state.fullState); // deep clone
      const event = action.payload;
      switch (event.type) {
        case "CardDrawn": {
          if (s.self.player_idx === event.player_id && event.card) {
            s.self.hand.push(event.card);
          }
          break;
        }
        case "CardPlayedOnScale": {
          // Remove card from hand (if the player is us, we know the card was in hand)
          if (s.self.player_idx === event.player_id) {
            // Remove the matching card from hand (simplified: find by suit/rank)
            const idx = s.self.hand.findIndex(
              c => c.suit === event.card.suit && c.rank === event.card.rank
            );
            if (idx !== -1) s.self.hand.splice(idx, 1);
          } else {
            // Opponent's card played: their hand count decreases
            s.opponent.hand_count = Math.max(0, s.opponent.hand_count - 1);
          }
          // Update the scale (shared scales array)
          const scale = s.scales.find(sc => sc.id === event.scale_id);
          if (scale) {
            scale.cards.push(event.card);
            scale.completed = event.completed;
          } else {
            // New scale (OpenScale) – create it
            s.scales.push({
              id: event.scale_id,
              cards: [event.card],
              completed: event.completed,
              owner: event.player_id,
            });
          }
          break;
        }
        case "CardPlacedOnSide": {
          // Place card on side stack (usually visible to both)
          if (s.self.player_idx === event.player_id) {
            // Remove from hand? (Depends on action: MoveToSide removes from hand, MovePersonalToSide removes from personal)
            // We need to know the source; for simplicity, we'll trust the OpponentUpdate later to sync counts.
            // For now, just update the side stack visually.
          }
          // Update the appropriate side stack
          if (event.player_id === s.self.player_idx) {
            s.self.side[event.stack].push(event.card);
          } else {
            // Opponent side will be updated by OpponentUpdate so skip here.
          }
          break;
        }
        case "OpponentUpdate": {
          s.opponent = {
            ...s.opponent,
            personal_count: event.personal_count,
            personal_top: event.personal_top,
            side: event.side,
          };
          break;
        }
        case "TurnEnded": {
          s.current_turn = event.next_player_id;
          break;
        }
        case "GameStarted": {
          s.current_turn = event.current_player_id;
          break;
        }
        case "GameOver": {
          return { ...state, winnerId: event.winner_id };
        }
        case "PlayerJoined":
        case "PlayerLeft":
        case "TurnTimedOut":
          // No state change needed
          break;
        default:
          break;
      }
      return { fullState: s, winnerId: null };
    }
    default:
      return state;
  }
}