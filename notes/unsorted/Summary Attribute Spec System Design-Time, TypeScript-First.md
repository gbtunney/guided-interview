- bute Spec System (Design-Time, TypeScript-First)

Goal

Define a human-first, design-time attribute specification format that sits
before schemas, databases, APIs, or UI frameworks.

It is meant for thinking, documenting, and standardizing fields consistently
across projects.

This is not a schema language and not tied to a platform.

Core Concepts

1. Shape vs Meaning

We distinguish data shape from semantic intent:

- Scalar: a single value (e.g. string, number, boolean)
- Enum: scalar with a fixed allowed set
- Object: fixed structure with known fields
- List: ordered collection (T[])
- Map / Dictionary: key → value store with variable keys (Record<string, T>)

Key rule:

- Keys are part of the schema → Object
- Keys are part of the data → Map

1. TypeScript-First

- The TypeScript type is the source of truth
- No separate “raw vs logical” type layer
- Semantic meaning is captured via constraints, UI choice, and optional
  description

1. ID and Label System

Fields have:

- ID: machine identifier (stable, boring)
- Label: human-facing display name

Automatic derivation:

- product_id / product-id / productId → “Product ID”
- “Product ID” → product_id (default: snake_case)

Common naming styles are acknowledged:

- snake_case
- kebab-case
- camelCase
- PascalCase

1. Presence Is Separate From Type

Presence rules are orthogonal to the TS type:

- Required: must be present
- Optional: may be omitted
- Default: assumed if missing (does not imply required)

Nullable is explicitly treated as:

- Advanced / optional
- Documented in the cheat sheet
- Not part of the default “quick flow”

1. Constraints as an Idea Menu

Constraints are suggestive, not mandatory.

They exist to prompt thinking, not enforce structure.

Grouped by data shape:

- Text (length, pattern, nonEmpty, unique)
- Number (min/max, integerOnly)
- Date/time (notInFuture, min/max)
- List (minItems, uniqueItems)
- Object (noExtraKeys)
- Map (keyPattern, maxKeys)
- Cross-field rules live in notes

1. UI Components as Hints, Not Contracts

UI components are documented as intent, not implementation.

Examples:

- text, select, date-picker, repeater, key-value-editor
- UI flags exist but are intentionally lightweight and optional

1. Reference Object Convention

When references are modeled as objects (instead of raw IDs), a minimal standard
is suggested:

type Ref = {

  id: string

  label?: string

  type?: string

}

Only use additional fields if needed.

Minimal Field Spec Format

Agreed ordering and structure:

- Use id, not field
- Put constraints above example
- Separate description (semantic meaning) from notes (misc context)

```yaml

data_obj:
    - id: <id>
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

### Guided Interview / Conversational Flow

We designed a non-rigid, AI-assisted interview that:

- Accepts ID or Label first
- Derives the other automatically
- Suggests TS types instead of forcing early decisions
- Uses numbered choices for low cognitive load
- Has a Quick mode by default:

1. ID or Label
2. Type intent (AI suggests TS type)
3. Presence (required + default)
4. Constraints (optional)
5. UI component (optional)
6. Description (optional)
7. Emit spec

-

Nullable, UI flags, and platform mappings are intentionally not part of the
default flow.

Future (Explicitly Deferred)

- Platform adapters (Airtable, Appsmith, etc.)
- Automatic mapping to schema languages
- Quiz/flashcard mode for reinforcement

These are noted but not baked into the core system.

Bottom Line

You now have:

- A clean, repeatable field-thinking framework
- A TypeScript-aligned mental model
- A human-readable spec format
- A conversational way to generate specs without tooling

This is a solid stopping point and a clean place to start a new thread.
