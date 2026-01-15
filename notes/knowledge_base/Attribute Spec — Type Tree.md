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

## ID and Label (Naming Conventions)

### ID

- The machine identifier for the field.
- Prefer stable and boring.
- Common styles:
  - snake_case (e.g. product_id)
  - kebab-case (e.g. product-id)
  - camelCase (e.g. productId)
  - PascalCase (e.g. ProductId)

### Label

- The human-facing display name.
- Derived automatically from the ID when possible.

### Derivation Rule (Default)

- _product_id / product-id / productId_ → “Product ID”
- “Product ID” → _product_id_ (**default**: _snake_case_)

---

## Shape

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

## TypeScript Type Families

- **string:**
  - Text
  - Identifiers
  - Dates/times encoded as strings
  - URLs
  - Emails
  - Colors
- **number:**
  - Counts
  - Measurements
  - Percentages
  - Timestamps
- **boolean:**
  - true/false
  - flags
- **{ ... }:** Structured object with named fields.
- **T[] or Array`<type>`:** Ordered list of items.
- **Record<string, T>:** Dictionary / map keyed by strings.

---

## Presence and Defaults

These are orthogonal to the TS type.

- **Required:** The field must be present in the object. (TS: omit ?)
- **Optional:** The field may be absent. (TS: field?: T)
- **Default:** Value assumed if missing. Does not imply required.

### Nullable (Advanced)

- **Nullable:** Field may explicitly be null. `T | null`
- **Optional + Nullable:** `{ field?: T | null}`

---

## Common Constraints

- **Text (string):**
  - `minLength`: Minimum length of the string.
  - `maxLength`: Maximum length of the string.
  - `pattern`: Regex pattern the string must match.
  - `trim`: Remove leading/trailing whitespace.
  - `lowercase / uppercase`: Enforce case policy.
  - `oneOf`: Allowed values for enums.
  - `nonEmpty`: Ensures the string is not empty.
  - `unique`: Ensures uniqueness across records.

- **Numbers (number):**
  - `integerOnly`: Must be an integer.
  - `min / max`: Minimum and maximum value.
  - `exclusiveMin / exclusiveMax`: Strictly less/greater than.
  - `multipleOf`: Value must be a multiple of this number.

- **Dates/times (string):**
  - `minDate / maxDate`: Earliest/latest allowed date.
  - `notInFuture`: Date must not be in the future.
  - `notInPast`: Date must not be in the past.

- **Lists** `T[]`
  - `minItems` / `maxItems`: Minimum and maximum number of items allowed in the
    list.
  - `uniqueItems`: Ensures all items in the list are unique.
  - `itemPattern` / `itemConstraints`: Constraints applied to each item in the
    list.

- **Objects** `{...}`
  - `noExtraKeys`: Ensures the object does not have keys outside the defined
    schema.
  - `requiredKeys`: Specifies keys that must be present in the object.

- **Maps** `Record<string, T>`
  - `keyPattern`: Regex pattern that keys must match.
  - `maxKeys`: Maximum number of keys allowed in the map.

- **Cross-field**(usually stays in notes)
  - `requiredIf`: A field is required if another field has a specific value.
  - `dependsOn`: A field's value depends on another field's value.
  - `mutuallyExclusiveWith`: Ensures two fields cannot both be present.
  - `computedFrom`: Indicates that a field's value is derived from other fields.

---

## Common UI Components

- Text
  - text
  - textarea
  - markdown-editor
  - richtext
- Choice
  - select
  - multi-select
  - radio-group
  - checkbox-group
  - segmented-control
  - combobox (searchable select)
- Boolean
  - switch
  - checkbox
- Numbers
  - number-input
  - slider
  - stepper
- Dates/times
  - date-picker
  - time-picker
  - datetime-picker
  - duration-input
- References
  - entity-picker
  - autocomplete
  - tag-input (chips)
- Collections
  - repeater (add/remove rows)
  - table-editor
  - key-value-editor
- Files
  - file-upload
  - image-upload
- Display-only
  - read-only-text
  - badge
  - json-viewer
- Optional UI Flags
  - readOnly
  - disabled
  - hidden
  - placeholder
  - helpText
  - group
  - order

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

---

### Examples

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

---

## Guided Interview Flow

### Default Behavior

- You can give either an ID or a Label first.
- The other is derived using the naming rules above.
- A TS type is suggested based on your intent.

### Quick Steps

1. ID or Label
2. Type intent (suggest TS type)
3. Presence (required + default)
4. Constraints (optional)
5. UI component (optional)
6. Description (optional)
7. Emit spec

### Notes

- Nullable is not asked in quick flow (but is available as an advanced option).
- UI flags are not asked by default; add them only if explicitly wanted.

---

## Quiz Note (Future Use)

- Placeholder for future quiz-related notes.
