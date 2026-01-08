import { Sidebar } from "@/components/navigation/Sidebar";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-neutral-900">
      {/* Sidebar - sticky on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-80">
        <div className="mx-auto max-w-5xl px-8 py-16 lg:px-16">
          {children}
        </div>
      </div>
    </div>
  );
}
