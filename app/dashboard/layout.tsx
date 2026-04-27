import Sidebar from "@/src/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-zinc-200 flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Mobile Header (placeholder for responsive) */}
        <header className="lg:hidden h-16 border-b border-zinc-800/50 flex items-center px-4 bg-[#0A0A0B] sticky top-0 z-40">
          <div className="font-bold text-lg text-white">COMOPAY Admin</div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
