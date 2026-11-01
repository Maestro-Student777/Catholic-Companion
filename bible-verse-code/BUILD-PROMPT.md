# BUILD PROMPT — Bible-Only Verse Sequence & Canonical Code

## Purpose
Build a standalone project whose primary corpus is the Bible's verse text, beginning with Genesis 1:1 as block 000001 and proceeding in a fixed, documented order until the final verse of the selected canon and edition is processed. Learn from relationships among all verse blocks and create a unified, revisitable model of the whole corpus without constantly inventing new scopes.

## Non-negotiable scope
1. The Bible text is the only primary content corpus. Do not mix commentary, sermons, catechetical material, external historical claims, or generated prose into the verse corpus. A future external-evidence layer must be separate, opt-in, and explicitly labeled.
2. Define canon and edition before ingestion: canon, translation/edition, language, license, source, version, and versification. Do not silently mix editions.
3. Genesis 1:1 is the first block. For the initial build, “chronological order” means fixed canonical verse order in the chosen edition—Genesis 1:1, Genesis 1:2, and onward through the canon—unless the owner explicitly requests a separate narrative-chronology view. Never reorder canonical IDs using uncertain historical chronology.
4. Preserve exact source text. Never invent, paraphrase, silently normalize, or repair a verse. Store normalization as a separate derived field.
5. Keep corpus and code distinct. Verse text is source data; code is a stable machine-readable representation and reproducible analysis. Do not assume the text contains a hidden computer cipher.
6. The core completion milestone is every verse in the selected canon and edition ingested, ordered, and validated. New features must serve this milestone, not redefine it.

## Verse block schema
Each block contains: stable ID; canon; book ID/name; chapter and verse; canonical sequence index; exact text; edition and language; license/provenance; ingestion and validation status; optional derived fields (tokens, lemmas, named entities, repeated phrases, candidate links, review notes); version history; and checksum. If versification differs between editions, use a crosswalk rather than forcing a false match.

## Required application
Build a working application with:
1. A corpus manifest for canon, edition, language, source, rights, version, expected books/chapters/verses, and ingestion date.
2. An ordered verse ledger with Genesis 1:1 first and the final verse last.
3. A one-verse view with previous/next controls and stable ID.
4. A validator for missing, duplicate, malformed, out-of-order, or changed blocks.
5. A learning layer for patterns derived only from the selected Bible corpus: word/phrase recurrence, vocabulary, named entities, and candidate thematic or textual relationships.
6. A relationship graph with typed edges such as explicit quotation, shared phrase, same named entity, repeated motif, and user-confirmed relationship. Similarity alone does not prove dependence.
7. A dashboard counting expected, ingested, validated, missing, and unresolved blocks and completion percentage.
8. JSON/CSV import and export for the manifest, verse blocks, crosswalks, validation report, and relationships.
9. An audit trail: never silently overwrite source text; version every correction and explain it.
10. An accessible, responsive reader that works without an AI account.

## Learning rules
- Begin with Genesis 1:1 and keep the canonical sequence stable.
- Use one verse as the smallest verifiable block; permit neighboring verses for context.
- Distinguish source text, metadata, derived observation, interpretation, and hypothesis.
- Do not infer divine intention, hidden messages, authorship, or historical certainty from numerical or lexical patterns alone.
- Record method, corpus version, normalization, comparison set, counterexamples, and validation status for every proposed pattern.
- Label machine-generated relationships as candidate patterns until verified.
- The core reader and validator must remain useful without an AI model.

## First milestone only
Implement project home and fixed scope; canon/edition manifest; block schema; lawful local-file ingestion; order/gap/duplicate/count validator; one-verse reader; progress and validation export. Do not build every advanced feature before this milestone works.

Do not scrape or reproduce copyrighted translations without permission. Use a public-domain text, a properly licensed corpus, or a user-supplied file with documented rights. If no lawful full corpus is available, build the importer and validator with a tiny clearly labeled test fixture; never pretend the full Bible has been ingested.

## Acceptance tests
- Genesis 1:1 is the first block and matches the supplied text exactly.
- Every block has a unique stable ID and sequence index.
- Canon and edition are explicit and never silently changed.
- Validator detects missing, duplicate, reordered, and changed blocks.
- Only validated blocks count as complete.
- Export/re-import preserves IDs, text, order, and manifest.
- Every derived relationship points to its source verses and method.
- No commentary or external claims enter the Bible-only corpus.
- Project scope stays fixed until all verse blocks in the selected edition are ingested and validated.

## Build instruction
Inspect the repository and available source files first. State which lawful corpus is actually available. Implement and test the schema, importer, and validator; document limitations; provide the next concrete action for loading the full corpus. Deliver working code, not just a mockup. Keep the boundary fixed: one canon, one selected edition, one ordered verse sequence, all verse blocks validated, then expanded analysis.