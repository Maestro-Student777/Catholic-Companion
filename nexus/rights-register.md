# Nexus Rights Register and Bible Text Policy

This is a working rights register, not legal advice. It identifies questions that must be resolved before ingesting, displaying, processing, or distributing any edition or media asset.

## Core rule

A permission to create a compendium, educational resource, or one publication is not automatically a license to reproduce a complete Bible translation in a public website or app.

Every edition needs a rights record that states the exact work, edition, territory, audience, media, and permitted operations.

Separate these operations: read or link to the publisher's text; display selected verses; display complete books or a complete Bible; store or cache the text; full-text search or indexing; compare translations; submit text to an AI system for analysis or summarization; produce audio narration; create adaptations or translations; export or redistribute text; and use the text in commercial or paid features.

## Initial research findings checked 2026-11-21

### Original Douay-Rheims

The source site The Original Douay-Rheims states that the original 1582 New Testament and 1609–1610 Old Testament translation is public domain. It also states that its structured data downloads are released under CC0 1.0. This is a promising candidate for an initial corpus, but the exact file, edition, annotations, and data package must be checked before import.

- Terms: https://thedouayrheims.com/terms
- Downloads: https://thedouayrheims.com/download
- About and edition distinctions: https://thedouayrheims.com/about

Do not assume that every modern edition, annotation, introduction, typography, or scan associated with a historic translation has identical rights.

### Open Scriptures Hebrew Bible

The Open Scriptures Hebrew Bible project identifies the Westminster Leningrad Codex text as public domain and its lemma/morphology resources as CC BY 4.0. Attribution is required for the CC BY components.

- Project: https://hb.openscriptures.org/
- License: https://github.com/openscriptures/morphhb/blob/master/LICENSE.md

Keep the base text, morphology, lexical data, and later editorial markup as separate rights components.

### New American Bible Revised Edition

The USCCB / Confraternity of Christian Doctrine permissions page states that digital permissions are no longer being granted for the NABRE and that digital licensing for the anticipated Catholic American Bible was not yet open on the page checked for this register. It describes separate rules for limited print, sound, and eBook quotation and for digital products.

- Official permissions page: https://www.usccb.org/offices/new-american-bible/permissions
- Permission contact shown by USCCB: nabperm@usccb.org

For the present prototype, link to authorized USCCB reading pages rather than ingesting the full NABRE text.

### English Standard Version

Crossway's current permissions pages describe standard quotation limits, but also state that ESV text may not be used, accessed, or processed by AI systems for purposes including developing, training, fine-tuning, interpreting the text, or generating AI responses based on the text.

- Permissions guide: https://www.crossway.org/permissions/
- Digital permission information: https://www.crossway.org/permissions/digital/

Because Nexus is intended to use AI-assisted research, do not submit ESV text to AI processing or include it in AI analysis unless Crossway provides written terms that explicitly authorize the proposed operations and supersede the restriction.

### NRSV, NRSVue, and NRSVue Catholic Edition

The National Council of Churches / Friendship Press identifies itself as the copyright owner. The official licensed-text sites identify Petradi International Rights Services as the rights and permissions manager and Scribe as the text-file provider for licensees.

- NRSVue permissions and file access: https://nrsvue.scribenet.com/
- NRSVue Catholic Edition: https://nrsvuece.scribenet.com/
- NRSV: https://nrsv.scribenet.com/

A license inquiry should describe the actual app and requested operations: full-text digital display, parallel comparison, storage, caching, search, AI-assisted analysis, audio, downloadable exports, and public or commercial distribution. Do not assume approval for one operation covers the others.

## Permission inquiry packet

When approaching a publisher or rights holder, prepare:

1. Project name, owner, website, and organization status.
2. Public or private access model.
3. Whether the app is free, donation-supported, subscription-based, or commercial.
4. Exact Bible translation and edition.
5. Number of verses, books, or complete Bible text required.
6. Parallel-text and comparison features.
7. Whether the text is stored, cached, indexed, or downloaded.
8. Whether AI will process the text, including retrieval, summarization, question answering, or generated commentary.
9. Whether users can export, print, or listen to the text.
10. Territory, audience, expected scale, attribution, fee, reporting, and renewal requirements.

Request written confirmation of each permitted operation. Keep the signed agreement or email in the private rights archive and link its document ID in the rights record.

## Publication gate

Until rights are recorded and reviewed:

- Link to the publisher's authorized Bible page.
- Use public-domain or clearly licensed texts only after validating the exact version and file provenance.
- Do not scrape a website simply because the text is viewable.
- Do not store copyrighted full texts in the public repository.
- Do not send restricted text to AI or third-party APIs without authorization.
- Do not assume copyright permission for a translation also covers study notes, maps, introductions, footnotes, audio, photographs, or database structure.

Review this register periodically. Publisher terms can change.
