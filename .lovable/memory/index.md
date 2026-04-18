# Memory: index.md
Updated: just now

# Project Memory

## Core
- Stack: React, Tailwind, Framer Motion, TanStack Query, Lovable Cloud (Supabase DB/Auth/Storage).
- Language: Interface and SEO must be strictly in Portuguese (pt-BR).
- Auth/Email: Email/password auth via Supabase. Use Lovable native email infra ONLY (no Resend).
- Security: Prompts and files require auth. Admins manage content (RLS via user_roles).
- Design: Cyberpunk neon aesthetic (black bg, yellow/cyan/purple glow). NO text inside images.

## Memories
- [Admin Panel](mem://funcionalidades/painel-admin) — Admin dashboard at /admin with tabs, pagination, search, and dynamic sorting
- [Database Schema](mem://arquitetura/banco-de-dados) — Supabase schema, user_roles, and category-files storage bucket
- [Brand Identity](mem://diretrizes/identidade-marca) — First-person copy, navbar 'Sobre mim' link, simplified hero
- [Category Pages](mem://funcionalidades/paginas-categoria) — Details at /categoria/:id, integrated PDF viewer iframe with controls
- [Content Model](mem://projeto/modelo-conteudo) — Items structured with title, tags, sort_order, and text or PDF media
- [Editorial Guidelines](mem://projeto/diretriz-editorial) — Sermons and social topics use a Christian theological worldview
- [Content Access](mem://seguranca/acesso-conteudo) — Locked state for guests, redirect to login, RLS for admin uploads
- [Footer Setup](mem://projeto/contatos) — External social links securely opened, Yahoo Mail compose URL
- [Visual Style](mem://diretrizes/estilo-visual) — Specific color tokens per category, Framer Motion glow, and neon gradients
- [Auth Redirect](mem://funcionalidades/fluxo-redirecionamento) — Preserve destination URL and redirect back after login
- [Global Search](mem://funcionalidades/busca-global) — Navbar Unicode case-insensitive search with HighlightMatch component
- [Programming Hub](mem://funcionalidades/subpaginas-programacao) — Futuristic mini-cards for 9 languages, sub-page filtering and auto-tags
- [Content Scope](mem://projeto/escopo-conteudo) — Categories: Prompts, Programming, Sermons, Kids, Engineering, Theology, AI
- [Theology Hub](mem://funcionalidades/subpaginas-teologia) — Sub-pages for doctrines with contextual auto-tagging on PDF uploads
- [Engineering Hub](mem://funcionalidades/subpaginas-engenharia) — HUD-style semester cards (1S/2S 2025, 1S 2026) with /semestre/:slug sub-pages
- [Data Priority](mem://arquitetura/prioridade-dados) — Supabase DB categories override static frontend categories in CategoriesSection
- [File Management](mem://funcionalidades/gerenciamento-arquivos) — 20MB limit for admin PDF uploads with contextual auto-tagging
- [Hub Structure](mem://diretrizes/estrutura-paginas-hub) — Hub categories hide sub-topic content in main list to prevent redundancy
- [Global Navbar](mem://funcionalidades/navegacao-global) — Left search, Right Home/About. No Categories link to avoid redundancy.
- [AI Tools Hub](mem://funcionalidades/hub-ferramentas-ia) — Category of external tool links (ChatGPT, Claude) using AIToolCards.tsx
