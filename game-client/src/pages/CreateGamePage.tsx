import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi } from "../api/GameApi";
import { t, useLanguage } from "../i18n";
import "./CreateGamePage.css";

export default function CreateGamePage() {
  const [username, setUsername] = useState("");
  const [duration, setDuration] = useState(180);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useLanguage();

  const handleCreateGame = async () => {
    const trimmedUser = username.trim();

    if (!trimmedUser) {
      setError(t("join.errors.usernameRequired"));
      return;
    }

    if (trimmedUser.length > 20) {
      setError(t("join.errors.usernameTooLong"));
      return;
    }

    try {
      setError("");
      sessionStorage.setItem("game-username", trimmedUser);

      const { game_id } = await gameApi.createGame({ duration_seconds: duration });

      navigate(`/game/${encodeURIComponent(game_id)}/waiting`);
    } catch (error) {
      console.error("Failed to create game:", error);
      setError(t("create.errors.createFailed"));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleCreateGame();
    }
  };

  return (
    <div className="create-outer">
      <div className="create-card">
        <button
          className="create-back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="create-header">
          <span className="create-logo" aria-hidden="true">
            ♠
          </span>

          <h1 className="create-title">{t("create.title")}</h1>

          <p className="create-subtitle">{t("create.subtitle")}</p>
        </div>

        <div className="create-fields">
          <div className="create-field">
            <label className="create-label" htmlFor="username-input">
              {t("join.username.label")}
            </label>

            <input
              id="username-input"
              className="create-input"
              placeholder={t("join.username.placeholder")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="create-field">
            <label className="create-label" htmlFor="duration-input">
              {t("create.duration.label")}
            </label>

            <select
              id="duration-input"
              className="create-input"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={240}>4 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          {error && <div className="create-error">{error}</div>}

          <button
            className="create-button"
            type="button"
            onClick={() => void handleCreateGame()}
          >
            {t("create.button")}
          </button>
        </div>

        <p className="create-note">{t("create.note")}</p>
      </div>
    </div>
  );
}
