/**
 * TitleScreen — Pokemon-style "ANDRES WORLD" title card.
 * Shows on initial load, transitions to game on key press or click.
 */

import { useCallback, useEffect, useState } from "react";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [blinkVisible, setBlinkVisible] = useState(true);

  // Blinking "PRESS ANY KEY" text
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkVisible((v) => !v);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleInput = useCallback(
    (e: KeyboardEvent | MouseEvent) => {
      e.preventDefault();
      onStart();
    },
    [onStart],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    window.addEventListener("click", handleInput);
    return () => {
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("click", handleInput);
    };
  }, [handleInput]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Player sprite */}
        <div
          style={{
            width: 128,
            height: 128,
            backgroundImage: "url(./assets/sprites/player.png)",
            backgroundPosition: "-128px 0px", // frame 1 (idle), row 0 (down/front-facing)
            backgroundSize: "384px 512px", // 4x scale of 96×128
            imageRendering: "pixelated" as const,
            margin: "0 auto 24px",
          }}
        />

        <h1 style={titleStyle}>ANDRES WORLD</h1>

        <div style={subtitleStyle}>A playable pixel-art portfolio</div>

        <div
          style={{
            ...pressKeyStyle,
            opacity: blinkVisible ? 1 : 0,
          }}
        >
          PRESS ANY KEY
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
  backgroundColor: "#1a1a2e",
};

const cardStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "48px 64px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', 'Courier New', monospace",
  fontSize: 32,
  color: "#fff",
  letterSpacing: 4,
  marginBottom: 16,
  textShadow: "2px 2px 0 #333",
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', 'Courier New', monospace",
  fontSize: 12,
  color: "#888",
  marginBottom: 48,
};

const pressKeyStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', 'Courier New', monospace",
  fontSize: 14,
  color: "#ccc",
  transition: "opacity 0.2s",
};
