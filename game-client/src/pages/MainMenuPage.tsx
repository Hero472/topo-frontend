import { useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function MainMenuPage() {
  const navigate = useNavigate();
  useLanguage();

  const GameLogoIcon = (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-8 h-8 text-brand-primary"
      aria-hidden="true"
    >
      <path d="M12 2C9 2 7 4.5 7 7c0 1.5.5 2.5 1.5 3.5C7 11.5 5 13 5 15c0 2.5 2 4.5 4.5 4.5 1.5 0 2.5-.5 3.5-1.5 1 1 2 1.5 3.5 1.5 2.5 0 4.5-2 4.5-4.5 0-2-2-3.5-3.5-4.5 1-1 1.5-2 1.5-3.5 0-2.5-2-5-5-5zm0 18v2" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-primary">
      <Card variant="elevated" className="w-full max-w-md">
        
        {/* Header with Logo, Title, Subtitle, and Language Selector */}
        <CardHeader 
          icon={GameLogoIcon}
          title={t("menu.title")}
          subtitle={t("menu.subtitle")}
        />

        {/* Main Action Buttons */}
        <CardContent className="flex flex-col gap-3">
          <Button 
            fullWidth 
            variant="primary" 
            size="lg"
            onClick={() => navigate("/join")}
          >
            {t("menu.multiplayer")}
          </Button>

          <Button fullWidth variant="secondary" size="lg" disabled>
            {t("menu.playCpu")}
            {/* Using the Badge component for the "Coming Soon" tag! */}
            <Badge variant="warning" className="ml-2">
              {t("menu.comingSoon")}
            </Badge>
          </Button>

          <Button 
            fullWidth 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/tutorial")}
          >
            {t("menu.tutorial")}
          </Button>
        </CardContent>

        {/* Footer with Version Info */}
        <CardFooter className="justify-center text-sm text-foreground-tertiary">
          {/* A little green dot to show it's an active build */}
          <span className="w-2 h-2 rounded-full bg-state-success mr-2" />
          {t("menu.version")} 0.5.0
        </CardFooter>

      </Card>
    </div>
  );
}