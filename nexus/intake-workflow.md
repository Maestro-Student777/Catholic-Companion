# Nexus Document Intake and Archive Workflow

## Purpose

Allow the project to grow through user-supplied files, public sources, manuscript images, licensed texts, research articles, presentations, and existing HTML widgets without losing the source, context, rights, or revision history.

## Intake stages

### 1. Receive

Accept a file or source link. Record original file name, format, MIME type, size, date received, supplied by, source location or URL, intended project use, and any accompanying permission statement.

Do not assume that a file supplied by a user is cleared for public redistribution.

### 2. Preserve the original

Keep the original file unchanged. Store a checksum (preferably SHA-256), version, and archive location. Never edit the only copy of an original manuscript scan, PDF, spreadsheet, or HTML widget.

### 3. Classify sensitivity and rights

Assign separate labels:

- Public domain / license verified.
- Permission granted for specified use.
- Permission requested.
- Personal research only.
- Copyright status unknown.
- Restricted / do not publish.
- Confidential or personal.

Rights status and factual review status are separate. A source can be historically reliable but not licensed for republication.

### 4. Extract and index

Extract content only in a way permitted by the rights record. Preserve exact locators:

- PDF: page number and printed page label where different.
- DOCX: heading, paragraph, table, and page where reliable.
- Spreadsheet: sheet, row, and cell range.
- Slide deck: slide number and element.
- HTML: URL, title, heading, and paragraph.
- Audio/video: timestamp and speaker.
- Manuscript: repository, shelfmark, folio, column, line, and image coordinate.

For scans, retain both the page image and any transcription. Mark OCR-derived text as machine-extracted and unverified until checked.

### 5. Create structured records

Create separate records for the source or publication, its edition or version, the stored document, passages or locators, claims extracted from it, people, places, events and relationships mentioned, and rights and attribution information.

Do not make the extracted summary the only preserved representation.

### 6. Review

A reviewer checks whether the summary accurately represents the source, the quote is exact, the locator is correct, the date type is identified, alternative readings are preserved, evidence is distinguished from inference, and content is cleared for the intended use.

### 7. Publish or retain privately

Only publish portions cleared for public distribution. Private or licensed original files remain in permission-controlled storage. A public record may contain metadata, a citation, and a lawful link even when the full text cannot be republished.

## What to upload in this project

Useful starting materials include existing HTML widgets or ZIP exports, research documents and notes, Bible edition details and license correspondence, manuscript or archaeology PDFs, timeline datasets and spreadsheets, existing slide decks, images with source information, permission letters, and license agreements.

For a first pass, supply a small representative set rather than every archive at once: one HTML widget, one timeline/data file, one research PDF, one Bible edition record, and any permission letter relevant to those materials.

## Current prototype behavior

The Nexus web page currently registers file metadata in browser local storage only. It does not upload file bytes to a server, perform text extraction, or synchronize across devices. The exported manifest does not contain original documents. Actual file analysis can begin when documents are attached to the working conversation or supplied through an approved archive integration.
