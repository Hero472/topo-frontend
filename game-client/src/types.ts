// Card
export interface Card {
  suit: string;   // "hearts", "clubs", "spades", "diamonds"
  value: number;  // 1..13
  deck: string;   // "blue" or "red"
}

export interface PersonalPile {
  count: number;
  top: Card | null;
  colors: string[];
}

// Player board as seen by the player themselves
export interface PlayerBoard {
  player_idx: number;
  username: string;
  hand: Card[];
  personal: PersonalPile;
  side: Card[][];
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

export interface Scale {
  id: number;
  cards: Card[];
  completed: boolean;
  owner: number;
}

export type DeckColor = "red" | "blue" | "black" | "white"; 

export interface FullState {
  type: "full_state";
  your_board: PlayerBoard;
  opponent: OpponentBoard;
  your_turn: boolean;
  scales: Scale[];
  turn_seconds_remaining: number;
  dealer_top: DeckColor | null;
  dealer_count: number;
}

// ── All server‑side events (matching your ServerEvent enum) ──
export type ServerEvent =
  | { type: "CardDrawn"; player_id: number; card: Card | null }
  | { type: "CardPlayedOnScale"; player_id: number; card: Card; scale_id: number; completed: boolean }
  | { type: "CardPlacedOnSide"; player_id: number; card: Card; stack: number }
  | { type: "OpponentUpdate"; player_id: number; personal_count: number; personal_top: Card | null; side: Card[][] }
  | { type: "TurnEnded"; next_player_id: number; turn_seconds: number }
  | { type: "TurnTimedOut"; player_id: number; next_player_id: number; turn_seconds: number }
  | { type: "PlayerJoined"; player_id: number; username: string }
  | { type: "PlayerLeft"; player_id: number }
  | { type: "GameStarted"; current_player_id: number; turn_seconds: number }
  | { type: "GameOver"; winner_id: number; reason: string };

// ── GameMessage wrapper ──
export interface GameMessage {
  to: number | null;
  event: ServerEvent;
}

export type Action =
  | { type: "draw" }
  | { type: "openScale"; hand_idx: number }
  | { type: "playHand"; hand_idx: number; scale_idx: number }
  | { type: "playPersonal"; scale_idx: number }
  | { type: "playSide"; stack: number; scale_idx: number }
  | { type: "moveToSide"; hand_idx: number; stack: number }
  | { type: "movePersonalToSide"; stack_idx: number };