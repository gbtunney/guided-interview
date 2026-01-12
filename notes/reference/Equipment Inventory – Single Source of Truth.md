# Equipment Inventory – Single Source of Truth

This document consolidates **schema, field order, AI extraction, automations,
and slug rules** into one canonical spec. Treat this as the only document you
maintain going forward.

---

# # Equipment Table – Final Field Order

## # Primary / Identity

1. **Name** (PRIMARY, text)
2. **Slug** (text or formula – see Slug Rules)
3. **Thumbnail** (attachment/helper)
4. **Status** (single select)

## # Product Info (authoritative)

1. **Category** (single select: Tank, Pump, Filter, Heater, Light, Sensor, Tool,
   Other)
1. **Product Name** (text)
1. **Brand** (single select)
1. **Model** (text)
1. **Serial #** (text)
1. **Specs** (long text; canonical; JSON or key/value)
1. **Purchased From** (single select: Amazon, Chewy, LFS, Other)

## # Relationships & Notes

1. **Connected Equipment** (link → Equipment)
2. **Notes** (long text)

## # Media / Assistive

1. **Photo** (attachment)
2. **Docs / Photos** (attachment, multiple allowed)

## # AI-Derived (assistive only)

1. **Specs & Category (from Photo)** (AI-generated)
2. **AI Extract (JSON)** (AI-generated)
3. **AI Confidence** (single select: High, Medium, Low)
4. **Needs Review** (checkbox)
5. **Last AI Parsed At** (date/time)

---

# # Slug Rules (choose ONE)

## # Option A: Formula slug (auto-updating)

Use if slug does NOT need to be stable.

````text
LOWER(SUBSTITUTE(TRIM({Name}), " ", "-"))

## # Option B: Stable slug (recommended for HA/API)

Use if slug must remain stable.

- `Slug` = text field
- Automation: set once when record created
- Never overwrite if already set

---

# # Automation 1: AI Extraction → JSON

**Trigger**

- When `Docs / Photos` is not empty or updated

**Action**

- Airtable AI (or webhook) populates `AI Extract (JSON)`

**Prompt**

> Use ALL attachments in {Docs / Photos}. Extract product info and return ONLY
> valid JSON. Keys: product_name, category, brand, model, serial,
> purchased_from, specs, confidence, evidence category must be one of: Tank,
> Pump, Filter, Heater, Light, Sensor, Tool, Other specs must be JSON with units
> Return ONLY JSON.

---

# # Automation 2: Parse JSON → Canonical Fields (safe fill)

**Trigger**

- When `AI Extract (JSON)` is updated

**Action**

- Run script
- Populate canonical fields ONLY if blank:
  - Product Name
  - Category
  - Brand
  - Model
  - Serial #
  - Specs
  - Purchased From

(AI never overwrites manual data.)

---

# # Automation 3: Backfill Name from Product Name

**Goal** If `Name` is empty and AI extraction succeeded, set
`Name = Product Name`.

**Trigger**

- When record updated

**Conditions (ALL)**

- Name is empty
- Product Name is not empty
- Docs / Photos is not empty
- AI Extract (JSON) is not empty
- Needs Review is unchecked (optional lock)

**Action**

- Update record: `Name = Product Name`
- (Optional) set `Name Auto-Set = true`

---

# # Canonical vs AI Fields (hard rule)

- **Canonical (authoritative):** Category, Product Name, Brand, Model, Serial #,
  Specs, Purchased From, Name, Slug

- **AI-Derived (assistive):** Specs & Category (from Photo), AI Extract (JSON),
  AI Confidence

AI fields never silently override canonical fields.

---

# # Future (Planned, not implemented)

- Areas table (Home Assistant mapping)
- Equipment → Area link
- Maintenance Log normalization
- Vendor normalization

---

# # Design Principles (non-negotiable)

- One source of truth
- AI suggests, humans approve
- Stable IDs if data leaves Airtable
- No schema creep without promotion rules

---

# # Airtable AI — **Authoritative Instructions to Rebuild Tables from This Spec**

