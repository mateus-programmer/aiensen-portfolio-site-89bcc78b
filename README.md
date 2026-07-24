# AIensen Portfolio

Repositório do site **AIensen** — uma plataforma pessoal futurista para organizar e compartilhar prompts, cursos, materiais de Engenharia de Software, estudos teológicos, ferramentas de IA e muito mais.

> **Live Preview:** [https://id-preview--b1df4b2e-e9f3-4e43-8008-f35ea2860b28.lovable.app](https://id-preview--b1df4b2e-e9f3-4e43-8008-f35ea2860b28.lovable.app)

---

## Visão Geral

O AIensen funciona como um hub central de conteúdos criados por mim e com auxílio de inteligência artificial. A interface adota uma estética cyberpunk/neon, com navegação simples, busca global e cards futuristas organizados por categorias.

### Principais Funcionalidades

- **Homepage com hero neon, busca global e cards de categorias**
- **Categorias dinâmicas** gerenciadas pelo painel administrativo (prioridade ao banco de dados, com fallback para categorias estáticas)
- **Páginas de categoria** com visualização de PDFs integrada em iframe
- **Hubs temáticos com sub-navegação:**
  - Engenharia de Software (semestres → matérias → pastas → sub-pastas)
  - Programação (linguagens de programação)
  - Teologia (tópicos doutrinários)
  - Ferramentas de IA
- **Painel Admin** protegido por autenticação e papel de administrador (`user_roles`)
- **Upload de PDFs** com tagueamento automático contextual
- **Autenticação** por email/senha com redirect pós-login e recuperação de senha
- **Design responsivo** e animações com Framer Motion
- **Segurança reforçada** com RLS, bucket privado, URLs assinadas e proteção de senhas vazadas (HIBP)

---

## Stack Tecnológica

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Linguagem:** TypeScript 5
- **Estilização:** Tailwind CSS v3
- **Componentes UI:** shadcn/ui + Radix UI
- **Animações:** Framer Motion
- **Dados / Backend:** Lovable Cloud (Supabase — Auth, Database, Storage)
- **Requisições:** TanStack Query (React Query)
- **Testes:** Vitest + Playwright

---

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis e seções da página
│   ├── admin/           # Componentes do painel administrativo
│   ├── icons/           # Ícones SVG customizados
│   └── ui/              # Componentes shadcn/ui
├── contexts/            # Contextos React (AuthContext)
├── data/                # Dados estáticos (semestres, matérias, pastas)
├── hooks/               # Custom hooks
├── integrations/        # Cliente Supabase e tipos gerados
├── lib/                 # Utilitários (ex: cn)
├── pages/               # Páginas da aplicação (roteadas via React Router)
└── test/                # Configuração e testes
```

---

## Como Rodar Localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/mateus-programmer/aiensen-portfolio-site-89bcc78b.git
   cd aiensen-portfolio-site-89bcc78b
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente:**

   O projeto já inclui as variáveis do Lovable Cloud no arquivo `.env`.
   Para ambiente local, certifique-se de que as seguintes variáveis estão presentes:

   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   VITE_SUPABASE_PROJECT_ID=...
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   # ou
   bun dev
   ```

   O Vite expõe a aplicação em `http://localhost:8080`.

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Executa o ESLint |
| `npm run test` | Executa os testes com Vitest |
| `npm run test:watch` | Executa os testes em modo watch |

---

## Painel Administrativo

A rota `/admin` é protegida por autenticação e papel de administrador (`user_roles`). Lá é possível:

- Criar, editar e ordenar categorias
- Gerenciar itens de conteúdo (texto e PDF)
- Fazer upload de arquivos PDF até 20 MB
- Visualizar conteúdos com tagueamento automático contextual

---

## Segurança

Foram aplicadas medidas de segurança no backend e no frontend:

- **Row Level Security (RLS):** todas as tabelas públicas possuem RLS ativado; a tabela `profiles` só permite leitura por usuários autenticados.
- **Papéis de usuário:** controle de administrador via tabela separada `user_roles`, consultada por função `SECURITY DEFINER` com privilégios mínimos.
- **Bucket privado:** o bucket `category-files` não permite acesso público; arquivos são servidos exclusivamente por URLs assinadas de curta duração.
- **Visualização segura de PDFs:** o leitor de PDFs utiliza URLs assinadas geradas no momento da exibição, com renovação automática.
- **Proteção contra senhas vazadas:** ativada a verificação HIBP (Have I Been Pwned) durante cadastro e alteração de senha.
- **Recuperação de senha:** fluxo funcional de "Esqueci minha senha" com envio de link seguro e cooldown entre reenvios.

---

## Design e Identidade Visual

- **Estilo:** Cyberpunk / neon minimalista
- **Cores principais:** fundo escuro, destaques amarelo, ciano e roxo
- **Fontes:** Orbitron (títulos), Inter (corpo) e Poppins (alternativa)
- **Regra:** nenhuma cor fixa (`#...`) nos componentes — todas as cores vêm dos tokens semânticos do `index.css` para garantir consistência e suporte a temas

---

## Autor

Desenvolvido por **Mateus Iensen**.

- [Instagram](https://www.instagram.com/iensenmateus/)
- [GitHub](https://github.com/mateus-programmer)
- [LinkedIn](https://www.linkedin.com/in/mateusiensen/)
- [Email](https://mail.yahoo.com/d/compose/?to=mateusleitesilva@yahoo.com)

---

## Licença

© 2026 Mateus Iensen. Todos os direitos reservados.
