import { create } from 'zustand';
import type { FullState, ServerEvent } from '../types';

interface GameStore {
  fullState: FullState | null;
  winnerId: number | null;
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

    // Deep clone the full state (only this player's view)
    const s: FullState = structuredClone(state.fullState);

    let newCanDraw = state.canDraw;

    switch (evt.type) {
      case 'card_drawn': {
        if (evt.card && s.your_board.player_idx === evt.player_id) {
          s.your_board.hand.push(evt.card);
          newCanDraw = false;
        }
        break;
      }

      case 'card_played_on_scale': {
        const { player_id, card, scale_id, completed } = evt;
        if (s.your_board.player_idx === player_id) {
          const idx = s.your_board.hand.findIndex(
            (c) => c.suit === card.suit && c.value === card.value
          );
          if (idx !== -1) s.your_board.hand.splice(idx, 1);
        }
        const scale = s.scales.find((sc) => sc.id === scale_id);
        if (scale) {
          scale.cards.push(card);
          scale.completed = completed;
        } else {
          s.scales.push({ id: scale_id, cards: [card], completed, owner: player_id });
        }
        break;
      }

      case 'card_placed_on_side': {
        const { player_id, card, stack } = evt;
        if (s.your_board.player_idx === player_id) {
          s.your_board.side[stack].push(card);
          const idx = s.your_board.hand.findIndex(
            (c) => c.suit === card.suit && c.value === card.value
          );
          if (idx !== -1) s.your_board.hand.splice(idx, 1);
        }
        // Opponent side stacks are replaced entirely by OpponentUpdate
        break;
      }

      case 'opponent_update': {
        s.opponent = {
          ...s.opponent,
          personal_count: evt.personal_count,
          personal_top: evt.personal_top,
          side: evt.side,
        };
        break;
      }

      case 'scale_completed': {
        const scale = s.scales.find((sc) => sc.id === evt.scale_id);
        if (scale) scale.completed = true;
        break;
      }

      case 'turn_ended': {
        s.your_turn = evt.next_player_id === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;

        let timeoutMessage: string | null = null;
        if (evt.timed_out_player_id != null) {
          timeoutMessage =
            evt.timed_out_player_id === s.your_board.player_idx
              ? 'You ran out of time!'
              : 'Your opponent ran out of time!';
        }
        set({
          fullState: s,
          winnerId: state.winnerId,
          timeoutMessage,
          canDraw: newCanDraw,
        });
        return;
      }

      case 'game_started': {
        s.your_turn = evt.current_player_id === s.your_board.player_idx;
        s.turn_seconds_remaining = evt.turn_seconds;
        newCanDraw = s.your_turn; 
        break;
      }

      case 'game_over': {
        set({ fullState: s, winnerId: evt.winner_id, timeoutMessage: null, canDraw: false });
        return;
      }

      case 'player_joined':
      case 'player_left':
        break;

      default:
        console.warn('Unhandled event:', evt);
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