import { Direction } from "grid-engine";

export interface NpcDefinition {
  id: string;
  name: string;
  spriteKey: string;
  dialog: string[];
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
    dialog: ["Software is eating the world."],
    startPosition: { x: 25, y: 31 },
    facingDirection: Direction.DOWN,
  },
  // 2. John Collison — Main Street patrol NPC
  {
    id: "john-collison",
    name: "John Collison",
    spriteKey: "npc-john-collison",
    dialog: ["Growth solves most problems."],
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
    dialog: ["Make something people want."],
    startPosition: { x: 14, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 4. Keri — Thoven HQ entrance area
  {
    id: "keri",
    name: "Keri",
    spriteKey: "npc-keri",
    dialog: [
      "Welcome to Thoven. We're building the operating system for music education.",
      "It's going well. Mostly.",
    ],
    startPosition: { x: 12, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 5. Brian Chesky — near Thoven HQ entrance
  {
    id: "brian-chesky",
    name: "Brian Chesky",
    spriteKey: "npc-brian-chesky",
    dialog: ["Don't fuck up the culture."],
    startPosition: { x: 11, y: 24 },
    facingDirection: Direction.DOWN,
  },
  // 6. Paul Graham — Ventanita area
  {
    id: "paul-graham",
    name: "Paul Graham",
    spriteKey: "npc-paul-graham",
    dialog: ["Write simply."],
    startPosition: { x: 26, y: 27 },
    facingDirection: Direction.DOWN,
  },
  // 7. Dalton Caldwell — Lookout Hill south entrance
  {
    id: "dalton-caldwell",
    name: "Dalton Caldwell",
    spriteKey: "npc-dalton-caldwell",
    dialog: ["Just talk to your users."],
    startPosition: { x: 23, y: 7 },
    facingDirection: Direction.DOWN,
  },
  // 8. Ben Horowitz — Idea Graveyard area
  {
    id: "ben-horowitz",
    name: "Ben Horowitz",
    spriteKey: "npc-ben-horowitz",
    dialog: ["Nobody told you it was going to be easy. Good."],
    startPosition: { x: 6, y: 34 },
    facingDirection: Direction.DOWN,
  },
  // 9. Vinod Khosla — east beach boardwalk (x=40 = beach strip, not ocean x=42+)
  {
    id: "vinod-khosla",
    name: "Vinod Khosla",
    spriteKey: "npc-vinod-khosla",
    dialog: ["The best entrepreneurs ignore the odds."],
    startPosition: { x: 40, y: 25 },
    facingDirection: Direction.LEFT,
  },
  // 10. Tobi Lutke — Engineering Lab area north
  {
    id: "tobi-lutke",
    name: "Tobi Lutke",
    spriteKey: "npc-tobi-lutke",
    dialog: ["Shipping is a feature."],
    startPosition: { x: 40, y: 5 },
    facingDirection: Direction.DOWN,
  },
  // 11. Patrick Collison — Engineering Lab area
  {
    id: "patrick-collison",
    name: "Patrick Collison",
    spriteKey: "npc-patrick-collison",
    dialog: ["Have you read the Stripe docs? All of them?"],
    startPosition: { x: 42, y: 5 },
    facingDirection: Direction.DOWN,
  },
  // 12. Dario Amodei — Engineering Lab
  {
    id: "dario-amodei",
    name: "Dario Amodei",
    spriteKey: "npc-dario-amodei",
    dialog: ["We're trying to be careful."],
    startPosition: { x: 41, y: 6 },
    facingDirection: Direction.DOWN,
  },
  // 13. Dad — Andres's House interior approach
  {
    id: "dad",
    name: "Dad",
    spriteKey: "npc-dad",
    dialog: ["Have you eaten? Also, call me."],
    startPosition: { x: 9, y: 18 },
    facingDirection: Direction.DOWN,
  },
  // 14. Dog 1 — Andres's House area
  {
    id: "dog-1",
    name: "Dog",
    spriteKey: "npc-dog-1",
    dialog: ["Woof."],
    startPosition: { x: 7, y: 20 },
    facingDirection: Direction.DOWN,
  },
];

export default NPC_CONFIG;
