import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi } from "../api/GameApi";
import { t, useLanguage } from "../i18n";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select, SelectItem } from "../components/ui/Select";

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
    <div className="min-h-screen w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center">
      
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/")}
        className="self-start mb-4 -ml-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-1"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        {t("common.back")}
      </Button>

      {/* Main Card */}
      <Card variant="elevated" padding="lg" className="w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="text-5xl text-brand-primary mb-3 block" aria-hidden="true">♠</span>
          <h1 className="text-2xl font-bold text-foreground-primary tracking-tight">
            {t("create.title")}
          </h1>
          <p className="text-sm text-foreground-tertiary mt-2">
            {t("create.subtitle")}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCreateGame} className="space-y-5">
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

          {/* Radix Select with SelectItem for perfect dark/light mode dropdowns */}
          <Select
            label={t("create.duration.label")}
            value={String(duration)} // Radix requires string values
            onValueChange={(val) => setDuration(Number(val))}
            disabled={isCreating}
          >
            <SelectItem value="30">30 seconds</SelectItem>
            <SelectItem value="60">1 minute</SelectItem>
            <SelectItem value="120">2 minutes</SelectItem>
            <SelectItem value="180">3 minutes</SelectItem>
            <SelectItem value="240">4 minutes</SelectItem>
            <SelectItem value="300">5 minutes</SelectItem>
          </Select>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            loading={isCreating}
            className="mt-2"
          >
            {isCreating ? t("create.creating") : t("create.button")}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-foreground-tertiary leading-relaxed">
          {t("create.note")}
        </div>

      </Card>
    </div>
  );
}