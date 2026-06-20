# M-L Master Design & AI Working Standard

Tài liệu này là nguồn chuẩn cho màu sắc, giao diện, cách mô tả task và cách kết nối API trong project. Nội dung được mở rộng từ file thiết kế gốc `Serene Academic` và đồng bộ với token hiện có trong `Frontend/app/app.css`.

Khi AI hoặc thành viên team tạo page/component mới, phải đọc tài liệu này trước khi tự chọn màu, spacing, layout hoặc kiểu gọi API.

## 1. Brand Direction

M-L Master là nền tảng học tập nghiêm túc, rõ ràng và hiện đại. Giao diện cần theo hướng Soft Minimalism và Calm UI: học thuật, tin cậy, dễ đọc, ít gây mệt thị giác, không quá nhiều hiệu ứng trang trí.

Nguyên tắc chung:

- Ưu tiên bố cục thoáng, có nhịp đọc rõ, không nhồi card.
- Mỗi page phải dùng cùng hệ màu và typography token trong `Frontend/app/app.css`.
- Không tự thêm màu ngẫu nhiên bằng hex nếu màu đó đã có token tương đương.
- Không dùng palette quá lệch như neon, tím đậm, xanh chói, cam/nâu làm màu chính.
- Giao diện cần responsive trước: desktop rõ cấu trúc, tablet không vỡ layout, mobile đọc được một cột.
- Nếu cần tạo màu mới, phải cập nhật `Frontend/app/app.css` và mục Color System trong file này cùng lúc.

## 2. Color System

Nguồn màu chính nằm trong `Frontend/app/app.css` ở block `@theme`. Khi code UI bằng Tailwind, dùng class token như `bg-background`, `text-primary`, `border-outline-variant`, thay vì hard-code hex.

### 2.1 Màu Nền

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `background` | `#fcf8f9` | Nền app tổng thể |
| `surface` | `#fcf8f9` | Nền section/page sáng |
| `surface-container-lowest` | `#ffffff` | Card nổi bật, form, modal |
| `surface-container-low` | `#f6f3f4` | Vùng nền phụ |
| `surface-container` | `#f0edee` | Panel hoặc section phụ |
| `surface-container-high` | `#ebe7e8` | Header nhỏ, toolbar, trạng thái nâng |
| `surface-container-highest` | `#e5e2e3` | Vùng nổi bật cần contrast nhẹ |

Quy định:

- Page chính dùng `bg-background` hoặc `bg-surface`.
- Card/form dùng `bg-white`, `bg-surface-container-lowest`, hoặc `bg-white/90`.
- Section phụ dùng `bg-surface-container-low`.
- Không tạo nền full-page bằng gradient khác hệ màu nếu chưa có lý do thiết kế rõ.

### 2.2 Màu Chữ

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `primary` | `#0e121e` | Heading, brand, CTA chính |
| `on-surface` | `#1c1b1c` | Body text chính |
| `on-surface-variant` | `#46464c` | Mô tả, subtitle, helper text |
| `on-primary` | `#ffffff` | Chữ trên nền primary |
| `on-secondary` | `#ffffff` | Chữ trên nền secondary |
| `outline` | `#76777c` | Border rõ |
| `outline-variant` | `#c6c6cc` | Border nhẹ |

Quy định:

- Heading dùng `text-primary`.
- Paragraph dùng `text-on-surface` hoặc `text-on-surface-variant`.
- Text phụ không dùng opacity thấp dưới `text-on-surface-variant` nếu ảnh hưởng khả năng đọc.
- CTA nền tối dùng `text-on-primary`.

### 2.3 Màu Hành Động

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `primary` | `#0e121e` | Nút chính, brand mark, heading quan trọng |
| `primary-container` | `#232733` | Quote box, panel tối |
| `secondary` | `#3f6564` | Accent, link hover, trạng thái chọn |
| `secondary-container` | `#bfe8e6` | Badge, nút phụ, highlight nhẹ |
| `secondary-fixed` | `#c1eae8` | Chữ/line accent trên nền tối |
| `tertiary` | `#011616` | Accent rất tối, ít dùng |
| `tertiary-container` | `#152b2a` | Panel tối phụ |
| `error` | `#ba1a1a` | Lỗi form/API |
| `error-container` | `#ffdad6` | Nền lỗi nhẹ |

Quy định:

- Nút chính: `bg-primary text-on-primary`.
- Nút phụ: `bg-secondary-container text-primary` hoặc `border-outline-variant bg-white text-primary`.
- Link hover: `hover:text-primary` hoặc `hover:text-secondary`.
- Error UI: `text-error`, `bg-error-container`, không dùng đỏ tự chọn.

### 2.4 Gradient Và Hiệu Ứng

Gradient hiện có:

```css
linear-gradient(135deg, #bfe8e6 0%, #ffffff 50%, #f6e6de 100%)
```

Quy định:

