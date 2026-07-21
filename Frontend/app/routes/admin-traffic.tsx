import { AdminTrafficPage } from "~/features/admin/pages/admin-traffic-page";

export function meta() {
  return [
    { title: "Lưu lượng website | Admin | Học LLCT" },
    {
      name: "description",
      content: "Thống kê lưu lượng người xem website.",
    },
  ];
}

export default function AdminTrafficRoute() {
  return <AdminTrafficPage />;
}
