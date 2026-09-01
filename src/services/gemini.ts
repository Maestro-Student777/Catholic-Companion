import { GoogleGenAI, Type } from "@google/genai";
import { Mode, GlossaryEntry, CrossReferenceAnalysis, CrossReference } from "../types";
import { findCuratedTerm } from "../data/catholicGlossary";

const SYSTEM_PROMPT = `
You are a Catholic research and study companion embedded in a split-screen reading tool. Your user is a serious Catholic reader who navigates Catholic websites on the left side of their screen. When they press "Snapshot," the text content of their current page is extracted and handed to you as your working document. You do not browse the internet. You work exclusively from what you are given.

---

**Your operating rules:**

1. **Work from the snapshot only.** Treat the snapshot like a page torn from a book and placed in front of you. You analyze, summarize, expand, cross-reference from memory, and ask questions — but you never claim to see anything beyond what was handed to you.

2. **Each snapshot is a fresh transaction.** When a new snapshot arrives, acknowledge it briefly, then wait for the user's first question or instruction. Do not assume the topic continues from the last snapshot unless the user says so.

3. **Respect the source.** You are working with content from Catholic websites — liturgical texts, apologetics, parish resources, scripture, prayer. Treat this content with the reverence it deserves. When you expand on it, be accurate. When you are uncertain, say so clearly.

4. **Six modes — switch based on user instruction:**
   - **Study mode** — You unpack the content. Explain vocabulary, trace references, connect to scripture or tradition, surface what a careful reader would want to know.
   - **Question mode** — You ask the user probing questions about the content to deepen their engagement. One question at a time. Wait for an answer before continuing.
   - **Note mode** — You receive a note instruction ("save this," "note that," "remember this") and you generate a clean, titled note entry to be stored in the session notes panel. Format: \`[NOTE — {short title}]: {summary}\`.
   - **History mode** — You provide deep historical context for the snapshot. Identify key historical events, figures, or periods relevant to the content and explain their significance to the Church and the world.
   - **Glossary mode** — You act as an authentic Catholic theological lexicon and Latin dictionary. Provide concise, dogmatically sound, and reverent explanations of Catholic terms, Latin phrases, and liturgical vocabulary, citing the Catechism (CCC), Church Councils, or Doctors of the Church.
   - **Cross-Reference mode** — You systematically map the snapshot's concepts to Sacred Scripture, the Catechism of the Catholic Church (CCC), Papal Encyclicals, Conciliar documents (Vatican II, Trent), and the Church Fathers (Augustine, Aquinas, Irenaeus, etc.). Clearly distinguish what the snapshot says versus what you are cross-referencing from Tradition.

5. **Default mode is Study mode** unless the user specifies otherwise.

---

**Snapshot format you will receive:**

\`\`\`
[SNAPSHOT]
Source: {url}
Time: {timestamp}
---
{extracted page text}
[END SNAPSHOT]
\`\`\`

When you receive this, respond with:
- One sentence naming what the page appears to be
- One sentence on what kind of analysis would be most useful
- Then wait for the user's direction

---

**On expanding content & Cross-referencing:**

You may draw on your training knowledge to:
- Identify liturgical context (feast, season, saint)
- Trace scriptural references
- Connect to Church documents, councils, catechism, or patristics
- Explain Latin phrases, theological terms, or historical background
- Suggest related topics the user might want to navigate to next

When you do this, clearly distinguish between *what the snapshot says* and *what you are adding from background knowledge.* Use phrases like "The page says..." versus "For context..." or "Worth noting from tradition..."

---

**On notes:**

Notes are cumulative within a session. When the user asks to save a note, generate the note entry cleanly. At any point the user can say "show my notes" and you will display all note entries saved so far in the session, in order.

---

**Tone:**

Direct, intelligent, and reverent. You are a study partner, not a search engine. You are allowed to find things interesting. You are allowed to say when something is worth sitting with.

---

**What you never do:**

- You never summarize a page you haven't been given
- You never claim the snapshot contains something it doesn't
- You never invent citations or Church documents
- You never redirect the user away from their Catholic focus unless they ask
`;

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateResponse(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  mode: Mode = 'study'
) {
  const genAI = getAI();
  
  const chat = genAI.chats.create({
    model: "gemini-3.7-flash",
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\nCURRENT MODE: ${mode.toUpperCase()}`,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message: prompt });
  return result.text;
}

export async function generateResponseStream(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  mode: Mode = 'study'
) {
  const genAI = getAI();
  
  const chat = genAI.chats.create({
    model: "gemini-3.7-flash",
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\nCURRENT MODE: ${mode.toUpperCase()}`,
    },
    history: history,
  });

  return await chat.sendMessageStream({ message: prompt });
}

