# Project Working Rules

Before changing UI, API integration, routes, or shared styling, read `DESIGN.md`.

Analyze this feature first.

Before coding:

1. Design scalable folder structure
2. Separate UI, business logic, API, hooks, types
3. Explain architecture decisions
4. Then generate code step-by-step

Do NOT put everything into one file.
Use enterprise React TypeScript architecture.

Core rules:

- Use color, spacing, radius, and typography tokens from `Frontend/app/app.css`.
- Do not introduce new hex colors unless `DESIGN.md` and `app.css` are updated together.
- Keep pages visually consistent with the Serene Academic / Calm UI direction.
- For API work, use a shared api client and service functions instead of scattered `fetch` calls inside components.
- API fetching, caching, refetching, mutation, loading, and error state must be managed with React Query through custom hooks.
- Every API-backed UI needs loading, success, empty, and error behavior when applicable.
- Check responsive behavior for mobile, tablet, and desktop before finishing.
- Run `npm.cmd run typecheck` in `Frontend` after TypeScript/UI changes.
- Run `npm.cmd run build` in `Frontend` after route, layout, config, or shared style changes.

Refactor React TypeScript project theo chuẩn enterprise.

Yêu cầu kiến trúc:

- Dùng feature-based architecture
- Tách theo chức năng
- Không để logic + UI + API trong cùng 1 file
- Không tạo file dài > 300 dòng
- Tách component nhỏ reusable
- Tách hooks riêng
- Tách service gọi API riêng
- Tách types/interface riêng
- Tách validation/schema riêng
- Tách constants riêng
- Tách route riêng theo feature

Structure chuẩn:

features/
├── auth/
│ ├── api/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── routes/
│ ├── services/
│ ├── types/
│ ├── schemas/
│ └── constants/
│
├── student/
├── admin/
└── chatbot/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   └── types/
layouts/
├── admin-layout.tsx
├── teacher-layout.tsx
├── student-layout.tsx
└── auth-layout.tsx
Quy tắc:

- React TypeScript strict mode
- Không dùng any
- Dùng React Query cho fetching
- Dùng axios instance chung
- UI component không chứa business logic
- Không fetch API trực tiếp trong page
- Dùng custom hooks
- Dùng lazy loading route
- Dùng route constants
- Mỗi component chỉ có 1 responsibility
- Component lớn phải tách nhỏ
- Reusable component đặt trong shared/components
- Không hardcode string hoặc API URL

API + React Query rules:

- Do not call API directly from `page` or UI components.
- Use shared axios/api client for base URL, auth headers, and shared error handling.
- Put endpoint calls in feature `services/` or `api/`.
- Put React Query logic in feature `hooks/`.
- Components consume only hook results such as `data`, `isLoading`, `isError`, `error`, `mutate`, and `isPending`.
- Use stable query keys from feature `constants/`; do not hardcode query keys inline across components.
- Mutations must invalidate or update related queries after success.
- API-backed UI must handle loading, success, empty, and error states.
- Keep request/response types in feature `types/`; do not use `any`.

Suggested flow:

```text
route/page -> feature component -> custom React Query hook -> service/api function -> shared api client
```

Route rules:

- Dùng folder-based routing
- Route theo feature
- Dynamic route dùng $id
- Có layout route
- Có protected route

Naming convention:

- kebab-case cho file
- PascalCase cho component
- camelCase cho function
- Hook bắt đầu bằng use

Khi generate code:

- Luôn tạo folder structure trước
- Giải thích file nào chịu trách nhiệm gì
- Không viết tất cả logic trong 1 page
- Ưu tiên maintainable architecture
- Ưu tiên scalable structure

Giải thích
Tại sao cần shared/ chỉ khi có cái chung
Component dùng chung
Hook dùng chung
Utils
