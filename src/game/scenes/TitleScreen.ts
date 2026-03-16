import Phaser from "phaser";

/**
 * TitleScreenScene — Pokemon-style "ANDRES WORLD" title card.
 * Shows character sprite + title text, waits for any key press to start.
 */
export class TitleScreenScene extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScreen" });
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // ─── Title text ────────────────────────────────────────────
    const titleText = this.add
      .text(width / 2, height / 2 - 60, "ANDRES WORLD", {
        fontSize: "28px",
        fontFamily: "monospace",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        letterSpacing: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // ─── Character sprite ──────────────────────────────────────
    const playerSprite = this.add
      .sprite(width / 2, height / 2 + 10, "player", 1)
      .setScale(3)
      .setAlpha(0);

    // ─── "Press any key" text ──────────────────────────────────
    const pressText = this.add
      .text(width / 2, height / 2 + 80, "PRESS ANY KEY", {
        fontSize: "10px",
        fontFamily: "monospace",
        color: "#888888",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // ─── Version text ──────────────────────────────────────────
    this.add
      .text(width - 8, height - 8, "v1.0", {
        fontSize: "8px",
        fontFamily: "monospace",
        color: "#555555",
      })
      .setOrigin(1, 1);

    // ─── Fade-in animations ────────────────────────────────────
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      duration: 800,
      ease: "Power2",
    });

    this.tweens.add({
      targets: playerSprite,
      alpha: 1,
      duration: 600,
      delay: 400,
      ease: "Power2",
    });

    this.tweens.add({
      targets: pressText,
      alpha: 1,
      duration: 500,
      delay: 1000,
      ease: "Power2",
      onComplete: () => {
        // Blink effect
        this.tweens.add({
          targets: pressText,
          alpha: 0.3,
          duration: 600,
          yoyo: true,
          repeat: -1,
        });
      },
    });

    // ─── Input: any key or click to start ──────────────────────
    const startGame = () => {
      this.input.keyboard!.off("keydown", startGame);
      this.input.off("pointerdown", startGame);

      // Fade out
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("Overworld");
      });
    };

    // Delay input acceptance to avoid accidental skip
    this.time.delayedCall(800, () => {
      this.input.keyboard!.on("keydown", startGame);
      this.input.on("pointerdown", startGame);
    });
  }
}
