# Attribute Spec — Guided Interview (AI-Assisted Flow)

This document defines the conversational, AI-guided interview process used to
produce field or object specs that conform to the Attribute Spec cheat sheet.

It is not a rigid CLI, schema, or form. It is a human-first interview with
suggested options and defaults.

Purpose

- Reduce cognitive load when defining fields
- Avoid premature schema decisions
- Allow freeform answers with AI normalization
- Produce a clean, final Markdown spec at the end

Core Principles

- One question at a time
- Numbered options where possible
- Freeform answers always allowed
- “Quick” by default, expandable to “Full” if needed
- TypeScript-first output
- Platform-agnostic

Interview Modes

Quick Mode (default)

Used for most fields.

Steps:

1. ID or Label
2. Type intent (AI suggests TS type + shape)
3. Presence (required + default)
4. Constraints (optional)
5. UI component (optional)
6. Description (optional)
7. Emit spec

Advanced topics (nullable, UI flags, platform mapping) are skipped unless
explicitly requested.

Full Mode (optional)

Adds:

- Explicit label confirmation
- Example refinement
- Additional constraint prompts
- Optional UI flags

Step-by-Step Question Flow (Dynamic Order)

The interview does not enforce a fixed order. Instead, it adapts based on what
the user is most confident about.

The AI may ask Type, UI, or Intent first, then infer the rest.

Entry Point — Sketch the Field

User may start with any one of the following:

1. ID or Label

- e.g. install_date or “Install Date”

1.

1. Rough idea / intent

- e.g. “a date when it was installed”

1.

1. UI-first choice

- e.g. “date picker”, “checkbox”, “dropdown”

1.

1. Type-first hint

- e.g. string, number, list, “enum”

1.

AI behavior:

- Accept whichever signal is given
- Infer missing pieces
- Normalize into ID + Label + TS type

Resolution Loop

After the entry point, the AI resolves the remaining attributes in a flexible
order:

- If UI is known first → infer TS type
- If TS type is known first → suggest UI
- If only intent is known → propose both

At each step, the AI:

- Offers numbered options
- Allows skipping
- Allows correction (“no, make it a list”)

Minimal Quick Path

The interview completes once the following are known:

- ID
- Label
- TS type
- Required or optional

Everything else is optional.

Example Dynamic Flows

Flow A — Data-first

1. “install_date”
2. Type: date-like
3. TS: string
4. UI: date-picker

Flow B — UI-first

1. “date picker”
2. Intent: installation date
3. TS: string
4. ID: install_date

Flow C — Intent-first

1. “a list of maintenance events”
2. TS: { date: string; note: string }[]
3. UI: repeater
4. ID: maintenance_events

Transcript Capture (Design Note)

After an interview completes, the AI can reconstruct a transcript containing:

- Each question asked
- Each user response
- The final emitted spec

Format options:

- Markdown
- YAML
- Plain text

This transcript can be:

- Shown inline
- Placed into a Canvas document
- Prepared for download (copy/paste)

Note:

- This is a logical reconstruction, not a raw system log
- Exact timestamps and system metadata are not preserved

Download Strategy (Practical)

Because ChatGPT cannot push files automatically:

- The transcript is emitted as Markdown or text
- You download it by:

- copying from Canvas
- or saving from your editor

Future Extensions (Deferred)

- Platform adapters (Airtable, Appsmith, etc.)
- Schema export (JSON Schema, Zod, etc.)
- Quiz / flashcard mode
- Batch interviews

These are intentionally out of scope for the current flow.
