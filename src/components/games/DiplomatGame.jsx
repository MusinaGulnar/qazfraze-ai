import { useEffect, useMemo, useState } from "react";
import { phraseologisms } from "../../data/phraseologisms";

const TOTAL_ROUNDS = 6;
const START_TRUST = 50;

const ui = {
  kk: {
    eyebrow: "QAZFRAZE STORY GAME",
    title: "Фразео-Дипломат",
    subtitle: "Сөздің астарлы мағынасын түсініп, дұрыс жауап беріңіз.",
    round: "Раунд",
    score: "Ұпай",
    trust: "Сенім",
    dialogue: "Диалог",
    choose: "Жауапты таңдаңыз",
    correct: "Дұрыс түсіндіңіз!",
    literal: "Сөзбе-сөз түсініп қалдыңыз",
    wrong: "Бұл жауап сәйкес келмеді",
    next: "Келесі жағдай",
    finish: "Нәтиже",
    success: "Келіссөз сәтті аяқталды!",
    neutral: "Келіссөз аяқталды",
    failure: "Сенім жоғалды",
    successText:
      "Сіз фразеологизмдердің астарлы мағынасын дұрыс түсініп, кейіпкерлермен жақсы байланыс орнаттыңыз.",
    neutralText:
      "Кейбір жауаптарда қателік болғанымен, негізгі келіссөзді сақтап қалдыңыз.",
    failureText:
      "Фразеологизмдерді дұрыс түсінбеу келіссөзге әсер етті. Қайта байқап көріңіз.",
    playAgain: "Қайта ойнау",
    back: "Ойындарға оралу",
    correctMeaning: "Дұрыс мағына",
    trustUp: "Сенім артты",
    trustDown: "Сенім төмендеді",
    points: "ұпай",
    teacher: "Ұстаз",
    businessman: "Кәсіпкер",
    grandmother: "Ақылды әже",
    finalScore: "Жалпы ұпай",
    finalTrust: "Соңғы сенім",
    accuracy: "Дәлдік",
    conversations: "Ситуациялар",
    continue: "Жалғастыру",
    bestScore: "Рекорд",
    bestScore: "Рекорд",
  },

  ru: {
    eyebrow: "QAZFRAZE STORY GAME",
    title: "Фразео-Дипломат",
    subtitle:
      "Понимайте скрытый смысл фразеологизмов и выбирайте правильный ответ.",
    round: "Раунд",
    score: "Очки",
    trust: "Доверие",
    dialogue: "Диалог",
    choose: "Выберите ответ",
    correct: "Вы поняли правильно!",
    literal: "Вы поняли буквально",
    wrong: "Этот ответ не подходит",
    next: "Следующая ситуация",
    finish: "Результат",
    success: "Переговоры завершены успешно!",
    neutral: "Переговоры завершены",
    failure: "Доверие потеряно",
    successText:
      "Вы правильно поняли скрытый смысл фразеологизмов и смогли установить хороший контакт с героями.",
    neutralText:
      "Несмотря на несколько ошибок, вам удалось сохранить основные переговоры.",
    failureText:
      "Непонимание фразеологизмов повлияло на переговоры. Попробуйте ещё раз.",
    playAgain: "Играть снова",
    back: "Вернуться к играм",
    correctMeaning: "Правильное значение",
    trustUp: "Доверие выросло",
    trustDown: "Доверие снизилось",
    points: "очков",
    finalScore: "Всего очков",
    finalTrust: "Итоговое доверие",
    accuracy: "Точность",
    conversations: "Ситуации",
    continue: "Продолжить",
    teacher: "Учитель",
    businessman: "Предприниматель",
    grandmother: "Мудрая бабушка",
    bestScore: "Рекорд",
  },
};

