# Identity Phase

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
