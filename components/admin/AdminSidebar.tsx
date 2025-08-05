"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  Users,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Produk",
    href: "/admin/produk",
    icon: Package,
  },
  {
    name: "Sesi PO",
    href: "/admin/po-sessions",
    icon: Calendar,
  },
  {
    name: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r border-border min-h-screen">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">DapurMama</h2>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
