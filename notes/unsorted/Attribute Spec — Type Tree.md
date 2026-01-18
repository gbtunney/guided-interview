# Attribute Spec — Type Tree

> Use this as a design-time picker. Choose the shape, write the TypeScript
> type,then add lightweight notes for constraints and UI.This is intentionally
> plain Markdown, not a schema language.

## Table of Contents

- [Vocabulary](#vocabulary)
  - [Scalar](#scalar)
  - [Object vs Map / Dictionary](#object-vs-map--dictionary)
- [ID and Label (Naming Conventions)](#id-and-label-naming-conventions)
  - [ID](#id)
  - [Label](#label)
  - [Derivation Rule (Default)](#derivation-rule-default)
- [Shape](#shape)
- [TypeScript Type Families](#typescript-type-families)
- [Presence and Defaults](#presence-and-defaults)
  - [Nullable (Advanced)](#nullable-advanced)
- [Common Constraints](#common-constraints)
- [Common UI Components](#common-ui-components)
- [Identification and Reference Object Conventions](#identification-and-reference-object-conventions)
- [Minimal Field Spec Template](#minimal-field-spec-template)
  - [Order Preference](#order-preference)
- [Examples](#examples)
  - [Short Text Name](#short-text-name)
  - [Array of Objects](#array-of-objects)
  - [Map / Dictionary](#map--dictionary)
- [Guided Interview Flow](#guided-interview-flow)
  - [Default Behavior](#default-behavior)
  - [Quick Steps](#quick-steps)
  - [Notes](#notes)
- [Quiz Note (Future Use)](#quiz-note-future-use)

---

- **Scalar (one value, no structure):**
  - string
  - number
  - boolean
  - null (rare; prefer T | null)
- **Enum (scalar with a fixed allowed set):**
  - string literal union: 'a' | 'b' | 'c'
  - number literal union: 1 | 2 | 3
- **Object (fixed structure, known fields):**
  - inline: { ... }
  - named: type X = { ... }
- **List (ordered collection of items):**
  - array: T[]
  - readonly array: readonly T[]
  - tuple (fixed length): [T1, T2]
- **Map / Dictionary (key → value lookup, variable keys):**
  - Record<string, T>
  - Record<'k1' | 'k2', T> (known key set, still map-shaped)

---

## Vocabulary

### Scalar

- A single value.
- Not nested, not iterable, not a container.

#### Examples

- string
- number
- boolean
- null
- literal unions like 'a' | 'b'
- date strings `2023-10-01`
- time strings `14:30:00`
- email strings `example@example.com`
- URL strings `https://example.com`
- > **Non-examples**: _objects, lists, maps._

### Object vs Map / Dictionary

- **Object:** Known fields, fixed meaning per field.  
  **Example**: `{ id: string; name: string }`
- **Map / Dictionary:** Variable keys, uniform value type.  
  Example: `Record<string, string>` where keys are data.

**Rule of thumb:**

- If keys are part of the schema → `Object`
- If keys are part of the data → `Map`

---

## Shape

## Presence and Defaults

These are orthogonal to the TS type.

- **Required:** The field must be present in the object. (TS: omit ?)
- **Optional:** The field may be absent. (TS: field?: T)
- **Default:** Value assumed if missing. Does not imply required.
- **other**:
  - **Nullable:** Field may explicitly be null. `T | null`
  - **Optional + Nullable:** `{ field?: T | null}`

---

## Identification and Reference Object Conventions

If you use references as objects (instead of raw id strings), a common minimal
shape is:

- **Ref**
  - id: string (required)
  - label?: string (optional display label)
  - type?: string (optional discriminator, only if you need polymorphism)

**Example TS:**

```ts
type Ref = { id: string; label?: string; type?: string }
```

---