/**
 * Generates an authentic, reverent Catholic Glossary definition for a theological term or Latin phrase.
 */
export async function lookupGlossaryTerm(term: string, context?: string): Promise<GlossaryEntry> {
  // First check curated fast-lookup database
  const curated = findCuratedTerm(term);
  if (curated && !context) {
    return curated;
  }

  const genAI = getAI();
  const prompt = `You are a Catholic master theologian and philologist. Provide an accurate, reverent, concise definition and theological context for the following term or Latin phrase within Catholic theology and tradition:
Term: "${term}"
${context ? `Context in which the term appears: "${context}"` : ''}

Respond strictly in valid JSON format matching this schema:
{
  "term": "standardized term title",
  "latinOrGreek": "Latin or Greek etymology or original phrasing (if applicable)",
  "category": "one of: dogma, sacraments, liturgy, canon_law, patristics, moral, scripture, latin_phrases, general",
  "definition": "concise, accurate definition in reverent Catholic tone (2-4 sentences)",
  "catechismRef": "relevant Catechism of the Catholic Church citation (e.g. CCC §1374) or Canon Law ref",
  "scriptureOrPatristicRef": "key Scripture citation or Church Father / Doctor / Council reference",
  "theologicalContext": "how this term fits into the Catholic life of faith or doctrine"
}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            latinOrGreek: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              enum: ['dogma', 'sacraments', 'liturgy', 'canon_law', 'patristics', 'moral', 'scripture', 'latin_phrases', 'general']
            },
            definition: { type: Type.STRING },
            catechismRef: { type: Type.STRING },
            scriptureOrPatristicRef: { type: Type.STRING },
            theologicalContext: { type: Type.STRING }
          },
          required: ["term", "category", "definition", "catechismRef"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `term-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      term: parsed.term || term,
      latinOrGreek: parsed.latinOrGreek || '',
      category: parsed.category || 'general',
      definition: parsed.definition || 'Definition provided from Catholic tradition.',
      catechismRef: parsed.catechismRef || 'CCC',
      scriptureOrPatristicRef: parsed.scriptureOrPatristicRef || '',
      theologicalContext: parsed.theologicalContext || '',
      source: 'ai',
      timestamp: Date.now()
    };
  } catch (err) {
    console.error("Glossary AI error:", err);
    // Fallback if AI fails or curated fallback exists
    if (curated) return curated;
    return {
      id: `term-${Date.now()}`,
      term: term,
      category: 'general',
      definition: `In Catholic theology, "${term}" represents an important doctrinal or traditional concept.`,
      catechismRef: 'Catechism of the Catholic Church',
      source: 'curated',
      timestamp: Date.now()
    };
  }
}

/**
 * Analyzes a snapshot and generates comprehensive Catholic cross-references
 * (Scripture, Catechism, Encyclicals, Patristic Fathers, Councils, Canon Law).
 */
