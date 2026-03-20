/**
 * useDialog — manages dialog state (open/close, current page, advance).
 */

import { useState, useCallback } from "react";
import type { DialogEntry } from "../types/dialog";

export interface DialogState {
  isOpen: boolean;
  entry: DialogEntry | null;
  speaker: string | null;
  currentPage: number;
}

export function useDialog() {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    entry: null,
    speaker: null,
    currentPage: 0,
  });

  const open = useCallback((entry: DialogEntry, speaker?: string) => {
    setState({
      isOpen: true,
      entry,
      speaker: speaker || entry.speaker || null,
      currentPage: 0,
    });
  }, []);

  const advance = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }));
  }, []);

  const close = useCallback(() => {
    setState({
      isOpen: false,
      entry: null,
      speaker: null,
      currentPage: 0,
    });
  }, []);

  return { dialog: state, openDialog: open, advanceDialog: advance, closeDialog: close };
}
