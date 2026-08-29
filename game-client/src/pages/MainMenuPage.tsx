import { useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import "./MainMenuPage.css";
import LanguageSelector from "../components/language/LanguageSelector";

export default function MainMenuPage() {
  const navigate = useNavigate();

  useLanguage();

  return (
    <div className="menu-page">
      <div className="menu-card">
        
        <div className="card-top-actions">
          <LanguageSelector />
        </div>

        <div className="menu-header">
          <div className="logo-icon" aria-hidden="true">
            ♠
          </div>
          <h1>{t("menu.title")}</h1>
          <p>{t("menu.subtitle")}</p>
        </div>

        <div className="menu-buttons">
          <button
            className="menu-button primary"
            onClick={() => navigate("/join")}
          >
            {t("menu.multiplayer")}
          </button>

          <button className="menu-button" disabled>
            {t("menu.playCpu")}
            <span className="coming-soon">{t("menu.comingSoon")}</span>
          </button>

          <button 
            className="menu-button"
            onClick={() => navigate("/tutorial")}>
            {t("menu.tutorial")}
          </button>
        </div>

        <div className="menu-footer">
          <span className="version-dot" />
          {t("menu.version")} 0.5.0
        </div>
      </div>
    </div>
  );
}