const characters = {
  teacher: {
    emoji: "👨‍🏫",
    kk: "Ұстаз",
    ru: "Учитель",
    roleKk: "Білім мен әділдікті бағалайды",
    roleRu: "Ценит знания и справедливость",
    gradient: "from-indigo-500 to-blue-500",
  },

  businessman: {
    emoji: "💼",
    kk: "Кәсіпкер",
    ru: "Предприниматель",
    roleKk: "Іскерлік пен сенімді жоғары қояды",
    roleRu: "Ценит деловое отношение и доверие",
    gradient: "from-cyan-500 to-teal-500",
  },

  grandmother: {
    emoji: "👵",
    kk: "Ақылды әже",
    ru: "Мудрая бабушка",
    roleKk: "Дәстүр мен халық сөзін жақсы біледі",
    roleRu: "Хорошо знает традиции и народную речь",
    gradient: "from-violet-500 to-fuchsia-500",
  },
};

const scenarios = [
  {
    id: 1,
    character: "teacher",
    phrase: "Қол ұшын беру",
    kk: {
      dialogue:
        "— Бекзат бүгін сабаққа дайындала алмай қалыпты. Оған қол ұшын берсек қалай қарайсың?",
      question:
        "Ұстаздың «қол ұшын берсек» дегені нені білдіреді?",
      answers: [
        {
          text: "Оған шын көңілмен көмектесу",
          type: "correct",
        },
        {
          text: "Оның қолынан ұстау",
          type: "literal",
        },
        {
          text: "Оны сабақтан шығарып жіберу",
          type: "wrong",
        },
      ],
      explanation:
        "«Қол ұшын беру» — қиын жағдайдағы адамға көмектесу, жәрдемдесу.",
    },
    ru: {
      dialogue:
        "— Бекзат не успел подготовиться к уроку. Как насчёт того, чтобы протянуть ему руку помощи?",
      question: "Что учитель имеет в виду?",
      answers: [
        {
          text: "Искренне помочь ему",
          type: "correct",
        },
        {
          text: "Взять его за руку",
          type: "literal",
        },
        {
          text: "Отправить его с урока",
          type: "wrong",
        },
      ],
      explanation:
        "«Қол ұшын беру» означает помочь человеку, оказавшемуся в трудной ситуации.",
    },
  },

  {
    id: 2,
    character: "teacher",
    phrase: "Қара қылды қақ жару",
    kk: {
      dialogue:
        "— Екі оқушының арасында дау туыпты. Мен қара қылды қақ жарып, екеуіне де әділ шешім шығарамын.",
      question: "Ұстаз қандай шешім қабылдамақ?",
      answers: [
        {
          text: "Ешкімді алаламай, әділ шешім шығару",
          type: "correct",
        },
        {
          text: "Қара шашты екіге бөлу",
          type: "literal",
        },
        {
          text: "Дауды елемей кету",
          type: "wrong",
        },
      ],
      explanation:
        "«Қара қылды қақ жару» — ешкімді жақтамай, өте әділ төрелік айту.",
    },
    ru: {
      dialogue:
        "— Между двумя учениками возник спор. Я должен рассудить их, разделив чёрный волос пополам.",
      question: "Что на самом деле имеет в виду учитель?",
      answers: [
        {
          text: "Вынести справедливое решение, никого не выделяя",
          type: "correct",
        },
        {
          text: "Разделить чёрный волос пополам",
          type: "literal",
        },
        {
          text: "Просто проигнорировать спор",
          type: "wrong",
        },
      ],
      explanation:
        "«Қара қылды қақ жару» — вынести очень справедливое решение.",
    },
  },

  {
    id: 3,
    character: "businessman",
    phrase: "Көз жұму",
    kk: {
      dialogue:
        "— Компаниядағы осы мәселені көріп тұрсам да, оған көз жұма алмаймын.",
      question: "Кәсіпкердің сөзі қандай мағынада қолданылған?",
      answers: [
        {
          text: "Кемшілікті көре тұра оған назар аудармау",
          type: "correct",
        },
        {
          text: "Көзін жұмып алу",
          type: "literal",
        },
        {
          text: "Ұйықтап қалу",
          type: "wrong",
        },
      ],
      explanation:
        "Бұл жерде «көз жұму» — кемшілікті көре тұра әдейі назар аудармау мағынасында.",
    },
    ru: {
      dialogue:
        "— Я вижу проблему в компании, но закрывать на неё глаза не могу.",
      question: "В каком значении употреблён фразеологизм?",
      answers: [
        {
          text: "Видеть недостаток, но намеренно не обращать внимания",
          type: "correct",
        },
        {
          text: "Просто закрыть глаза",
          type: "literal",
        },
        {
          text: "Заснуть",
          type: "wrong",
        },
      ],
      explanation:
        "Здесь «көз жұму» означает намеренно не обращать внимания на недостаток.",
    },
  },

  {
    id: 4,
    character: "businessman",
    phrase: "Ат құлағында ойнау",
    kk: {
      dialogue:
        "— Ол ат құлағында ойнайтын жігіт екен. Жылқы шаруашылығына жауапты етіп қойсақ болады.",
      question: "Кәсіпкер жігіттің қандай қабілетін айтып тұр?",
      answers: [
        {
          text: "Атқа өте шебер мініп, еркін шаба алатынын",
          type: "correct",
        },
        {
          text: "Аттың құлағымен ойнайтынын",
          type: "literal",
        },
        {
          text: "Жылқыдан қорқатынын",
          type: "wrong",
        },
      ],
      explanation:
        "«Ат құлағында ойнау» — атқа өте шебер мініп, еркін шабу.",
    },
    ru: {
      dialogue:
        "— Говорят, этот парень буквально играет на ушах лошади. Можно доверить ему конное хозяйство.",
      question: "Какую способность он имеет в виду?",
      answers: [
        {
          text: "Он очень искусно ездит верхом",
          type: "correct",
        },
        {
          text: "Он играет с ушами лошади",
          type: "literal",
        },
        {
          text: "Он боится лошадей",
          type: "wrong",
        },
      ],
      explanation:
        "«Ат құлағында ойнау» означает очень искусно ездить верхом.",
    },
  },

  {
    id: 5,
    character: "grandmother",
    phrase: "Қой аузынан шөп алмас",
    kk: {
      dialogue:
        "— Немерем өте жуас бала. Қой аузынан шөп алмас десем де болады.",
      question: "Әже немересін қалай сипаттап отыр?",
      answers: [
        {
          text: "Өте жуас, момын және зияны жоқ",
          type: "correct",
        },
        {
          text: "Қойдан шөп тартып ала алмайтын",
          type: "literal",
        },
        {
          text: "Өте ашуланшақ бала",
          type: "wrong",
        },
      ],
      explanation:
        "«Қой аузынан шөп алмас» — өте жуас, момын, ешкімге зияны жоқ адам.",
    },
    ru: {
      dialogue:
        "— Мой внук очень тихий мальчик. Даже сказать можно: изо рта овцы травинку не возьмёт.",
      question: "Как бабушка описывает внука?",
      answers: [
        {
          text: "Очень кроткий, тихий и безобидный",
          type: "correct",
        },
        {
          text: "Не может забрать траву у овцы",
          type: "literal",
        },
        {
          text: "Очень вспыльчивый ребёнок",
          type: "wrong",
        },
      ],
      explanation:
        "«Қой аузынан шөп алмас» означает очень кроткого и безобидного человека.",
    },
  },

  {
    id: 6,
    character: "grandmother",
    phrase: "Теріс бата беру",
    kk: {
      dialogue:
        "— Балам, үлкеннің батасын бағала. Теріс бата беру — жай айтылатын сөз емес.",
      question: "«Теріс бата беру» нені білдіреді?",
      answers: [
        {
          text: "Қатты ренжіп, батадан айыру, қарғыс айту",
          type: "correct",
        },
        {
          text: "Батаны кері бағытта оқу",
          type: "literal",
        },
        {
          text: "Қонаққа бата бермеу",
          type: "wrong",
        },
      ],
      explanation:
        "«Теріс бата беру» — қатты реніш білдіріп, адамды батадан айыру.",
    },
    ru: {
      dialogue:
        "— Сынок, цени благословение старших. Лишить человека благословения — не просто слова.",
      question: "Что означает «теріс бата беру»?",
      answers: [
        {
          text: "Из-за сильной обиды лишить человека благословения",
          type: "correct",
        },
        {
          text: "Прочитать бата в обратном направлении",
          type: "literal",
        },
        {
          text: "Просто не дать благословение гостю",
          type: "wrong",
        },
      ],
      explanation:
        "«Теріс бата беру» означает из-за сильной обиды лишить человека благословения.",
    },
  },
];

