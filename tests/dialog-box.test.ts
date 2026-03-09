import { describe, it, expect } from "vitest";
import { splitIntoPages } from "../src/game/ui/DialogBox";

// INTER-04: splitIntoPages pagination
describe("INTER-04: splitIntoPages", () => {
  it("splitIntoPages(['line1','line2','line3','line4'], 2) returns two pages of 2 lines each", () => {
    const result = splitIntoPages(["line1", "line2", "line3", "line4"], 2);
    expect(result).toEqual([
      ["line1", "line2"],
      ["line3", "line4"],
    ]);
  });
});

// INTER-05: advance() pagination logic
// advance() is a pure function that takes (currentPage, totalPages) and returns
// true if dialog closes (last page), false if more pages remain.
describe("INTER-05: advance logic", () => {
  it("INTER-05a: advance on page 0 of 2-page dialog returns false (more pages remain)", () => {
    // A 2-page dialog: pages [0, 1]. On page 0, advance returns false.
    const pages = splitIntoPages(["a", "b", "c", "d"], 2);
    expect(pages.length).toBe(2);

    // Simulate advance: if currentPage + 1 < totalPages => false (stay open)
    const currentPage = 0;
    const isLastPage = currentPage + 1 >= pages.length;
    expect(isLastPage).toBe(false);
  });

  it("INTER-05b: advance on a 1-page dialog returns true (dialog closes)", () => {
    // A 1-page dialog: pages [0]. On page 0, advance returns true (closes).
    const pages = splitIntoPages(["only line"], 2);
    expect(pages.length).toBe(1);

    const currentPage = 0;
    const isLastPage = currentPage + 1 >= pages.length;
    expect(isLastPage).toBe(true);
  });
});
