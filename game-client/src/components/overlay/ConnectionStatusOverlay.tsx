import "./ConnectionStatusOverlay.css";

type ConnectionStatus =
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed"
| "error";

interface ConnectionStatusOverlayProps {
  status: ConnectionStatus;
}

export default function ConnectionStatusOverlay({
  status,
}: Readonly<ConnectionStatusOverlayProps>) {
  if (status === "open") {
    return null;
  }

  const content = {
    connecting: {
      title: "Connecting",
      message: "Connecting to the game...",
    },
    reconnecting: {
      title: "Reconnecting",
      message: "Connection lost. Trying again...",
    },
    error: {
      title: "Connection problem",
      message: "Unable to connect to the game.",
    },
    closed: {
      title: "Disconnected",
      message: "You are no longer connected to the game.",
    },
  }[status];

  return (
    <div className="connection-overlay">
      <div className="connection-overlay-card">
        <div className="connection-spinner" aria-hidden="true" />

        <div className="connection-overlay-content">
          <strong>{content.title}</strong>
          <span>{content.message}</span>
        </div>
      </div>
    </div>
  );
}