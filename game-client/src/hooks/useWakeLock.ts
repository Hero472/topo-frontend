// src/hooks/useWakeLock.ts
import { useEffect, useRef, useCallback } from 'react';

export function useWakeLock(isActive: boolean = true) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (!isActive) return;
    
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request('screen');
        wakeLockRef.current = wakeLock;
        console.log('Screen Wake Lock active');
      } catch (err) {
        // Wake lock request failed (e.g., battery saver mode, or no user gesture yet)
        console.warn('Wake Lock failed:', err);
      }
    }
  }, [isActive]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current !== null) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('Screen Wake Lock released');
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Re-acquire wake lock if the user switches back to the tab
    const handleVisibilityChange = () => {
      if (isActive && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isActive, requestWakeLock, releaseWakeLock]);
}