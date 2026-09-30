import { useEffect, useState } from "react";
import {
  findPhrase,
  searchPhrases,
} from "./utils/phraseSearch";
import {
  getCachedAnalysis,
  saveCachedAnalysis,
} from "./utils/analysisCache";
import WordGame from "./components/games/WordGame";
import DiplomatGame from "./components/games/DiplomatGame";
import CorpusPage from "./components/CorpusPage";
import logo from "./assets/qazfraze-logo.svg";
import {
  ArrowUp,
  BookOpen,
  ChevronRight,
  Copy,
  Database,
  Download,
  Gamepad2,
  Image as ImageIcon,
  Info,
  Languages,
  Menu,
  MessageSquare,
  MessageSquarePlus,
  Maximize2,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
const initialChats = [
  { id: 1, title: "Қой аузынан шөп алмас" },
  { id: 2, title: "Ат құлағында ойнау" },
  { id: 3, title: "Қара қылды қақ жару" },
];

const translations = {
  kk: {
    newChat: "Жаңа зерттеу",
    recent: "Соңғы фразеологизмдер",
    tools: "Құралдар",
    game: "Ойын",
    image: "AI сурет",
    about: "Жоба туралы",
    phraseology: "Қазақ фразеологиясы",

    greeting: "Сәлем! Мен",
    platformBadge: "Қазақ фразеологиясын зерттеу платформасы",
    heroTitle: "Қазақ фразеологизмдерін AI көмегімен зерттеңіз",
    heroSubtitle:
      "Мағынасын, мәдени контекстін, аудармасын және қолданысын бір жерден талдаңыз.",
    statPhrases: "Фразеологизм",
    statGroups: "Зерттеу тобы",
    statLanguages: "Интерфейс тілі",
    statTool: "Талдау құралы",
    description:
      "Қазақ фразеологизмдерінің мағынасын, аудармасын, мәдени ерекшелігін және қолданылуын зерттеуге көмектесемін.",

    input:
      "Фразеологизмді немесе оның мағынасын жазыңыз...",

    assistant: "AI фразеологиялық көмекші",

    warning:
      "QAZFRAZE AI кейбір жауаптарды қате түсіндіруі мүмкін. Маңызды зерттеу нәтижелерін дереккөздермен салыстырыңыз.",

    enter: "Enter — жіберу",

    kazakh: "Қазақша",
    russian: "Русский",
    english: "English",

    culture: "Мәдениет",
    example: "Мысал",
    meaning: "Мағынасы",
    translation: "Перевод",
    englishTranslation: "Translation",

    culturalExplanation:
      "Ұлттық-мәдени түсіндірме",

    usageExample:
      "Қолданылу мысалы",

    researchResult: "Зерттеу нәтижесі",
    literalMeaning: "Сөзбе-сөз бейнесі",
    usage: "Қолданылуы",
    style: "Қолдану стилі",
    fact: "Қызықты дерек",
    saveImage: "Суретті сақтау",

    imageCreate: "AI сурет жасау",
    imageGenerating: "AI сурет жасап жатыр...",
    imageRegenerate: "Қайта жасау",
    imageOpen: "Суретті ашу",
    imageReady: "AI визуализациясы",
    imageEmpty: "Фразеологизмнің мағынасын визуалды түрде зерттеңіз.",
    imageError:
      "AI суретін жасау кезінде қате пайда болды.",

    share: "Бөлісу",
    copy: "Көшіру",

    foundInCorpus: "Корпустан табылды",
    group: "Тобы",
    culturalMark: "Мәдени белгісі",

    searchTitle:
      "Корпустан табылған фразеологизмдер",

    noResult:
      "Бұл фразеологизм 150 бірліктен тұратын зерттеу корпусынан табылмады.",

    demoAnswer:
      "Бұл сұрау әзірге демонстрациялық режимде өңделуде. Нақты AI талдауы API қосылғаннан кейін іске қосылады.",

    copied: "Мәтін көшірілді",

    imageSoon:
      "Алдымен чаттан фразеологизмді талдаңыз.",

    aboutSoon:
      "Жоба туралы ақпарат",

    /* ==================================================
       ABOUT MODAL
    ================================================== */

    aboutTitle: "Жоба туралы",

    aboutSubtitle:
      "Қазақ фразеологиясын зерттеуге арналған AI-платформа",

    aboutIntro:
      "QAZFRAZE AI — қазақ тіліндегі фразеологиялық бірліктерді зерттеуге, олардың мағынасын түсінуге, аударуға және мәдени контекстін ашуға көмектесетін интеллектуалды зерттеу платформасы.",

    aboutCorpusTitle:
      "Зерттеу корпусы",

    aboutCorpusText:
      "Платформа негізінде 150 қазақ фразеологизмінен тұратын зерттеу корпусы жатыр. Әрбір бірлік мағынасы, қолданылу жиілігі, зерттеу тобы және ұлттық-мәдени белгісі бойынша қарастырылады.",

    aboutFeaturesTitle:
      "Мүмкіндіктер",

    aboutFeature1:
      "AI талдау",

    aboutFeature1Text:
      "Фразеологизмнің мағынасын, қолданылуын және контекстін AI көмегімен талдау.",

    aboutFeature2:
      "Аударма",

    aboutFeature2Text:
      "Қазақша мағынаны орыс және ағылшын тілдеріне түсіндіру.",

    aboutFeature3:
      "AI визуализация",

    aboutFeature3Text:
      "Фразеологизмнің бейнелік және мәдени мағынасын иллюстрация арқылы көрсету.",

    aboutFeature4:
      "Ойын режимі",

    aboutFeature4Text:
      "Фразеологизмдерді интерактивті ойындар арқылы меңгеру.",

    aboutCultureTitle:
      "Мәдени контекст",

    aboutCultureText:
      "Қазақ фразеологизмдері халықтың тарихын, тұрмысын, салт-дәстүрін және дүниетанымын бейнелейді. QAZFRAZE AI осы мәдени қабатты түсіндіруге ерекше назар аударады.",

    aboutStats1:
      "Фразеологизм",

    aboutStats2:
      "Зерттеу тобы",

    aboutStats3:
      "Интерфейс тілі",

    aboutStats4:
      "AI құрал",

    aboutTechnology:
      "Технологиялар",

    aboutClose:
      "Жабу",

    aboutNotice:
      "Платформа зерттеу және білім беру мақсатында әзірленген. AI жауаптарын маңызды академиялық жұмыстарда бастапқы дереккөздермен салыстыру ұсынылады.",

    /* ==================================================
       CHAT SAVE NOTICE
    ================================================== */

    chatSaveNotice:
      "Назар аударыңыз: бұл чаттағы диалогтар әзірге автоматты түрде сақталмайды. Қажетті жауаптарды өзіңізге сақтау үшін «Көшіру» батырмасын пайдаланыңыз немесе скриншот жасаңыз. Жасалған AI суреттерін де бөлек сақтап алғаныңыз жөн.",

    
    chatSaveShort:
      "Бұл чаттағы диалогтар автоматты түрде сақталмайды. Қажетті ақпаратты көшіріп немесе скриншот жасап сақтап алыңыз.",

    suggestions: [
      "Ат құлағында ойнау",
      "Қара қылды қақ жару",
      "Қой аузынан шөп алмас",
      "Бір оқпен екі қоян ату",
    ],

    gameBack: "Чатқа оралу",

    gameTitle: "Фразеологиялық ойындар",
    gameSubtitle:
      "Қазақ фразеологизмдерін ойын арқылы меңгеріңіз.",

    game1Title: "Сөзбен жина",
    game1Description:
      "Фразеологизмді оның мағынасы бойынша дұрыс сөздерден жинаңыз.",
    game1Tag: "15 раунд",

    game2Title: "Фразео-Дипломат",
    game2Description:
      "Кейіпкерлердің сөзін дұрыс түсініп, сенім деңгейін арттырыңыз.",
    game2Tag: "Диалог",

    play: "Ойнау",

    gameNotReady:
      "Бұл ойын келесі кезеңде толық қосылады.",

    score: "Ұпай",
    combo: "Комбо",
    round: "Раунд",
  },

  ru: {
    newChat: "Новое исследование",
    recent: "Последние фразеологизмы",
    tools: "Инструменты",
    game: "Игра",
    image: "AI изображение",
    about: "О проекте",
    phraseology: "Казахская фразеология",

    greeting: "Здравствуйте! Я",
    platformBadge: "Платформа исследования казахской фразеологии",
    heroTitle: "Исследуйте казахские фразеологизмы с помощью AI",
    heroSubtitle:
      "Анализируйте значение, культурный контекст, перевод и употребление в одном месте.",
    statPhrases: "Фразеологизмов",
    statGroups: "Исследовательские группы",
    statLanguages: "Языка интерфейса",
    statTool: "Инструмент анализа",
    description:
      "Помогаю исследовать значение, перевод, культурные особенности и употребление казахских фразеологизмов.",

    input:
      "Введите фразеологизм или его значение...",

    assistant: "AI-помощник по фразеологии",

    warning:
      "QAZFRAZE AI может допускать ошибки в интерпретации. Важные результаты исследования следует проверять по источникам.",

    enter: "Enter — отправить",

    kazakh: "Қазақша",
    russian: "Русский",
    english: "English",

    culture: "Культура",
    example: "Пример",
    meaning: "Значение",
    translation: "Перевод",
    englishTranslation: "Перевод",

    culturalExplanation:
      "Национально-культурное объяснение",

    usageExample:
      "Пример употребления",

    researchResult: "Результат исследования",
    literalMeaning: "Буквальный образ",
    usage: "Употребление",
    style: "Стиль употребления",
    fact: "Интересный факт",
    saveImage: "Сохранить изображение",

    imageCreate: "Создать AI изображение",
    imageGenerating: "AI изображение создаётся...",
    imageRegenerate: "Создать заново",
    imageOpen: "Открыть изображение",
    imageReady: "AI визуализация",
    imageEmpty: "Исследуйте образное значение фразеологизма визуально.",
    imageError:
      "Во время создания AI изображения произошла ошибка.",

    share: "Поделиться",
    copy: "Копировать",

    foundInCorpus: "Найдено в корпусе",
    group: "Группа",
    culturalMark: "Культурная маркировка",

    searchTitle:
      "Фразеологизмы из корпуса",

    noResult:
      "Этот фразеологизм не найден в исследовательском корпусе из 150 единиц.",

    demoAnswer:
      "Этот запрос пока обрабатывается в демонстрационном режиме. Реальный AI-анализ будет подключён после интеграции API.",

    copied: "Текст скопирован",

    imageSoon:
      "Сначала выполните анализ фразеологизма в чате.",

    aboutSoon:
      "Информация о проекте",

    /* ==================================================
       ABOUT MODAL
    ================================================== */

    aboutTitle: "О проекте",

    aboutSubtitle:
      "AI-платформа для исследования казахской фразеологии",

    aboutIntro:
      "QAZFRAZE AI — интеллектуальная исследовательская платформа, которая помогает изучать казахские фразеологизмы, понимать их значение, переводить их и раскрывать культурный контекст.",

    aboutCorpusTitle:
      "Исследовательский корпус",

    aboutCorpusText:
      "В основе платформы находится корпус из 150 казахских фразеологических единиц. Каждая единица рассматривается с точки зрения значения, частотности, исследовательской группы и национально-культурной маркировки.",

    aboutFeaturesTitle:
      "Возможности",

    aboutFeature1:
      "AI-анализ",

    aboutFeature1Text:
      "Анализ значения, употребления и контекста фразеологизма с помощью AI.",

    aboutFeature2:
      "Перевод",

    aboutFeature2Text:
      "Объяснение казахского значения на русском и английском языках.",

    aboutFeature3:
      "AI-визуализация",

    aboutFeature3Text:
      "Визуальное представление образного и культурного значения фразеологизма.",

    aboutFeature4:
      "Игровой режим",

    aboutFeature4Text:
      "Изучение казахских фразеологизмов через интерактивные игровые механики.",

    aboutCultureTitle:
      "Культурный контекст",

    aboutCultureText:
      "Казахские фразеологизмы отражают историю, быт, традиции и мировоззрение народа. QAZFRAZE AI уделяет особое внимание объяснению этого культурного слоя.",

    aboutStats1:
      "Фразеологизмов",

    aboutStats2:
      "Исследовательские группы",

    aboutStats3:
      "Языка интерфейса",

    aboutStats4:
      "AI-инструмента",

    aboutTechnology:
      "Технологии",

    aboutClose:
      "Закрыть",

    aboutNotice:
      "Платформа разработана для исследовательских и образовательных целей. При использовании AI-ответов в важных академических работах рекомендуется сверять информацию с первичными источниками.",

    /* ==================================================
       CHAT SAVE NOTICE
    ================================================== */

    chatSaveNotice:
      "Обратите внимание: диалоги в этом чате пока не сохраняются автоматически. Чтобы сохранить нужный ответ, используйте кнопку «Копировать» или сделайте скриншот. Сгенерированные AI-изображения также рекомендуется сохранить отдельно.",

    conversationNotice:
      "Обратите внимание: диалоги в этом чате пока не сохраняются автоматически. Чтобы сохранить нужный ответ, используйте «Копировать» или сделайте скриншот. Сгенерированные AI-изображения также рекомендуется сохранить отдельно.",

    chatSaveShort:
      "Диалоги в этом чате автоматически не сохраняются. Нужную информацию можно скопировать или сохранить скриншотом.",

    suggestions: [
      "Ат құлағында ойнау",
      "Қара қылды қақ жару",
      "Қой аузынан шөп алмас",
      "Бір оқпен екі қоян ату",
    ],

    gameBack: "Вернуться в чат",

    gameTitle: "Фразеологические игры",
    gameSubtitle:
      "Изучайте казахские фразеологизмы через игру.",

    game1Title: "Собери словами",
    game1Description:
      "Соберите фразеологизм из правильных слов по его значению.",
    game1Tag: "15 раундов",

    game2Title: "Фразео-Дипломат",
    game2Description:
      "Правильно понимайте реплики персонажей и повышайте уровень доверия.",
    game2Tag: "Диалог",

    play: "Играть",

    gameNotReady:
      "Эта игра будет полностью подключена на следующем этапе.",

    score: "Очки",
    combo: "Комбо",
    round: "Раунд",
  },
};

const demoTranslations = {
  meaning:
    "Атқа өте шебер міну деген мағынаны білдіреді.",

  russian:
    "Очень искусно ездить на лошади.",

  english:
    "To be highly skilled at riding a horse.",

  culture:
    "Бұл фразеологизм қазақ халқының дәстүрлі жылқы мәдениетімен тығыз байланысты. Ат қазақ қоғамында көлік қана емес, әлеуметтік және мәдени құндылықтың маңызды бөлігі болған.",

  example:
    "Ол ат құлағында ойнайтын шабандоз ретінде бүкіл ауылға танымал болды.",
};

function normalizeAnalysisResult(
  result = {},
  phrase,
  corpusEntry
) {
  return {
    meaning:
      result.meaning ||
      corpusEntry?.meaning ||
      "AI мағына туралы жауап қайтара алмады.",
    literalMeaning:
      result.literalMeaning ||
      "—",
    russian: result.russian || "—",
    english: result.english || "—",
    culture:
      result.culture ||
      corpusEntry?.culturalMark ||
      "—",
    example: result.example || "—",
    usage:
      result.usage ||
      "—",
    style: result.style || "—",
    fact: result.fact || "—",
    phrase:
      corpusEntry?.phrase ||
      phrase,
    corpus: corpusEntry || null,
  };
}

function App() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [activeTab, setActiveTab] =
    useState("Қазақша");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [searchResults, setSearchResults] =
    useState([]);

  const [language, setLanguage] =
    useState("kk");

  const [activeGame, setActiveGame] =
    useState(null);
  const [activeSection, setActiveSection] =
    useState("chat");  
  const [corpusOpen, setCorpusOpen] =
    useState(false);
  const [generatedImage, setGeneratedImage] =
    useState(null);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [imageError, setImageError] =
    useState("");

  const [imageTargetPhrase, setImageTargetPhrase] =
    useState("");

  /* ==================================================
     ABOUT MODAL
  ================================================== */

  const [aboutOpen, setAboutOpen] =
    useState(false);

  const t = translations[language];

  const openAbout = () => {
    setAboutOpen(true);
    setSidebarOpen(false);
  };

  const closeAbout = () => {
    setAboutOpen(false);
  };

  const handleMessageChange = (value) => {
    setMessage(value);

    if (value.trim().length >= 2) {
      setSearchResults(
        searchPhrases(value)
      );
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (item) => {
    setMessage(item.phrase);
    setSearchResults([]);
  };

  const openGameHub = () => {
    setActiveGame("hub");
    setSidebarOpen(false);
  };
  const openCorpus = () => {
    setActiveSection("corpus");
    setActiveGame(null);
    setAboutOpen(false);
    setCorpusOpen(true);
    setSidebarOpen(false);
  };

  const closeCorpus = () => {
    setCorpusOpen(false);
    setActiveSection("chat");
  };

  const analyzeCorpusPhrase = (phrase) => {
    setCorpusOpen(false);
    setActiveSection("chat");
    sendMessage(phrase);
  };

  const generateCorpusImage = (item) => {
    setCorpusOpen(false);
    setActiveSection("chat");
    setActiveChat(item.phrase);
    setLoading(false);
    setGeneratedImage(null);
    setImageError("");
    setImageTargetPhrase(item.phrase);
    setMessages([
      {
        type: "user",
        text: item.phrase,
      },
      {
        type: "ai",
        text: item.meaning,
        data: {
          phrase: item.phrase,
          meaning: item.meaning,
          russian: "—",
          english: "—",
          culture: item.culturalMark,
          example: "—",
          corpus: item,
        },
      },
    ]);
    generatePhraseImage({
      phrase: item.phrase,
      meaning: item.meaning,
      culture: item.culturalMark,
      corpus: item,
    });
  };

  const openWordGame = () => {
    setActiveGame("word");
    setSidebarOpen(false);
  };

  const openDiplomatGame = () => {
    setActiveGame("diplomat");
    setSidebarOpen(false);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  /*
  ======================================================
  AI IMAGE GENERATION
  ======================================================
  */

  const generatePhraseImage = async (
    phraseData
  ) => {
    if (!phraseData?.phrase) {
      setImageError(t.imageSoon);
      return;
    }

    const targetPhrase =
      phraseData.phrase;

    setImageTargetPhrase(
      targetPhrase
    );

    setImageLoading(true);
    setImageError("");
    setGeneratedImage(null);

    try {
      const response = await fetch(
        "/api/generate-image",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            phrase:
              phraseData.phrase,

            meaning:
              phraseData.meaning ||
              phraseData.corpus?.meaning ||
              "",

            culture:
              phraseData.culture ||
              phraseData.corpus?.culturalMark ||
              "",

            language,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            t.imageError
        );
      }

      if (!data.image) {
        throw new Error(
          t.imageError
        );
      }

      setGeneratedImage({
        phrase:
          targetPhrase,
        image:
          data.image,
      });

    } catch (error) {
      console.error(
        "QAZFRAZE IMAGE ERROR:",
        error
      );

      setImageError(
        error?.message ||
          t.imageError
      );

    } finally {
      setImageLoading(false);
    }
  };

  const handleImageButton = (
    data
  ) => {
    if (!data) {
      setImageError(t.imageSoon);
      return;
    }

    generatePhraseImage({
      ...data,

      phrase:
        data.phrase ||
        data.corpus?.phrase ||
        activeChat,
    });
  };

  const openGeneratedImage = () => {
    if (!generatedImage?.image) {
      return;
    }

    const imageWindow =
      window.open("", "_blank");

    if (!imageWindow) {
      return;
    }

    const { document } = imageWindow;
    const image = document.createElement("img");

    document.title = generatedImage.phrase;
    document.body.style.cssText =
      "margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f8f9fc;font-family:Inter,Arial,sans-serif;";
    image.src = generatedImage.image;
    image.alt = generatedImage.phrase;
    image.style.cssText =
      "max-width:92vw;max-height:92vh;object-fit:contain;border-radius:20px;box-shadow:0 20px 60px rgba(30,45,80,0.15);";
    document.body.appendChild(image);

    imageWindow.focus();
  };

  const downloadGeneratedImage = () => {
    if (!generatedImage?.image) {
      return;
    }

    const link = document.createElement("a");
    link.href = generatedImage.image;
    link.download = `${generatedImage.phrase || "qazfraze"}.png`;
    link.target = "_blank";
    link.rel = "noopener";
    link.click();
  };

  /*
  ======================================================
  CHAT
  ======================================================
  */

  const sendMessage = async (phraseOverride) => {
    if (
      !(phraseOverride ?? message).trim() ||
      loading
    ) {
      return;
    }

    const text =
      (phraseOverride ?? message).trim();

    const corpusEntry =
      findPhrase(text);

    const cacheKeyPhrase =
      corpusEntry?.phrase ||
      text;

    const cachedResult =
      getCachedAnalysis(
        cacheKeyPhrase,
        language
      );

    setLoading(true);
    setActiveChat(text);
    setActiveGame(null);
    setSearchResults([]);

    setGeneratedImage(null);
    setImageError("");
    setImageTargetPhrase("");

    setMessages([
      {
        type: "user",
        text,
      },
    ]);

    setMessage("");
    setSidebarOpen(false);

    if (cachedResult) {
      console.log(
        "QAZFRAZE CACHE HIT:",
        cacheKeyPhrase
      );

      const answer = normalizeAnalysisResult(
        cachedResult,
        text,
        corpusEntry
      );

      setMessages([
        {
          type: "user",
          text,
        },

        {
          type: "ai",
          text: answer.meaning,
          data: answer,
          cached: true,
        },
      ]);

      setLoading(false);

      return;
    }

    console.log(
      "QAZFRAZE CACHE MISS:",
      cacheKeyPhrase
    );

    try {
      const response =
        await fetch(
          "/api/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              phrase: text,

              language,

              context: corpusEntry
                ? `
Фразеологизм: ${corpusEntry.phrase}
Сөздік мағынасы: ${corpusEntry.meaning}
Тобы: ${corpusEntry.group}
Мәдени белгісі: ${corpusEntry.culturalMark}
Жиілігі: ${corpusEntry.frequency}
`
                : "Бұл фразеологизм 150 бірліктен тұратын ішкі зерттеу корпусынан табылмады.",
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "AI сұранысын орындау мүмкін болмады."
        );
      }

      const aiResult =
        data.result;

      saveCachedAnalysis(
        cacheKeyPhrase,
        language,
        aiResult
      );

      console.log(
        "QAZFRAZE CACHE SAVED:",
        cacheKeyPhrase
      );

      const answer = normalizeAnalysisResult(
        aiResult,
        text,
        corpusEntry
      );

      setMessages([
        {
          type: "user",
          text,
        },

        {
          type: "ai",
          text: answer.meaning,
          data: answer,
          cached: false,
        },
      ]);

    } catch (error) {
      console.error(
        "QAZFRAZE AI ERROR:",
        error
      );

      setMessages([
        {
          type: "user",
          text,
        },

        {
          type: "ai",

          text: `AI-мен байланысу кезінде қате пайда болды: ${
            error.message ||
            "Белгісіз қате"
          }`,

          data: {
            meaning:
              "AI-мен байланысу кезінде қате пайда болды.",

            russian: "—",

            english: "—",

            culture:
              corpusEntry?.culturalMark ||
              "—",

            example: "—",

            phrase:
              corpusEntry?.phrase ||
              text,

            corpus:
              corpusEntry ||
              null,
          },
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveSection("chat");
    setActiveGame(null);
    setActiveChat(null);
    setMessages([]);
    setMessage("");
    setSearchResults([]);
    

    setGeneratedImage(null);
    setImageError("");
    setImageTargetPhrase("");

    setSidebarOpen(false);
  };

  const selectChat = (chat) => {
    setActiveGame(null);

    const corpusEntry =
      findPhrase(chat.title);

    setActiveChat(chat.title);
    setSearchResults([]);
    setSidebarOpen(false);

    setGeneratedImage(null);
    setImageError("");
    setImageTargetPhrase("");

    const answer = corpusEntry
      ? {
          phrase: chat.title,

          meaning:
            corpusEntry.meaning,

          russian:
            chat.title ===
            "Ат құлағында ойнау"
              ? demoTranslations.russian
              : "Орысша аудармасы AI арқылы анықталады.",

          english:
            chat.title ===
            "Ат құлағында ойнау"
              ? demoTranslations.english
              : "English translation will be generated by AI.",

          culture:
            corpusEntry.culturalMark,

          example:
            chat.title ===
            "Ат құлағында ойнау"
              ? demoTranslations.example
              : "Бұл фразеологизмді қолдану мысалы AI арқылы жасалады.",

          corpus:
            corpusEntry,
        }
      : {
          phrase: chat.title,

          ...demoTranslations,

          corpus: null,
        };

    setMessages([
      {
        type: "user",
        text: chat.title,
      },

      {
        type: "ai",
        text: answer.meaning,
        data: answer,
      },
    ]);
  };

  const handleCopy = async (
    data
  ) => {
    const text = [
      data.meaning,
      data.literalMeaning,
      data.usage,
      data.russian,
      data.english,
      data.culture,
      data.example,
      data.style,
      data.fact,
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(
        text
      );

      alert(t.copied);

    } catch {
      alert(t.copied);
    }
  };

  const handleShare = async (data) => {
    if (!navigator.share) {
      await handleCopy(data);
      return;
    }

    try {
      await navigator.share({
        title: "QAZFRAZE AI",
        text: data.meaning,
      });
    } catch {
      // Sharing can be cancelled by the user.
    }
  };

  return (
    <div className="flex h-screen min-h-[100dvh] overflow-hidden bg-[#f4f7fb] text-[#172033]">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[min(84vw,280px)] flex-col
          border-r border-slate-200/80 bg-[#f7f9fc]
          transition-transform duration-300
          md:relative md:w-[246px] md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200/70 px-4 md:h-[76px]">

          <div className="flex min-w-0 items-center gap-2.5">

            <img src={logo} alt="QAZFRAZE AI" className="h-9 w-9 shrink-0" />

            <div className="min-w-0">

              <div className="truncate text-[14px] font-black tracking-tight text-slate-900">
                QAZFRAZE{" "}
                <span className="text-[#5f6cff]">
                  AI
                </span>
              </div>

              <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Research platform
              </div>

            </div>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

        </div>

        {/* NEW CHAT */}

        <div className="px-3.5 pt-4">

          <button
            onClick={startNewChat}
            className="flex w-full items-center gap-2.5 rounded-xl border border-indigo-200/80 bg-white px-3 py-3 text-[12px] font-bold text-slate-700 shadow-[0_8px_20px_rgba(30,45,80,0.05)] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
          >
            <MessageSquarePlus size={17} className="text-[#5f6cff]" />

            {t.newChat}
          </button>

        </div>

        {/* SIDEBAR CONTENT */}

        <div className="mt-5 flex-1 overflow-y-auto px-3.5">

          {/* RECENT */}

          <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {t.recent}
          </div>

          <div className="space-y-0.5">

            {initialChats.map(
              (chat) => (
                <button
                  key={chat.id}
                  onClick={() =>
                    selectChat(chat)
                  }
                  className={`
                    flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2.5 text-left text-[12px] transition
                    ${
                      activeChat ===
                      chat.title
                        ? "border-indigo-100 bg-indigo-50 font-semibold text-[#5261ee]"
                        : "text-slate-600 hover:border-slate-200 hover:bg-white"
                    }
                  `}
                >

                  <MessageSquare size={15} className="shrink-0 text-slate-400" />

                  <span className="truncate">
                    {chat.title}
                  </span>

                </button>
              )
            )}

          </div>
          {/* RESEARCH CORPUS */}

<button
  onClick={openCorpus}
  className={`
    group flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2.5 text-[12px] font-semibold transition
    ${
      activeSection === "corpus"
        ? "border-indigo-100 bg-indigo-50 text-[#5f6cff]"
        : "text-slate-600 hover:border-slate-200 hover:bg-white"
    }
  `}
>
  <span
    className={`
    flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] transition
      ${
        activeSection === "corpus"
          ? "bg-[#5f6cff] text-white"
          : "bg-indigo-50 text-[#5f6cff] group-hover:bg-[#5f6cff] group-hover:text-white"
      }
    `}
  >
    <Database size={15} />
  </span>

  <span>
    {language === "kk"
      ? "Зерттеу корпусы"
      : "Исследовательский корпус"}
  </span>

  <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[7px] font-bold text-slate-400 group-hover:bg-white group-hover:text-[#5f6cff]">
    150
  </span>
</button>
          {/* TOOLS */}

          <div className="mt-5 border-t border-slate-200/80 pt-4">

            <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {t.tools}
            </div>

            {/* GAME */}

            <button
              onClick={openGameHub}
              className={`
                group flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2.5 text-[12px] font-semibold transition
                ${
                  activeGame
                    ? "border-indigo-100 bg-indigo-50 text-[#5f6cff]"
                    : "text-slate-600 hover:border-slate-200 hover:bg-white"
                }
              `}
            >

              <span
                  className={`
                  flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] transition
                  ${
                    activeGame
                      ? "bg-[#5f6cff] text-white"
                      : "bg-indigo-50 text-[#5f6cff] group-hover:bg-[#5f6cff] group-hover:text-white"
                  }
                `}
              >
                <Gamepad2 size={15} />
              </span>

              <span>
                {t.game}
              </span>

              <span className="ml-auto text-[7px] font-bold uppercase tracking-wider text-[#5f6cff]">
                Play
              </span>

            </button>

            {/* AI IMAGE */}

            <button
              onClick={() => {
                const lastAiMessage =
                  [...messages]
                    .reverse()
                    .find(
                      (msg) =>
                        msg.type ===
                        "ai"
                    );

                if (
                  lastAiMessage?.data
                ) {
                  handleImageButton(
                    lastAiMessage.data
                  );
                } else {
                  setImageError(
                    t.imageSoon
                  );
                }
              }}
              className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-semibold text-slate-600 transition hover:bg-white"
            >

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100">
                <ImageIcon size={15} />
              </span>

              {t.image}

            </button>

            {/* ABOUT */}

            <button
              onClick={openAbout}
              className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2.5 text-[12px] font-semibold text-slate-600 transition hover:border-slate-200 hover:bg-white"
            >

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Info size={15} />
              </span>

              {t.about}

            </button>

          </div>

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="border-t border-slate-200/80 p-3">

          <div className="flex items-center gap-2.5 rounded-xl bg-white/60 px-2.5 py-2.5">

            <img src={logo} alt="" className="h-7 w-7 shrink-0" />

            <div className="min-w-0">

              <div className="text-[12px] font-bold">
                QAZFRAZE AI
              </div>

              <div className="truncate text-[9px] text-slate-400">
                {t.phraseology}
              </div>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="relative flex min-w-0 flex-1 flex-col">

        {/* TOP BAR */}

        <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/90 px-3 backdrop-blur-xl sm:px-5">

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-indigo-50 hover:text-[#5f6cff] md:hidden"
              aria-label="Menu"
            >
              <Menu size={19} />
            </button>

            <div className="hidden items-center gap-2.5 text-[11px] font-bold text-slate-500 md:flex">

              <span
                className={`h-2 w-2 rounded-full ${
                  activeGame
                    ? "bg-indigo-400"
                    : "bg-emerald-400"
                }`}
              />

              <span>{activeGame ? t.game : t.platformBadge}</span>

            </div>

          </div>

          <div className="ml-auto flex items-center gap-1.5">

            {/* LANGUAGE */}

            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-1.5 py-1.5 text-slate-400 sm:px-2">
              <Languages size={15} />

              <button
                onClick={() => {
                  setLanguage("kk");
                  setActiveTab(
                    "Қазақша"
                  );

                  setSearchResults(
                    message.trim()
                      .length >= 2
                      ? searchPhrases(
                          message
                        )
                      : []
                  );
                }}
                className={`
                  rounded-lg px-2 py-1 text-[9px] font-bold transition
                  ${
                    language === "kk"
                      ? "bg-white text-[#5f6cff] shadow-sm"
                      : "text-slate-400"
                  }
                `}
              >
                KZ
              </button>

              <button
                onClick={() => {
                  setLanguage("ru");
                  setActiveTab(
                    "Русский"
                  );

                  setSearchResults(
                    message.trim()
                      .length >= 2
                      ? searchPhrases(
                          message
                        )
                      : []
                  );
                }}
                className={`
                  rounded-lg px-2 py-1 text-[9px] font-bold transition
                  ${
                    language === "ru"
                      ? "bg-white text-[#5f6cff] shadow-sm"
                      : "text-slate-400"
                  }
                `}
              >
                RU
              </button>

            </div>

            {/* WORKING ABOUT BUTTON */}

            <button
              onClick={openAbout}
              className="hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-bold text-slate-500 transition hover:bg-indigo-50 hover:text-[#5f6cff] sm:flex"
            >
              <Info size={15} />
              {t.about}
            </button>

            <img src={logo} alt="QAZFRAZE AI" className="h-8 w-8 rounded-xl md:hidden" />

          </div>

        </header>

        {/* CONTENT */}

        {activeGame ? (

          <GameArea
            activeGame={activeGame}
            language={language}
            t={t}
            onOpenWordGame={
              openWordGame
            }
            onOpenDiplomatGame={
              openDiplomatGame
            }
            onBack={closeGame}
          />

        ) : (

          <>

            {/* CHAT AREA */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

              {!activeChat ? (

                <div className="flex min-h-full items-start justify-center px-3 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-12 lg:pt-16">

                  <div className="w-full max-w-6xl">

                    {/* HERO */}

                    <div className="mb-7 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">

                      <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f6cff] shadow-sm">
                          <Sparkles size={13} />
                          {t.platformBadge}
                        </div>

                        <h1 className="max-w-3xl text-[30px] font-black leading-[1.08] tracking-[-0.04em] text-[#172033] sm:text-4xl lg:text-[46px]">
                          {t.heroTitle}
                        </h1>

                        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-[15px]">
                          {t.heroSubtitle}
                        </p>
                      </div>

                      <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-white bg-white/70 p-2 shadow-[0_12px_34px_rgba(30,45,80,0.06)] lg:flex">
                        <img src={logo} alt="QAZFRAZE AI" className="h-14 w-14" />
                        <div className="pr-3">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            QAZFRAZE AI
                          </div>
                          <div className="mt-1 text-xs font-bold text-slate-700">
                            {t.phraseology}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* SUGGESTIONS */}

                    <div className="mb-2.5 grid grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:gap-2.5">

                      {t.suggestions.map(
                        (item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setMessage(
                                item
                              );

                              setSearchResults(
                                []
                              );
                            }}
                            className="group flex min-h-[50px] items-center rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600 shadow-[0_8px_22px_rgba(30,45,80,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 sm:min-h-[54px] sm:px-3.5 sm:text-[13px]"
                          >

                            <Sparkles size={15} className="mr-2 shrink-0 text-[#5f6cff] transition group-hover:scale-110" />

                            <span className="min-w-0 truncate">
                              {item}
                            </span>

                          </button>
                        )
                      )}

                    </div>

                    <ChatInput
                      message={message}
                      setMessage={
                        handleMessageChange
                      }
                      sendMessage={
                        sendMessage
                      }
                      loading={loading}
                      placeholder={
                        t.input
                      }
                      assistant={
                        t.assistant
                      }
                      searchResults={
                        searchResults
                      }
                      onSelectSearchResult={
                        handleSearchSelect
                      }
                      searchTitle={
                        t.searchTitle
                      }
                    />

                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <HomeStat value="150" label={t.statPhrases} />
                      <HomeStat value="3" label={t.statGroups} />
                      <HomeStat value="2" label={t.statLanguages} />
                      <HomeStat value="AI" label={t.statTool} />
                    </div>

                    <p className="mx-auto mt-2 max-w-2xl px-2 text-center text-[8px] leading-4 text-slate-400 sm:text-[9px]">
                      {t.warning}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="mx-auto w-full max-w-[1040px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7">

                  {messages.map(
                    (msg, index) => {

                      const messagePhrase =
                        msg.data?.phrase ||
                        activeChat;

                      const isImageTarget =
                        imageTargetPhrase ===
                        messagePhrase;

                      const showImagePanel =
                        msg.data &&
                        (isImageTarget ||
                          !imageTargetPhrase);

                      return (
                        <div
                          key={index}
                          className="mb-5 sm:mb-6"
                        >

                          {msg.type ===
                          "user" ? (

                            <div className="flex justify-end">

                              <div className="max-w-[92%] rounded-2xl rounded-br-md bg-[#f0f2f7] px-3.5 py-2.5 text-[12px] font-medium leading-5 text-slate-700 sm:max-w-[78%] sm:px-4 sm:py-3 sm:text-sm">
                                {msg.text}
                              </div>

                            </div>

                          ) : (

                            <div className="flex gap-2.5 sm:gap-3">

                              <img src={logo} alt="QAZFRAZE AI" className="h-9 w-9 shrink-0" />

                              <div className="min-w-0 flex-1">

                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-indigo-100 bg-white p-3 shadow-[0_8px_26px_rgba(30,45,80,0.05)] sm:p-4">
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <Sparkles size={16} className="shrink-0 text-[#5f6cff]" />
                                    <div className="min-w-0">
                                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5f6cff]">
                                        {t.researchResult}
                                      </div>
                                      <div className="mt-1 truncate text-[13px] font-black text-slate-800 sm:text-sm">
                                        {messagePhrase}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-[#5f6cff]">
                                    AI
                                  </span>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-[12px] leading-5.5 text-slate-700 shadow-[0_8px_24px_rgba(30,45,80,0.035)] sm:p-4 sm:text-sm sm:leading-6.5">
                                  <div className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                    {t.meaning}
                                  </div>
                                  {msg.text}
                                </div>

                                {/* CORPUS */}

                                {msg.data?.corpus && (

                                  <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">

                                    <div className="mb-2 flex flex-wrap items-center gap-1.5">

                                      <span className="rounded-md bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#5f6cff] shadow-sm">
                                        {
                                          t.foundInCorpus
                                        }
                                      </span>

                                      <span className="rounded-md bg-white px-2 py-1 text-[8px] font-semibold text-slate-500 shadow-sm">
                                        {t.group}:{" "}
                                        {
                                          msg.data
                                            .corpus
                                            .group
                                        }
                                      </span>

                                    </div>

                                    <div className="grid gap-2.5 sm:grid-cols-2">

                                      <div>

                                        <div className="mb-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                          {
                                            t.meaning
                                          }
                                        </div>

                                        <div className="text-[11px] leading-5 text-slate-700 sm:text-[12px]">
                                          {
                                            msg.data
                                              .corpus
                                              .meaning
                                          }
                                        </div>

                                      </div>

                                      <div>

                                        <div className="mb-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                          {
                                            t.culturalMark
                                          }
                                        </div>

                                        <div className="text-[11px] leading-5 text-slate-700 sm:text-[12px]">
                                          {
                                            msg.data
                                              .corpus
                                              .culturalMark
                                          }
                                        </div>

                                      </div>

                                    </div>

                                  </div>
                                )}

                                {/* TABS */}

                                <div className="mt-4 flex gap-0.5 overflow-x-auto border-b border-slate-200 scrollbar-none">

                                  {[
                                    t.kazakh,
                                    t.russian,
                                    t.english,
                                    t.culture,
                                    t.example,
                                  ].map(
                                    (tab) => (

                                      <button
                                        key={tab}
                                        onClick={() =>
                                          setActiveTab(
                                            tab
                                          )
                                        }
                                        className={`
                                          whitespace-nowrap px-2.5 py-2 text-[9px] font-bold transition sm:px-3 sm:text-[10px]
                                          ${
                                            activeTab ===
                                            tab
                                              ? "border-b-2 border-[#5f6cff] text-[#5f6cff]"
                                              : "text-slate-400 hover:text-slate-600"
                                          }
                                        `}
                                      >
                                        {tab}
                                      </button>

                                    )
                                  )}

                                </div>

                                {/* TAB CONTENT */}

                                <div className="mt-2.5 rounded-xl border border-slate-200 bg-[#fafbfe] p-3 sm:p-3.5">

                                  {activeTab ===
                                    t.kazakh && (
                                    <TabContent
                                      title={
                                        t.meaning
                                      }
                                      content={
                                        msg.data
                                          .meaning
                                      }
                                    />
                                  )}

                                  {activeTab ===
                                    t.russian && (
                                    <TabContent
                                      title={
                                        t.translation
                                      }
                                      content={
                                        msg.data
                                          .russian
                                      }
                                    />
                                  )}

                                  {activeTab ===
                                    t.english && (
                                    <TabContent
                                      title={
                                        t.englishTranslation
                                      }
                                      content={
                                        msg.data
                                          .english
                                      }
                                    />
                                  )}

                                  {activeTab ===
                                    t.culture && (
                                    <TabContent
                                      title={
                                        t.culturalExplanation
                                      }
                                      content={
                                        msg.data
                                          .culture
                                      }
                                    />
                                  )}

                                  {activeTab ===
                                    t.example && (
                                    <TabContent
                                      title={
                                        t.usageExample
                                      }
                                      content={`«${msg.data.example}»`}
                                      italic
                                    />
                                  )}

                                </div>

                                <ResearchResult
                                  data={msg.data}
                                  t={t}
                                />

                                {/* AI IMAGE */}

                                {showImagePanel && (

                                    <div className="mt-3">

                                      {!imageLoading &&
                                        !imageError &&
                                        !generatedImage && (
                                          <div className="overflow-hidden rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/35">
                                            <div className="flex min-h-[150px] flex-col items-center justify-center px-5 py-7 text-center">
                                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                                                <ImageIcon size={19} />
                                              </div>
                                              <div className="text-[11px] font-bold text-slate-700 sm:text-[12px]">
                                                {t.imageCreate}
                                              </div>
                                              <div className="mt-1 max-w-sm text-[9px] leading-4 text-slate-500 sm:text-[10px]">
                                                {t.imageEmpty}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                      {imageLoading && (
                                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 sm:aspect-[16/8]">

                                            <div className="px-4 text-center">

                                              <div className="mx-auto mb-2.5 flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-indigo-50">
                                                <img src={logo} alt="" className="h-8 w-8" />
                                              </div>

                                              <div className="text-[12px] font-bold text-slate-700">
                                                {
                                                  t.imageGenerating
                                                }
                                              </div>

                                              <div className="mt-1 text-[9px] text-slate-400">
                                                AI визуализация
                                              </div>

                                            </div>

                                          </div>

                                        </div>
                                      )}

                                      {imageError && (
                                        <div className="rounded-xl border border-red-100 bg-red-50 p-3">

                                          <div className="text-[11px] font-bold text-red-600">
                                            {t.imageError}
                                          </div>

                                          <div className="mt-1 text-[10px] leading-5 text-red-500">
                                            {
                                              imageError
                                            }
                                          </div>

                                        </div>
                                      )}

                                      {generatedImage &&
                                        generatedImage.phrase ===
                                          messagePhrase && (

                                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(30,45,80,0.07)]">

                                            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">

                                              <div className="min-w-0">

                                                <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#5f6cff]">
                                                  {
                                                    t.imageReady
                                                  }
                                                </div>

                                                <div className="mt-0.5 truncate text-[11px] font-bold text-slate-700">
                                                  {
                                                    generatedImage.phrase
                                                  }
                                                </div>

                                              </div>

                                              <div className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                                                <ImageIcon size={14} />
                                              </div>

                                            </div>

                                            <div className="bg-slate-50 p-1.5">

                                              <img
                                                src={
                                                  generatedImage.image
                                                }
                                                alt={
                                                  generatedImage.phrase
                                                }
                                                className="w-full rounded-xl object-cover"
                                              />

                                            </div>

                                            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 p-2.5">

                                              <button
                                                onClick={() =>
                                                  generatePhraseImage(
                                                    msg.data
                                                  )
                                                }
                                                disabled={
                                                  imageLoading
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff] disabled:cursor-not-allowed disabled:opacity-50"
                                              >
                                                <RefreshCw size={12} />{" "}
                                                {
                                                  t.imageRegenerate
                                                }
                                              </button>

                                              <button
                                                onClick={
                                                  openGeneratedImage
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff]"
                                              >
                                                <Maximize2 size={12} />{" "}
                                                {
                                                  t.imageOpen
                                                }
                                              </button>

                                              <button
                                                onClick={
                                                  downloadGeneratedImage
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff]"
                                              >
                                                <Download size={12} />
                                                {t.saveImage}
                                              </button>

                                            </div>

                                          </div>
                                        )}

                                    </div>
                                  )}

                                {/* ACTIONS */}

                                <div className="mt-2.5 flex flex-wrap gap-1.5">

                                  <button
                                    onClick={() =>
                                      handleImageButton(
                                        msg.data
                                      )
                                    }
                                    disabled={
                                      imageLoading
                                    }
                                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[9px] font-bold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[10px]"
                                  >
                                    {imageLoading &&
                                    imageTargetPhrase ===
                                      messagePhrase
                                      ? t.imageGenerating
                                      : t.imageCreate}
                                    {imageLoading &&
                                    imageTargetPhrase ===
                                      messagePhrase ? (
                                      <RefreshCw size={13} className="animate-spin" />
                                    ) : (
                                      <ImageIcon size={13} />
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        msg.data
                                      )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 sm:text-[10px]"
                                  >
                                    <Copy size={13} />
                                    {t.copy}
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleShare(
                                        msg.data
                                      )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 sm:text-[10px]"
                                  >
                                    <Share2 size={13} />
                                    {t.share}
                                  </button>

                                </div>

                                

                                {/* ==================================================
                                   CHAT SAVE NOTICE
                                ================================================== */}

                                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5">

                                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-bold text-amber-500 shadow-sm">
                                    i
                                  </div>

                                  <p className="text-[9px] leading-4.5 text-amber-700 sm:text-[10px] sm:leading-5">
                                    {t.chatSaveNotice}
                                  </p>

                                </div>

                              </div>

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                  {/* LOADING */}

                  {loading && (

                    <div className="flex gap-2.5 sm:gap-3">

                      <img src={logo} alt="QAZFRAZE AI" className="h-9 w-9 shrink-0" />

                      <div>

                        <div className="mb-1.5 text-[12px] font-black sm:text-[13px]">
                          QAZFRAZE AI
                        </div>

                        <div className="flex gap-1">

                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />

                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />

                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* ACTIVE CHAT INPUT */}

            {activeChat && (

              <div className="shrink-0 border-t border-slate-100 bg-white px-2.5 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 sm:px-4">

                <div className="mx-auto max-w-[1040px]">

                  <ChatInput
                    message={message}
                    setMessage={
                      handleMessageChange
                    }
                    sendMessage={
                      sendMessage
                    }
                    loading={loading}
                    placeholder={
                      t.input
                    }
                    assistant={
                      t.assistant
                    }
                    searchResults={
                      searchResults
                    }
                    onSelectSearchResult={
                      handleSearchSelect
                    }
                    searchTitle={
                      t.searchTitle
                    }
                  />

                  <p className="mt-1.5 hidden text-center text-[8px] text-slate-400 sm:block">
                    {t.enter}
                  </p>

                </div>

              </div>
            )}

          </>
        )}

      </main>

      {/* ==================================================
          ABOUT MODAL
      ================================================== */}

      {aboutOpen && (
        <AboutModal
          t={t}
          language={language}
          onOpenCorpus={openCorpus}
          onClose={closeAbout}
        />
      )}

      {corpusOpen && (
        <div
          className="fixed inset-0 z-[110] flex min-w-0 items-center justify-center overflow-x-hidden overflow-y-auto bg-slate-950/40 p-2 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCorpus();
            }
          }}
        >
          <div className="flex max-h-[94dvh] min-w-0 w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(20,30,70,0.25)]">
            <CorpusPage
              language={language}
              onBack={closeCorpus}
              onAnalyze={analyzeCorpusPhrase}
              onGenerateImage={generateCorpusImage}
            />
          </div>
        </div>
      )}

    </div>
  );
}

/*
========================================================
ABOUT MODAL
========================================================
*/

function AboutModal({
  t,
  language,
  onOpenCorpus,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="relative flex max-h-[92dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(20,30,70,0.25)]">

        {/* MODAL HEADER */}

        <div className="relative shrink-0 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6 sm:py-5">

          <div className="relative flex items-start justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <img src={logo} alt="QAZFRAZE AI" className="h-11 w-11 shrink-0" />

              <div className="min-w-0">

                <div className="text-[16px] font-black tracking-tight text-[#172033] sm:text-lg">
                  QAZFRAZE{" "}
                  <span className="text-[#5f6cff]">
                    AI
                  </span>
                </div>

                <div className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:text-[11px]">
                  {t.aboutSubtitle}
                </div>

              </div>

            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={
                language === "kk"
                  ? "Жабу"
                  : "Закрыть"
              }
            >
              <X size={18} />
            </button>

          </div>

        </div>

        {/* MODAL CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">

            {/* INTRO */}

            <section>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#5f6cff]" />

                <h2 className="text-[13px] font-black text-[#172033] sm:text-sm">
                  {t.aboutTitle}
                </h2>

              </div>

              <p className="text-[11px] leading-5.5 text-slate-600 sm:text-[13px] sm:leading-6">
                {t.aboutIntro}
              </p>

            </section>

            {/* STATS */}

            <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              <AboutStat
                value="150"
                label={t.aboutStats1}
              />

              <AboutStat
                value="3"
                label={t.aboutStats2}
              />

              <AboutStat
                value="2"
                label={t.aboutStats3}
              />

              <AboutStat
                value="AI"
                label={t.aboutStats4}
              />

            </section>

            {/* CORPUS */}

            <button
              type="button"
              onClick={onOpenCorpus}
              className="group w-full rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-4 text-left transition hover:border-indigo-200 hover:shadow-[0_10px_30px_rgba(95,108,255,0.1)] sm:p-5"
            >

              <div className="mb-2.5 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm text-[#5f6cff] shadow-sm">
                  <Database size={17} />
                </div>

                <h2 className="text-[13px] font-black text-[#172033] sm:text-sm">
                  {t.aboutCorpusTitle}
                </h2>

              </div>

              <p className="text-[10px] leading-5 text-slate-600 sm:text-[12px] sm:leading-6">
                {t.aboutCorpusText}
              </p>

              <div className="mt-3 text-[10px] font-bold text-[#5f6cff] transition group-hover:text-cyan-600 sm:text-[11px]">
                {language === "kk"
                  ? "Корпусты ашу"
                  : "Открыть корпус"}
                <ChevronRight size={14} />
              </div>

            </button>

            {/* FEATURES */}

            <section>

              <div className="mb-3">

                <h2 className="text-[13px] font-black text-[#172033] sm:text-sm">
                  {t.aboutFeaturesTitle}
                </h2>

              </div>

              <div className="grid gap-2 sm:grid-cols-2">

                <AboutFeature
                  icon={<Sparkles size={14} />}
                  title={t.aboutFeature1}
                  description={
                    t.aboutFeature1Text
                  }
                />

                <AboutFeature
                  icon={<Languages size={14} />}
                  title={t.aboutFeature2}
                  description={
                    t.aboutFeature2Text
                  }
                />

                <AboutFeature
                  icon={<ImageIcon size={14} />}
                  title={t.aboutFeature3}
                  description={
                    t.aboutFeature3Text
                  }
                />

                <AboutFeature
                  icon={<Gamepad2 size={14} />}
                  title={t.aboutFeature4}
                  description={
                    t.aboutFeature4Text
                  }
                />

              </div>

            </section>

            {/* CULTURE */}

            <section className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 sm:p-5">

              <div className="mb-2 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm text-cyan-600 shadow-sm">
                  <BookOpen size={16} />
                </div>

                <h2 className="text-[13px] font-black text-[#172033] sm:text-sm">
                  {t.aboutCultureTitle}
                </h2>

              </div>

              <p className="text-[10px] leading-5 text-slate-600 sm:text-[12px] sm:leading-6">
                {t.aboutCultureText}
              </p>

            </section>

            {/* TECHNOLOGY */}

            <section>

              <h2 className="mb-2.5 text-[13px] font-black text-[#172033] sm:text-sm">
                {t.aboutTechnology}
              </h2>

              <div className="flex flex-wrap gap-1.5">

                {[
                  "React",
                  "Vite",
                  "JavaScript",
                  "Tailwind CSS",
                  "AI API",
                  "AI Image",
                  "Local Cache",
                ].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[9px] font-bold text-slate-600"
                    >
                      {tech}
                    </span>
                  )
                )}

              </div>

            </section>

            {/* NOTICE */}

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 p-3">

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-amber-500 shadow-sm">
                i
              </div>

              <p className="text-[9px] leading-4.5 text-amber-700 sm:text-[10px] sm:leading-5">
                {t.aboutNotice}
              </p>

            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}

        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-6">

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#172033] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#5f6cff]"
          >
            {t.aboutClose}
          </button>

        </div>

      </div>

    </div>
  );
}

/*
========================================================
ABOUT STAT
========================================================
*/

function AboutStat({
  value,
  label,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">

      <div className="text-lg font-black tracking-tight text-[#5f6cff] sm:text-xl">
        {value}
      </div>

      <div className="mt-0.5 text-[8px] font-semibold leading-3.5 text-slate-400 sm:text-[9px]">
        {label}
      </div>

    </div>
  );
}

function HomeStat({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-[0_8px_24px_rgba(30,45,80,0.04)] sm:px-4">
      <div className="text-lg font-black tracking-tight text-[#5f6cff] sm:text-xl">
        {value}
      </div>
      <div className="mt-0.5 text-[9px] font-semibold leading-4 text-slate-400 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

/*
========================================================
ABOUT FEATURE
========================================================
*/

function AboutFeature({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-indigo-100 hover:bg-indigo-50/20">

      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-bold text-[#5f6cff]">
          {icon}
        </div>

        <h3 className="text-[11px] font-black text-slate-700 sm:text-[12px]">
          {title}
        </h3>

      </div>

      <p className="text-[9px] leading-4.5 text-slate-500 sm:text-[10px] sm:leading-5">
        {description}
      </p>

    </div>
  );
}

/*
========================================================
GAME AREA
========================================================
*/

function GameArea({
  activeGame,
  language,
  t,
  onOpenWordGame,
  onOpenDiplomatGame,
  onBack,
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fc]">

      {activeGame === "hub" && (
        <GameHub
          t={t}
          onOpenWordGame={
            onOpenWordGame
          }
          onOpenDiplomatGame={
            onOpenDiplomatGame
          }
        />
      )}

      {activeGame === "word" && (
        <div className="mx-auto w-full max-w-5xl p-2.5 sm:p-4 md:p-6">

          <div className="mb-3 flex items-center justify-between gap-2">

            <button
              onClick={() =>
                onOpenDiplomatGame()
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[10px] font-bold text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff]"
            >
              {language === "kk"
                ? "Келесі ойын"
                : "Следующая игра"}
            </button>

            <button
              onClick={onBack}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[10px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff]"
            >
              <ArrowUp size={14} className="-rotate-90" />
              {t.gameBack}
            </button>

          </div>

          <WordGame
            language={language}
            onBack={onBack}
          />

        </div>
      )}

      {activeGame === "diplomat" && (
        <DiplomatGame
          language={language}
          t={t}
          onBack={onBack}
        />
      )}

    </div>
  );
}

/*
========================================================
GAME HUB
========================================================
*/

function GameHub({
  t,
  onOpenWordGame,
  onOpenDiplomatGame,
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-5 sm:py-7 lg:px-6">

      <div className="mb-5">

        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#5f6cff]">

          <span className="h-1.5 w-1.5 rounded-full bg-[#5f6cff]" />

          QAZFRAZE GAME

        </div>

        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#172033] sm:text-3xl">
          {t.gameTitle}
        </h1>

        <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
          {t.gameSubtitle}
        </p>

      </div>

      <div className="grid gap-3 lg:grid-cols-2">

        {/* GAME 1 */}

        <button
          onClick={onOpenWordGame}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgba(30,45,80,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_12px_40px_rgba(95,108,255,0.1)] sm:p-5"
        >

          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-100/70 blur-2xl transition group-hover:bg-indigo-200/80" />

          <div className="relative">

            <div className="mb-4 flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5f6cff] to-[#00b8ff] text-lg text-white shadow-md shadow-indigo-200">
                <Sparkles size={18} />
              </div>

              <span className="rounded-full bg-indigo-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#5f6cff]">
                {t.game1Tag}
              </span>

            </div>

            <h2 className="text-lg font-black tracking-tight sm:text-xl">
              {t.game1Title}
            </h2>

            <p className="mt-1.5 min-h-[50px] text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              {t.game1Description}
            </p>

            <div className="mt-4 flex items-center justify-between">

              <span className="text-[12px] font-bold text-[#5f6cff]">
                {t.play}
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400 transition group-hover:bg-[#5f6cff] group-hover:text-white">
                <ChevronRight size={16} />
              </span>

            </div>

          </div>

        </button>

        {/* GAME 2 */}

        <button
          onClick={
            onOpenDiplomatGame
          }
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgba(30,45,80,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_12px_40px_rgba(0,184,255,0.1)] sm:p-5"
        >

          <div className="absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-cyan-100/70 blur-3xl transition group-hover:bg-cyan-200/80" />

          <div className="relative">

            <div className="mb-4 flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00b8ff] to-[#5968ff] text-lg text-white shadow-md shadow-cyan-200">
                <MessageSquare size={18} />
              </div>

              <span className="rounded-full bg-cyan-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-cyan-600">
                {t.game2Tag}
              </span>

            </div>

            <h2 className="text-lg font-black tracking-tight sm:text-xl">
              {t.game2Title}
            </h2>

            <p className="mt-1.5 min-h-[50px] text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              {t.game2Description}
            </p>

            <div className="mt-4 flex items-center justify-between">

              <span className="text-[12px] font-bold text-[#5f6cff]">
                {t.play}
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400 transition group-hover:bg-[#5f6cff] group-hover:text-white">
                <ChevronRight size={16} />
              </span>

            </div>

          </div>

        </button>

      </div>

    </div>
  );
}

/*
========================================================
TAB CONTENT
========================================================
*/

function TabContent({
  title,
  content,
  italic = false,
}) {
  return (
    <div>

      <div className="mb-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </div>

      <p
        className={`text-[12px] leading-5.5 text-slate-700 sm:text-[13px] sm:leading-6 ${
          italic
            ? "italic"
            : ""
        }`}
      >
        {content}
      </p>

    </div>
  );
}

function ResearchResult({ data, t }) {
  const fields = [
    {
      label: t.literalMeaning,
      value: data.literalMeaning,
    },
    {
      label: t.usage,
      value: data.usage,
    },
    {
      label: t.style,
      value: data.style,
    },
    {
      label: t.fact,
      value: data.fact,
    },
  ].filter(
    (field) => field.value && field.value !== "—"
  );

  if (!fields.length) {
    return null;
  }

  return (
    <section className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/45 p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#5f6cff] shadow-sm">
          <Sparkles size={14} />
        </span>
        <h3 className="text-[11px] font-black text-[#172033] sm:text-[12px]">
          {t.researchResult}
        </h3>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-white/80 bg-white/75 p-2.5 sm:p-3"
          >
            <div className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {field.label}
            </div>
            <p className="text-[11px] leading-5 text-slate-700 sm:text-[12px] sm:leading-5.5">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
========================================================
CHAT INPUT
========================================================
*/

function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
  placeholder,
  assistant,
  searchResults,
  onSelectSearchResult,
  searchTitle,
}) {
  return (
    <div className="relative">

      {/* SMART SEARCH */}

      {searchResults?.length >
        0 && (

        <div className="absolute bottom-full left-0 right-0 z-50 mb-2">

          <div className="max-h-[52vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_15px_45px_rgba(30,45,80,0.14)]">

            <div className="px-2 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {searchTitle}
            </div>

            <div className="space-y-0.5">

              {searchResults
                .slice(0, 5)
                .map(
                  (item) => (

                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onSelectSearchResult(
                          item
                        )
                      }
                      className="group w-full rounded-lg px-2 py-2 text-left transition hover:bg-indigo-50"
                    >

                      <div className="flex items-start gap-2">

                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#5f6cff] transition group-hover:bg-white">
                          <Search size={14} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="truncate text-[11px] font-bold text-slate-800">
                            {item.phrase}
                          </div>

                          <div className="mt-0.5 line-clamp-2 text-[9px] leading-4 text-slate-500">
                            {item.meaning}
                          </div>

                          {item.culturalMark && (
                            <div className="mt-0.5 text-[8px] font-medium text-slate-400">
                              {
                                item.culturalMark
                              }
                            </div>
                          )}

                        </div>

                        <div className="pt-1 text-slate-300 transition group-hover:text-[#5f6cff]">
                          <ChevronRight size={15} />
                        </div>

                      </div>

                    </button>
                  )
                )}

            </div>

          </div>

        </div>
      )}

      {/* INPUT */}

      <div className="rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_14px_36px_rgba(30,45,80,0.07)] transition focus-within:border-indigo-300 focus-within:shadow-[0_16px_44px_rgba(95,108,255,0.13)]">

        <div className="flex items-start gap-2">
          <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#5f6cff]">
            <Search size={16} />
          </div>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }

            }}
            rows={1}
            placeholder={placeholder}
            className="min-h-[44px] w-full resize-none bg-transparent px-1 py-2.5 pr-2 text-[12px] font-medium outline-none placeholder:text-slate-400 sm:min-h-[48px] sm:text-sm"
          />

          <button
            onClick={() => sendMessage()}
            disabled={
              !message.trim() ||
              loading
            }
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-white transition hover:bg-[#5f6cff] disabled:cursor-not-allowed disabled:bg-slate-200"
            aria-label="Send"
            title="Send"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 pb-0.5 sm:px-2.5">

          <span className="truncate text-[8px] font-semibold text-slate-400 sm:text-[9px]">
            {assistant}
          </span>

        </div>

      </div>

    </div>
  );
}

export default App;