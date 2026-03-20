/**
 * Overworld interaction map — defines what happens when the player
 * presses Space/E while facing specific tiles.
 */

import { DIALOGUE } from "../content/dialogue";
import type { DialogEntry } from "../types/dialog";

export type InteractionType = "npc" | "sign" | "building" | "under_construction";

export interface Interaction {
  type: InteractionType;
  id: string;
  dialog?: DialogEntry;
  /** For building entrances — the interior scene key */
  interiorKey?: string;
  /** Return position when exiting the interior */
  returnPos?: { x: number; y: number };
}

/**
 * Build the interaction map keyed by "x,y" tile coordinate.
 * Includes signs, building entrances, and under-construction markers.
 * NPC interactions are handled separately (dynamic positions).
 */
export function buildInteractionMap(): Map<string, Interaction> {
  const map = new Map<string, Interaction>();

  // ─── Signs ───────────────────────────────────────────
  map.set("25,36", {
    type: "sign",
    id: "welcome-sign",
    dialog: DIALOGUE["welcome-sign"],
  });

  // ─── Building Entrances ──────────────────────────────
  // Andres's House entrance (bottom of house footprint)
  map.set("8,20", {
    type: "building",
    id: "andres-house",
    interiorKey: "andres-room",
    returnPos: { x: 8, y: 21 },
  });

  // Thoven HQ entrance
  map.set("16,19", {
    type: "building",
    id: "thoven-hq",
    interiorKey: "thoven-hq",
    returnPos: { x: 16, y: 20 },
  });

  // Starbucks Café entrance
  map.set("31,28", {
    type: "building",
    id: "starbucks",
    interiorKey: "starbucks",
    returnPos: { x: 31, y: 29 },
  });

  // Engineering Lab entrance
  map.set("41,8", {
    type: "building",
    id: "engineering-lab",
    interiorKey: "engineering-lab",
    returnPos: { x: 41, y: 9 },
  });

  // Chalk Lab hardhat NPC sign
  map.set("19,13", {
    type: "sign",
    id: "chalk-lab-hardhat",
    dialog: DIALOGUE["chalk-lab-hardhat"],
  });

  // ─── Under Construction ──────────────────────────────
  // Chalk Lab
  map.set("20,12", {
    type: "under_construction",
    id: "chalk-lab",
    dialog: DIALOGUE["chalk-lab-construction"],
  });

  // VC Office
  map.set("28,20", {
    type: "under_construction",
    id: "vc-office",
    dialog: DIALOGUE["vc-office"],
  });

  // ─── Bulletin Board ──────────────────────────────────
  map.set("24,33", {
    type: "sign",
    id: "bulletin-header",
    dialog: DIALOGUE["bulletin-header"],
  });

  // Bulletin pins (adjacent tiles around the board)
  map.set("23,33", {
    type: "sign",
    id: "bulletin-pin-1",
    dialog: DIALOGUE["bulletin-pin-1"],
  });

  map.set("25,33", {
    type: "sign",
    id: "bulletin-pin-2",
    dialog: DIALOGUE["bulletin-pin-2"],
  });

  map.set("23,34", {
    type: "sign",
    id: "bulletin-pin-3",
    dialog: DIALOGUE["bulletin-pin-3"],
  });

  map.set("24,34", {
    type: "sign",
    id: "bulletin-pin-4",
    dialog: DIALOGUE["bulletin-pin-4"],
  });

  map.set("25,34", {
    type: "sign",
    id: "bulletin-pin-5",
    dialog: DIALOGUE["bulletin-pin-5"],
  });

  map.set("23,35", {
    type: "sign",
    id: "bulletin-pin-6",
    dialog: DIALOGUE["bulletin-pin-6"],
  });

  map.set("24,35", {
    type: "sign",
    id: "bulletin-pin-7",
    dialog: DIALOGUE["bulletin-pin-7"],
  });

  // Bulletin PC
  map.set("26,33", {
    type: "sign",
    id: "bulletin-pc",
    dialog: DIALOGUE["bulletin-pc"],
  });

  // Hidden area signs
  map.set("39,30", {
    type: "sign",
    id: "secret-beach-sign",
    dialog: DIALOGUE["secret-beach-sign"],
  });

  map.set("8,9", {
    type: "sign",
    id: "music-room-sign",
    dialog: DIALOGUE["music-room-sign"],
  });

  map.set("8,28", {
    type: "sign",
    id: "idea-graveyard-sign",
    dialog: DIALOGUE["idea-graveyard-sign"],
  });

  map.set("23,3", {
    type: "sign",
    id: "lookout-hill-sign",
    dialog: DIALOGUE["lookout-hill-sign"],
  });

  map.set("25,1", {
    type: "sign",
    id: "hidden-mentor",
    dialog: DIALOGUE["hidden-mentor"],
  });

  return map;
}

/** Singleton interaction map instance. */
export const INTERACTION_MAP = buildInteractionMap();
