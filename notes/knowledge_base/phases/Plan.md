# Plan

## Overview: Type Phase

This document defines the conversational, AI-guided interview process used to
produce field,object,data specs that conform to the general described spec
structure. It is not a rigid CLI, schema, or form. It is a human-first interview
with suggested options and defaults.

### Purpose

- Reduce cognitive load when defining fields
- Avoid premature schema decisions
- Allow freeform answers with AI normalization
- Produce a clean, final Markdown spec at the end

### Core Principles

- One question at a time
- Numbered options where possible
- Freeform answers always allowed
- “Quick” by default, expandable to “Full” if needed
- TypeScript-first output
- Platform-agnostic

This is guided interview that has 3 phases thyAll the items can

these are flexible

## PHASE 1: Type Phase

Goal: Assist user in outlining attribytes/fields based on 3 type layers:

[Foundational Type Layers](./../FoundationalTypeLayers.md)

- Conceptual types \
- Technical (Raw) Type
- Ui Type ( if relevant ) additional
- raw technical notation

##### Why Separate These Layers?

> **Because they change at different rates:**

- Conceptual meaning is stable
- Technical representation changes by platform
- UI changes by context

**_Separating them prevents premature coupling_**

- A TS type is suggested based on your intent.

### Quick Steps

### Quick Steps

1. Type intent (suggest TS type)
2. Presence (required + default)
3. Constraints (optional)
4. UI component (optional)
5. Description (optional)
6. Emit spec
