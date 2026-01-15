# Attribute Spec — Type Lookup (Conceptual ↔ Raw ↔ UI)

A compact reference for **three type layers**:

- **Conceptual Type**: what it *means*
- **Raw Data Type**: what it *is structurally* (storage/shape)
- **UI Type**: how it’s *edited/viewed*

**Constraints are intentionally ignored for now.**

---

# Table of Contents

- [1. Type Layers](#1-type-layers)
- [2. Raw Data Types](#2-raw-data-types)
- [3. UI Types](#3-ui-types)
- [4. Conceptual Type Lookup Table](#4-conceptual-type-lookup-table)
- [5. Notes](#5-notes)

---

# 1. Type Layers

## Conceptual Type (Meaning)

**Definition:** the real‑world meaning of the value, independent of storage or UI.

Use it to answer:
- “What kind of thing is this?”

## Raw Data Type (Structure)

**Definition:** the structural form a system carries (scalar/container + primitive family).

Use it to answer:
- “What shape is this data?”

## UI Type (Affordance)

**Definition:** the editing/viewing control a human uses.

Use it to answer:
- “How should someone input or read this?”

---

# 2. Raw Data Types

Raw types are written as **structure + primitive**.

## 2.1 Primitive Families

- **Text**
- **Number**
- **Boolean**
- **Binary** (bytes / blobs)
- **Null** (absence marker; usually paired with another)

## 2.2 Structures

- **Scalar**: `Text | Number | Boolean | Binary`
- **Enum**: `Enum<Text>` or `Enum<Number>`
- **Object / Record**: `Object{ field: T, ... }`
- **List / Sequence**: `List<T>`
- **Tuple (fixed)**: `Tuple<T1, T2, ...>`
- **Map / Dictionary**: `Map<Text, T>`

## 2.3 Quick Examples

- `Text`
- `Enum<Text>`
- `List<Text>`
- `Object{ id: Text, label: Text }`
- `Map<Text, Text>`

---

# 3. UI Types

A small, reusable vocabulary (not a component library):

## 3.1 Text

- **text** (single-line)
- **textarea** (multi-line)
- **richtext**
- **code**

## 3.2 Choice

- **select**
- **multi-select**
- **radio-group**
- **checkbox-group**
- **combobox** (searchable select)

## 3.3 Boolean

- **switch**
- **checkbox**

## 3.4 Number

- **number-input**
- **stepper**
- **slider**

## 3.5 Time

- **date-picker**
- **time-picker**
- **datetime-picker**
- **duration-input**

## 3.6 Files

- **file-upload**
- **image-upload**

## 3.7 Collections

- **repeater** (add/remove items)
- **table-editor**
- **key-value-editor**

## 3.8 Display

- **read-only-text**
- **badge**
- **json-viewer**

---

# 4. Conceptual Type Lookup Table

This is the main reference: **Conceptual → common Raw → typical UI**.

> Notes:
> - Raw types shown are **common defaults**, not mandates.
> - UI types are **typical affordances**, not requirements.

| Conceptual Type     | Meaning                           | Common Raw Data Types                                     | Typical UI Types           |           |                      |
| ------------------- | --------------------------------- | --------------------------------------------------------- | -------------------------- | --------- | -------------------- |
| Identifier          | stable ID for a thing             | `Text` • `Number`                                         | text • read-only-text      |           |                      |
| Reference           | points to another entity          | `Text` • `Object{ id: Text, label: Text }`                | entity-picker • combobox   |           |                      |
| Name                | human-facing title                | `Text`                                                    | text                       |           |                      |
| Description / Notes | longer free text                  | `Text`                                                    | textarea • richtext        |           |                      |
| Code / Slug         | constrained token                 | `Text`                                                    | text • code                |           |                      |
| URL                 | web/resource locator              | `Text`                                                    | text                       |           |                      |
| Email               | email address                     | `Text`                                                    | text                       |           |                      |
| Phone               | phone number                      | `Text`                                                    | text                       |           |                      |
| Flag                | true/false indicator              | `Boolean`                                                 | switch • checkbox          |           |                      |
| Status              | closed set state                  | `Enum<Text>`                                              | select • radio-group       |           |                      |
| Mode                | behavior selec be tor             | `Enum<Text>`                                              | segmented-control • select |           |                      |
| Count               | discrete quantity                 | `Number`                                                  | number-input • stepper     |           |                      |
| Percentage          | ratio value                       | `Number`                                                  | number-input • slider      |           |                      |
| Rating              | bounded score                     | `Number` • `Enum<Number>`                                 | slider • select            |           |                      |
| Money               | amount + currency                 | `Object{ amount: Number, currency: Text }`                | number-input + select      |           |                      |
| Measurement         | value + unit                      | `Object{ value: Number, unit: Text }`                     | number-input + select      |           |                      |
| Date                | calendar date                     | `Text`                                                    | date-picker                |           |                      |
| Time                | time of day                       | `Text`                                                    | time-picker                |           |                      |
| DateTime            | timestamp                         | `Text` • `Number`                                         | datetime-picker            |           |                      |
| Duration            | length of time                    | `Number` • `Text` • `Object{ value: Number, unit: Text }` | duration-input             |           |                      |
| Interval            | start/end span                    | `Object{ start: Text                                      | Number, end: Text          | Number }` | datetime-picker (x2) |
| Tag                 | label for grouping                | `Text` • `List<Text>`                                     | tag-input • multi-select   |           |                      |
| Labels / Metadata   | arbitrary key-value props         | `Map<Text, Text>`                                         | key-value-editor           |           |                      |
| Event               | record of something that happened | `Object{ ... }`                                           | table-editor • repeater    |           |                      |
| File                | file object/ref                   | `Binary` • `Object{ id: Text, name: Text }`               | file-upload                |           |                      |
| Image               | image file                        | same as File                                              | image-upload               |           |                      |

---

# 5. Notes

## 5.1 The “Duration goes where it belongs” note

- **Duration** is a **conceptual type**.
- It commonly uses raw types like `Number` (with implied unit) or `Object{ value, unit }`.
- UI: `duration-input`.

## 5.2 If you want this to be even more “lookup-y”

Next (optional) refinements that keep it concise:

- Add a short **alias list** (e.g. “Slug” == “Code”).
- Add a “**recommended default raw type**” column separate from “common raw”.
- Add a “**multi-value?**” column (single vs list vs map patterns).

