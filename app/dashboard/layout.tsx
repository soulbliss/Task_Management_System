import { Metadata } from "next";
import { UserNav } from "@/components/user-nav";

export const metadata: Metadata = {
  title: "Dashboard | Task Management System",
  description: "View your task statistics and recent tasks",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/dashboard">
              <span className="font-bold inline-block">Task Management</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                className="transition-colors hover:text-foreground/80"
                href="/dashboard"
              >
                Dashboard
              </a>
              <a
                className="transition-colors hover:text-foreground/80"
                href="/tasks"
              >
                Tasks
              </a>
            </nav>
          </div>
          <UserNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 