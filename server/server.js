import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist");
const indexPath = path.join(distPath, "index.html");

const allowedOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : undefined
  )
);
app.use(express.json({ limit: "64kb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "QAZFRAZE AI backend is running",
  });
});

/* =========================
   TEXT ANALYSIS
========================= */

app.post("/api/analyze", async (req, res) => {
  try {
    const { phrase, context, language = "kk" } = req.body;

    if (!phrase?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Фразеологизм енгізілмеді.",
      });
    }

    if (phrase.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: "Фразеологизм тым ұзын.",
      });
    }

    const prompt = `
Сен QAZFRAZE AI жүйесінің қазақ фразеологиясы бойынша AI көмекшісісің.

Сенің негізгі мақсатың — қазақ фразеологизмдерін пайдаланушыға
қысқа, табиғи, нақты және түсінікті түрде түсіндіру.

Тіл:
${language === "ru" ? "орыс тілі" : "қазақ тілі"}

Фразеологизм:
"${phrase}"

Корпус деректері:
${context || "Контекст берілмеген."}

ЖАУАП БЕРУ ЕРЕЖЕЛЕРІ:

1. "meaning"
Фразеологизмнің қазіргі ауыспалы мағынасын түсіндір.
Фразаның сөзбе-сөз мағынасын ұзақ түсіндірме.
Мағынаны 1–3 табиғи сөйлеммен бер.
Мағынасы корпус деректерімен сәйкес болсын.

2. "russian"
Фразеологизмнің орыс тіліндегі табиғи мағыналық баламасын бер.
Сөзбе-сөз аударма жасама.

3. "english"
Фразеологизмнің ағылшын тіліндегі мағыналық баламасын бер.
Сөзбе-сөз аударма жасама.
Егер дәл тұрақты балама болмаса, мағынасын табиғи ағылшын тілінде түсіндір.

4. "culture"
Фразеологизмнің ұлттық-мәдени ерекшелігін түсіндір.
Корпуста берілген мәдени белгіге сүйен.
Дәлелсіз тарихи дерек ойлап шығарма.
2–3 сөйлем жеткілікті.

5. "example"
Фразеологизмді қолданатын бір табиғи қазақша сөйлем жаз.
Фразеологизм сөйлемде мағынасына сай қолданылсын.

6. "literalMeaning"
Фразаның сөзбе-сөз бейнесін қысқа түсіндір.

7. "usage"
Фразеологизмнің қай жағдайда және қандай реңкте қолданылатынын түсіндір.

8. "style"
Қолданылу стилін бер: бейтарап, ауызекі, көркем, ресми немесе дәстүрлі.

9. "fact"
Фразеологизм туралы бір қысқа, пайдалы дерек бер. Дәлелсіз тарихи факт ойлап шығарма.

МАҢЫЗДЫ:

- Бір ақпаратты бірнеше бөлімде қайталама.
- Робот сияқты академиялық тіл қолданба.
- Қажетсіз күрделі терминдерді қолданба.
- Фразаның сөзбе-сөз бейнесін негізгі мағына ретінде көрсетпе.
- Корпустағы дерекке қайшы ақпарат ойлап шығарма.
- Нақты білмейтін тарихи немесе мәдени фактіні ойдан қоспа.

ТЕК мына JSON форматында жауап бер:

{
  "meaning": "...",
  "russian": "...",
  "english": "...",
  "culture": "...",
  "example": "...",
  "literalMeaning": "...",
  "usage": "...",
  "style": "...",
  "fact": "..."
}

JSON-нан басқа ешқандай мәтін жазба.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    let result;

    try {
      const output = response.output_text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      result = JSON.parse(output);
    } catch {
      result = {
        meaning: response.output_text,
        russian: "",
        english: "",
        culture: "",
        example: "",
        literalMeaning: "",
        usage: "",
        style: "",
        fact: "",
      };
    }

    result = {
      meaning: result.meaning || "",
      russian: result.russian || "",
      english: result.english || "",
      culture: result.culture || "",
      example: result.example || "",
      literalMeaning: result.literalMeaning || "",
      usage: result.usage || "",
      style: result.style || "",
      fact: result.fact || "",
    };

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("OPENAI ANALYZE ERROR:", error);

    res.status(500).json({
      success: false,
      error: "AI сұранысын орындау кезінде қате пайда болды.",
    });
  }
});

/* =========================
   AI IMAGE GENERATION
========================= */

app.post("/api/generate-image", async (req, res) => {
  try {
    const {
      phrase,
      meaning,
      culture,
      language = "kk",
    } = req.body;

    if (!phrase?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Фразеологизм енгізілмеді.",
      });
    }
    if (phrase.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: "Фразеологизм тым ұзын.",
      });
    }
    const imagePrompt = `
Create a high-quality editorial illustration for a Kazakh
language and culture educational platform.

The Kazakh phraseological expression is:

"${phrase}"

Its figurative meaning is:

"${meaning || "Not provided"}"

Cultural context:

"${culture || "Kazakh cultural context"}"

VISUAL GOAL:

Represent the FIGURATIVE MEANING of the phrase naturally.

Do NOT illustrate the phrase literally if that would create
a misleading or absurd image.

The image should communicate the idea, situation or emotion
behind the phrase through a realistic, elegant and culturally
appropriate scene.

STYLE:

- modern educational editorial illustration
- realistic but slightly artistic
- natural human expressions
- clean professional composition
- subtle cinematic lighting
- warm and believable environment
- authentic Kazakh cultural details when relevant
- contemporary high-quality digital artwork
- suitable for a professional educational website
- visually understandable without text

IMPORTANT:

- Do not put any text in the image.
- Do not add captions.
- Do not add logos.
- Do not add watermarks.
- Do not create an infographic.
- Do not make the image cartoonish unless the situation naturally requires it.
- Avoid exaggerated fantasy elements.
- Avoid stereotypical or inaccurate cultural details.
- Prioritize the figurative meaning over the literal wording.

Language context:
${language === "ru" ? "Russian interface" : "Kazakh interface"}
`;

    console.log("QAZFRAZE IMAGE REQUEST:", phrase);

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "auto",
    });

    const image = result?.data?.[0];

    if (!image) {
      throw new Error("AI суреті жасалмады.");
    }

    let imageUrl = null;

    if (image.url) {
      imageUrl = image.url;
    }

    if (!imageUrl && image.b64_json) {
      imageUrl = `data:image/png;base64,${image.b64_json}`;
    }

    if (!imageUrl) {
      throw new Error("AI суретінің деректері қайтарылмады.");
    }

    console.log("QAZFRAZE IMAGE SUCCESS:", phrase);

    res.json({
      success: true,
      image: imageUrl,
      phrase,
    });
  } catch (error) {
    console.error("OPENAI IMAGE ERROR:", error);

    res.status(500).json({
      success: false,
      error: "AI суретін жасау кезінде қате пайда болды.",
    });
  }
});

/* =========================
   PRODUCTION FRONTEND
========================= */

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get(
    /^(?!\/api(?:\/|$)).*/,
    (req, res, next) => {
      res.sendFile(indexPath, (error) => {
        if (error) {
          next(error);
        }
      });
    }
  );
}

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`QAZFRAZE AI server: http://localhost:${PORT}`);
});