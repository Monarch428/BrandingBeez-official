// components/admin/AdminLayout.tsx
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AdminLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ sidebar, header, children }: AdminLayoutProps) {
  return (
    <div className="h-screen flex bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      {/* ✅ GLOBAL TOASTER — keep it OUTSIDE dialogs and ABOVE everything */}
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 2147483647,
        }}
        toastOptions={{
          style: {
            zIndex: 2147483647,
          },
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 border-r bg-white/90 backdrop-blur">
        {sidebar}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white/90 backdrop-blur flex items-center px-6">
          {header}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
