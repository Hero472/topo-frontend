import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi } from "../api/GameApi";
import { t, useLanguage } from "../i18n";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import "./CreateGamePage.css";

export default function CreateGamePage() {
  const [username, setUsername] = useState("");
  const [duration, setDuration] = useState(180);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  useLanguage();

  const handleCreateGame = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

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
      setIsCreating(true);

      sessionStorage.setItem("game-username", trimmedUser);

      const { invite_code } = await gameApi.createGame({
        duration_seconds: duration,
      });

      navigate(`/game/${encodeURIComponent(invite_code)}/waiting`, {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to create game:", error);
      setError(t("create.errors.createFailed"));
      setIsCreating(false);
    }
  };

  return (
    <div className="create-page">
      <Card variant="elevated" className="create-card">
        
        <div className="create-header">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            ← {t("common.back")}
          </Button>
        </div>

        <div className="create-title-section">
          <span className="create-logo" aria-hidden="true">♠</span>
          <h1 className="create-title">{t("create.title")}</h1>
          <p className="create-subtitle">{t("create.subtitle")}</p>
        </div>

        <form onSubmit={handleCreateGame} className="create-form">
          <Input
            label={t("join.username.label")}
            placeholder={t("join.username.placeholder")}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            error={error}
            disabled={isCreating}
            autoFocus
          />

          <Select
            label={t("create.duration.label")}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isCreating}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={180}>3 minutes</option>
            <option value={240}>4 minutes</option>
            <option value={300}>5 minutes</option>
          </Select>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={isCreating}
          >
            {isCreating ? t("create.creating") : t("create.button")}
          </Button>
        </form>

        <p className="create-note">{t("create.note")}</p>
      </Card>
    </div>
  );
}