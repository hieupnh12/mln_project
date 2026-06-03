import { Outlet } from "react-router";

import { AdminMobileNav } from "../features/admin/components/admin-mobile-nav";
import { AdminSidebar } from "../features/admin/components/admin-sidebar";
import { AdminTopbar } from "../features/admin/components/admin-topbar";

export function AdminLayout() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface">
      <AdminSidebar />
      <AdminTopbar />

      <main className="px-margin-mobile pb-xl pt-md md:px-margin-desktop lg:ml-64 lg:mt-xl">
        <AdminMobileNav />
        <Outlet />
      </main>
    </div>
  );
}
