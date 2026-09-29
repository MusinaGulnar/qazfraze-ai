const CACHE_KEY = "qazfraze_ai_analysis_cache";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object"
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(cache)
    );
  } catch {
    // Cache is optional when storage is unavailable or full.
  }
}

export function createCacheKey(phrase, language = "kk") {
  return `${language}:${phrase
    .toLowerCase()
    .trim()}`;
}

export function getCachedAnalysis(
  phrase,
  language = "kk"
) {
  const cache = readCache();
  const key = createCacheKey(phrase, language);

  return cache[key] || null;
}

export function saveCachedAnalysis(
  phrase,
  language,
  result
) {
  const cache = readCache();
  const key = createCacheKey(phrase, language);

  cache[key] = {
    ...result,
    cachedAt: new Date().toISOString(),
  };

  writeCache(cache);

  return cache[key];
}

export function clearAnalysisCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function getAnalysisCacheStats() {
  const cache = readCache();

  return {
    total: Object.keys(cache).length,
    entries: Object.entries(cache).map(
      ([key, value]) => ({
        key,
        ...value,
      })
    ),
  };
}