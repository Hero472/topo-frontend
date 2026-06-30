// JoinPage.tsx
import { useState } from "react";
import type { Card } from "../types/types";
import CardScale from "../components/CardScale";

const decorativeCards: Card[] = [
  { suit: "hearts", value: 12, deck: "blue" },
  { suit: "clubs", value: 13, deck: "blue" },
  { suit: "diamonds", value: 7, deck: "blue" },
  { suit: "diamonds", value: 7, deck: "blue" },

];

export function JoinPage() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedRoom = room.trim();
    const trimmedUser = username.trim();

    if (!trimmedRoom) {
      setError("Room name is required");
      return;
    }
    if (!trimmedUser) {
      setError("Username is required");
      return;
    }
    if (trimmedUser.length > 20) {
      setError("Username must be 20 characters or less");
      return;
    }

    const url = new URL(globalThis.location.href);
    url.searchParams.set("room", trimmedRoom);
    url.searchParams.set("username", trimmedUser);
    globalThis.location.href = url.toString();
  };

  return (
    <div style={styles.outer}>
      <CardScale cards={decorativeCards} emptyLabel="" />
      <div style={styles.card}>
        <h1 style={styles.title}>♠️ Topo Online</h1>
        <p style={styles.subtitle}>Enter a room and your name to start playing</p>

        <form onSubmit={handleJoin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="room-input">
              Room
            </label>
            <input
              id="room-input"
              style={styles.input}
              placeholder="e.g. myroom"
              value={room}
              onChange={(e) => { setRoom(e.target.value); setError(""); }}
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="username-input">
              Username
            </label>
            <input
              id="username-input"
              style={styles.input}
              placeholder="e.g. Alice"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Join Game
          </button>
        </form>

        <div style={styles.note}>
          Share the room name with a friend to play together.
        </div>
      </div>
    </div>
  );
}

// Inline styles – you can extract to a CSS file / CSS modules as you prefer
const styles: Record<string, React.CSSProperties> = {
  outer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    padding: "40px 32px",
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 8,
    color: "#555",
    fontSize: "1rem",
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: 4,
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "1rem",
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  error: {
    color: "#e74c3c",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  button: {
    padding: "14px",
    fontSize: "1.1rem",
    fontWeight: 700,
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: 8,
  },
  note: {
    marginTop: 24,
    fontSize: "0.85rem",
    color: "#777",
  },
};