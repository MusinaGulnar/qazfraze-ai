
import { useEffect, useMemo, useState } from "react";
import { wordGameData } from "../../data/wordGameData";

const ROUND_TIME = 15;
const TOTAL_ROUNDS = 15;
const HIGH_SCORE_KEY = "qazfraze_word_game_high_score";

const ui = {
  kk: {
    title: "Своими сөзбен",
    subtitle: "Фразеологизмді дұрыс құрастыр",
    round: "Раунд",
    score: "Ұпай",
    combo: "Комбо",
    time: "Уақыт",
    found: "Корпустан табылған мағына",
    situation: "Ситуация",
    yourAnswer: "Сіздің жауабыңыз",
    correct: "Дұрыс!",
    wrong: "Қате",
    timeout: "Уақыт аяқталды",
    correctAnswer: "Дұрыс жауап",
    next: "Келесі раунд",
    finish: "Нәтиже",
    resultTitle: "Ойын аяқталды",
    totalScore: "Жалпы ұпай",
    correctAnswers: "Дұрыс жауаптар",
    bestCombo: "Ең жоғары комбо",
    averageTime: "Орташа уақыт",
    highScore: "Рекорд",
    playAgain: "Қайта ойнау",
    back: "Ойындарға оралу",
    choose: "Сөздерді дұрыс ретпен таңда",
    remove: "Соңғы сөзді алып тастау",
    excellent: "Керемет нәтиже!",
    good: "Жақсы нәтиже!",
    tryAgain: "Тағы бір рет байқап көр!",
    points: "ұпай",
    seconds: "с",
    newRecord: "Жаңа рекорд!",
    record: "Жеке рекорд",
    accuracy: "Дәлдік",
    corpus: "150 фразеологизм",
    tapAgain: "Қате сөзді бассаңыз, таңдау жойылады",
  },

  ru: {
    title: "Своими словами",
    subtitle: "Соберите правильный фразеологизм",
    round: "Раунд",
    score: "Очки",
    combo: "Комбо",
    time: "Время",
    found: "Значение из корпуса",
    situation: "Ситуация",
    yourAnswer: "Ваш ответ",
    correct: "Правильно!",
    wrong: "Ошибка",
    timeout: "Время вышло",
    correctAnswer: "Правильный ответ",
    next: "Следующий раунд",
    finish: "Результат",
    resultTitle: "Игра завершена",
    totalScore: "Всего очков",
    correctAnswers: "Правильные ответы",
    bestCombo: "Лучшее комбо",
    averageTime: "Среднее время",
    highScore: "Рекорд",
    playAgain: "Играть снова",
    back: "Вернуться к играм",
    choose: "Выберите слова в правильном порядке",
    remove: "Удалить последнее слово",
    excellent: "Отличный результат!",
    good: "Хороший результат!",
    tryAgain: "Попробуйте ещё раз!",
    points: "очков",
    seconds: "с",
    newRecord: "Новый рекорд!",
    record: "Личный рекорд",
    accuracy: "Точность",
    corpus: "150 фразеологизмов",
    tapAgain: "Нажмите на выбранное слово, чтобы убрать его",
  },
};

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[.,!?;:()[\]{}"'`«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getInitialGameData(language) {
  const source = wordGameData[language] || wordGameData.kk;

  if (!source?.length) {
    return [];
  }

  const shuffled = shuffle(source);

  if (shuffled.length >= TOTAL_ROUNDS) {
    return shuffled.slice(0, TOTAL_ROUNDS);
  }

  const result = [];

  for (let index = 0; index < TOTAL_ROUNDS; index += 1) {
    result.push(shuffled[index % shuffled.length]);
  }

  return result;
}

function getHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // localStorage unavailable
  }
}

