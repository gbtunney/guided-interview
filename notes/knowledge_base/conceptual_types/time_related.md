# # Time-Related Conceptual Types

Time-related concepts are often confused. They are **siblings**, not
parent/child.

````txt
Time-related
├─ Date
├─ DateTime
├─ Duration
└─ Interval

---

# # Date

**What it represents:**

- A calendar day

**Questions it answers:**

- “On what day?”

**Examples:**

- `2026-01-10`

**Common technical representations:**

- ISO 8601 date string (`YYYY-MM-DD`)

**Typical UI:**

- date-picker

---

# # DateTime

**What it represents:**

- A precise moment in time

**Questions it answers:**

- “At what exact moment?”

**Examples:**

- `2026-01-10T14:32:05Z`

**Common technical representations:**

- ISO 8601 datetime string
- Epoch milliseconds (`number`)

**Typical UI:**

- datetime-picker

---

# # Duration

#### # What it represents

- A length of time

**Questions it answers:**

- “How long?”

**Examples:**

- 5 minutes
- 2 hours
- 7 days

**Common technical representations:**

1. **Number-based** (most common)
   - milliseconds or seconds
   - Example: `3600000` (1 hour)

1. **ISO 8601 duration string**
   - Example: `PT30M`, `P7D`

1. **Structured object**

   ```ts
   { value: 5, unit: 'minutes' }
````

**Typical UI:**

- duration input
- number + unit selector
- slider + unit

---

# # Interval (for completeness)

**What it represents:**

- A span between two points in time

**Examples:**

- start + end datetime

**Common representations:**

- `{ start: DateTime; end: DateTime }`

---

# # Key Distinctions (Summary Table)

| Concept  | Answers            | Example             |
| -------- | ------------------ | ------------------- |
| Date     | What day?          | `2026-01-10`        |
| DateTime | What moment?       | `2026-01-10T14:32Z` |
| Duration | How long?          | `30 minutes`        |
| Interval | From when to when? | start + end         |

---

# # How This Fits Your System

Originally, conceptual types were an **explicit layer**.

You later chose to make them **implicit**, inferred from:

- TypeScript type
- Constraints
- UI component
- Optional description

This document preserves the **mental model** without forcing formalization.

You can reintroduce explicit conceptual types later without breaking
compatibility.