- Chỉ dùng gradient này cho hero/login/brand surface khi cần hiệu ứng mềm.
- **Catalog card hero** (Flashcard / Kiểm tra): dùng token `catalog-*` trong `app.css` — tối đa 10 tổ hợp gradient, chữ trắng trên nền gradient.
- Không tạo thêm gradient tím/xanh neon/cam ngoài token `catalog-*` nếu không cập nhật tài liệu này.
- Blur/glass chỉ dùng nhẹ: border mỏng, background trắng trong suốt, shadow thấp.

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `catalog-cyan` | `#06b6d4` | Gradient hero card — xanh ngọc |
| `catalog-sky` | `#0ea5e9` | Gradient hero card — xanh trời |
| `catalog-cobalt` | `#2563eb` | Gradient hero card — xanh coban |
| `catalog-indigo` | `#4f46e5` | Gradient hero card — chàm |
| `catalog-violet` | `#7c3aed` | Gradient hero card — tím |
| `catalog-magenta` | `#d946ef` | Gradient hero card — magenta |
| `catalog-coral` | `#fb923c` | Gradient hero card — cam san hô |
| `catalog-amber` | `#fbbf24` | Gradient hero card — vàng amber |

## 3. Typography

Font:

- Sans: `Inter`
- Serif display: `Playfair Display`
- Heading học thuật/brand có thể dùng `font-serif`.
- Nội dung, form, button, nav dùng `font-body-md`, `font-label-md` hoặc `font-sans`.

Quy định:

- Không dùng font mới nếu chưa thêm vào `root.tsx` và cập nhật tài liệu.
- Không dùng letter spacing âm.
- Không scale chữ bằng viewport width.
- Heading trong card không dùng kích thước hero.

## 4. Spacing, Radius, Layout

Spacing token:

| Token | Value | Dùng cho |
| --- | --- | --- |
| `margin-mobile` | `16px` | Padding ngang mobile |
| `margin-desktop` | `64px` | Padding ngang desktop |
| `gutter` | `24px` | Khoảng cách grid/card |
| `sm` | `12px` | Khoảng cách nhỏ |
| `md` | `24px` | Khoảng cách nội dung |
| `lg` | `48px` | Section spacing |
| `xl` | `80px` | Hero/section lớn |

Quy định layout:

- Page app/tool không làm landing page nếu user yêu cầu chức năng.
- Không đặt card lồng trong card.
- Dashboard/tool ưu tiên layout scan nhanh, ít trang trí.
- Hero/page marketing phải có visual thật hoặc ảnh rõ chủ thể.
- Mobile ưu tiên một cột, không ép hai cột bằng scale nhỏ.
- Dùng `min-w-0`, `break-words`, `truncate` khi nội dung có thể dài.

Radius:

- Card thường: `rounded-lg` hoặc `rounded-xl`.
- Card lớn như login/auth có thể dùng `rounded-[28px]`.
- Button thường dùng `rounded-lg`, `rounded-xl`, hoặc `rounded-full` khi là pill nav/CTA.

## 5. Component Rules

Button:

- Primary: `bg-primary text-on-primary`.
- Secondary: `bg-secondary-container text-primary`.
- Outline: `border border-outline-variant/35 bg-white text-primary`.
- Icon button phải có `aria-label`.
- Button có trạng thái `hover`, `active`, `disabled` nếu có logic.

Form:

- Label rõ, input có border `outline-variant`.
- Error hiển thị gần field liên quan.
- Loading state không làm layout nhảy.
- Submit disabled khi đang gửi request hoặc dữ liệu chưa hợp lệ.

Card:

- Dùng cho item lặp, form, modal, panel cần khung rõ.
- Không dùng card chỉ để bọc cả page section.
- Shadow nhẹ, không shadow quá đậm.

Navigation:

- Nav chính dùng màu trung tính, active state rõ.
- Link không active dùng `text-on-surface-variant`.
- Link hover dùng `text-primary`.

## 6. Responsive Standard

Breakpoints theo Tailwind:

- Mobile mặc định: `<640px`
- `sm`: `>=640px`
- `md`: `>=768px`
- `lg`: `>=1024px`
- `xl`: `>=1280px`

Checklist responsive:

- Mobile không overflow ngang.
- Text trong button/card không bị cắt.
- Grid nhiều cột chuyển thành một cột trên mobile.
- Ảnh có `aspect-ratio`, `object-fit`, và không kéo méo.
- Footer/link group wrap được.
- Desktop phải giữ đúng cấu trúc thiết kế chính, không chỉ phóng to mobile.

## 7. API Integration Standard

Khi kết nối API, không gọi `fetch` rải rác trong component nếu flow được dùng lại. Tách theo lớp:

```text
route/component -> service function -> shared api client -> backend endpoint
```

Đề xuất cấu trúc frontend:

```text
Frontend/app/
  lib/
    api-client.ts
  services/
    auth.service.ts
    user.service.ts
  types/
    api.ts
```

