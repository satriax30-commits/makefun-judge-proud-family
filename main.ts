// makefun-judge-proud-family
// Bounty: "Make the AI Judge Feel Proud: A Family Scene"
// (u-shino-make-the-ai-judge-feel-proud-a-family-scene-ee2e3fa2)
//
// This program writes ONE family scene (1-2 lines, <= 280 chars) to
// <outputDir>/entry.txt, then reads it back and gates it before exiting.
//
// ---------------------------------------------------------------------------
// CANDIDATE SCENES, weighed against the judge's brief (most important first):
//   1. a real family scene on the page, warm enough to make a proud judge
//      smile; 2. heartfelt, a small domestic moment with genuine affection;
//   3. funny in a light, recognisable way; 4. one or two lines, no word
//      wasted; 5. specific and fresh, one telling detail, not a greeting
//      card.
// ---------------------------------------------------------------------------
// A. "Dad still waves at the school bus every morning, even though I'm
//    thirty-two and the driver waves back."
//    Warm and specific, but the laugh is gentle to the point of faint, and
//    the scene is really about Dad alone; the family feeling is thin.
// B. "Mum saved every one of my school drawings in a folder labelled
//    'genius', including the one that was just a potato."
//    Funny and specific, and the folder label is a lovely detail -- but it
//    leans more joke than scene: the affection is implied, not felt on the
//    page, and "potato drawing" risks reading as a gag first.
// C. "My little brother announced at dinner that he'd traded his sandwich
//    for a rock, because 'the rock was cooler', and Dad just nodded like
//    it was a fair deal."
//    A real dinner-table scene with a genuine laugh, and Dad's nod carries
//    the warmth. But three characters compete for one breath, the line
//    runs long, and the heart lands second to the joke.
// D. "Grandma answers every video call with her thumb over the camera,
//    then says, 'There you are, love,' to a black screen."
//    Very funny, very recognisable, one telling detail. But the warmth is
//    mostly in the reader's head: on the page it is a gag about a thumb,
//    and the affection has to be inferred rather than felt.
// E. "Dad fell asleep during my graduation speech, woke up for the
//    applause, and clapped loudest."
//    Heartfelt and funny at once, and the last beat is a real turn. But
//    "graduation" is a familiar stage, and the scene is told as a summary
//    rather than lived in the moment.
// F. (CHOSEN) "Mum still cuts the crusts off my sandwiches when I visit.
//    I'm thirty-four, and honestly, they do taste better that way."
//    Wins on the brief in order: a whole domestic scene in two lines --
//    the visit, the kitchen, the mother still mothering. The affection is
//    the action itself, not sentiment stuck on afterwards: she still does
//    it, he still lets her. The turn is wry and true -- a grown man
//    admitting the crustless sandwich really is better -- the kind of line
//    a family would actually laugh at. One telling detail (the crusts)
//    does all the work, and no word is wasted. Quiet and a little silly
//    at once, which the brief says can both win.
// ---------------------------------------------------------------------------
// Deliberately NOT addressed to the judge: the brief allows it, but cheap
// judge-flattery would read as sentiment stuck on afterwards and lose on
// criterion 2. The scene stands on its own.
// ---------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: two lines, plain ASCII, no trailing newline.
const SCENE: string =
  "Mum still cuts the crusts off my sandwiches when I visit.\n" +
  "I'm thirty-four, and honestly, they do taste better that way.";

// ---------------------------------------------------------------------------
// Self-check gate (mirrors the server gate in RULES.txt):
//   * UTF-8 text, 1-280 characters, not only whitespace
//   * 1-2 lines
// The program writes the file, reads it back, and refuses to exit 0 unless
// the file on disk passes every check. Deterministic: no clock, no random.
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function charCount(text: string): number {
  // Count Unicode code points, so the count matches what a reader sees.
  return [...text].length;
}

function lineCount(text: string): number {
  return text.split("\n").length;
}

function gate(text: string, where: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > 280) {
    fail(`${where}: ${chars} characters, outside 1-280`);
  }
  if (text.trim().length === 0) {
    fail(`${where}: text is only whitespace`);
  }
  const lines = lineCount(text);
  if (lines < 1 || lines > 2) {
    fail(`${where}: ${lines} lines, outside 1-2`);
  }
}

function main(): void {
  const outputDir = process.argv[2] ?? process.env.OUTPUT_DIR;
  if (!outputDir) {
    fail("usage: node main.ts <outputDir>  (or set OUTPUT_DIR)");
  }

  // Gate the scene before writing anything.
  gate(SCENE, "scene");

  mkdirSync(outputDir, { recursive: true });
  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, SCENE, "utf8");

  // Read back and gate the file on disk: the written artifact is what counts.
  const written = readFileSync(outPath, "utf8");
  if (written !== SCENE) {
    fail("entry.txt on disk does not match the scene");
  }
  gate(written, "entry.txt");

  console.log(
    `wrote ${outPath} (${charCount(written)} chars, ${lineCount(written)} lines)`,
  );
}

main();
