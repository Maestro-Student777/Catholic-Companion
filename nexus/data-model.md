# Nexus Shared Data Model

This document defines an interoperable record model broad enough to connect Scripture, history, manuscripts, research, and media.

## ID convention

Use permanent, type-prefixed identifiers:

- SRC-000001 — source.
- EDT-000001 — edition or textual witness.
- DOC-000001 — archived document.
- PAS-000001 — passage or text locator.
- CLM-000001 — claim.
- EVT-000001 — event.
- PER-000001 — person.
- PLC-000001 — place.
- REL-000001 — relationship.
- INT-000001 — interpretation.
- RGT-000001 — rights record.
- MED-000001 — media asset.
- NOTE-000001 — research note.

IDs never change when a title, date estimate, or interpretation changes. If a record is merged or split, preserve redirect or supersession links.

## Common fields

Every record should support: id, record_type, title or display_name, summary, created_at, updated_at, created_by, provenance, review_status, revision, tags, and related_record_ids.

Do not treat an AI-generated summary as the source itself.

## Source record

A source describes an identifiable witness or publication. Recommended fields:

- source_id; title; author_or_attributed_author; originating_culture_or_institution; source_type; original_language; place_of_origin; date_of_origin; date_basis; current_repository_or_collection; shelfmark_or_catalog_number; stable_url; bibliographic_citation; edition_ids; rights_record_ids; limitations; provenance_notes.

Source types should distinguish primary text, inscription, manuscript, artifact, translation, critical edition, official institutional document, scholarly publication, and modern commentary.

## Edition and witness record

A source may have multiple editions, manuscripts, recensions, translations, or digitizations. Keep them separate. Fields include edition_id, source_id, edition_title, editor_or_translator, language, textual_tradition, publication_or_copy_date, publisher_or_repository, version_or_revision, transcription_policy, license_status, rights_record_id, source_file_id, and stable_url.

For biblical text, never use the bare label Bible as the only edition identifier. Record the canon, textual base, translation, edition, revision, and publisher.

## Passage record

A passage is a locator, not necessarily a stored copy of the text. Fields include passage_id, edition_id, book, chapter, verse_start, verse_end, original_language_locator, page_or_line_locator, quoted_text_reference, text_storage_status, and rights_record_id.

The same biblical reference in two editions has two edition-specific passage records.

## Claim record

A claim is a proposition made by a source or researcher. Fields include claim_id, claim_text, claim_kind, asserted_by, source_ids, passage_ids, exact_locators, evidence_status, reasoning, limitations, supporting_claim_ids, counterevidence_claim_ids, alternative_explanations, reviewer, and review_status.

Suggested evidence statuses: directly attested; independently corroborated; compatible context; inferred; disputed; contradicted; unknown or not established. These are epistemic labels, not automatic numerical confidence scores.

## Event record and date model

Events must support date ranges and multiple competing chronologies. Fields include event_id, event_name, description, date_start, date_end, date_display, date_precision, calendar_or_era, chronology_model_id, date_basis, source_ids, passage_ids, people_ids, place_ids, certainty_status, alternative_event_ids, and notes.

Use astronomical year numbering internally for integer years: 1 BC = year 0, 2 BC = year -1, 1 AD = year 1. Always display dates in conventional BCE/CE or BC/AD notation as chosen by the project. Do not convert uncertain date ranges into falsely precise point dates.

Keep four distinct date fields where applicable:

1. Event date: when the narrative says the event occurred.
2. Testimony or writing date: when the source says a record was made.
3. Composition or editorial date: when the literary work reached a particular form.
4. Manuscript date: when the surviving physical witness was copied or produced.

Do not infer one of these dates automatically from another.

## Person, place, and relationship records

Person fields should include name variants, language forms, approximate lifespan, role, family relationships, source references, and identity uncertainty.

Place fields should include ancient and modern names, coordinates, geographic type, time-dependent names, identification basis, competing identifications, and source references.

Relationships must be typed and sourced: parent, child, spouse, sibling, tribe, ruler, successor, author, scribe, custodian, teacher, student, geographic containment, or another explicitly named relation.

Do not merge people solely because their names resemble one another.

## Rights record

Rights apply to a particular edition, file, image, recording, or dataset. Fields include rights_id, rights_holder, work_or_asset, edition_or_version, license_name, license_url, written_permission_file_id, territory, audience, commercial_status, start_date, end_date, allowed_operations, prohibited_operations, AI_processing_permission, storage_and_caching_permission, redistribution_permission, attribution_text, fee_or_royalty_terms, review_date, reviewer, and status.

Allowed operations should be recorded independently: reading, display, quotation, storage, caching, indexing, search, comparison, AI processing, translation, narration, adaptation, download, redistribution, and commercial distribution.

## Research note and change history

A note must identify its author and sources. A revision must record what changed, why, who changed it, and which earlier record it supersedes. Preserve old conclusions rather than silently rewriting them.

## Import and export

Use UTF-8 JSON as the first portable exchange format. Validate schema version, IDs, references, dates, and rights status before import. Exports should include the related source and rights metadata needed to interpret a record outside the application. The database schema may later be implemented in SQL, but the JSON record contract should remain portable.
