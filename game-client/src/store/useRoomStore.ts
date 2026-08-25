import { create } from "zustand";

import type { ServerEvent } from "../types/types";

export interface LobbyPlayer {
  playerId: string;
  username: string;
  playerIdx: number;
  ready: boolean;
}

export interface DisconnectInfo {
  playerId: string;
  playerIdx: number;
  gracePeriodSeconds: number;
  /** Date.now() in ms when the disconnect happened, so the UI can compute
   *  "time left" itself without needing a server-driven tick. */
  disconnectedAt: number;
}

export type RoomPhase = "lobby" | "playing" | "over";

export interface RoomStore {
  phase: RoomPhase;
  gameId: string | null;

  // ── Lobby ──
  players: Record<string, LobbyPlayer>;
  startingIn: number | null;

  // ── Connection status (relevant during "playing" and "over") ──
  disconnected: DisconnectInfo | null;

  // ── Game over / rematch ──
  winnerId: string | null;
  reason: string | null;
  playAgainRequestedBy: Set<string>;

  // ── Transient one-line banner, e.g. "opponent left the lobby" ──
  notice: string | null;

  applyEvent: (evt: ServerEvent) => void;
  clearNotice: () => void;
  reset: () => void;
}

const initialState = {
  phase: "lobby" as RoomPhase,
  gameId: null as string | null,
  players: {} as Record<string, LobbyPlayer>,
  startingIn: null as number | null,
  disconnected: null as DisconnectInfo | null,
  winnerId: null as string | null,
  reason: null as string | null,
  playAgainRequestedBy: new Set<string>(),
  notice: null as string | null,
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  ...initialState,

  applyEvent: (evt) => {
    const state = get();

    switch (evt.type) {
      case "waiting_for_player": {
        set({ phase: "lobby", gameId: evt.game_id, startingIn: null });
        break;
      }

      case "player_joined": {
        set({
          players: {
            ...state.players,
            [evt.player_id]: {
              playerId: evt.player_id,
              username: evt.username,
              playerIdx: evt.player_idx,
              ready: false,
            },
          },
        });
        break;
      }

      case "player_ready": {
        const existing = state.players[evt.player_id];
        if (!existing) break;

        set({
          players: {
            ...state.players,
            [evt.player_id]: { ...existing, ready: true },
          },
        });
        break;
      }

      case "player_left": {
        const rest = { ...state.players };
        delete rest[evt.player_id];
        set({ players: rest });
        break;
      }

      // Not wired up on the backend yet (LobbyPhase currently starts
      // immediately once both players are ready) - safe to leave handled
      // here so it "just works" once the countdown ships.
      case "game_starting": {
        set({ startingIn: evt.seconds_remaining });
        break;
      }

      case "game_started": {
        set({
          phase: "playing",
          startingIn: null,
          disconnected: null,
          winnerId: null,
          reason: null,
          playAgainRequestedBy: new Set(),
          notice: null,
        });
        break;
      }

      case "player_disconnected": {
        set({
          disconnected: {
            playerId: evt.player_id,
            playerIdx: evt.player_idx,
            gracePeriodSeconds: evt.grace_period_seconds,
            disconnectedAt: Date.now(),
          },
        });
        break;
      }

      case "player_reconnected": {
        if (state.disconnected?.playerId === evt.player_id) {
          set({ disconnected: null });
        }
        break;
      }

      case "opponent_left": {
        // Fired in two different situations - word it accordingly. It is
        // NOT fired for an in-match departure anymore: that now ends the
        // game directly via a "game_over" event carrying a reason string.
        const notice =
          state.phase === "lobby"
            ? "Your opponent left the lobby."
            : "Your opponent disconnected.";

        set({ notice });
        break;
      }

      case "game_over": {
        set({
          phase: "over",
          winnerId: evt.winner_id,
          reason: evt.reason,
          startingIn: null,
        });
        break;
      }

      case "play_again_requested": {
        const next = new Set(state.playAgainRequestedBy);
        next.add(evt.player_id);
        set({ playAgainRequestedBy: next });
        break;
      }

      default: {
        // Not a room-level event - the game store (or nothing) handles it.
        break;
      }
    }
  },

  clearNotice: () => set({ notice: null }),

  reset: () => set(initialState),
}));