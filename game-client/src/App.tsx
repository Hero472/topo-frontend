import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { useGameSocket } from './hooks/useGameSocket';
import Board from './components/Board';
import ActionPanel from './components/ActionPanel';
import TurnTimer from './components/TurnTimer';

function Game() {
  const params = new URLSearchParams(globalThis.location.search);
  const room = params.get('room') || 'test';
  const username = params.get('username') || 'Anonymous';
  const { sendAction, status, error } = useGameSocket(room, username);

  const fullState = useGameStore((s) => s.fullState);
  const winnerId = useGameStore((s) => s.winnerId);
  const timeoutMessage = useGameStore((s) => s.timeoutMessage);
  const clearTimeoutMessage = useGameStore((s) => s.clearTimeoutMessage);

  // Clear timeout message after 5 seconds
  useEffect(() => {
    if (timeoutMessage) {
      const timer = setTimeout(() => clearTimeoutMessage(), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeoutMessage, clearTimeoutMessage]);

  // Connection info banner
  const connectionInfo = (
    <div style={{ textAlign: 'center', padding: 8, fontSize: '0.9em' }}>
      {status === 'connecting' && '🔄 Connecting to server…'}
      {status === 'open' && '🟢 Connected'}
      {status === 'closed' && '🔴 Disconnected (reconnecting…)'}
      {error && <span style={{ color: 'red', marginLeft: 10 }}>⚠️ {error}</span>}
    </div>
  );

  if (!fullState) {
    return (
      <>
        {connectionInfo}
        <div style={{ textAlign: 'center', marginTop: 50 }}>Loading game state…</div>
      </>
    );
  }

  if (winnerId !== null) {
    return (
      <>
        {connectionInfo}
        <div style={{ textAlign: 'center', fontSize: '2em', marginTop: 50 }}>
          🎉 Player {winnerId} wins!
        </div>
      </>
    );
  }

  const isMyTurn = fullState.your_turn;
  const turnKey = `${fullState.your_turn}_${fullState.turn_seconds_remaining}`;

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {connectionInfo}

      {timeoutMessage && (
        <div style={{
          background: '#ffc107', color: '#000', padding: '8px 16px',
          borderRadius: 4, textAlign: 'center', fontWeight: 'bold',
        }}>
          {timeoutMessage}
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>
        {isMyTurn ? (
          <TurnTimer key={turnKey} initialSeconds={fullState.turn_seconds_remaining} />
        ) : (
          '🕒 Waiting for opponent…'
        )}
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        <Board board={fullState} />
        <ActionPanel
          sendAction={sendAction}
          isMyTurn={isMyTurn}
          hand={fullState.your_board.hand}
          personal={fullState.your_board.personal}
          scales={fullState.scales}
          side={fullState.your_board.side}
        />
      </div>
    </div>
  );
}

function JoinScreen() {
  const room = 'myroom';
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Join Game</h2>
      <a href={`?room=${room}&username=Alice`}>Join as Alice</a>
      <br />
      <a href={`?room=${room}&username=Bob`}>Join as Bob</a>
    </div>
  );
}

export default function App() {
  const params = new URLSearchParams(globalThis.location.search);
  if (!params.has('player_id')) return <JoinScreen />;
  return <Game />;
}