import { phraseologisms } from "../data/phraseologisms.js";

export function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()[\]{}"'`«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "") {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean);
}

function getWordSimilarity(wordA, wordB) {
  if (!wordA || !wordB) return 0;

  if (wordA === wordB) return 1;

  if (wordA.startsWith(wordB) || wordB.startsWith(wordA)) {
    return 0.8;
  }

  return 0;
}

function scorePhrase(item, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  const phrase = normalizeText(item.phrase);
  const meaning = normalizeText(item.meaning);
  const culturalMark = normalizeText(item.culturalMark);

  // 1. Дәл сәйкестік
  if (phrase === normalizedQuery) {
    return 1000;
  }

  // 2. Фразаның ішінде толық сұраныс бар
  if (phrase.includes(normalizedQuery)) {
    return 900;
  }

  // 3. Сұраныстың ішінде толық фраза бар
  if (normalizedQuery.includes(phrase)) {
    return 850;
  }

  const queryWords = tokenize(normalizedQuery);
  const phraseWords = tokenize(phrase);
  const meaningWords = tokenize(meaning);
  const cultureWords = tokenize(culturalMark);

  let score = 0;

  queryWords.forEach((queryWord) => {
    // Фразеологизмнің өзінен іздеу
    phraseWords.forEach((phraseWord) => {
      const similarity = getWordSimilarity(queryWord, phraseWord);

      if (similarity === 1) {
        score += 120;
      } else if (similarity > 0) {
        score += 70;
      }
    });

    // Мағынадан іздеу
    meaningWords.forEach((meaningWord) => {
      const similarity = getWordSimilarity(queryWord, meaningWord);

      if (similarity === 1) {
        score += 100;
      } else if (similarity > 0) {
        score += 55;
      }
    });

    // Мәдени белгі бойынша іздеу
    cultureWords.forEach((cultureWord) => {
      const similarity = getWordSimilarity(queryWord, cultureWord);

      if (similarity === 1) {
        score += 45;
      } else if (similarity > 0) {
        score += 25;
      }
    });
  });

  return score;
}

export function searchPhrases(query = "") {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  return phraseologisms
    .map((item) => ({
      ...item,
      searchScore: scorePhrase(item, normalizedQuery),
    }))
    .filter((item) => item.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 8);
}

export function findPhrase(query = "") {
  const results = searchPhrases(query);

  return results[0] || null;
}