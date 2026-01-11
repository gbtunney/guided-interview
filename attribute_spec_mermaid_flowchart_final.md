# Attribute Spec — Type Tree (TypeScript-first)

Use this as a *design-time* picker. Choose the **shape**, write the **TypeScript type**, then add lightweight notes for constraints + UI.

This is intentionally **plain Markdown**, not a schema language.

---

## Vocabulary (what these words mean)

### Scalar

- A **single value**.
- Not nested, not iterable, not a container.

Examples:

- `string`, `number`, `boolean`, `null`, literal unions like `'a' | 'b'`.

Non-examples:

- objects, lists, maps.

### Object vs Map / Dictionary

- **Object**: known fields, fixed meaning per field.
  - Example: `{ id: string; name: string }`
- **Map / Dictionary**: variable keys, uniform value type.
  - Example: `Record<string, string>` where keys are *data*.

Rule of thumb:

- If keys are part of the *schema* → **Object**
- If keys are part of the *data* → **Map**

---

## ID and Label (naming conventions)

### ID

- The **machine identifier** for the field.
- Prefer **stable** and **boring**.
- Common styles:
  - `snake_case` (e.g. `product_id`)
  - `kebab-case` (e.g. `product-id`)
  - `camelCase` (e.g. `productId`)
  - `PascalCase` (e.g. `ProductId`)

### Label

- The **human-facing** display name.
- Derived automatically from the ID when possible.

Derivation rule (default):

- If you give an ID like `product_id` or `product-id` or `productId`, the label becomes **"Product ID"**.
- If you give a label like **"Product ID"**, the ID becomes \`\` (default style: snake\_case).

---

## 1) Shape

- **Scalar** *(one value, no structure)*

  - `string`
  - `number`
  - `boolean`
  - `null` *(rare; prefer ****T | null****)*

- **Enum** *(scalar with a fixed allowed set)*

  - string literal union: `'a' | 'b' | 'c'`
  - number literal union: `1 | 2 | 3`

- **Object** *(fixed structure, known fields)*

  - inline: `{ ... }`
  - named: `type X = { ... }`

- **List** *(ordered collection of items)*

  - array: `T[]`
  - readonly array: `readonly T[]`
  - tuple (fixed length): `[T1, T2]`

- **Map / Dictionary** *(key → value lookup, variable keys)*

  - `Record<string, T>`
  - `Record<'k1' | 'k2', T>` *(known key set, still map-shaped)*

---

## 2) TypeScript type families (what they are)

- `string`
  - Text, identifiers, dates/times encoded as strings, URLs, emails, colors.
- `number`
  - Counts, measurements, percentages, timestamps.
- `boolean`
  - True/false flags.
- `{ ... }`
  - Structured object with named fields.
- `T[]`
  - Ordered list of items.
- `Record<string, T>`
  - Dictionary / map keyed by strings.

---

## 3) Presence and defaults (keep separate)

These are *orthogonal* to the TS type.

- **Required**

  - Meaning: the field must be present in the object.
  - Typical TS: omit `?` (no optional marker)

- **Optional**

  - Meaning: the field may be absent.
  - Typical TS: `field?: T`

- **Default**

  - Meaning: value assumed if missing.
  - Does **not** imply required.

### Nullable (advanced, keep in mind)

You said you don’t typically use this, but keep it as a known option.

- **Nullable**

  - Meaning: the field may explicitly be `null`.
  - Typical TS: `field: T | null`

- **Optional + Nullable**

  - Typical TS: `field?: T | null`

---

## 4) Common constraints (idea menu)

### Text (`string`)

- `minLength`
- `maxLength`
- `pattern` (regex)
- `trim` (policy)
- `lowercase` / `uppercase` (policy)
- `oneOf` (for enums)
- `nonEmpty`
- `unique` (across records)

### Numbers (`number`)

- `integerOnly`
- `min` / `max`
- `exclusiveMin` / `exclusiveMax`
- `multipleOf` (step)

### Dates/times (usually `string`)

- `minDate` / `maxDate`
- `notInFuture`
- `notInPast`

### Lists (`T[]`)

- `minItems` / `maxItems`
- `uniqueItems`
- `itemPattern` / `itemConstraints` (applies to each item)

### Objects (`{...}`)

- `noExtraKeys` (closed object)
- `requiredKeys` (specific keys required)

### Maps (`Record<string, T>`)

- `keyPattern`
- `maxKeys`

### Cross-field (usually stays in notes)

- `requiredIf`
- `dependsOn`
- `mutuallyExclusiveWith`
- `computedFrom`

---

## 5) Common UI components (idea menu)

Text

- `text`
- `textarea`
- `markdown-editor`
- `richtext`

Choice

- `select`
- `multi-select`
- `radio-group`
- `checkbox-group`
- `segmented-control`
- `combobox` (searchable select)

Boolean

- `switch`
- `checkbox`

Numbers

- `number-input`
- `slider`
- `stepper`

Dates/times

- `date-picker`
- `time-picker`
- `datetime-picker`
- `duration-input`

References

- `entity-picker`
- `autocomplete`
- `tag-input` (chips)

Collections

- `repeater` (add/remove rows)
- `table-editor`
- `key-value-editor`

Files

- `file-upload`
- `image-upload`

Display-only

- `read-only-text`
- `badge`
- `json-viewer`

Optional UI flags (keep lightweight)

- `readOnly`
- `disabled`
- `hidden`
- `placeholder`
- `helpText`
- `group`
- `order`

---

## 6) Identification and reference object conventions

If you use references as objects (instead of raw id strings), a common minimal shape is:

- `Ref`
  - `id: string` *(required)*
  - `label?: string` *(optional display label)*
  - `type?: string` *(optional discriminator, only if you need polymorphism)*

Example TS:

- `type Ref = { id: string; label?: string; type?: string }`

---

## 7) Minimal field spec template

Order preference:

- Put **constraints above example**.
- Use **ID** (not “field”).
- **Description** is optional (semantic meaning), separate from notes.

```
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

---

## 8) Examples

### Short text name

- id: name label: Name ts: string presence: required: true default: null constraints:
  - nonEmpty example: "Example name" ui: component: text description: notes:

### Array of objects

- id: maintenance\_events label: Maintenance Events ts: { date: string; note: string }[] presence: required: false default: [] constraints:
  - maxItems: 200 example:
  - { date: "2025-10-01", note: "cleaned impeller" } ui: component: repeater description: notes: item.date is DateString

### Map / dictionary

- id: labels label: Labels ts: Record\<string, string> presence: required: false default: {} constraints:
  - keyPattern: ^[a-z0-9-]+\$
  - maxKeys: 50 example: { location: "living-room" } ui: component: key-value-editor description: notes: keys are slug-like

---

## 9) Guided interview flow (quick, conversational)

Default behavior:

- You can give either an **ID** or a **Label** first.
- I will derive the other using the naming rules above.
- I will suggest a TS type based on your intent.

Quick steps:

1. ID or Label
2. Type intent (I suggest TS type)
3. Presence (required + default)
4. Constraints (optional)
5. UI component (optional)
6. Description (optional)
7. Emit spec

Notes:

- Nullable is *not* asked in quick flow (but is available as an advanced option).
- UI flags are not asked by default; add them only if you explicitly want them.

---

## 10) Quiz note (future use)

This spec can also be used as a guided quiz:

- Identify shape and TS type
- Pick presence and constraints
- Pick UI component

Future extension (deferred):

- Add a final platform step (Airtable/Appsmith/etc.) to suggest equivalent field types and constraints.

