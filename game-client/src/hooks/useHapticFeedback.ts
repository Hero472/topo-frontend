import { useCallback } from 'react';
import type { ServerEvent } from '../types/types';

export interface UseHapticFeedbackReturn {
  vibrateShort: () => void;      // Card played / successful action
  vibrateLong: () => void;       // Turn passed over / major state change
  vibrateDraw: () => void;       // Drawing a card (light flutter)
  vibrateError: () => void;      // Invalid move / blocked action
  handleServerEvent: (event: ServerEvent) => void;
  isSupported: boolean;
}

/**
 * Hook to manage haptic feedback (vibration) for game events.
 * Uses pattern-based vibrations for a more premium, physical feel.
 */
export function useHapticFeedback(): UseHapticFeedbackReturn {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const vibrateShort = useCallback(() => {
    if (isSupported) {
      // [30ms vibrate, 20ms pause, 30ms vibrate]
      // Feels like a crisp, physical "snap" or card hitting the table
      navigator.vibrate([30, 20, 30]);
    }
  }, [isSupported]);

  const vibrateLong = useCallback(() => {
    if (isSupported) {
      // [100ms vibrate, 50ms pause, 100ms vibrate]
      // Feels like a heavy, deliberate "thud" signifying a definitive turn change
      navigator.vibrate([100, 50, 100]);
    }
  }, [isSupported]);

  const vibrateDraw = useCallback(() => {
    if (isSupported) {
      // [20ms, 15ms, 20ms, 15ms, 20ms]
      // A light, quick flutter, mimicking the feel of riffling through cards
      navigator.vibrate([20, 15, 20, 15, 20]);
    }
  }, [isSupported]);

  const vibrateError = useCallback(() => {
    if (isSupported) {
      // [50ms, 50ms, 50ms]
      // A stuttering buzz, universally understood by users as "no" or "blocked"
      navigator.vibrate([50, 50, 50]);
    }
  }, [isSupported]);

  const handleServerEvent = useCallback(
    (event: ServerEvent) => {
      switch (event.type) {
        case 'card_played_on_scale':
        case 'card_placed_on_side':
          vibrateShort();
          break;

        case 'hand_refill':
          vibrateDraw();
          break;

        case 'turn_ended':
          vibrateLong();
          break;

        case 'error':
          vibrateError();
          break;

        default:
          break;
      }
    },
    [vibrateShort, vibrateLong, vibrateDraw, vibrateError]
  );

  return {
    vibrateShort,
    vibrateLong,
    vibrateDraw,
    vibrateError,
    handleServerEvent,
    isSupported,
  };
}