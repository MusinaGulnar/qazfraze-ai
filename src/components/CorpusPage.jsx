import { useMemo, useState } from "react";
import { phraseologisms } from "../data/phraseologisms";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Database,
  Image as ImageIcon,
  Search,
  Sparkles,
  X,
} from "lucide-react";

function CorpusPage({
  language = "kk",
  onBack,
  onAnalyze,
  onGenerateImage,
}) {
  const kk = language === "kk";

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [page, setPage] = useState(1);

  const perPage = 12;

  const text = kk
    ? {
        badge: "QAZFRAZE RESEARCH",
        title: "Зерттеу корпусы",
        subtitle:
          "Қазақ тіліндегі 150 фразеологиялық бірліктен тұратын зерттеу деректер базасы.",
        search:
          "Фразеологизмді немесе оның мағынасын іздеңіз...",
        all: "Барлығы",
        group1: "1-топ",
        group2: "2-топ",
        group3: "3-топ",
        high: "Жоғары жиілік",
        medium: "Орташа жиілік",
        low: "Төмен жиілік",
        groups: "Зерттеу тобы",
        frequency: "Жиілік",
        cultural: "Мәдени белгі",
        meaning: "Мағынасы",
        details: "Толық зерттеу",
        analyze: "AI арқылы талдау",
        imageCreate: "AI суретін жасау",
        close: "Жабу",
        corpus: "Фразеологизм",
        found: "бірлік көрсетілді",
        noResult: "Сәйкес фразеологизм табылмады.",
        reset: "Фильтрлерді тазалау",
        previous: "Алдыңғы",
        next: "Келесі",
        page: "бет",
        cultureTitle: "Мәдени контекст",
        researchGroup: "Зерттеу тобы",
        usageFrequency: "Қолданылу жиілігі",
      }
    : {
        badge: "QAZFRAZE RESEARCH",
        title: "Исследовательский корпус",
        subtitle:
          "Исследовательская база из 150 казахских фразеологических единиц.",
        search:
          "Введите фразеологизм или его значение...",
        all: "Все",
        group1: "Группа 1",
        group2: "Группа 2",
        group3: "Группа 3",
        high: "Высокая частотность",
        medium: "Средняя частотность",
        low: "Низкая частотность",
        groups: "Исследовательская группа",
        frequency: "Частотность",
        cultural: "Культурная маркировка",
        meaning: "Значение",
        details: "Полное исследование",
        analyze: "AI-анализ",
        imageCreate: "Создать AI-изображение",
        close: "Закрыть",
        corpus: "Фразеологизмов",
        found: "единиц показано",
        noResult: "Подходящие фразеологизмы не найдены.",
        reset: "Сбросить фильтры",
        previous: "Назад",
        next: "Далее",
        page: "страница",
        cultureTitle: "Культурный контекст",
        researchGroup: "Исследовательская группа",
        usageFrequency: "Частотность",
      };

  const filtered = useMemo(() => {
    const normalized = query
      .toLowerCase()
      .trim();

    return phraseologisms.filter((item) => {
      const matchesQuery =
        !normalized ||
        item.phrase
          .toLowerCase()
          .includes(normalized) ||
        item.meaning
          .toLowerCase()
          .includes(normalized) ||
        item.culturalMark
          .toLowerCase()
          .includes(normalized);

      const matchesGroup =
        group === "all" ||
        String(item.group) === group;

      const matchesFrequency =
        frequency === "all" ||
        item.frequency === frequency;

      return (
        matchesQuery &&
        matchesGroup &&
        matchesFrequency
      );
    });
  }, [query, group, frequency]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visibleItems = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const changeGroup = (value) => {
    setGroup(value);
    setPage(1);
  };

  const changeFrequency = (value) => {
    setFrequency(value);
    setPage(1);
  };

  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setGroup("all");
    setFrequency("all");
    setPage(1);
  };

  return (
    <div className="min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fc]">
      <div className="mx-auto min-w-0 w-full max-w-6xl px-3 py-5 sm:px-5 sm:py-7 lg:px-7">

        {/* HEADER */}

        <div className="mb-5 min-w-0 sm:mb-6">

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#5f6cff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5f6cff]" />
            {text.badge}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-2xl font-black tracking-[-0.045em] text-[#172033] sm:text-3xl lg:text-[36px]">
                {text.title}
              </h1>

              <p className="mt-1.5 max-w-2xl text-[11px] leading-5 text-slate-500 sm:text-[13px] sm:leading-6">
                {text.subtitle}
              </p>
            </div>

            <button
              onClick={onBack}
              className="self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff] sm:self-auto"
            >
              <ArrowLeft size={14} />
              {kk ? "AI чатқа оралу" : "Вернуться в AI-чат"}
            </button>

          </div>

        </div>

        {/* STATISTICS */}

        <div className="mb-4 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">

          <CorpusStat
            value="150"
            label={text.corpus}
            icon={<Database size={16} />}
          />

          <CorpusStat
            value="3"
            label={text.groups}
            icon={<BookOpen size={16} />}
          />

          <CorpusStat
            value={
              phraseologisms.filter(
                (item) =>
                  item.frequency === "жоғары"
              ).length
            }
            label={kk ? "Жоғары жиілік" : "Высокая частотность"}
            icon={<ArrowRight size={16} />}
          />

          <CorpusStat
            value="AI"
            label={kk ? "Талдау құралы" : "Инструмент анализа"}
            icon={<Sparkles size={16} />}
          />

        </div>

        {/* SEARCH + FILTERS */}

        <div className="mb-4 min-w-0 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_8px_30px_rgba(30,45,80,0.04)] sm:p-3">

          <div className="relative">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              <Search size={16} />
            </span>

            <input
              value={query}
              onChange={(e) =>
                changeQuery(e.target.value)
              }
              placeholder={text.search}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-50 sm:h-11 sm:text-[12px]"
            />

          </div>

          <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">

              <FilterButton
                active={group === "all"}
                onClick={() =>
                  changeGroup("all")
                }
              >
                {text.all}
              </FilterButton>

              <FilterButton
                active={group === "1"}
                onClick={() =>
                  changeGroup("1")
                }
              >
                {text.group1}
              </FilterButton>

              <FilterButton
                active={group === "2"}
                onClick={() =>
                  changeGroup("2")
                }
              >
                {text.group2}
              </FilterButton>

              <FilterButton
                active={group === "3"}
                onClick={() =>
                  changeGroup("3")
                }
              >
                {text.group3}
              </FilterButton>

            </div>

            <div className="flex gap-1">

              <FilterButton
                active={frequency === "all"}
                onClick={() =>
                  changeFrequency("all")
                }
              >
                {text.all}
              </FilterButton>

              <FilterButton
                active={
                  frequency === "жоғары"
                }
                onClick={() =>
                  changeFrequency("жоғары")
                }
              >
                {text.high}
              </FilterButton>

              <FilterButton
                active={
                  frequency === "орташа"
                }
                onClick={() =>
                  changeFrequency("орташа")
                }
              >
                {text.medium}
              </FilterButton>

              <FilterButton
                active={frequency === "төмен"}
                onClick={() =>
                  changeFrequency("төмен")
                }
              >
                {text.low}
              </FilterButton>

            </div>

          </div>

        </div>

        {/* RESULT INFO */}

        <div className="mb-2.5 flex items-center justify-between px-1">

          <div className="text-[9px] font-semibold text-slate-400 sm:text-[10px]">
            <span className="font-black text-[#5f6cff]">
              {filtered.length}
            </span>{" "}
            {text.found}
          </div>

          {(query ||
            group !== "all" ||
            frequency !== "all") && (
            <button
              onClick={clearFilters}
              className="text-[9px] font-bold text-slate-400 transition hover:text-[#5f6cff]"
            >
              {text.reset}
            </button>
          )}

        </div>

        {/* CARDS */}

        {visibleItems.length > 0 ? (

          <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

            {visibleItems.map((item) => (
              <CorpusCard
                key={item.id}
                item={item}
                kk={kk}
                text={text}
                onOpen={() =>
                  setSelectedPhrase(item)
                }
              />
            ))}

          </div>

        ) : (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">

            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-400">
              <Search size={20} />
            </div>

            <div className="text-[12px] font-bold text-slate-700">
              {text.noResult}
            </div>

            <button
              onClick={clearFilters}
              className="mt-3 rounded-lg bg-[#172033] px-3 py-2 text-[9px] font-bold text-white transition hover:bg-[#5f6cff]"
            >
              {text.reset}
            </button>

          </div>

        )}

        {/* PAGINATION */}

        {totalPages > 1 && (

          <div className="mt-5 flex min-w-0 max-w-full flex-wrap items-center justify-center gap-1.5">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setPage((value) =>
                  Math.max(1, value - 1)
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[9px] font-bold text-slate-500 transition hover:border-indigo-200 hover:text-[#5f6cff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              {text.previous}
            </button>

            <div className="flex items-center gap-1">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter((number) => {
                  if (totalPages <= 7) {
                    return true;
                  }

                  if (number === 1) {
                    return true;
                  }

                  if (
                    number === totalPages
                  ) {
                    return true;
                  }

                  return (
                    Math.abs(
                      number - currentPage
                    ) <= 1
                  );
                })
                .map((number, index, array) => {

                  const previous =
                    array[index - 1];

                  const showDots =
                    previous &&
                    number - previous > 1;

                  return (
                    <div
                      key={number}
                      className="flex items-center gap-1"
                    >

                      {showDots && (
                        <span className="px-0.5 text-[9px] text-slate-300">
                          ...
                        </span>
                      )}

                      <button
                        onClick={() =>
                          setPage(number)
                        }
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[9px] font-bold transition ${
                          currentPage === number
                            ? "bg-[#5f6cff] text-white shadow-sm shadow-indigo-200"
                            : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-[#5f6cff]"
                        }`}
                      >
                        {number}
                      </button>

                    </div>
                  );
                })}

            </div>

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setPage((value) =>
                  Math.min(
                    totalPages,
                    value + 1
                  )
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[9px] font-bold text-slate-500 transition hover:border-indigo-200 hover:text-[#5f6cff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {text.next} <ChevronRight size={14} />
            </button>

          </div>

        )}

      </div>

      {/* DETAIL MODAL */}

      {selectedPhrase && (
        <CorpusDetailModal
          item={selectedPhrase}
          kk={kk}
          text={text}
          onClose={() =>
            setSelectedPhrase(null)
          }
          onAnalyze={() => {
            onAnalyze?.(
              selectedPhrase.phrase
            );
            setSelectedPhrase(null);
          }}
          onGenerateImage={() => {
            onGenerateImage?.(selectedPhrase);
            setSelectedPhrase(null);
          }}
        />
      )}

    </div>
  );
}

/* ======================================================
   STAT
====================================================== */

function CorpusStat({
  value,
  label,
  icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-3.5">

      <div className="flex items-start justify-between">

        <div>
          <div className="text-lg font-black tracking-tight text-[#5f6cff] sm:text-xl">
            {value}
          </div>

          <div className="mt-0.5 text-[8px] font-semibold leading-3.5 text-slate-400 sm:text-[9px]">
            {label}
          </div>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-bold text-[#5f6cff]">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ======================================================
   FILTER BUTTON
====================================================== */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[8px] font-bold transition sm:px-3 sm:text-[9px] ${
        active
          ? "bg-[#172033] text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff]"
      }`}
    >
      {children}
    </button>
  );
}

function getFrequencyLabel(value, kk) {
  if (kk) return value;

  return {
    жоғары: "Высокая",
    орташа: "Средняя",
    төмен: "Низкая",
  }[value] || value;
}

/* ======================================================
   CORPUS CARD
====================================================== */

function CorpusCard({
  item,
  kk,
  text,
  onOpen,
}) {
  return (
    <button
      onClick={onOpen}
      className="group relative min-w-0 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-[0_6px_25px_rgba(30,45,80,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_12px_35px_rgba(95,108,255,0.09)] sm:p-4 lg:p-5"
    >

      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-50 opacity-0 blur-2xl transition group-hover:opacity-100" />

      <div className="relative">

        <div className="mb-3 flex items-center justify-between">

          <span className="text-[8px] font-black tracking-wider text-slate-300">
            #{String(item.id).padStart(3, "0")}
          </span>

          <div className="flex gap-1">

            <span className="rounded-md bg-indigo-50 px-1.5 py-1 text-[7px] font-bold text-[#5f6cff] lg:px-2 lg:text-[8px]">
              {kk
                ? `${item.group}-топ`
                : `Группа ${item.group}`}
            </span>

            <span className="rounded-md bg-slate-50 px-1.5 py-1 text-[7px] font-semibold text-slate-500 lg:px-2 lg:text-[8px]">
              {getFrequencyLabel(item.frequency, kk)}
            </span>

          </div>

        </div>

        <h2 className="line-clamp-2 text-[13px] font-black leading-5 tracking-tight text-[#172033] sm:text-[14px] lg:text-[15px]">
          {item.phrase}
        </h2>

        <div className="mt-2">

          <div className="mb-1 text-[7px] font-bold uppercase tracking-[0.13em] text-slate-400 lg:text-[8px]">
            {text.meaning}
          </div>

          <p className="line-clamp-2 text-[10px] leading-4.5 text-slate-600 sm:text-[11px] lg:text-[12px] lg:leading-5">
            {item.meaning}
          </p>

        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-2.5">

          <div className="min-w-0">

            <div className="mb-0.5 text-[7px] font-bold uppercase tracking-wider text-slate-400 lg:text-[8px]">
              {text.cultural}
            </div>

            <div className="truncate text-[8px] font-semibold text-slate-500 lg:text-[9px]">
              {item.culturalMark}
            </div>

          </div>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[11px] text-slate-300 transition group-hover:bg-[#5f6cff] group-hover:text-white">
            <ChevronRight size={15} />
          </span>

        </div>

      </div>

    </button>
  );
}

/* ======================================================
   DETAIL MODAL
====================================================== */

function CorpusDetailModal({
  item,
  kk,
  text,
  onClose,
  onAnalyze,
  onGenerateImage,
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="flex max-h-[90dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(20,30,70,0.25)]">

        {/* HEADER */}

        <div className="relative shrink-0 overflow-hidden border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">

          <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-indigo-100/70 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">

            <div className="min-w-0">

              <div className="mb-2 flex flex-wrap items-center gap-1.5">

                <span className="rounded-md bg-indigo-50 px-2 py-1 text-[8px] font-bold text-[#5f6cff]">
                  #{String(item.id).padStart(3, "0")}
                </span>

                <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500">
                  {kk
                    ? `${item.group}-топ`
                    : `Группа ${item.group}`}
                </span>

                <span className="rounded-md bg-cyan-50 px-2 py-1 text-[8px] font-semibold text-cyan-600">
                  {getFrequencyLabel(item.frequency, kk)}
                </span>

              </div>

              <h2 className="text-xl font-black tracking-[-0.035em] text-[#172033] sm:text-2xl">
                {item.phrase}
              </h2>

            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        {/* CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="space-y-3.5 p-4 sm:space-y-4 sm:p-6">

            <DetailBlock
              label={text.meaning}
              value={item.meaning}
            />

            <div className="grid gap-3 sm:grid-cols-2">

              <DetailBlock
                label={text.researchGroup}
                value={
                  kk
                    ? `${item.group}-топ`
                    : `Группа ${item.group}`
                }
              />

              <DetailBlock
                label={text.usageFrequency}
                value={getFrequencyLabel(item.frequency, kk)}
              />

            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 sm:p-5">

              <div className="mb-2 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm text-cyan-600 shadow-sm">
                  <BookOpen size={16} />
                </div>

                <div className="text-[11px] font-black text-[#172033] sm:text-[12px]">
                  {text.cultureTitle}
                </div>

              </div>

              <p className="text-[10px] leading-5 text-slate-600 sm:text-[12px] sm:leading-6">
                {item.culturalMark}
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex shrink-0 flex-col gap-1.5 border-t border-slate-100 bg-white p-3 sm:flex-row sm:p-4">

          <button
            onClick={onAnalyze}
            className="flex-1 rounded-xl bg-[#172033] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#5f6cff] sm:text-[11px]"
          >
            <Sparkles size={15} />
            {text.analyze}
          </button>

          <button
            onClick={onGenerateImage}
            className="flex-1 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-[10px] font-bold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 sm:text-[11px]"
          >
            <ImageIcon size={15} />
            {text.imageCreate}
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5f6cff] sm:text-[11px]"
          >
            {text.close}
          </button>

        </div>

      </div>

    </div>
  );
}

/* ======================================================
   DETAIL BLOCK
====================================================== */

function DetailBlock({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">

      <div className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>

      <p className="text-[11px] leading-5 text-slate-700 sm:text-[12px]">
        {value}
      </p>

    </div>
  );
}

export default CorpusPage;