function getCorpusPhrase(phrase) {
  const normalized = phrase.toLowerCase().trim();

  return (
    phraseologisms.find(
      (item) =>
        item.phrase?.toLowerCase().trim() === normalized
    ) || null
  );
}

export default function DiplomatGame({
  language = "kk",
  onBack,
}) {
  const text = ui[language] || ui.kk;

  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [trust, setTrust] = useState(START_TRUST);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("playing");
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(
        localStorage.getItem(
          "qazfraze_diplomat_high_score"
        )
      ) || 0;
    } catch {
      return 0;
    }
  });

  const current = scenarios[roundIndex];

  const character = characters[current.character];

  const corpusEntry = useMemo(
    () => getCorpusPhrase(current.phrase),
    [current.phrase]
  );

  useEffect(() => {
    setFeedback(null);
  }, [roundIndex]);

  function chooseAnswer(answer) {
    if (feedback) return;

    setAnswered((value) => value + 1);

    if (answer.type === "correct") {
      const nextScore = score + 100;
      const nextTrust = Math.min(100, trust + 18);

      setScore(nextScore);
      setTrust(nextTrust);
      setCorrectAnswers((value) => value + 1);

      setFeedback({
        type: "correct",
        title: text.correct,
        points: 100,
        trustChange: 18,
        explanation:
          current[
            language === "ru" ? "ru" : "kk"
          ].answers.find(
            (item) => item.type === "correct"
          )?.text,
      });
    } else if (answer.type === "literal") {
      const nextScore = Math.max(0, score - 40);
      const nextTrust = Math.max(0, trust - 10);

      setScore(nextScore);
      setTrust(nextTrust);

      setFeedback({
        type: "literal",
        title: text.literal,
        points: -40,
        trustChange: -10,
        explanation:
          current[
            language === "ru" ? "ru" : "kk"
          ].explanation,
      });
    } else {
      const nextScore = Math.max(0, score - 60);
      const nextTrust = Math.max(0, trust - 15);

      setScore(nextScore);
      setTrust(nextTrust);

      setFeedback({
        type: "wrong",
        title: text.wrong,
        points: -60,
        trustChange: -15,
        explanation:
          current[
            language === "ru" ? "ru" : "kk"
          ].explanation,
      });
    }
  }

  function nextRound() {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      finishGame();
      return;
    }

    setRoundIndex((value) => value + 1);
  }

  function finishGame() {
    const finalScore = score;

    if (finalScore > bestScore) {
      try {
        localStorage.setItem(
          "qazfraze_diplomat_high_score",
          String(finalScore)
        );
      } catch {
        // ignore
      }

      setBestScore(finalScore);
    }

    setStatus("finished");
  }

  function restart() {
    setRoundIndex(0);
    setScore(0);
    setTrust(START_TRUST);
    setCorrectAnswers(0);
    setAnswered(0);
    setFeedback(null);
    setStatus("playing");
  }

  if (status === "finished") {
    const accuracy =
      Math.round(
        (correctAnswers / TOTAL_ROUNDS) * 100
      );

    const ending =
      trust >= 80
        ? "success"
        : trust >= 50
          ? "neutral"
          : "failure";

    const endingData = {
      success: {
        icon: "🤝",
        title: text.success,
        description: text.successText,
        box: "from-emerald-500 to-teal-500",
      },
      neutral: {
        icon: "🙂",
        title: text.neutral,
        description: text.neutralText,
        box: "from-indigo-500 to-blue-500",
      },
      failure: {
        icon: "💭",
        title: text.failure,
        description: text.failureText,
        box: "from-slate-600 to-slate-800",
      },
    }[ending];

    return (
      <>
        <style>{styles}</style>

        <div className="diplomat-fade min-h-[650px] rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-3 sm:p-5 md:p-8">
          <div className="mx-auto flex min-h-[600px] max-w-4xl items-center justify-center">
            <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(30,45,80,0.12)]">
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${endingData.box} px-6 py-12 text-center text-white md:px-12`}
              >
                <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                <div className="relative">
                  <div className="mb-4 text-6xl">
                    {endingData.icon}
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                    {text.finish}
                  </div>

                  <h2 className="mt-2 text-3xl font-black md:text-4xl">
                    {endingData.title}
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80">
                    {endingData.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-100 md:grid-cols-4">
                <ResultStat
                  label={text.finalScore}
                  value={score}
                />

                <ResultStat
                  label={text.finalTrust}
                  value={`${trust}%`}
                />

                <ResultStat
                  label={text.accuracy}
                  value={`${accuracy}%`}
                />

                <ResultStat
                  label={text.bestScore}
                  value={bestScore}
                />
              </div>

              <div className="border-t border-slate-100 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {text.trust}
                  </span>

                  <span className="text-sm font-black text-slate-800">
                    {trust}/100
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all"
                    style={{
                      width: `${trust}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6 pt-0 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-2xl bg-[#5f6cff] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#505ce5]"
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
    ((roundIndex + 1) / TOTAL_ROUNDS) * 100;

  const locale =
    current[language === "ru" ? "ru" : "kk"];

  return (
    <>
      <style>{styles}</style>

      <div className="diplomat-fade min-h-[650px] rounded-[32px] bg-[#f7f9fc] p-3 sm:p-4 md:p-7">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5f6cff] sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#5f6cff] shadow-[0_0_12px_rgba(95,108,255,0.7)]" />
                {text.eyebrow}
              </div>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {text.title}
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                {text.subtitle}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm sm:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {text.round}
              </div>

              <div className="mt-0.5 text-lg font-black text-slate-800">
                {roundIndex + 1}
                <span className="mx-1 text-slate-300">
                  /
                </span>
                {TOTAL_ROUNDS}
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mb-5">
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5f6cff] to-[#00c6ff] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <GameStat
              label={text.score}
              value={score}
              icon="✦"
            />

            <GameStat
              label={text.trust}
              value={`${trust}%`}
              icon="🤝"
              trust={trust}
            />

            <div className="col-span-2 sm:col-span-1">
              <GameStat
                label={text.round}
                value={`${roundIndex + 1}/${TOTAL_ROUNDS}`}
                icon="◆"
              />
            </div>
          </div>

          {/* CHARACTER + DIALOGUE */}
          <div className="mb-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(30,45,80,0.07)]">
            <div className="flex flex-col sm:flex-row">
              {/* CHARACTER */}
              <div
                className={`relative flex min-h-[190px] items-center justify-center overflow-hidden bg-gradient-to-br ${character.gradient} p-8 sm:w-[30%]`}
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                <div className="relative text-center text-white">
                  <div className="character-avatar mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/15 text-5xl shadow-2xl backdrop-blur">
                    {character.emoji}
                  </div>

                  <div className="mt-3 text-sm font-black">
                    {language === "ru"
                      ? character.ru
                      : character.kk}
                  </div>

                  <div className="mt-1 text-[10px] font-medium text-white/70">
                    {language === "ru"
                      ? character.roleRu
                      : character.roleKk}
                  </div>
                </div>
              </div>

              {/* DIALOGUE */}
              <div className="flex flex-1 flex-col justify-center p-5 sm:p-7 md:p-8">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-[#5f6cff]">
                    💬
                  </span>
                  {text.dialogue}
                </div>

                <div className="relative rounded-[22px] rounded-tl-md bg-slate-50 p-5">
                  <div className="absolute -left-2 top-4 h-4 w-4 rotate-45 bg-slate-50" />

                  <p className="relative text-base font-semibold leading-7 text-slate-700 sm:text-lg">
                    {locale.dialogue}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {text.question}
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm font-bold text-indigo-900">
                    {locale.question}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ANSWERS */}
          {!feedback ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {text.choose}
                </div>

                <div className="text-[10px] font-semibold text-slate-400">
                  {text.round} {roundIndex + 1}
                </div>
              </div>

              <div className="grid gap-3">
                {locale.answers.map((answer, index) => (
                  <button
                    key={`${current.id}-${index}`}
                    type="button"
                    onClick={() => chooseAnswer(answer)}
                    className="answer-button group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-md active:scale-[0.99]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-500 transition group-hover:bg-indigo-100 group-hover:text-[#5f6cff]">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="flex-1 text-sm font-bold leading-6 text-slate-700">
                      {answer.text}
                    </span>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#5f6cff]">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Feedback
              feedback={feedback}
              text={text}
              locale={locale}
              onNext={nextRound}
              isLast={
                roundIndex + 1 >= TOTAL_ROUNDS
              }
            />
          )}

          {/* CORPUS FOOTER */}
          {corpusEntry && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#5f6cff]">
                ◈
              </div>

              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {text.dialogue}
                </div>

                <div className="truncate text-xs font-bold text-slate-700">
                  {corpusEntry.phrase}
                </div>
              </div>

              <div className="ml-auto hidden rounded-lg bg-slate-50 px-2.5 py-1 text-[9px] font-bold text-slate-400 sm:block">
                150
              </div>
            </div>
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
  trust,
}) {
  let valueClass = "text-slate-800";

  if (trust !== undefined) {
    if (trust >= 80) {
      valueClass = "text-emerald-600";
    } else if (trust < 50) {
      valueClass = "text-red-500";
    } else {
      valueClass = "text-[#5f6cff]";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
        <span>{icon}</span>
        {label}
      </div>

      <div
        className={`mt-1 text-lg font-black sm:text-xl ${valueClass}`}
      >
        {value}
      </div>
    </div>
  );
}

function Feedback({
  feedback,
  text,
  locale,
  onNext,
  isLast,
}) {
  const correct = feedback.type === "correct";
  const literal = feedback.type === "literal";

  const boxClass = correct
    ? "border-emerald-200 bg-emerald-50"
    : literal
      ? "border-amber-200 bg-amber-50"
      : "border-red-200 bg-red-50";

  const titleClass = correct
    ? "text-emerald-700"
    : literal
      ? "text-amber-700"
      : "text-red-700";

  const buttonClass = correct
    ? "bg-emerald-600 hover:bg-emerald-700"
    : literal
      ? "bg-amber-600 hover:bg-amber-700"
      : "bg-red-600 hover:bg-red-700";

  return (
    <div
      className={`feedback-pop rounded-[26px] border p-5 sm:p-6 ${boxClass}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            className={`flex items-center gap-2 text-xl font-black ${titleClass}`}
          >
            <span className="text-2xl">
              {correct
                ? "✓"
                : literal
                  ? "!"
                  : "×"}
            </span>

            {feedback.title}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black ${
                feedback.points >= 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.points > 0 ? "+" : ""}
              {feedback.points} {text.points}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black ${
                feedback.trustChange > 0
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {feedback.trustChange > 0
                ? `+${feedback.trustChange}`
                : feedback.trustChange}{" "}
              {text.trust}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-white/70 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {text.correctMeaning}
            </div>

            <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
              {locale.explanation}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className={`shrink-0 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 ${buttonClass}`}
        >
          {isLast ? text.finish : text.next}
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}

function ResultStat({ label, value }) {
  return (
    <div className="bg-white px-4 py-5 text-center sm:py-6">
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
        {label}
      </div>

      <div className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">
        {value}
      </div>
    </div>
  );
}

const styles = `
  @keyframes diplomatFade {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes characterFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes feedbackPop {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .diplomat-fade {
    animation: diplomatFade 0.35s ease-out;
  }

  .character-avatar {
    animation: characterFloat 3.5s ease-in-out infinite;
  }

  .feedback-pop {
    animation: feedbackPop 0.28s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .diplomat-fade,
    .character-avatar,
    .feedback-pop {
      animation: none !important;
    }
  }
`;