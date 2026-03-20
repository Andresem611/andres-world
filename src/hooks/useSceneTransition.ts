/**
 * useSceneTransition — manages transitions between overworld and interiors.
 */

import { useState, useCallback } from "react";

export type SceneType = "overworld" | "interior";

export interface SceneState {
  type: SceneType;
  interiorKey: string | null;
  returnPos: { x: number; y: number } | null;
  transitioning: boolean;
}

export function useSceneTransition() {
  const [scene, setScene] = useState<SceneState>({
    type: "overworld",
    interiorKey: null,
    returnPos: null,
    transitioning: false,
  });

  const enterInterior = useCallback(
    (interiorKey: string, returnPos: { x: number; y: number }) => {
      setScene({ type: "overworld", interiorKey: null, returnPos: null, transitioning: true });
      // Fade out, then switch
      setTimeout(() => {
        setScene({
          type: "interior",
          interiorKey,
          returnPos,
          transitioning: false,
        });
      }, 300);
    },
    [],
  );

  const exitInterior = useCallback(() => {
    setScene((prev) => ({ ...prev, transitioning: true }));
    setTimeout(() => {
      setScene((prev) => ({
        type: "overworld",
        interiorKey: null,
        returnPos: prev.returnPos,
        transitioning: false,
      }));
    }, 300);
  }, []);

  return { scene, enterInterior, exitInterior };
}