export async function analyzeCrossReferences(snapshotText: string, sourceUrl?: string): Promise<CrossReferenceAnalysis> {
  const genAI = getAI();
  const prompt = `You are a Catholic research scholar specializing in magisterial cross-referencing and patristics.
Analyze this snapshot text from a Catholic reading session:

[SNAPSHOT TEXT]
${snapshotText.slice(0, 4000)}
[END SNAPSHOT]
${sourceUrl ? `Source: ${sourceUrl}` : ''}

Your task is to identify key themes and provide 4 to 8 high-value, authentic Catholic cross-references:
1. Scripture references (Old & New Testament verses directly connected or fulfilled)
2. Catechism of the Catholic Church (CCC § numbers directly treating this doctrine)
3. Papal Encyclicals / Apostolic Exhortations (e.g. Pope Leo XIII, Pius XII, John Paul II, Benedict XVI, Paul VI)
4. Patristic Writings & Doctors of the Church (e.g. St. Augustine, St. Thomas Aquinas Summa, St. Irenaeus Against Heresies, St. Athanasius, St. John Chrysostom)
5. Ecumenical Councils (Nicaea, Ephesus, Chalcedon, Trent, Vatican II) or Code of Canon Law (CIC)

CRITICAL INSTRUCTION:
Clearly distinguish between what the snapshot says versus what you are cross-referencing from Tradition.
Provide the URL or recommended reading link if available (e.g. Vatican.va, USCCB Bible, New Advent, CCEL).

Respond strictly in valid JSON matching this schema:
{
  "snapshotSummary": "1-2 sentences summarizing the core theological or liturgical topic in the snapshot",
  "identifiedThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "crossReferences": [
    {
      "type": "one of: scripture, catechism, encyclical, patristic, canon_law, council",
      "title": "Clear descriptive title (e.g. CCC §1374 - The Real Presence)",
      "citation": "Exact citation (e.g. CCC §1374, Jn 6:51-58, ST III q. 75, CIC Can. 897)",
      "authorOrSource": "Author or source name (e.g. St. Thomas Aquinas, Magisterium, St. Paul)",
      "yearOrEra": "Approximate date or era (e.g. c. 1270, 1992, AD 451)",
      "summary": "Concise 2-3 sentence explanation of what this cross-referenced text teaches",
      "connectionToSnapshot": "Explicit 1-2 sentence connection showing how this expands or deepens what is in the snapshot",
      "directQuote": "Famous quote or key sentence from this source if notable",
      "url": "Recommended URL if applicable (e.g. https://www.vatican.va/archive/ENG0015/_INDEX.HTM, https://bible.usccb.org, etc.)"
    }
  ]
}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            snapshotSummary: { type: Type.STRING },
            identifiedThemes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            crossReferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { 
                    type: Type.STRING,
                    enum: ['scripture', 'catechism', 'encyclical', 'patristic', 'canon_law', 'council']
                  },
                  title: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  authorOrSource: { type: Type.STRING },
                  yearOrEra: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  connectionToSnapshot: { type: Type.STRING },
                  directQuote: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["type", "title", "citation", "authorOrSource", "summary", "connectionToSnapshot"]
              }
            }
          },
          required: ["snapshotSummary", "identifiedThemes", "crossReferences"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const items: CrossReference[] = (parsed.crossReferences || []).map((ref: any, idx: number) => ({
      id: `crossref-${Date.now()}-${idx}`,
      type: ref.type || 'catechism',
      title: ref.title || 'Catholic Reference',
      citation: ref.citation || '',
      authorOrSource: ref.authorOrSource || 'Catholic Tradition',
      yearOrEra: ref.yearOrEra || '',
      summary: ref.summary || '',
      connectionToSnapshot: ref.connectionToSnapshot || '',
      directQuote: ref.directQuote,
      url: ref.url
    }));

    return {
      snapshotSummary: parsed.snapshotSummary || 'Analysis of snapshot text in light of Church tradition.',
      identifiedThemes: parsed.identifiedThemes || [],
      crossReferences: items,
      timestamp: Date.now()
    };
  } catch (err) {
    console.error("Cross-reference analysis error:", err);
    return {
      snapshotSummary: 'Snapshot content evaluated against Sacred Scripture and Sacred Tradition.',
      identifiedThemes: ['Sacred Doctrine', 'Sacred Scripture', 'Church Fathers'],
      crossReferences: [
        {
          id: `crossref-fallback-1`,
          type: 'catechism',
          title: 'Catechism of the Catholic Church',
          citation: 'CCC §80-84',
          authorOrSource: 'Magisterium',
          summary: 'Sacred Scripture and Sacred Tradition make up a single sacred deposit of the Word of God.',
          connectionToSnapshot: 'Provides foundational framework for interpreting the snapshot in continuity with apostolic faith.',
          url: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'
        },
        {
          id: `crossref-fallback-2`,
          type: 'scripture',
          title: 'Apostolic Tradition in Scripture',
          citation: '2 Thessalonians 2:15',
          authorOrSource: 'St. Paul the Apostle',
          summary: '"So then, brethren, stand firm and hold to the traditions which you were taught by us, either by word of mouth or by letter."',
          connectionToSnapshot: 'Affirms biblical imperative to hold fast to apostolic tradition alongside written scripture.',
          url: 'https://bible.usccb.org'
        }
      ],
      timestamp: Date.now()
    };
  }
}
