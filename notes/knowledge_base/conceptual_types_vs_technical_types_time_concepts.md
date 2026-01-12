# Schema Types

## Conceptual Types

A **conceptual type** describes **what something is in the real world**,
independent of how it is stored, transmitted, or rendered. It is **conceptual
and portable**, not tied to TypeScript, databases, or UI frameworks.

It answers:

> “What kind of thing is this?”

Conceptual types are:

- Human-meaningful
- Stable across systems
- Portable between platforms

Examples:

- Date
- DateTime
- Duration
- Identifier
- Boolean flag
- Reference
- Measurement
- Money
- File

---

## Technical (Raw) Types

A **technical type** (sometimes called _raw_ or _storage_ type) describes **how
a value is represented** in code or data.

Examples:

- `string`
- `number`
- `boolean`
- `{ ... }`
- `T[]`

A single conceptual type may map to multiple technical types.

---

## UI / Interaction Types

A **UI type** describes **how a human interacts** with the value.

Examples:

- date-picker
- time-picker
- checkbox
- text input
- slider
- repeater

UI types are _affordances_, not data definitions.

---

## Why Separate These Layers?

Because they change at different rates:

- Conceptual meaning is stable
- Technical representation changes by platform
- UI changes by context

Separating them prevents premature coupling
