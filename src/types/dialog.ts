/**
 * GameState — placeholder for Phase 4+ conditional dialogue.
 * Keys are boolean flags (e.g., "hasVisitedHQ", "metDad") checked at runtime.
 */
export interface GameState {
  [key: string]: boolean;
}

/**
 * DialogEntry — typed dialogue content for NPCs, signs, and buildings.
 * ADR Decision 2: all NPC strings extracted to src/content/dialogue.ts using this interface.
 */
export interface DialogEntry {
  /** Display name above dialog box (omit to use NPC name from config) */
  speaker?: string;
  /** Dialog lines shown in sequence */
  lines: string[];
  /** GameState key — entry only shown when state[condition] is true (Phase 4+) */
  condition?: keyof GameState;
  /** Clickable link shown after dialog (e.g., portfolio URL) */
  link?: { label: string; url: string };
  /** GameState key to set true after dialog completes (Phase 4+) */
  onComplete?: string;
}
