import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinPage.css";

export function JoinPage() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
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

    navigate(`/game?room=${encodeURIComponent(trimmedRoom)}&username=${encodeURIComponent(trimmedUser)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="join-outer">
      <div className="join-card">
        <div className="join-header">
          <span className="join-logo" aria-hidden="true">♠️</span>
          <h1 className="join-title">Topo Online</h1>
          <p className="join-subtitle">
            Enter a room and your name to start playing
          </p>
        </div>

        <div className="join-fields">
          <div className="join-field">
            <label className="join-label" htmlFor="room-input">
              Room
            </label>
            <input
              id="room-input"
              className="join-input"
              placeholder="e.g. myroom"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="join-field">
            <label className="join-label" htmlFor="username-input">
              Username
            </label>
            <input
              id="username-input"
              className="join-input"
              placeholder="e.g. Alice"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error && <div className="join-error">{error}</div>}

          <button className="join-button" onClick={handleJoin}>
            Join Game
          </button>
        </div>

        <p className="join-note">
          Share the room name with a friend to play together.
        </p>
      </div>
    </div>
  );
}