import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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
    <div className="min-h-screen w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center">
      
      {/* Main Card */}
      <Card variant="elevated" padding="lg" className="w-full relative">

        {/* Header Section */}
        <div className="text-center mb-8 pt-2">
          <span className="text-5xl text-brand-primary mb-3 block" aria-hidden="true">♠</span>
          <h1 className="text-2xl font-bold text-foreground-primary tracking-tight">
            {t("join.title")}
          </h1>
          <p className="text-sm text-foreground-tertiary mt-2">
            {t("join.subtitle")}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleJoin} className="space-y-5">
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

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            className="mt-2"
          >
            {t("join.button")}
          </Button>
        </form>

      </Card>
    </div>
  );
}