import { Sidebar } from "@/components/navigation/Sidebar";
import { getLessonTree } from "@/lib/mdx";

export default async function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch lesson tree data on the server
  const lessonTree = await getLessonTree();

  return (
    <div className="relative min-h-screen bg-neutral-900">
      {/* Sidebar - sticky on desktop */}
      <Sidebar initialTree={lessonTree} />

      {/* Main Content Area */}
      <div className="lg:pl-80">
        <div className="mx-auto max-w-5xl px-8 py-16 lg:px-16">
          {children}
        </div>
      </div>
    </div>
  );
}
