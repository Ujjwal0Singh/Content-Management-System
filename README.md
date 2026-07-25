# CMS Assignment — Headless CMS (Admin + Public Frontend)

A decoupled headless CMS: Express/MongoDB backend, a React admin dashboard for
managing block-based content, and a React public site that renders it
(including nested lists, tables, and LaTeX math via KaTeX).

```
cms-assignment/
├── backend/            Express API + MongoDB models + JWT auth
├── admin-frontend/     React admin dashboard (Vite, Redux Toolkit)
├── public-frontend/    React public site (Vite)
└── docker-compose.yml
```

## 1. Content model

Every page is `{ title, slug, status, layout, blocks: [] }`. Each block is
`{ type, data, order }` where `type` is one of `header | text | list | table
| math | image`. This is what lets one schema hold headings, markdown text,
nested lists, tables, and LaTeX formulas without special-casing the database.

---


## 2. Running (plain Node, for development)

```bash
# backend
cd backend
npm install
npm run dev            # nodemon-less watch mode via node --watch
npm run seed:admin     # once, to create the first admin

# admin frontend (new terminal)
cd admin-frontend
npm install
npm run dev             # http://localhost:5173

# public frontend (new terminal)
cd public-frontend
npm install
npm run dev             # http://localhost:5174
```

---

## 3. API reference

```
POST   /api/v1/auth/register     create an admin (open — consider disabling after first use)
POST   /api/v1/auth/login        { email, password } -> { token, admin }
GET    /api/v1/auth/me           requires Bearer token

GET    /api/v1/content           list pages (?status=published to filter)
GET    /api/v1/content/slug/:slug   public: fetch one page by slug
GET    /api/v1/content/:id       admin: fetch one page by id (auth required)
POST   /api/v1/content           admin: create page (auth required)
PUT    /api/v1/content/:id       admin: update page (auth required)
DELETE /api/v1/content/:id       admin: delete page (auth required)
```

Admin routes expect `Authorization: Bearer <jwt>`.

## 4. Block types reference

| type   | data shape |
|--------|------------|
| header | `{ text, level }` |
| text   | `{ content }` — markdown, rendered with `react-markdown` |
| list   | `{ style: "ordered"\|"unordered", items: [{ text, items: [] }] }` — nested |
| table  | `{ headers: [...], rows: [[...]] }` |
| math   | `{ latex, display: boolean }` — rendered with `react-katex`/KaTeX |
| image  | `{ url, alt }` |

Add new block types by: adding the type to `backend/src/models/Page.js` enum
and `utils/validators.js`, adding a form to `admin-frontend/src/components/BlockEditor.jsx`,
and a renderer to `public-frontend/src/components/BlockRenderer.jsx`.
