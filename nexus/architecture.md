# Nexus Architecture

## Product definition

Nexus is a source-grounded, multimodal knowledge environment. It connects reading, research, computation, chronology, geography, media, and learning through shared records.

## Architectural layers

### 1. Experience layer

Views can be independently developed and reused:

- Bible reader and parallel-text comparison.
- Original-language and textual-variant workspace.
- Historical timeline and chronology calculator.
- People, places, family-tree, and event explorers.
- Interactive globe and historical maps.
- Research ledger and source archive.
- Document intake, annotation, and search.
- Slideshow, movie mode, audio narration, and visual reconstructions.
- Learning games, quizzes, and evidence challenges.
- Prayer, liturgy, formation, and works-of-mercy tools.

A view must not become the only place where its data exists. Records belong in the shared model.

### 2. Shared application services

Services should provide search, stable record resolution, citation and locator generation, chronology calculations with explicit assumptions, text comparison that preserves edition identity, import/validation/export, rights checks, and revision history.

### 3. Common knowledge model

Core record families:

- Source: book, papyrus, inscription, artifact, manuscript, website, recording, or publication.
- Edition: a particular version, recension, or textual witness.
- Document: a file or digitized artifact preserved in the archive.
- Passage: a locatable portion of a text, including a Bible reference.
- Claim: a proposition made by a source or researcher.
- Event: something reported to have happened, with a date or range and date basis.
- Person and place.
- Relationship: parentage, authorship, custody, succession, or another typed link.
- Interpretation: an attributed explanation or theological reading.
- Rights record: permissions and restrictions applicable to a text, edition, image, or file.
- Media asset and research note.

### 4. Storage and preservation

Public repository:
- Application code.
- Documentation and schema.
- Rights-cleared structured data.
- Public metadata and links.
- Public-domain or permissively licensed texts whose precise source and license have been verified.

Private or permission-controlled archive:
- User-uploaded documents not approved for publication.
- Licensed Bible files and publisher-supplied databases.
- Personal research notes that should not be public.
- Large originals, scans, audio, and restricted research packages.

Later database and object storage:
- Database for searchable metadata, entities, claims, relationships, permissions, and revision history.
- Object storage for original files and derived renditions.
- Backups and an export path independent of the live web application.

Do not use a public Git repository as the default place to store all uploaded documents. A public repository is not a private archive.

### 5. AI and automation layer

AI may help with extraction, classification, summarization, comparison, entity resolution, and question generation. Outputs must retain source and exact locator, model-generated versus human-authored status, generation date, review status, supporting and counterevidence, and rights eligibility for the particular processing operation.

AI-generated material must never silently overwrite source text or convert a hypothesis into an attested fact.

## Integration strategy for existing modules

Do not rebuild working modules merely to make them visually uniform. First inventory their data and capabilities, then integrate them by stable IDs and adapters.

- Scripture Evidence: adopt as the initial claim and source-ledger model; preserve existing browser-local export/import behavior while designing a future shared store.
- Countless Cabinet: inventory its datasets and map records to people, places, events, and source IDs.
- Solarium: map chronological records to shared event IDs and retain its visualization.
- Motion Showcase: reuse motion and presentation components as a presentation layer.
- Liturgy: connect readings and calendar events through source and date records.
- Mercy: retain its distinct service workflow; link content to Scripture and other records where appropriate.
- React reader: inspect and migrate reader, notes, glossary, and cross-reference components into the integrated experience when backend and permissions permit.

## Technical path

Prototype: static HTML/JS and existing Vite/React code. Local browser preferences and JSON export only. No claim of cloud sync.

First durable release: choose a backend after confirming deployment and access requirements. A relational database fits the many relationships among events, sources, claims, passages, and people. Add authenticated object storage for files and a full backup/export path.

Later research features: full-text search, document parsing, page-level citations, original-language tooling, timeline calculations, graph queries, and licensed text APIs.

## Non-negotiable quality controls

- Stable IDs; no identity by display title alone.
- Exact provenance and versioned sources.
- Separate event date, writing date, composition date, and manuscript date.
- Explicit date uncertainty and alternative chronologies.
- No rights assumption from public accessibility.
- No unsupported auto-merging of similarly named people or places.
- Preserve conflicting witnesses.
- Accessibility, responsive layout, keyboard operation, and reduced-motion support.
- Every public claim can be traced to its source or marked as unverified.
