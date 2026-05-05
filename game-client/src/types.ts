// Card
export interface Card {
  suit: number;   // 0..3
  rank: number;   // 1..13
  color: string;
}

// Player board as seen by the player themselves
export interface PlayerBoard {
  player_idx: number;
  username: string;
  hand: Card[];
  personal: Card[];
  side: Card[][];        // each stack is an array
}

// Opponent board (no hand cards, only counts & side)
export interface OpponentBoard {
  player_idx: number;
  username: string;
  hand_count: number;
  personal_count: number;
  personal_top: Card | null;
  side: Card[][];
}

export interface FullState {
  room_id: string;
  current_turn: number;   // player_idx whose turn it is
  self: PlayerBoard;
  opponent: OpponentBoard;
}

// All server events you broadcast
export type ServerEvent =
  | { type: "CardDrawn"; player_id: number; card: Card }
  | { type: "CardPlayedOnScale"; player_id: number; card: Card; scale_id: number; completed: boolean }
  | { type: "CardPlacedOnSide"; player_id: number; card: Card; stack: number }
  | { type: "OpponentUpdate"; player_id: number; personal_count: number; personal_top: Card | null; side: Card[][] }
  | { type: "TurnEnded"; next_player_id: number; turn_seconds: number }
  | { type: "PlayerJoined"; player_id: number; username: string }
  | { type: "PlayerLeft"; player_id: number }
  | { type: "GameStarted"; current_player_id: number; turn_seconds: number }
  | { type: "GameOver"; winner_id: number; reason: string };

  // GameMessage wrapper from server
export interface GameMessage {
  to: number | null;
  event: ServerEvent;
}