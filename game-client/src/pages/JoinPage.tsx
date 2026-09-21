import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { Card } from "../components/common/Card";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/common/Input";
import LanguageSelector from "../components/language/LanguageSelector";
import "./JoinPage.css";

export function JoinPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  useLanguage();

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
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

    sessionStorage.setItem("game-username", trimmedUser);
    navigate(`/game/${encodeURIComponent(gameId)}/waiting`);
  };

  return (
    <div className="join-page">
      <Card variant="elevated" className="join-card">
        <div className="join-top-actions">
          <LanguageSelector />
        </div>

        <div className="join-header">
          <span className="join-logo" aria-hidden="true">♠</span>
          <h1 className="join-title">{t("join.title")}</h1>
          <p className="join-subtitle">{t("join.subtitle")}</p>
        </div>

        <form onSubmit={handleJoin} className="join-form">
          <Input
            label={t("join.username.label")}
            placeholder={t("join.username.placeholder")}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            error={error}
            autoFocus
            size="lg"
          />

          <Button type="submit" variant="primary" fullWidth size="lg">
            {t("join.button")}
          </Button>
        </form>
      </Card>
    </div>
  );
}