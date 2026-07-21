const LETTER_OFFSET = "a".charCodeAt(0);

/** Maps A–F / 1–6 (and numpad) to a 0-based option index. */
export function resolvePracticeOptionHotkey(event: KeyboardEvent): number | null {
  if (event.code.startsWith("Digit")) {
    const digit = Number(event.code.replace("Digit", ""));
    if (digit >= 1 && digit <= 6) {
      return digit - 1;
    }
  }

  if (event.code.startsWith("Numpad")) {
    const digit = Number(event.code.replace("Numpad", ""));
    if (digit >= 1 && digit <= 6) {
      return digit - 1;
    }
  }

  if (event.code.startsWith("Key")) {
    const letter = event.code.replace("Key", "").toLowerCase();
    if (letter.length === 1) {
      const index = letter.charCodeAt(0) - LETTER_OFFSET;
      if (index >= 0 && index <= 5) {
        return index;
      }
    }
  }

  return null;
}
