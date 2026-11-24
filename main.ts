import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One line: a one-star review written by a house cat about the human it
// lives with. Chosen against the judge's brief, in its own order: it is
// squarely a cat's one-star review of its human (it opens "One star." and
// complains about the human, not about cats in general); the complaint is
// specific and recognisable — the food bowl, and the human standing there
// watching the cat eat; the voice is unmistakably feline — the human is
// measured by cat standards, a waiter who never leaves, and the review
// gives away more about the cat than the owner (it pays in hairballs);
// the wording is tight and surprising, with the sting in the last few
// words ("I pay in hairballs"); and it keeps the deadpan shape of a real
// one-star review while the content goes somewhere only a cat would go.
// Alternatives weighed and set aside: a closed-door variant ("He locks
// the door, then acts surprised when I scream at it. I live here. He is
// the guest.") is specific but its sting lands on a claim rather than a
// turn; a laptop-keyboard variant ("He types on the warm keyboard all day
// and never lets me sit on it. I have reported him to the sunbeam.") is
// warm and feline but the report-to-the-sunbeam joke explains itself a
// beat too early. The waiter line keeps the complaint, the voice and the
// sting in one tight sentence, and the hairball payment is the laugh.
const text =
  "One star. He fills my bowl, then stands there watching me eat like a waiter who never leaves. I pay in hairballs.";

// The bounty requires 1-200 characters, not only white space, and a single
// line: fail loudly instead of writing an entry the judge would refuse.
// The gate is strict on purpose — the entry file must be exactly this one
// line, byte for byte: no carriage return (a second kind of line break),
// no leading or trailing padding (the judge reads the file as submitted),
// and no control characters.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 200 || text.trim().length === 0) {
  throw new Error(
    `entry must be 1-200 characters of non-blank text, got ${codePoints}`,
  );
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (text !== text.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

// Read it back and prove the file on disk is exactly the line: a write
// that silently truncated, re-encoded or padded the entry would otherwise
// ship a different text to the judge than the one gated above.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
