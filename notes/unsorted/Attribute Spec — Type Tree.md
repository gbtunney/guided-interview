# Attribute Spec — Type Tree (TypeScript-first)

Use this as a design-time picker. Choose the shape, write the TypeScript type,
then add lightweight notes for constraints and UI.  
This is intentionally plain Markdown, not a schema language.

---

## Table of Contents

1. Vocabulary
2. ID and Label (Naming Conventions)
3. Shape
4. TypeScript Type Families
5. Presence and Defaults
6. Common Constraints
7. Common UI Components
8. Identification and Reference Object Conventions
9. Minimal Field Spec Template
10. Examples
11. Guided Interview Flow
12. Quiz Note (Future Use)

---

## 1. Vocabulary

### Scalar

- A single value.
- Not nested, not iterable, not a container.

**Examples:** string, number, boolean, null, literal unions like 'a' | 'b'.  
**Non-examples:** objects, lists, maps.

### Object vs Map / Dictionary

- **Object:** Known fields, fixed meaning per field.  
  Example: { id: string; name: string }
- **Map / Dictionary:** Variable keys, uniform value type.  
  Example: Record<string, string> where keys are data.

**Rule of thumb:**

- If keys are part of the schema → Object
- If keys are part of the data → Map

---

## 2. ID and Label (Naming Conventions)

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

**Derivation rule (default):**

- product_id / product-id / productId → “Product ID”
- “Product ID” → product_id (default: snake_case)

---

## 3. Shape

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

## 4. TypeScript Type Families

- **string:** Text, identifiers, dates/times encoded as strings, URLs, emails,
  colors.
- **number:** Counts, measurements, percentages, timestamps.
- **boolean:** True/false flags.
- **{ ... }:** Structured object with named fields.
- **T[]:** Ordered list of items.
- **Record<string, T>:** Dictionary / map keyed by strings.

---

## 5. Presence and Defaults

These are orthogonal to the TS type.

- **Required:** The field must be present in the object. (TS: omit ?)
- **Optional:** The field may be absent. (TS: field?: T)
- **Default:** Value assumed if missing. Does not imply required.

### Nullable (Advanced)

- **Nullable:** Field may explicitly be null. (TS: field: T | null)
- **Optional + Nullable:** (TS: field?: T | null)

---

## 6. Common Constraints

### Text (string)

- minLength
- maxLength
- pattern (regex)
- trim (policy)
- lowercase / uppercase (policy)
- oneOf (for enums)
- nonEmpty
- unique (across records)

### Numbers (number)

- integerOnly
- min / max
- exclusiveMin / exclusiveMax
- multipleOf (step)

### Dates/times (usually string)

- minDate / maxDate
- notInFuture
- notInPast

### Lists (T[])

- minItems / maxItems
- uniqueItems
- itemPattern / itemConstraints (applies to each item)

### Objects ({...})

- noExtraKeys (closed object)
- requiredKeys (specific keys required)

### Maps (Record<string, T>)

- keyPattern
- maxKeys

### Cross-field (usually stays in notes)

- requiredIf
- dependsOn
- mutuallyExclusiveWith
- computedFrom

---

## 7. Common UI Components

### Text

- text
- textarea
- markdown-editor
- richtext

### Choice

- select
- multi-select
- radio-group
- checkbox-group
- segmented-control
- combobox (searchable select)

### Boolean

- switch
- checkbox

### Numbers

- number-input
- slider
- stepper

### Dates/times

- date-picker
- time-picker
- datetime-picker
- duration-input

### References

- entity-picker
- autocomplete
- tag-input (chips)

### Collections

- repeater (add/remove rows)
- table-editor
- key-value-editor

### Files

- file-upload
- image-upload

### Display-only

- read-only-text
- badge
- json-viewer

### Optional UI Flags

- readOnly
- disabled
- hidden
- placeholder
- helpText
- group
- order

---

## 8. Identification and Reference Object Conventions

If you use references as objects (instead of raw id strings), a common minimal
shape is:

- **Ref**
  - id: string (required)
  - label?: string (optional display label)
  - type?: string (optional discriminator, only if you need polymorphism)

**Example TS:**  
type Ref = { id: string; label?: string; type?: string }

---

## 9. Minimal Field Spec Template

Order preference:

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

## 10. Examples

### Short Text Name

- id: name  
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

### Array of Objects

- id: maintenance_events  
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

### Map / Dictionary

- id: labels  
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

---

## 11. Guided Interview Flow

**Default behavior:**

- You can give either an ID or a Label first.
- The other is derived using the naming rules above.
- A TS type is suggested based on your intent.

**Quick steps:**

1. ID or Label
2. Type intent (suggest TS type)
3. Presence (required + default)
4. Constraints (optional)
5. UI component (optional)
6. Description (optional)
7. Emit spec

**Notes:**

- Nullable is not asked in quick flow (but is available as an advanced option).
- UI flags are not asked by default; add them only if explicitly wanted.

---

T
