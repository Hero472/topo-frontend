export type DeckColor = "red" | "blue" | "black" | "white"; 

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
  deck: DeckColor;
}

export interface PersonalPile {
  count: number;
  top: Card | null;
  colors: string[];
}

export interface PlayerBoard {
  player_idx: number;
  personal: PersonalPile;
  side: [Card[], Card[], Card[], Card[]];
  hand: Card[];
}

export interface OpponentBoard {
  player_idx: number;
  username: string;
  hand_count: number;
  personal_count: number;
  personal_top: Card | null;
  side: [Card[], Card[], Card[], Card[]];
}

export interface Scale {
  scale_idx: number;
  cards: Card[];
}

export interface FullState {
  type: 'full_state';
  your_board: PlayerBoard;
  your_turn: boolean;
  opponent: OpponentBoard;
  scales: (Scale | null)[];
  dealer_top: DeckColor | null;
  dealer_count: number;
  turn_seconds_remaining: number;
}

// ── All server‑side events (matching your ServerEvent enum) ──
export type ServerEvent =
  // ── Lobby ──
  | {
      type: "player_joined";
      player_id: string;
      player_idx: number;
      username: string;
    }
  | {
      type: "player_left";
      player_id: string;
      player_idx: number;
    }

  // ── Game lifecycle ──
  | {
      type: "game_started";
      current_player_id: string;
      current_player_idx: number;
      turn_seconds: number;
    }

  // ── Private: drawn card ──
  | {
      type: "hand_refill";
      player_id: string;
      player_idx: number;
      cards: Card[];
    }
  
  // ── Public: Personal used and needs to show the next ──
  | {
    type: "personal_pile_updated";
    player_id: string;
    player_idx: number;
    count: number;
    top: Card | null;
  }

  // ── Public: card played on scale ──
  | {
      type: "card_played_on_scale";
      player_id: string;
      player_idx: number;
      card: Card;
      scale_idx: number;
      completed: boolean;
    }

  // ── Public: card placed on side stack ──
  | {
      type: "card_placed_on_side";
      player_id: string;
      player_idx: number;
      card: Card;
      stack_idx: number;
    }

  // ── Public: scale completed ──
  | {
      type: "scale_completed";
      scale_idx: number;
      by_player_id: string;
      by_player_idx: number;
    }

  // ── Private: opponent update ──
  | {
      type: "opponent_update";
      player_id: string;
      player_idx: number;
      personal_count: number;
      personal_top: Card | null;
      side: [Card[], Card[], Card[], Card[]];
    }

  // ── Turn ended ──
  | {
      type: "turn_ended";
      next_player_id: string;
      next_player_idx: number;
      turn_seconds: number;
      timed_out_player_id: string | null;
      timed_out_player_idx: number | null;
    }

  // ── Game over ──
  | {
      type: "game_over";
      winner_id: string;
      winner_idx: number;
      reason: string;
    }

  // ── Connection events ──
  | {
      type: "player_disconnected";
      player_id: string;
      player_idx: number;
    }
  | {
      type: "player_reconnected";
      player_id: string;
      player_idx: number;
    }

  // ── Error (server → client) ──
  | {
      type: "error";
      code: string;
      message: string | null;
      details?: {
        player_id?: string;
        action?: string;
        card_id?: string;
      };
    }

  // ── Full state (sync) ──
  | FullState;   // already covered above

export type Action =
  | { type: "draw" }
  | { type: "open_scale"; hand_idx: number }
  | { type: "play_hand"; hand_idx: number; scale_idx: number }
  | { type: "play_personal"; scale_idx: number }
  | { type: "play_side"; stack_idx: number; scale_idx: number }
  | { type: "move_to_side"; hand_idx: number; stack_idx: number }
  | { type: "move_personal_to_side"; stack_idx: number }