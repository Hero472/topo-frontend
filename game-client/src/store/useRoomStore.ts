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
  disconnectedAt: number;
}

export type RoomPhase = "lobby" | "playing" | "game_over";

export interface RoomStore {
  phase: RoomPhase;
  gameId: string | null;
  myPlayerId: string | null;
  players: Record<string, LobbyPlayer>;
  startingIn: number | null;
  disconnected: DisconnectInfo | null;
  winnerId: string | null;
  reason: string | null;
  playAgainRequestedBy: Set<string>;
  notice: string | null;

  applyEvent: (evt: ServerEvent) => void;
  clearNotice: () => void;
  reset: () => void;
}

type RoomState = Omit<RoomStore, "applyEvent" | "clearNotice" | "reset">;

const getInitialState = (): RoomState => ({
  phase: "lobby",
  gameId: null,
  myPlayerId: null,
  players: {},
  startingIn: null,
  disconnected: null,
  winnerId: null,
  reason: null,
  playAgainRequestedBy: new Set<string>(),
  notice: null,
});

export const useRoomStore = create<RoomStore>((set, get) => ({
  ...getInitialState(),

  applyEvent: (evt) => {
    const state = get();

    switch (evt.type) {
      case "full_state": {
        if (evt.phase === "lobby") {
          const newPlayers: Record<string, LobbyPlayer> = {};
          for (const p of evt.players) {
            newPlayers[p.player_id] = {
              playerId: p.player_id,
              username: p.username,
              playerIdx: p.player_idx,
              ready: p.is_ready,
            };
          }
          set({
            phase: "lobby",
            gameId: evt.game_id,
            myPlayerId: evt.player_id,
            players: newPlayers,
            startingIn: null,
            disconnected: null,
            winnerId: null,
            reason: null,
            playAgainRequestedBy: new Set(),
            notice: null,
          });
        } else if (evt.phase === "playing") {
          set({
            phase: "playing",
            myPlayerId: evt.player_id,
            startingIn: null,
            disconnected: null,
            winnerId: null,
            reason: null,
            playAgainRequestedBy: new Set(),
            notice: null,
          });
        } else if (evt.phase === "game_over") {
          set({
            phase: "game_over",
            myPlayerId: evt.player_id,
            winnerId: evt.winner_id,
            reason: evt.reason,
            startingIn: null,
            disconnected: null,
          });
        }
        break;
      }

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
        const notice =
          state.phase === "lobby"
            ? "Your opponent left the lobby."
            : "Your opponent disconnected.";
        set({ notice });
        break;
      }

      case "game_over": {
        set({
          phase: "game_over",
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

      case "play_again": {
        set({
          phase: "lobby",
          winnerId: null,
          reason: null,
          playAgainRequestedBy: new Set(),
          notice: "Starting a new game...",
        });
        break;
      }

      default:
        break;
    }
  },

  clearNotice: () => set({ notice: null }),
  reset: () => set(getInitialState()),
}));