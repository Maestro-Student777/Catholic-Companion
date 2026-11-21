# Nexus Implementation Roadmap

## Guiding strategy

Build a connected foundation around the existing Catholic-Companion repository. Keep existing modules intact until their data and behavior have been inventoried. Migrate through adapters and shared records, not one large rewrite.

## Phase 0 — Foundation

Deliverables: Nexus landing workspace; existing-module inventory and navigation; architecture and data-model specification; document intake workflow; rights register; seed data and first pilot subject.

Acceptance: user can open the Nexus workspace, identify existing tools and current limitations, save reading preferences locally, register source and file metadata locally, export a JSON backup, and see that no unsupported cloud-sync or licensed-text claim is being made.

## Phase 1 — Normalize current data

Inventory Scripture Evidence claims, source records, events, places, questions and methodological rules; Countless Cabinet data files and archived datasets; Solarium timeline records; Liturgy calendar/readings data; Mercy resources; Motion Showcase story and motion data; and reader notes, glossary, and cross-reference types.

For each dataset, record its current format, number of entries, provenance, rights, validation needs, and export method. Create import adapters that map existing records into the shared model without deleting original fields. Keep the raw source export and a mapping report.

Acceptance: one stable ID per source, event, person, place, claim and relationship; duplicate candidates are flagged for human review, not auto-merged; each imported record traces back to its original file and location.

## Phase 2 — Exodus pilot

Scope: Exodus 1:8–14.

Deliver: two or more licensed or rights-cleared textual witnesses; translation and textual-tradition selector; exact verse-by-verse parallel display; source registry and claim ledger; event timeline with 1446 BC and later chronology hypotheses kept separate; Egyptian places map with uncertain identifications visibly marked; document links and page/line citations; notes, exportable research packet, and revision history.

Acceptance: a user can select a verse, inspect the text and variant, open its source, see related claims and a timeline hypothesis, add a note, and export the research with citations intact.

## Phase 3 — Persistent archive

Choose a backend based on deployment and privacy requirements. Implement authentication and roles, a database for shared records and relationships, private object storage for original files, document extraction and indexing with locators, versioning, audit log, backups and recovery, search across authorized content, and user export.

Acceptance: a user can upload a permitted document, retrieve it on another device, see its provenance and rights, and trace extracted claims back to the original page or location.

## Phase 4 — Bible and manuscript services

Integrate each translation and witness independently. Enforce rights at the level of display, storage, search, AI processing, audio, export, and redistribution. Build manuscript comparison only where reliable transcriptions and image permissions exist.

## Phase 5 — Timeline, globe, and learning

Connect Adam-to-Leo historical overview, family and tribal genealogy, event chronology and alternative models, ancient and modern place identities, historical globe and map layers, movie mode with pause-to-inspect details, quizzes and evidence challenges, and slide/document generation from reviewed records.

## Phase 6 — Publication and collaboration

Add public compendium pages, private research workspaces, editorial review and contributor roles, attribution and license displays, downloadable research packages, community feedback, and correction history.

## Do not do yet

- Do not rewrite all existing HTML widgets.
- Do not copy all Bible editions into one database before rights are cleared.
- Do not merge contradictory chronology models.
- Do not place private user documents in the public repository.
- Do not treat generated summaries as verified source records.
- Do not add sign-in, billing, or AI API costs before the core no-account research experience is proven.
