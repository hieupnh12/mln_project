import { Outlet } from "react-router";

import { AdminTopbar } from "../features/admin/components/admin-topbar";

export function AdminLayout() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface">
      <AdminTopbar />

      <main className="w-full px-5 py-4 pb-xl md:px-25 md:py-5">
        <Outlet />
      </main>
    </div>
  );
}
