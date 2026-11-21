# Nexus — Unified Knowledge Workspace

Nexus is the integration layer for the Catholic-Companion repository. It connects Scripture reading, textual witnesses, historical research, chronology, maps, documents, source records, presentations, and learning experiences through shared records.

## Open the prototype

Open the workspace at `/nexus/` after this branch is merged and the repository's Pages deployment publishes it.

## Existing repository modules

- Scripture Evidence & Discovery: claim ledger, source registry, places/events, research questions, methodological rules, browser-local persistence, and JSON backup/restore.
- Countless Cabinet: chronology and catalog material.
- Solarium Rhythm: celestial time and chronological visualization.
- Motion Showcase: motion and presentation experiments.
- Mercy Amplification: practical resources and works of mercy.
- Liturgy: daily liturgical calendar and reading links.
- React research companion: reader, notes, glossary, and cross-reference components in the source tree.

These tools are not yet a single synchronized application. Existing browser-local records do not automatically sync between tools or devices.

## First-build limits

- No full Bible text is bundled in Nexus.
- The reader page stores reading preferences only.
- Document intake registers file metadata in the current browser; it does not upload or preserve file bytes.
- Local browser data is not a secure archive or synchronized database.
- Source records and timeline examples are starter material, not a verified historical database.
- Copyright and permission records must be completed before copyrighted text, notes, audio, maps, or images are ingested or published.

## Working rules

1. Preserve the original file or source unchanged.
2. Give each source, document, claim, passage, event, person, and place a stable ID.
3. Record exact provenance and locators: page, line, verse, section, timestamp, inscription line, or artifact number.
4. Separate testimony, transcription, translation, editorial reconstruction, inference, interpretation, and doctrinal teaching.
5. Preserve alternative readings and chronological models; never overwrite them with a preferred conclusion.
6. Record rights at the edition and asset level.
7. Keep private, licensed, or restricted originals outside the public Git repository unless permission explicitly allows public redistribution.
8. Publish new research through reviewable, versioned changes.

## Documentation

- architecture.md — system layers and integration strategy.
- data-model.md — stable record types, IDs, date conventions, and relationships.
- intake-workflow.md — how user documents and external sources enter the archive.
- rights-register.md — rights gates and current Bible-text licensing notes.
- roadmap.md — incremental build phases and acceptance criteria.
- data/seed-records.json — example records using the proposed schema.

## Next implementation milestone

Use Exodus 1:8–14 as the pilot workflow. A user should be able to select a rights-cleared text, compare a second witness, open the relevant source records, view a dated historical hypothesis, attach notes, and export the complete research packet with provenance preserved.
