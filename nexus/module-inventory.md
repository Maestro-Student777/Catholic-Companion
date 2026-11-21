# Existing Module Inventory

This inventory was prepared from the repository tree and source files inspected for the Nexus foundation branch. It is a starting inventory, not a full test report.

| Existing module | Current repository location | Observed role | Integration direction |
|---|---|---|---|
| Public collection home | `/index.html` | Public navigation and status map for the project collection | Add Nexus as the shared workspace entrance; retain existing destinations. |
| Scripture Evidence & Discovery | `/scripture-evidence/` | Claim ledger, source registry, places/events, questions, methodological rules, local persistence and JSON backup/restore | First source/claim model; map records to stable shared IDs and add provenance-aware imports. |
| Countless Cabinet | `/countless-cabinet/` and `/countless-cabinet/data/` | Historical catalogs, chronology and archive records; includes large data files and archive material | Inventory datasets, identify duplicate/related records, build reversible import adapters. |
| Solarium Rhythm | `/solarium/` | Celestial clock and Earth Story Atlas / chronological visualizations | Link timeline events by stable IDs; preserve the existing visualization. |
| Motion Showcase | `/motion-showcase/` | Motion and presentation experiments | Reuse as the presentation/motion layer for timeline movie mode. |
| Liturgy | `/liturgy/` | Liturgical calendar and reading links with an existing daily-update script/workflow | Connect date, reading, feast, and source records; keep publisher links and permissions clear. |
| Mercy Amplification | `/mercy/` | Practical resource pathways and works of mercy | Preserve as a separate formation/service module; add optional Scripture and source links. |
| React research companion | `/src/` | Reader, AI companion, notes, glossary, and cross-reference UI | Review backend/API status, state persistence, security, and content rights before integrating into the public static experience. |
| Bible verse-code project | `/bible-verse-code/` | Separate build specification for a canonical verse sequence | Align its canon/edition metadata with the shared edition and passage model. |

## Important observed limitations

- Scripture Evidence README explicitly says records are local to the browser and do not sync.
- Scripture Evidence README says automatic source fetching, full-text indexing, OCR, manuscript collation, and bulk ingestion of the existing timeline/Solarium data are not implemented.
- The simpler Countless Cabinet page says entries are local to the browser and can be exported; it is not yet a connected server archive.
- The React Reader fetches arbitrary URLs through `/api/proxy`; its AI companion and server dependencies need a separate deployment/security review. It must not be assumed to run as a static GitHub Pages feature.
- A repository ZIP, large catalog file, or HTML widget is an asset to preserve and inventory before migration; do not replace it with a simplified placeholder without checking its contents.

## Integration rule

Keep original data and applications intact. For each imported dataset, create: (1) a read-only source snapshot; (2) a mapping report; (3) normalized shared records; and (4) a validation report listing unresolved IDs, duplicates, rights gaps, and dropped or unsupported fields. Human review is required before merging ambiguous identities or replacing earlier records.
