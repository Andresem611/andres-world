/**
 * useMusic — manages background music playback.
 * Gracefully handles missing audio files.
 */

import { useRef, useCallback } from "react";

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<string | null>(null);

  const play = useCallback((trackPath: string) => {
    if (currentTrackRef.current === trackPath) return;

    // Stop current
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(trackPath);
    audio.loop = true;
    audio.volume = 0.3;

    audio.play().catch(() => {
      // Graceful fallback — audio file may not exist yet
      console.log(`Music: ${trackPath} not available (this is fine)`);
    });

    audioRef.current = audio;
    currentTrackRef.current = trackPath;
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      currentTrackRef.current = null;
    }
  }, []);

  return { play, stop };
}
