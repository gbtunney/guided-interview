# Attribute Spec — Guided Interview (AI-Assisted Flow)

## Identity Phase

## Type Phase

## Other?

#### Steps

1. ID or Label
2. Type intent (AI suggests TS type + shape)
3. UI component (optional)
4. Presence (required + default)
5. Constraints (optional)
6. Description (optional)
7. Emit spec

Advanced topics (nullable, UI flags, platform mapping) are skipped unless
explicitly requested.

### Full Mode (optional)

Adds:

- Explicit label confirmation
- Example refinement
- Additional constraint prompts
- Optional UI flags

## Step-by-Step Question Flow (Dynamic Order)

The interview does not enforce a fixed order. Instead, it adapts based on what
the user is most confident about.

The AI may ask Type, UI, or Intent first, then infer the rest.

### Entry Point — Sketch the Field

User may start with any one of the following:

- ID, Label,Description
  - e.g. install_date or “Install Date”
- Rough idea / intent
  - e.g. “a date when it was installed”
- UI-first choice
  - e.g. “date picker”, “checkbox”, “dropdown”
- Type-first hint
  - e.g. string, number, list, “enum”

#### AI behavior

- Accept whichever signal is given
- Infer missing pieces
- Normalize into ID + Label + TS type

### Resolution Loop

After the entry point, the AI resolves the remaining attributes in a flexible
order:

- If UI is known first → infer TS type
- If TS type is known first → suggest UI
- If only intent is known → propose both

At each step, the AI:

- Offers numbered options
- Allows skipping
- Allows correction (“no, make it a list”)

### Minimal Quick Path

The interview completes once the following are known:

- ID
- Label
- TS type
- Required or optional

Everything else is optional.

## Example Dynamic Flows

### Flow A — Data-first

1. “install_date”
2. Type: date-like
3. TS: string
4. UI: date-picker

### Flow B — UI-first

1. “date picker”
2. Intent: installation date
3. TS: string
4. ID: install_date

### Flow C — Intent-first

1. “a list of maintenance events”
2. TS: { date: string; note: string }[]
3. UI: repeater
4. ID: maintenance_events

## Transcript Capture (Design Note)

After an interview completes, the AI can reconstruct a transcript containing:

- Each question asked
- Each user response
- The final emitted spec

### Format options

- Markdown
- YAML
- Plain text

This transcript can be:

- Shown inline
- Placed into a Canvas document
- Prepared for download (copy/paste)

#### Note

- This is a logical reconstruction, not a raw system log
- Exact timestamps and system metadata are not preserved

### Download Strategy (Practical)

Because ChatGPT cannot push files automatically:

- The transcript is emitted as Markdown or text
- You download it by:
  - copying from Canvas
  - or saving from your editor

## TODO: SPEC DRAFT

```yaml
identity:
  id: <id> #sluglike
  label: <derived or explicit>
  description: <meaning>
type:
  technical: <technical list>
  conceptual: <conceptual list>
  raw: <possib type>
ui:
  component: <component>
constraints:
  - <rule>
presence:
  optional: boolean
  required: boolean
  default: <value>
example: <value>
notes: <optional misc>
```

## Minimal Field Spec Template

### Order Preference

- Put constraints above example.
- Use ID (not “field”).
- Description is optional (semantic meaning), separate from notes.

```yaml
id: <id>
label: <derived or explicit>
ts: <TypeScript type>
presence:
  required: true|false
  default: <value>
constraints:
  - <rule>
example: <value>
ui:
  component: <component>
description: <optional semantic meaning>
notes: <optional misc>
```

### Examples TODO; update w new schema

#### Short Text Name

```yaml
  id: name
  label: Name
  ts: string
  presence:
   required: true
   default: null
  constraints:
  - nonEmpty
    example: “Example name”
    ui:
     component: text
    description:
    notes:
```

#### Array of Objects

```yaml
  id: maintenance_events
  label: Maintenance Events
  ts: { date: string; note: string }[]
  presence:
   required: false
   default: []
  constraints:
  - maxItems: 200
    example:
  - { date: “2025-10-01”, note: “cleaned impeller” }
    ui:
     component: repeater
    description:
    notes: item.date is DateString
```

#### Map / Dictionary

```yaml
id: labels
label: Labels
ts: Record<string, string>
presence:
  required: false
  default: {}
constraints:
  - keyPattern: ^[a-z0-9-]+$
  - maxKeys: 50
    example: { location: “living-room” }
    ui:
      component: key-value-editor
    description:
    notes: keys are slug-like
```