Nguyên tắc:

- Mỗi endpoint có type request/response rõ.
- Service trả dữ liệu đã parse hoặc throw lỗi chuẩn.
- Component chỉ xử lý UI state: loading, success, empty, error.
- Không hard-code base URL trong component.
- Token/auth header chỉ xử lý ở api client hoặc server route.
- Không nuốt lỗi bằng `catch {}` rỗng.

Mẫu API client:

```ts
type ApiErrorPayload = {
  message?: string;
  code?: string;
};

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | ApiErrorPayload
      | null;

    throw new Error(payload?.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
```

Mẫu service:

```ts
import { apiRequest } from "~/lib/api-client";

type LoginWithGoogleResponse = {
  redirectUrl: string;
};

export function getGoogleLoginUrl() {
  return apiRequest<LoginWithGoogleResponse>("/auth/google/url");
}
```

## 8. React Router Data Rules

Ưu tiên:

- Dữ liệu cần render trước: dùng `loader`.
- Mutation/form submit: dùng `action` hoặc service gọi trong event handler nếu là client-only flow.
- Redirect sau login/logout: xử lý trong route/action rõ ràng.
- Error từ loader/action cần có UI fallback hoặc ErrorBoundary.

Không nên:

- Gọi API trong `useEffect` nếu dữ liệu là yêu cầu chính của route.
- Để component vừa gọi API, vừa parse response, vừa map domain logic quá nhiều.
- Dùng state rời rạc cho cùng một request nếu có thể gom thành `idle/loading/success/error`.

## 9. AI Task Prompt Standard

Khi giao việc cho AI hoặc thành viên team, mô tả theo mẫu này để kết quả đồng nhất:

```md
## Goal
Mục tiêu người dùng cần đạt là gì?

## Scope
File/page/component nào được sửa? File nào không được đụng?

## Design
- Dùng token màu trong `Frontend/app/app.css`.
- Bố cục desktop/tablet/mobile mong muốn.
- Component/state bắt buộc có.
- Ảnh/icon/tài sản cần dùng.

## Data/API
- Endpoint:
- Method:
- Request payload:
- Response shape:
- Auth requirement:
- Error cases:

## Behavior
- Loading:
- Empty:
- Success:
- Error:
- Navigation/redirect:

## Acceptance Criteria
- Typecheck/build pass.
- Không overflow mobile.
- Không hard-code màu ngoài guideline.
- UI đúng trạng thái chính.
```

Ví dụ prompt tốt:

```md
Tạo trang profile tại `Frontend/app/routes/profile.tsx`.
Thiết kế theo `DESIGN.md`, dùng `bg-background`, `text-primary`, `text-on-surface-variant`.
Desktop: layout 2 cột gồm thông tin user và lịch sử học. Mobile: một cột.
Gọi `GET /api/me`, response `{ id, name, email, avatarUrl }`.
Có loading skeleton, error message bằng `text-error`, và empty state nếu thiếu lịch sử học.
Chạy typecheck/build sau khi sửa.
```

## 10. PR / Merge Checklist

## 11. Landing Modern Tokens

The public landing page may use a light premium education palette while still staying
inside the project token system. These tokens live in `Frontend/app/app.css` and should
be used instead of hard-coded colors inside React components:

| Token | Hex | Usage |
| --- | --- | --- |
| `landing-white` | `#ffffff` | Main landing background and glass panels |
| `landing-cream` | `#f8f9fa` | Warm premium section background |
| `landing-gray` | `#f3f4f6` | Subtle secondary background |
| `landing-red` | `#b91c1c` | Primary Marx-Lenin CTA and highlights |
| `landing-red-deep` | `#991b1b` | CTA gradient and hover states |
| `landing-red-dark` | `#7f1d1d` | Deep accent for timeline nodes |
| `landing-gold` | `#d4a017` | Premium accent and small highlights |
| `landing-text` | `#111827` | Main landing headings |
| `landing-text-muted` | `#374151` | Body copy |
| `landing-text-soft` | `#6b7280` | Supporting text |

Rules:

- Use these for the marketing/landing experience, authentication surfaces, and student
  learning surfaces when a consistent public-to-product brand transition is needed.
- Keep dense learning tools, teacher workflows, and admin workflows on the Serene Academic tokens.
- Do not add additional landing colors without updating this section and `app.css`.

Trước khi merge UI/API code:

- Không dùng hex mới nếu không cập nhật `DESIGN.md`.
- Không có text mojibake hoặc sai encoding tiếng Việt.
- `npm.cmd run typecheck` pass trong `Frontend`.
- `npm.cmd run build` pass trong `Frontend` nếu sửa route/layout/config.
- Mobile không overflow ngang.
- Component có loading/error/empty state khi có API.
- API response type rõ ràng, không dùng `any` nếu có thể tránh.
- Không revert hoặc xoá thay đổi không liên quan.
