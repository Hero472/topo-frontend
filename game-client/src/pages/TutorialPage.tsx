import { useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function TutorialPage() {
  const navigate = useNavigate();
  useLanguage();

  return (
    // Page wrapper: centers the card, adds max-width for readability, and provides mobile padding
    <div className="min-h-screen w-full max-w-3xl mx-auto py-8 px-4">
      <Card variant="elevated" padding="lg" className="w-full">
        
        {/* Header with Back Button and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-6 border-b border-border-primary">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            {/* Clean SVG chevron instead of the raw text "←" */}
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
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground-primary">
            {t("tutorial.title")}
          </h1>
        </div>

        {/* Main Content Area */}
        <CardContent className="space-y-10 text-foreground-secondary [&_p]:leading-relaxed [&_p]:mb-3">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              1. {t("tutorial.objective.title")}
            </h2>
            <p>{t("tutorial.objective.text")}</p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              2. {t("tutorial.board.title")}
            </h2>

            <h3 className="text-lg font-medium text-foreground-primary mt-4">
              {t("tutorial.board.central")}
            </h3>
            <p>{t("tutorial.board.centralText")}</p>

            <h3 className="text-lg font-medium text-foreground-primary mt-4">
              {t("tutorial.board.side")}
            </h3>
            <p>{t("tutorial.board.sideText")}</p>

            <h3 className="text-lg font-medium text-foreground-primary mt-4">
              {t("tutorial.board.personal")}
            </h3>
            <p>{t("tutorial.board.personalText")}</p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              3. {t("tutorial.howToPlay.title")}
            </h2>
            <ol className="list-decimal list-inside space-y-2 marker:text-brand-primary marker:font-bold pl-1">
              <li>{t("tutorial.howToPlay.step1")}</li>
              <li>{t("tutorial.howToPlay.step2")}</li>
              <li>{t("tutorial.howToPlay.step3")}</li>
              <li>{t("tutorial.howToPlay.step4")}</li>
            </ol>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              4. {t("tutorial.scales.title")}
            </h2>
            <p>{t("tutorial.scales.text")}</p>

            {/* Code/Example Block */}
            <div className="bg-background-tertiary border border-border-primary rounded-lg p-4 font-mono text-sm text-foreground-primary whitespace-pre-line my-4">
              {t("tutorial.scales.example")}
            </div>

            <p>{t("tutorial.scales.ace")}</p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              5. {t("tutorial.king.title")}
            </h2>
            <p>{t("tutorial.king.text")}</p>
            <p>{t("tutorial.king.cannotStart")}</p>
            <p>{t("tutorial.king.noDoubleKing")}</p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              6. {t("tutorial.turn.title")}
            </h2>
            <p>{t("tutorial.turn.text")}</p>
            <p>{t("tutorial.turn.ending")}</p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground-primary">
              7. {t("tutorial.winning.title")}
            </h2>
            <p>{t("tutorial.winning.text")}</p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}