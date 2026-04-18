---
name: Engineering Semester Hub
description: HUD-style futuristic semester cards inside "Aulas Engenharia de Software" with sub-pages and auto-tagging
type: feature
---
The category "Aulas Engenharia de Software" acts as a hub that renders the `SemesterCards` component with three HUD/cyberpunk cards: "Primeiro Semestre 2025" (cyan), "Segundo Semestre 2025" (yellow), "Primeiro Semestre 2026" (purple). Each card features animated scanlines, grid texture, corner brackets, status pill (CONCLUÍDO/EM ANDAMENTO), course code, period and CTA. Clicking opens `/categoria/:id/semestre/:slug` (`SemesterSubPage`) which filters `content_items` by `tags contains [semester.tag]` and auto-applies the semester tag to admin uploads via `defaultTags`. The main hub list hides items that carry any semester tag to avoid redundancy.
