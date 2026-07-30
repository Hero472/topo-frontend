import { useNavigate } from "react-router-dom";
import "./MainMenuPage.css";

export default function MainMenuPage() {
    const navigate = useNavigate();

    return (
        <div className="menu-page">
            <div className="menu-card">
                <div className="menu-header">
                    <div className="logo-icon" aria-hidden="true">♠</div>
                    <h1>Topo</h1>
                    <p>Online Card Game</p>
                </div>

                <div className="menu-buttons">
                    <button
                        className="menu-button primary"
                        onClick={() => navigate("/join")}
                    >
                        Multiplayer
                    </button>

                    <button className="menu-button" disabled>
                        Play vs CPU
                        <span className="coming-soon">Coming Soon</span>
                    </button>

                    <button className="menu-button" disabled>
                        Tutorial
                        <span className="coming-soon">Coming Soon</span>
                    </button>
                </div>

                <div className="menu-footer">
                    <span className="version-dot" />
                    Version 0.1.0
                </div>
            </div>
        </div>
    );
}