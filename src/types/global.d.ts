import { GridEngine } from "grid-engine";

declare module "phaser" {
  interface Scene {
    gridEngine: GridEngine;
  }
}
