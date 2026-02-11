---
name: i18n
description: Auto-translate edited files using consistent style patterns
---

## What I do

When editing files, automatically translate content following these style patterns:

**Korean to English:**

- `냉혹한 {A}의 세계` → `The {A} *Experience*`

**Korean to Japanese:**

- `냉혹한 {A}의 세계` → `闇が深い{A}の世界`

## When to use me

Use this skill when:

- Editing files that contain Korean text
- Translating blog posts or documentation
- Maintaining multilingual content

Always preserve the tone and style of the original while applying these specific translation patterns.

## Scripts

### check-translations.ts

Check which Korean files are missing translations.

```bash
deno run --allow-read scripts/check-translations.ts [directory]
```

Outputs a table of files missing `en` and/or `ja` translations. Exits 0 if all translated, 1 otherwise.

**Run tests:**

```bash
deno test scripts/check-translations_test.ts
```
