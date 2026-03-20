/**
 * DialogBox — Pokemon Gen 1/2 style dialog box rendered as DOM.
 * Shows at bottom of viewport, advances on Space/E, closes on last line.
 */

import React, { useCallback, useEffect } from "react";

interface DialogBoxProps {
  lines: string[];
  currentPage: number;
  speaker?: string;
  onAdvance: () => void;
  onClose: () => void;
}

const LINES_PER_PAGE = 2;

export function splitIntoPages(lines: string[], linesPerPage: number = LINES_PER_PAGE): string[][] {
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  return pages.length > 0 ? pages : [[""]];
}

export const DialogBox = React.memo(function DialogBox({
  lines,
  currentPage,
  speaker,
  onAdvance,
  onClose,
}: DialogBoxProps) {
  const pages = splitIntoPages(lines);
  const isLastPage = currentPage >= pages.length - 1;
  const page = pages[Math.min(currentPage, pages.length - 1)];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        if (isLastPage) {
          onClose();
        } else {
          onAdvance();
        }
      }
    },
    [isLastPage, onAdvance, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        {speaker && <div style={speakerStyle}>{speaker}</div>}
        <div style={textStyle}>
          {page.map((line, i) => (
            <div key={i} style={lineStyle}>
              {line}
            </div>
          ))}
        </div>
        <div style={indicatorStyle}>
          {isLastPage ? "▼ close" : "▼ next"}
        </div>
      </div>
    </div>
  );
});

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  zIndex: 100,
  pointerEvents: "none",
};

const boxStyle: React.CSSProperties = {
  width: 720,
  backgroundColor: "#111",
  border: "4px solid #fff",
  borderRadius: 4,
  padding: "12px 16px",
  margin: "0 0 16px 0",
  fontFamily: "'Press Start 2P', 'Courier New', monospace",
  fontSize: 14,
  color: "#fff",
  lineHeight: 1.8,
  pointerEvents: "auto",
  imageRendering: "pixelated",
};

const speakerStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#aaa",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: 2,
};

const textStyle: React.CSSProperties = {
  minHeight: 48,
};

const lineStyle: React.CSSProperties = {
  marginBottom: 4,
};

const indicatorStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#888",
  textAlign: "right",
  marginTop: 4,
};
