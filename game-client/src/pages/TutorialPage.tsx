import { useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { Card, CardContent } from "../components/common/Card";
import { Button } from "../components/common/Button";
import "./TutorialPage.css";

export default function TutorialPage() {
  const navigate = useNavigate();
  useLanguage();

  return (
    <div className="tutorial-page">
      <Card variant="elevated" className="tutorial-card">
        <div className="tutorial-header">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            ← {t("common.back")}
          </Button>
          <h1>{t("tutorial.title")}</h1>
        </div>

        <CardContent className="tutorial-content">
          <section className="tutorial-section">
            <h2>1. {t("tutorial.objective.title")}</h2>
            <p>{t("tutorial.objective.text")}</p>
          </section>

          <section className="tutorial-section">
            <h2>2. {t("tutorial.board.title")}</h2>

            <h3>{t("tutorial.board.central")}</h3>
            <p>{t("tutorial.board.centralText")}</p>

            <h3>{t("tutorial.board.side")}</h3>
            <p>{t("tutorial.board.sideText")}</p>

            <h3>{t("tutorial.board.personal")}</h3>
            <p>{t("tutorial.board.personalText")}</p>
          </section>

          <section className="tutorial-section">
            <h2>3. {t("tutorial.howToPlay.title")}</h2>

            <ol>
              <li>{t("tutorial.howToPlay.step1")}</li>
              <li>{t("tutorial.howToPlay.step2")}</li>
              <li>{t("tutorial.howToPlay.step3")}</li>
              <li>{t("tutorial.howToPlay.step4")}</li>
            </ol>
          </section>

          <section className="tutorial-section">
            <h2>4. {t("tutorial.scales.title")}</h2>
            <p>{t("tutorial.scales.text")}</p>

            <div className="scale-example">
              {t("tutorial.scales.example")}
            </div>

            <p>{t("tutorial.scales.ace")}</p>
          </section>

          <section className="tutorial-section">
            <h2>5. {t("tutorial.king.title")}</h2>
            <p>{t("tutorial.king.text")}</p>
            <p>{t("tutorial.king.cannotStart")}</p>
            <p>{t("tutorial.king.noDoubleKing")}</p>
          </section>

          <section className="tutorial-section">
            <h2>6. {t("tutorial.turn.title")}</h2>
            <p>{t("tutorial.turn.text")}</p>
            <p>{t("tutorial.turn.ending")}</p>
          </section>

          <section className="tutorial-section">
            <h2>7. {t("tutorial.winning.title")}</h2>
            <p>{t("tutorial.winning.text")}</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}