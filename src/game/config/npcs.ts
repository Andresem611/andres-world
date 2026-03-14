import { Direction } from "grid-engine";

export interface NpcDefinition {
  id: string;
  name: string;
  spriteKey: string;
  dialogId: string;
  startPosition: { x: number; y: number };
  facingDirection?: Direction;
  patrol?: boolean;
}

export interface PatrolNpcDefinition extends NpcDefinition {
  patrol: true;
  collides: false;
  patrolPath: Direction[];
}

// 14 NPC entries matching the NPC roster from the design doc:
// 11 founders/named NPCs + keri + dad + dog-1
// (dog-2 gets a placeholder PNG sprite but is placed via interior scene in Phase 4)
const NPC_CONFIG: (NpcDefinition | PatrolNpcDefinition)[] = [
  // 1. Marc Andreessen — Main Street bulletin board
  {
    id: "marc-andreessen",
    name: "Marc Andreessen",
    spriteKey: "npc-marc-andreessen",
    dialogId: "marc-andreessen",
    startPosition: { x: 25, y: 31 },
    facingDirection: Direction.DOWN,
  },
  // 2. John Collison — Main Street patrol NPC
  {
    id: "john-collison",
    name: "John Collison",
    spriteKey: "npc-john-collison",
    dialogId: "john-collison",
    startPosition: { x: 25, y: 20 },
    facingDirection: Direction.UP,
    patrol: true,
    collides: false,
    patrolPath: [
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.UP,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
      Direction.DOWN,
    ],
  } as PatrolNpcDefinition,
  // 3. Michael Seibel — south of Thoven HQ entrance
  {
    id: "michael-seibel",
    name: "Michael Seibel",
    spriteKey: "npc-michael-seibel",
    dialogId: "michael-seibel",
    startPosition: { x: 14, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 4. Keri — Thoven HQ entrance area
  {
    id: "keri",
    name: "Keri",
    spriteKey: "npc-keri",
    dialogId: "keri",
    startPosition: { x: 12, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 5. Brian Chesky — near Thoven HQ entrance
  {
    id: "brian-chesky",
    name: "Brian Chesky",
    spriteKey: "npc-brian-chesky",
    dialogId: "brian-chesky",
    startPosition: { x: 11, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 6. Paul Graham — Ventanita area
  {
    id: "paul-graham",
    name: "Paul Graham",
    spriteKey: "npc-paul-graham",
    dialogId: "paul-graham",
    startPosition: { x: 26, y: 27 },
    facingDirection: Direction.DOWN,
  },
  // 7. Dalton Caldwell — Lookout Hill south entrance
  {
    id: "dalton-caldwell",
    name: "Dalton Caldwell",
    spriteKey: "npc-dalton-caldwell",
    dialogId: "dalton-caldwell",
    startPosition: { x: 23, y: 7 },
    facingDirection: Direction.DOWN,
  },
  // 8. Ben Horowitz — Idea Graveyard area
  {
    id: "ben-horowitz",
    name: "Ben Horowitz",
    spriteKey: "npc-ben-horowitz",
    dialogId: "ben-horowitz",
    startPosition: { x: 6, y: 34 },
    facingDirection: Direction.DOWN,
  },
  // 9. Vinod Khosla — east beach boardwalk (x=40 = beach strip, not ocean x=42+)
  {
    id: "vinod-khosla",
    name: "Vinod Khosla",
    spriteKey: "npc-vinod-khosla",
    dialogId: "vinod-khosla",
    startPosition: { x: 40, y: 25 },
    facingDirection: Direction.LEFT,
  },
  // 10. Tobi Lutke — Engineering Lab area north
  {
    id: "tobi-lutke",
    name: "Tobi Lutke",
    spriteKey: "npc-tobi-lutke",
    dialogId: "tobi-lutke",
    startPosition: { x: 40, y: 5 },
    facingDirection: Direction.DOWN,
  },
  // 11. Patrick Collison — Engineering Lab area
  {
    id: "patrick-collison",
    name: "Patrick Collison",
    spriteKey: "npc-patrick-collison",
    dialogId: "patrick-collison",
    startPosition: { x: 42, y: 5 },
    facingDirection: Direction.DOWN,
  },
  // 12. Dario Amodei — Engineering Lab
  {
    id: "dario-amodei",
    name: "Dario Amodei",
    spriteKey: "npc-dario-amodei",
    dialogId: "dario-amodei",
    startPosition: { x: 41, y: 6 },
    facingDirection: Direction.DOWN,
  },
  // 13. Dad — Andres's House exterior (east entrance approach)
  {
    id: "dad",
    name: "Dad",
    spriteKey: "npc-dad",
    dialogId: "dad",
    startPosition: { x: 10, y: 18 },
    facingDirection: Direction.DOWN,
  },
  // 14. Dog 1 — Andres's House area
  {
    id: "dog-1",
    name: "Dog",
    spriteKey: "npc-dog-1",
    dialogId: "dog-1",
    startPosition: { x: 7, y: 20 },
    facingDirection: Direction.DOWN,
  },
];

export default NPC_CONFIG;
