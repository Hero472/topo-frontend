import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import "./JoinPage.css";
import LanguageSelector from "../components/language/LanguageSelector";

export function JoinPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  useLanguage();

  const handleJoin = () => {
    const trimmedUser = username.trim();

    if (!trimmedUser) {
      setError(t("join.errors.usernameRequired"));
      return;
    }

    if (trimmedUser.length > 20) {
      setError(t("join.errors.usernameTooLong"));
      return;
    }

    if (!gameId) {
      setError("Missing game id");
      return;
    }

    sessionStorage.setItem(
      "game-username",
      trimmedUser,
    );

    navigate(
      `/game/${encodeURIComponent(gameId)}/waiting`,
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="join-outer">
      <LanguageSelector />
      <div className="join-card">
        <div className="join-header">
          <span className="join-logo" aria-hidden="true">
            ♠
          </span>

          <h1 className="join-title">
            {t("join.title")}
          </h1>

          <p className="join-subtitle">
            {t("join.subtitle")}
          </p>
        </div>

        <div className="join-fields">
          <div className="join-field">
            <label
              className="join-label"
              htmlFor="username-input"
            >
              {t("join.username.label")}
            </label>

            <input
              id="username-input"
              className="join-input"
              placeholder={t("join.username.placeholder")}
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {error && (
            <div className="join-error">
              {error}
            </div>
          )}

          <button
            className="join-button"
            type="button"
            onClick={handleJoin}
          >
            {t("join.button")}
          </button>
        </div>
      </div>
    </div>
  );
}