export default function WordGame({
  language = "kk",
  onBack,
}) {
  const text = ui[language] || ui.kk;

  const [rounds, setRounds] = useState(() =>
    getInitialGameData(language)
  );

  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [status, setStatus] = useState("playing");
  const [feedback, setFeedback] = useState(null);

  const [roundStartedAt, setRoundStartedAt] = useState(Date.now());
  const [totalAnswerTime, setTotalAnswerTime] = useState(0);
  const [answeredRounds, setAnsweredRounds] = useState(0);

  const [highScore, setHighScore] = useState(getHighScore);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [wrongCardIndex, setWrongCardIndex] = useState(null);

  const currentRound = rounds[roundIndex];

  const targetWords = useMemo(() => {
    return normalize(currentRound?.phrase).split(" ").filter(Boolean);
  }, [currentRound]);

  useEffect(() => {
    if (!currentRound) return;

    setAvailableWords(shuffle(currentRound.words || []));
    setSelectedWords([]);
    setTimeLeft(ROUND_TIME);
    setStatus("playing");
    setFeedback(null);
    setWrongCardIndex(null);
    setRoundStartedAt(Date.now());
  }, [currentRound]);

  useEffect(() => {
    if (status !== "playing") return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft, status]);

  useEffect(() => {
    setRounds(getInitialGameData(language));
    setRoundIndex(0);
    setSelectedWords([]);
    setAvailableWords([]);
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setCorrectAnswers(0);
    setStatus("playing");
    setFeedback(null);
    setTotalAnswerTime(0);
    setAnsweredRounds(0);
    setWrongCardIndex(null);
    setRoundStartedAt(Date.now());
    setIsNewRecord(false);
  }, [language]);

  function registerAnswerTime() {
    const elapsed = Math.max(
      1,
      Math.min(
        ROUND_TIME,
        Math.round((Date.now() - roundStartedAt) / 1000)
      )
    );

    setTotalAnswerTime((value) => value + elapsed);
    setAnsweredRounds((value) => value + 1);

    return elapsed;
  }

  function handleTimeout() {
    if (status !== "playing") return;

    registerAnswerTime();

    setCombo(0);
    setStatus("timeout");

    setFeedback({
      type: "timeout",
      title: text.timeout,
      answer: currentRound.phrase,
    });
  }

  function selectWord(word, index) {
    if (status !== "playing") return;

    const nextSelected = [...selectedWords, word];

    setSelectedWords(nextSelected);

    setAvailableWords((words) =>
      words.filter((_, wordIndex) => wordIndex !== index)
    );

    if (nextSelected.length === targetWords.length) {
      checkAnswer(nextSelected);
    }
  }

  function removeSelectedWord(index) {
    if (status !== "playing") return;

    const removedWord = selectedWords[index];

    if (!removedWord) return;

    setSelectedWords((words) =>
      words.filter((_, wordIndex) => wordIndex !== index)
    );

    setAvailableWords((words) => [...words, removedWord]);
  }

  function removeLastWord() {
    if (!selectedWords.length || status !== "playing") return;

    removeSelectedWord(selectedWords.length - 1);
  }

  function checkAnswer(answer) {
    const answerText = normalize(answer.join(" "));
    const targetText = normalize(currentRound.phrase);

    const answerTime = registerAnswerTime();

    if (answerText === targetText) {
      const nextCombo = combo + 1;

      const timeBonus = timeLeft * 10;
      const comboMultiplier = Math.min(nextCombo, 5);

      const earned =
        100 +
        timeBonus +
        (comboMultiplier - 1) * 50;

      setScore((value) => value + earned);
      setCombo(nextCombo);

      setBestCombo((value) =>
        Math.max(value, nextCombo)
      );

      setCorrectAnswers((value) => value + 1);
      setStatus("correct");

      setFeedback({
        type: "correct",
        title: text.correct,
        points: earned,
        combo: nextCombo,
        answerTime,
      });
    } else {
      setCombo(0);
      setStatus("wrong");

      setFeedback({
        type: "wrong",
        title: text.wrong,
        answer: currentRound.phrase,
      });
    }
  }

  function goNext() {
    if (roundIndex + 1 >= rounds.length) {
      const finalHighScore = Math.max(
        highScore,
        score
      );

      if (score > highScore) {
        saveHighScore(score);
        setHighScore(score);
        setIsNewRecord(true);
      } else {
        setIsNewRecord(false);
        setHighScore(finalHighScore);
      }

      setStatus("finished");
      return;
    }

    setRoundIndex((value) => value + 1);
  }

  function restart() {
    const newRounds = getInitialGameData(language);

    setRounds(newRounds);
    setRoundIndex(0);
    setSelectedWords([]);
    setAvailableWords([]);
    setTimeLeft(ROUND_TIME);

    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setCorrectAnswers(0);

    setStatus("playing");
    setFeedback(null);

    setTotalAnswerTime(0);
    setAnsweredRounds(0);

    setWrongCardIndex(null);
    setRoundStartedAt(Date.now());
    setIsNewRecord(false);
    setHighScore(getHighScore());
  }

  if (!currentRound && status !== "finished") {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-[32px] bg-[#f7f9fc]">
        <div className="text-sm font-semibold text-slate-500">
          Ойын деректері жүктелуде...
        </div>
      </div>
    );
  }

  if (status === "finished") {
    const averageTime =
      answeredRounds > 0
        ? (totalAnswerTime / answeredRounds).toFixed(1)
        : "0.0";

    const percentage =
      rounds.length > 0
        ? Math.round(
            (correctAnswers / rounds.length) * 100
          )
        : 0;

    let resultMessage = text.tryAgain;

    if (percentage >= 80) {
      resultMessage = text.excellent;
    } else if (percentage >= 50) {
      resultMessage = text.good;
    }

    return (
      <>
        <style>{gameStyles}</style>

        <div className="game-fade-in min-h-[650px] w-full rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-3 sm:p-5 md:p-8">
          <div className="mx-auto flex min-h-[600px] max-w-4xl items-center justify-center">
            <div className="game-result-card w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(30,45,80,0.12)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 px-6 py-12 text-center text-white md:px-12">
                <div className="result-orb absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="result-orb absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />

                <div className="relative">
                  {isNewRecord && (
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                      <span>🏆</span>
                      {text.newRecord}
                    </div>
                  )}

                  <div className="mb-4 text-5xl">
                    {percentage >= 80
                      ? "🏆"
                      : percentage >= 50
                        ? "⭐"
                        : "🎯"}
                  </div>

                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    {text.finish}
                  </div>

                  <h2 className="mt-2 text-3xl font-black md:text-4xl">
                    {text.resultTitle}
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
                    {resultMessage}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-100 md:grid-cols-5">
                <ResultStat
                  label={text.totalScore}
                  value={score}
                />

                <ResultStat
                  label={text.correctAnswers}
                  value={`${correctAnswers}/${rounds.length}`}
                />

                <ResultStat
                  label={text.accuracy}
                  value={`${percentage}%`}
                />

                <ResultStat
                  label={text.bestCombo}
                  value={`×${bestCombo}`}
                />

                <ResultStat
                  label={text.averageTime}
                  value={`${averageTime}${text.seconds}`}
                />
              </div>

              <div className="border-t border-slate-100 px-6 py-5">
                <div className="mx-auto flex max-w-xl items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {text.record}
                    </div>
                    <div className="mt-0.5 text-lg font-black text-slate-800">
                      {highScore}
                    </div>
                  </div>

                  <div className="text-2xl">⚡</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6 md:flex-row md:justify-center">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-2xl bg-[#5f6cff] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#505ce5] active:scale-[0.98]"
                >
                  {text.playAgain}
                </button>

                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    {text.back}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const progress =
    ((roundIndex + 1) / rounds.length) * 100;

  const timerProgress =
    (timeLeft / ROUND_TIME) * 100;

  const isDanger = timeLeft <= 5;

  return (
    <>
      <style>{gameStyles}</style>

      <div className="game-fade-in min-h-[650px] w-full rounded-[32px] bg-[#f7f9fc] p-3 sm:p-4 md:p-7">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#5f6cff]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#5f6cff]" />
                QAZFRAZE GAME
              </div>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {text.title}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {text.subtitle}
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {text.round}
                </div>

                <div className="mt-0.5 text-lg font-black text-slate-800">
                  {roundIndex + 1}
                  <span className="mx-1 text-slate-300">
                    /
                  </span>
                  {rounds.length}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {text.highScore}
                </div>

                <div className="mt-0.5 text-lg font-black text-[#5f6cff]">
                  {highScore}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE ROUND */}
          <div className="mb-4 flex items-center justify-between sm:hidden">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {text.round}
              </span>

              <span className="ml-2 text-sm font-black text-slate-800">
                {roundIndex + 1}/{rounds.length}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {text.highScore}
              </span>

              <span className="ml-2 text-sm font-black text-[#5f6cff]">
                {highScore}
              </span>
            </div>
          </div>

          {/* ROUND PROGRESS */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>{roundIndex + 1}</span>
              <span>{rounds.length}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5f6cff] to-[#00c6ff] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            <GameStat
              label={text.score}
              value={score}
              icon="✦"
            />

            <GameStat
              label={text.combo}
              value={`×${combo}`}
              active={combo > 1}
              icon="🔥"
            />

            <GameStat
              label={text.time}
              value={`${timeLeft}s`}
              danger={isDanger}
              icon="◷"
            />
          </div>

          {/* TIMER */}
          <div
            className={`mb-6 h-2 overflow-hidden rounded-full ${
              isDanger ? "bg-red-100" : "bg-slate-200"
            }`}
          >
            <div
              className={`timer-bar h-full rounded-full transition-all duration-1000 ${
                isDanger
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-[#5f6cff] to-[#00b8ff]"
              }`}
              style={{
                width: `${timerProgress}%`,
              }}
            />
          </div>

          {/* SITUATION CARD */}
          <div className="relative mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_50px_rgba(30,45,80,0.07)] sm:p-6 md:p-9">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-cyan-50 blur-3xl" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6cff]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-xs">
                  ?
                </span>
                {text.situation}
              </div>

              <p className="max-w-3xl text-lg font-bold leading-relaxed text-slate-800 sm:text-xl md:text-2xl">
                {currentRound.situation}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-400">
                  {text.corpus}
                </span>

                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-[#5f6cff]">
                  {text.choose}
                </span>
              </div>
            </div>
          </div>

          {/* ANSWER AREA */}
          <div className="mb-5 rounded-[24px] border border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {text.yourAnswer}
              </div>

              {selectedWords.length > 0 && (
                <button
                  type="button"
                  onClick={removeLastWord}
                  disabled={status !== "playing"}
                  className="text-[10px] font-bold text-slate-400 transition hover:text-[#5f6cff] disabled:opacity-50"
                >
                  ↶ {text.remove}
                </button>
              )}
            </div>

            <div className="flex min-h-[72px] flex-wrap items-center gap-2">
              {targetWords.map((_, index) => {
                const word = selectedWords[index];

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={!word || status !== "playing"}
                    onClick={() =>
                      removeSelectedWord(index)
                    }
                    className={`answer-slot ${
                      word
                        ? "filled"
                        : "empty"
                    }`}
                    title={
                      word
                        ? text.tapAgain
                        : ""
                    }
                  >
                    {word || "•••"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* WORD CARDS */}
          <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {availableWords.map((word, index) => (
              <button
                key={`${word}-${index}`}
                type="button"
                disabled={status !== "playing"}
                onClick={() => selectWord(word, index)}
                onAnimationEnd={() =>
                  setWrongCardIndex(null)
                }
                className={`word-card group ${
                  wrongCardIndex === index
                    ? "word-card-wrong"
                    : ""
                }`}
              >
                <span>{word}</span>
                <span className="word-card-arrow">
                  +
                </span>
              </button>
            ))}
          </div>

          {/* SMALL HINT */}
          <div className="mb-4 text-center text-[10px] font-medium text-slate-400">
            {text.tapAgain}
          </div>

          {/* FEEDBACK */}
          {feedback && (
            <FeedbackCard
              feedback={feedback}
              text={text}
              onNext={goNext}
              isLast={
                roundIndex + 1 >= rounds.length
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

function GameStat({
  label,
  value,
  icon,
  active,
  danger,
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 shadow-sm transition sm:px-4 ${
        active
          ? "border-orange-200 bg-orange-50"
          : danger
            ? "border-red-200 bg-red-50"
            : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:gap-2 sm:text-[10px]">
        <span>{icon}</span>
        {label}
      </div>

      <div
        className={`mt-1 text-lg font-black sm:text-xl ${
          danger
            ? "text-red-500"
            : active
              ? "text-orange-500"
              : "text-slate-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  text,
  onNext,
  isLast,
}) {
  const isCorrect = feedback.type === "correct";
  const isTimeout = feedback.type === "timeout";

  return (
    <div
      className={`feedback-pop overflow-hidden rounded-[24px] border p-5 shadow-sm ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50"
          : isTimeout
            ? "border-amber-200 bg-amber-50"
            : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div
            className={`flex items-center gap-2 text-lg font-black ${
              isCorrect
                ? "text-emerald-700"
                : isTimeout
                  ? "text-amber-700"
                  : "text-red-700"
            }`}
          >
            <span className="text-xl">
              {isCorrect
                ? "✓"
                : isTimeout
                  ? "◷"
                  : "×"}
            </span>

            {feedback.title}
          </div>

          {isCorrect ? (
            <div className="mt-2 text-sm font-semibold text-emerald-700">
              +{feedback.points} {text.points}

              {feedback.combo > 1 && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black">
                  COMBO ×{feedback.combo}
                </span>
              )}
            </div>
          ) : (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-semibold">
                {text.correctAnswer}:
              </span>{" "}
              {feedback.answer}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          className={`shrink-0 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 active:scale-[0.98] ${
            isCorrect
              ? "bg-emerald-600 hover:bg-emerald-700"
              : isTimeout
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLast ? text.finish : text.next}
        </button>
      </div>
    </div>
  );
}

function ResultStat({ label, value }) {
  return (
    <div className="bg-white px-3 py-5 text-center sm:px-4 sm:py-6">
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
        {label}
      </div>

      <div className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">
        {value}
      </div>
    </div>
  );
}

const gameStyles = `
  @keyframes gameFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes feedbackPop {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes wrongShake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-7px);
    }
    40% {
      transform: translateX(7px);
    }
    60% {
      transform: translateX(-5px);
    }
    80% {
      transform: translateX(5px);
    }
  }

  @keyframes timerPulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes resultOrb {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.12);
    }
    100% {
      transform: scale(1);
    }
  }

  .game-fade-in {
    animation: gameFadeIn 0.35s ease-out;
  }

  .feedback-pop {
    animation: feedbackPop 0.28s ease-out;
  }

  .word-card {
    position: relative;
    min-height: 62px;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid rgb(226 232 240);
    background: white;
    padding: 15px 30px 15px 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 800;
    color: rgb(51 65 85);
    box-shadow: 0 4px 14px rgba(30, 45, 80, 0.045);
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .word-card:hover:not(:disabled) {
    transform: translateY(-3px);
    border-color: rgb(199 210 254);
    background: rgb(238 242 255);
    color: rgb(95 108 255);
    box-shadow: 0 12px 28px rgba(95, 108, 255, 0.12);
  }

  .word-card:active:not(:disabled) {
    transform: scale(0.96);
  }

  .word-card:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .word-card-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    font-weight: 500;
    color: rgb(203 213 225);
    transition: color 0.18s ease;
  }

  .word-card:hover:not(:disabled) .word-card-arrow {
    color: rgb(95 108 255);
  }

  .word-card-wrong {
    animation: wrongShake 0.35s ease;
    border-color: rgb(252 165 165) !important;
    background: rgb(254 242 242) !important;
  }

  .answer-slot {
    min-width: 92px;
    min-height: 50px;
    border-radius: 13px;
    border: 1px dashed rgb(203 213 225);
    padding: 10px 15px;
    text-align: center;
    font-size: 13px;
    font-weight: 800;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      box-shadow 0.18s ease;
  }

  .answer-slot.empty {
    background: rgba(255, 255, 255, 0.5);
    color: rgb(203 213 225);
  }

  .answer-slot.filled {
    border-style: solid;
    border-color: rgb(199 210 254);
    background: white;
    color: rgb(30 41 59);
    box-shadow: 0 5px 15px rgba(30, 45, 80, 0.06);
  }

  .answer-slot.filled:hover {
    transform: translateY(-2px);
    border-color: rgb(129 140 248);
    background: rgb(238 242 255);
    color: rgb(79 70 229);
  }

  .timer-bar {
    transition:
      width 1s linear,
      background 0.2s ease;
  }

  .result-orb {
    animation: resultOrb 5s ease-in-out infinite;
  }

  @media (max-width: 640px) {
    .word-card {
      min-height: 58px;
      padding: 13px 27px 13px 13px;
      font-size: 13px;
    }

    .answer-slot {
      min-width: 76px;
      min-height: 46px;
      padding: 8px 10px;
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .game-fade-in,
    .feedback-pop,
    .word-card-wrong,
    .result-orb {
      animation: none !important;
    }

    .word-card,
    .answer-slot {
      transition: none !important;
    }
  }
`;

