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
    console.log("[CREATE GAME] Function triggered");
    e.preventDefault();
    
    if (isCreating) {
      console.log("[CREATE GAME] Ignored: isCreating is already true (preventing double-click)");
      return;
    }

    const trimmedUser = username.trim();
    console.log("[CREATE GAME] Username processed:", { 
      original: username, 
      trimmed: trimmedUser, 
      length: trimmedUser.length 
    });

    if (!trimmedUser) {
      console.log("[CREATE GAME] Validation FAILED: Username is empty");
      setError(t("join.errors.usernameRequired"));
      return;
    }

    if (trimmedUser.length > 20) {
      console.log("[CREATE GAME] Validation FAILED: Username too long");
      setError(t("join.errors.usernameTooLong"));
      return;
    }

    try {
      console.log("[CREATE GAME] Validation passed. Clearing errors, setting isCreating=true");
      setError("");
      setIsCreating(true);

      sessionStorage.setItem("game-username", trimmedUser);
      console.log("[CREATE GAME] Saved to sessionStorage. Key: 'game-username', Value:", trimmedUser);

      const payload = { duration_seconds: duration };
      console.log("[CREATE GAME] PREPARING API CALL");
      console.log("[CREATE GAME] Payload to send:", JSON.stringify(payload));
      console.log("[CREATE GAME] 'duration' variable type & value:", typeof duration, duration);

      // The actual API call
      console.log("[CREATE GAME] Calling gameApi.createGame...");
      const response = await gameApi.createGame(payload);
      
      console.log("[CREATE GAME] API CALL SUCCESSFUL! Raw response:", response);

      const { invite_code } = response;
      console.log("[CREATE GAME] Extracted invite_code:", invite_code);

      const targetUrl = `/game/${encodeURIComponent(invite_code)}/waiting`;
      console.log("[CREATE GAME] Attempting navigation to:", targetUrl);

      navigate(targetUrl, { replace: true });
      console.log("[CREATE GAME] Navigation triggered successfully");

    } catch (error) {
      console.error("[CREATE GAME] CATCH BLOCK TRIGGERED! SOMETHING FAILED 🔴🔴🔴");
      console.error("[CREATE GAME] Full Error Object:", error);
      
      // Safely extract error details depending on the error type
      if (error instanceof Error) {
        console.error("[CREATE GAME] Error Message:", error.message);
        console.error("[CREATE GAME] Error Stack:", error.stack);
      } else {
        console.error("[CREATE GAME] Non-Error object thrown:", String(error));
      }

      setError(t("create.errors.createFailed"));
      setIsCreating(false);
      console.log("[CREATE GAME] Reset isCreating to false, error state updated");
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