Paste the following **verbatim** into Airtable AI ("Describe what you want to
build" / "Instructions" box). This is written as an execution contract, not
prose.

---

## # 🔒 SYSTEM INSTRUCTIONS (DO NOT SUMMARIZE, DO NOT OMIT)

You are an Airtable AI agent tasked with **rebuilding and aligning tables
exactly to the specification below**. This specification is authoritative. Do
not infer, rename, merge, or simplify fields unless explicitly instructed.

If a field already exists, **reuse it**. If a field exists with a conflicting
purpose, **flag it instead of deleting it**.

AI‑derived fields must NEVER overwrite canonical (manual) fields automatically.

---

## # 🎯 OBJECTIVE

Create or update an Airtable base to match the **Equipment Inventory – Single
Source of Truth** specification, including:

- Exact field names
- Exact field order
- Correct field types
- Clear separation of canonical vs AI‑derived fields
- Automation compatibility

---

# # 📘 TABLE: Equipment

Create a table named **Equipment** with the following fields, in this order:

## # 1. Primary / Identity

1. **Name** — single line text (PRIMARY field)
2. **Slug** — text (NOT formula unless instructed later)
3. **Thumbnail** — attachment or helper image field
4. **Status** — single select
   - Options: In Use, Spare, Broken, Retired
   - Default: Spare

## # 2. Product Info (Canonical / Manual)

1. **Category** — single select
   - Options: Tank, Pump, Filter, Heater, Light, Sensor, Tool, Other
   - Default: Other
1. **Product Name** — single line text
2. **Brand** — single select
3. **Model** — single line text
4. **Serial #** — single line text
5. **Specs** — long text (canonical; JSON or key/value allowed)
6. **Purchased From** — single select

- Options: Amazon, Chewy, LFS, Other, Unknown
- Default: Unknown

## # 3. Relationships & Notes

1. **Connected Equipment** — link to another record → Equipment (self‑link)
2. **Notes** — long text

## # 4. Media / Assistive Inputs

1. **Photo** — attachment
2. **Docs / Photos** — attachment (multiple allowed)

## # 5. AI‑Derived (Assistive ONLY — never authoritative)

1. **Specs & Category (from Photo)** — AI‑generated text
2. **AI Extract (JSON)** — AI‑generated text
3. **AI Confidence** — single select

- Options: High, Medium, Low

1. **Needs Review** — checkbox (default checked)
2. **Last AI Parsed At** — date/time

---

# # 🤖 AI EXTRACTION RULES

- AI may read **Docs / Photos** and **Photo** attachments
- AI must output **strict JSON** into `AI Extract (JSON)`
- AI must NEVER write directly to canonical fields

## # JSON schema required from AI Extract (JSON)

```json
{
  "product_name": string | null,
  "category": "Tank" | "Pump" | "Filter" | "Heater" | "Light" | "Sensor" | "Tool" | "Other" | null,
  "brand": string | null,
  "model": string | null,
  "serial": string | null,
  "purchased_from": string | null,
  "specs": object | null,
  "confidence": "High" | "Medium" | "Low",
  "evidence": string[]
}
````

---

# # ⚙️ REQUIRED AUTOMATION COMPATIBILITY

The table MUST support the following automations (do not implement unless asked,
but ensure compatibility):

1. **AI Extraction Automation**
   - Trigger: Docs / Photos updated
   - Action: Populate `AI Extract (JSON)`

1. **Safe Parse Automation**
   - Trigger: AI Extract (JSON) updated
   - Action: Copy values into canonical fields ONLY if blank

1. **Name Backfill Automation**
   - If Name is blank AND Product Name exists AND AI Extract exists → set Name =
     Product Name

1. **Slug Automation (optional)**
   - Slug set once from Name if empty

---

# # ⛔ NON‑NEGOTIABLE RULES

- Do NOT collapse fields
- Do NOT rename fields
- Do NOT infer defaults not listed above
- Do NOT overwrite user‑entered data
- AI‑derived fields are always assistive

---

## # ✅ END OF SPEC

Confirm understanding before making changes.
