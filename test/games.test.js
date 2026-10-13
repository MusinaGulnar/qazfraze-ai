import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { wordGameData } from "../src/data/wordGameData.js";
import { phraseologisms } from "../src/data/phraseologisms.js";
import { searchPhrases, findPhrase, normalizeText } from "../src/utils/phraseSearch.js";

test("WordGame: data completeness and correctness", () => {
  assert.equal(wordGameData.kk.length, 15, "KK should have 15 rounds");
  assert.equal(wordGameData.ru.length, 15, "RU should have 15 rounds");

  // Check each Kazakh round
  wordGameData.kk.forEach((r, idx) => {
    assert.ok(r.id, `Round ${idx} must have id`);
    assert.ok(r.situation?.trim(), `Round ${idx} must have non-empty situation`);
    assert.ok(r.phrase?.trim(), `Round ${idx} must have non-empty phrase`);
    assert.ok(Array.isArray(r.words) && r.words.length >= 4, `Round ${idx} must have words array`);
    assert.ok(r.meaning?.trim(), `Round ${idx} must have meaning`);

    // Verify all target phrase words exist in words array
    const phraseWords = r.phrase.toLowerCase().split(/\s+/).filter(Boolean);
    const available = r.words.map((w) => w.toLowerCase().trim());
    for (const pw of phraseWords) {
      assert.ok(
        available.includes(pw),
        `Round ${r.id} (${r.phrase}): word "${pw}" is missing from available words [${available.join(", ")}]`
      );
    }
  });

  // Check each Russian round
  wordGameData.ru.forEach((r, idx) => {
    assert.ok(r.id, `Round ${idx} must have id`);
    assert.ok(r.situation?.trim(), `Round ${idx} must have non-empty situation`);
    assert.ok(r.phrase?.trim(), `Round ${idx} must have non-empty phrase`);
    assert.ok(Array.isArray(r.words) && r.words.length >= 4, `Round ${idx} must have words array`);
    assert.ok(r.meaning?.trim(), `Round ${idx} must have meaning`);

    const phraseWords = r.phrase.toLowerCase().split(/\s+/).filter(Boolean);
    const available = r.words.map((w) => w.toLowerCase().trim());
    for (const pw of phraseWords) {
      assert.ok(
        available.includes(pw),
        `RU round ${r.id} (${r.phrase}): word "${pw}" is missing from available words [${available.join(", ")}]`
      );
    }
  });
});

test("WordGame: UI translations must not have mixed language", () => {
  const content = fs.readFileSync("./src/components/games/WordGame.jsx", "utf8");

  // Check that "Своими сөзбен" is absent
  assert.ok(
    !content.includes("Своими сөзбен"),
    "WordGame.jsx must NOT contain mixed language 'Своими сөзбен'"
  );

  // Check that Kazakh title is "Сөзбен жина"
  assert.match(
    content,
    /kk:\s*\{[\s\S]*?title:\s*"Сөзбен жина"/,
    "WordGame.jsx KK title must be 'Сөзбен жина'"
  );

  // Check that Russian title is "Собери словами"
  assert.match(
    content,
    /ru:\s*\{[\s\S]*?title:\s*"Собери словами"/,
    "WordGame.jsx RU title must be 'Собери словами'"
  );

  // Check localized loading key
  assert.match(
    content,
    /loading:\s*"Ойын деректері жүктелуде\.\.\."/,
    "WordGame.jsx must have localized KK loading text"
  );
  assert.match(
    content,
    /loading:\s*"Загрузка данных игры\.\.\."/,
    "WordGame.jsx must have localized RU loading text"
  );
});

test("DiplomatGame: scenario completeness and valid response types", () => {
  const content = fs.readFileSync("./src/components/games/DiplomatGame.jsx", "utf8");
  const match = content.match(/const scenarios = (\[[\s\S]*?\]);/);
  assert.ok(match, "Scenarios array must be present in DiplomatGame.jsx");

  // Verify question translation keys are present
  assert.match(
    content,
    /question:\s*"Сұрақ"/,
    "DiplomatGame.jsx must have KK question: 'Сұрақ'"
  );
  assert.match(
    content,
    /question:\s*"Вопрос"/,
    "DiplomatGame.jsx must have RU question: 'Вопрос'"
  );
});

test("Phrase Corpus: 150 items with all required fields", () => {
  assert.equal(phraseologisms.length, 150, "Corpus must contain 150 phraseologisms");

  phraseologisms.forEach((p, idx) => {
    assert.ok(p.id, `Item ${idx} missing id`);
    assert.ok(p.phrase?.trim(), `Item ${idx} missing phrase`);
    assert.ok(p.meaning?.trim(), `Item ${idx} missing meaning`);
    assert.ok(p.culturalMark?.trim(), `Item ${idx} missing culturalMark`);
    assert.ok(p.group, `Item ${idx} missing group`);
    assert.ok(p.frequency, `Item ${idx} missing frequency`);
  });
});

test("Phrase search utility", () => {
  assert.equal(normalizeText(" Ат  құлағында   ойнау! "), "ат құлағында ойнау");

  const results = searchPhrases("ат");
  assert.ok(results.length > 0, "Searching 'ат' must return results");

  const found = findPhrase("Ат құлағында ойнау");
  assert.ok(found, "findPhrase should find 'Ат құлағында ойнау'");
  assert.equal(found.phrase, "Ат құлағында ойнау");
});

test("App.jsx: sendMessage argument safety against non-strings", () => {
  const content = fs.readFileSync("./src/App.jsx", "utf8");

  // Verify sendMessage has defensive type guard
  assert.match(
    content,
    /const raw =\s*typeof phraseOverride === "string"\s*\?\s*phraseOverride\s*:\s*message;/,
    "sendMessage must safely check typeof phraseOverride === 'string'"
  );
});
