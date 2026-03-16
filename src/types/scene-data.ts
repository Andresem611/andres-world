/**
 * Scene transition data contracts.
 *
 * Overworld → Interior: InteriorTransitionData
 * Interior → Overworld: OverworldReturnData (wrapped in { returnFrom })
 */

/** Passed from Overworld to an interior scene via scene.start(key, data) */
export interface InteriorTransitionData {
  /** Which building this interior belongs to (e.g. "ThovenHQ", "AndresRoom") */
  buildingKey: string;
  /** Overworld tile position to return to when exiting the interior */
  returnPos: { x: number; y: number };
  /** Tile position where the player spawns inside the interior */
  entryPos: { x: number; y: number };
}

/** Passed from Interior back to Overworld via scene.start("Overworld", { returnFrom }) */
export interface OverworldReturnData {
  returnPos: { x: number; y: number };
  facingDirection?: string;
}
