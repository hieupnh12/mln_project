# Teacher routes — agent checklist

Đọc file này **trước** khi thêm/sửa route, layout, menu hoặc trang thuộc khu vực **teacher** (và tương tự cho student/admin).

## Cấu trúc route teacher

- Khai báo route con trong `Frontend/app/routes.ts` dưới parent `route("teacher", "routes/teacher.tsx", [...])`.
- Parent `routes/teacher.tsx` **bắt buộc** bọc `ProtectedRoute` với `allowedRoles={ROUTE_ACCESS.teacher}` và `TeacherLayout`.
- Không thêm page teacher ngoài cây route này (tránh URL lọt không qua guard).

```tsx
// routes/teacher.tsx — mẫu bắt buộc
<ProtectedRoute allowedRoles={ROUTE_ACCESS.teacher}>
  <TeacherLayout />
</ProtectedRoute>
```

## Kiểm tra quyền khi người dùng gõ URL trực tiếp

Ví dụ: `http://localhost:5173/teacher/questions` khi role là `student`.

`ProtectedRoute` (`Frontend/app/shared/components/protected-route.tsx`):

1. **Chưa đăng nhập** → `/login` (lưu `state.from` để quay lại sau login nếu hợp lệ).
2. **Sai role** (student/admin vào `/teacher/*`) → toast thông báo + chuyển về:
   - `state.from` nếu path đó **thuộc đúng role** của họ (ví dụ student từ `/student/courses/1` lỡ click link teacher),
   - ngược lại → dashboard theo role (`AUTH_ROLE_REDIRECTS` trong `features/auth/constants/auth.constants.ts`).

Không tắt/bypass `ProtectedRoute` để “test UI” trên môi trường thật.

## Khi thêm route teacher mới

1. Thêm `route("...", "routes/teacher-....tsx")` trong `routes.ts`.
2. Thêm constant trong `features/teacher/constants/teacher-dashboard.constants.ts` (`TEACHER_ROUTES`) nếu cần link/nav.
3. Cập nhật sidebar/mobile nav nếu là mục menu chính.
4. Không gọi API teacher trực tiếp từ component public; dùng service + hook trong `features/teacher/`.
5. Chạy `npm.cmd run typecheck` và `npm.cmd run build` trong `Frontend`.

## Student / Admin (cùng quy tắc)

| Khu vực | Layout route | `ROUTE_ACCESS` |
| --- | --- | --- |
| Student | `routes/student.tsx` | `student` |
| Teacher | `routes/teacher.tsx` | `teacher` |
| Admin | `routes/admin-dashboard.tsx` (hoặc layout admin sau này) | `admin` |

## 404

- URL không khớp route → `routes/not-found.tsx` (splat `*` trong `routes.ts`).
- UI dùng `shared/components/not-found-page.tsx` (copy: “The requested page could not be found.”).

## Docker / deploy (frontend)

- Build image với `--build-arg VITE_API_BASE_URL=...` (URL API production).
- `Frontend/Dockerfile`: stage build dùng `node:20-bookworm-slim`, xóa `package-lock.json` trước `npm install` (lockfile Windows thiếu native binding Linux).
- Không commit `.env.production`.

## Tham chiếu nhanh

- Guard: `Frontend/app/shared/components/protected-route.tsx`
- Role → path: `Frontend/app/shared/constants/route-access.ts`, `getRoleHomePath`
- Danh sách route: `Frontend/app/routes.ts`
