/**
 * DialogBox.ts
 *
 * Pokemon Gen 1/2 style dialog text box for Andres World.
 * - Camera-fixed container (setScrollFactor(0)) — does NOT scroll with world
 * - Instant text display (no typewriter effect)
 * - 2 lines per page; Space/E advances; advance() returns true on last page close
 * - White box with dark pixel border, monospace font
 */

// ─── InteractionPayload ───────────────────────────────────────────────────────

export type InteractionPayload =
  | { type: "npc"; id: string; dialog: string[] }
  | { type: "sign"; text: string[] }
  | { type: "building"; key: string; returnPos: { x: number; y: number }; entryPos?: { x: number; y: number } }
  | { type: "under_construction"; message: string };

// ─── splitIntoPages (pure function — exported for Vitest) ─────────────────────

/**
 * Chunks an array of lines into pages of `linesPerPage` lines each.
 *
 * @param lines - Array of text lines to paginate
 * @param linesPerPage - How many lines per page (2 for Pokemon Gen 1/2 style)
 * @returns Array of pages, each page being an array of line strings
 *
 * @example
 * splitIntoPages(["a","b","c","d"], 2)
 * // => [["a","b"], ["c","d"]]
 */
export function splitIntoPages(lines: string[], linesPerPage: number): string[][] {
  if (lines.length === 0) return [];

  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  return pages;
}

// ─── DialogBox class ──────────────────────────────────────────────────────────

/**
 * Pokemon Gen 1/2 style dialog box.
 *
 * Usage:
 *   const dialog = new DialogBox(this); // this = Phaser.Scene
 *   dialog.show(["Hello!", "How are you?", "Nice day."]);
 *   // In Space/E handler:
 *   const closed = dialog.advance(); // returns true when dialog closes
 */
export class DialogBox {
  private container: Phaser.GameObjects.Container;
  private line1Text: Phaser.GameObjects.Text;
  private line2Text: Phaser.GameObjects.Text;

  private pages: string[][] = [];
  private currentPage: number = 0;

  // Layout constants — box sits in bottom 25% of 800x600 screen
  private static readonly BOX_X = 0;
  private static readonly BOX_Y = 470;
  private static readonly BOX_WIDTH = 800;
  private static readonly BOX_HEIGHT = 120;
  private static readonly TEXT_X = 16;
  private static readonly LINE1_Y = 486;
  private static readonly LINE2_Y = 510;
  private static readonly FONT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "monospace",
    fontSize: "14px",
    color: "#000000",
    wordWrap: { width: 800 - 32 }, // box width minus 2x padding
  };

  constructor(scene: Phaser.Scene) {
    // Create the container in screen space (not world space)
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0); // CRITICAL: stays fixed to camera viewport
    this.container.setDepth(100);      // above all map layers
    this.container.setVisible(false);  // hidden by default

    // Background rectangle
    const bg = scene.add.rectangle(
      DialogBox.BOX_X + DialogBox.BOX_WIDTH / 2,
      DialogBox.BOX_Y + DialogBox.BOX_HEIGHT / 2,
      DialogBox.BOX_WIDTH,
      DialogBox.BOX_HEIGHT,
      0xffffff
    );
    bg.setStrokeStyle(3, 0x000000);
    this.container.add(bg);

    // Text objects — line1 and line2 for 2-line pages
    this.line1Text = scene.add.text(
      DialogBox.TEXT_X,
      DialogBox.LINE1_Y,
      "",
      DialogBox.FONT_STYLE
    );
    this.line2Text = scene.add.text(
      DialogBox.TEXT_X,
      DialogBox.LINE2_Y,
      "",
      DialogBox.FONT_STYLE
    );

    this.container.add(this.line1Text);
    this.container.add(this.line2Text);
  }

  /**
   * Open the dialog box with the given lines.
   * Lines are paginated at 2 lines per page.
   */
  show(lines: string[]): void {
    this.pages = splitIntoPages(lines, 2);
    this.currentPage = 0;
    this.renderPage(this.currentPage);
    this.container.setVisible(true);
  }

  /**
   * Advance to the next page or close if on the last page.
   * @returns true if the dialog was closed (last page), false if there are more pages
   */
  advance(): boolean {
    this.currentPage += 1;
    if (this.currentPage >= this.pages.length) {
      this.container.setVisible(false);
      this.pages = [];
      this.currentPage = 0;
      return true;
    }
    this.renderPage(this.currentPage);
    return false;
  }

  /**
   * Returns true if the dialog box is currently open/visible.
   */
  isOpen(): boolean {
    return this.container.visible;
  }

  /**
   * Programmatically close the dialog without advancing through remaining pages.
   */
  close(): void {
    this.container.setVisible(false);
    this.pages = [];
    this.currentPage = 0;
  }

  /**
   * Render the specified page index, updating line1 and line2 text.
   */
  private renderPage(pageIndex: number): void {
    const page = this.pages[pageIndex] ?? [];
    this.line1Text.setText(page[0] ?? "");
    this.line2Text.setText(page[1] ?? "");
  }
}
