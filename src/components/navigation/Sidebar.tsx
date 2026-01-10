"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonTree } from "@/types/lesson";

export function Sidebar() {
  const [tree, setTree] = useState<LessonTree[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Fetch lesson tree only once on mount
  useEffect(() => {
    fetch("/api/lessons/tree")
      .then((res) => res.json())
      .then((data) => {
        setTree(data);
      });
  }, []);

  // Auto-expand current category when pathname changes
  useEffect(() => {
    const currentCategory = pathname.split("/")[2];
    if (currentCategory) {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentCategory);
        return newSet;
      });
    }
  }, [pathname]);

  // Save scroll position on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      scrollPositionRef.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [tree]); // Re-attach when tree loads

  // Restore scroll position ONLY when categories expand/collapse
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && scrollPositionRef.current > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        container.scrollTop = scrollPositionRef.current;
      });
    }
  }, [expandedCategories]); // Only on category expand/collapse, NOT on pathname changes

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isLessonActive = (category: string, slug: string) => {
    return pathname === `/lessons/${category}/${slug}`;
  };

  const SidebarContent = () => (
    <nav
      ref={scrollContainerRef}
      className="h-full overflow-y-auto p-6 space-y-1 bg-neutral-900 custom-scrollbar"
    >
      {/* Logo/Title Area */}
      <div className="mb-8 pb-6 border-b border-neutral-700">
        <Link href="/lessons" className="block group">
          <h2 className="text-2xl font-serif font-bold text-gray-100 tracking-tight">
            C# Curriculum
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Fundamentals to mastery
          </p>
        </Link>
      </div>

      {/* Category Navigation */}
      <div className="space-y-6">
        {tree.map((item, index) => {
          const isExpanded = expandedCategories.has(item.category.category);
          const hasActiveLessonin = item.lessons.some((lesson) =>
            isLessonActive(item.category.category, lesson.slug)
          );

          return (
            <div
              key={item.category.category}
              className="space-y-2"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(item.category.category)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-neutral-800 group",
                  hasActiveLessonin && "bg-neutral-800"
                )}
              >
                <span
                  className="text-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    filter: hasActiveLessonin
                      ? `drop-shadow(0 0 8px ${item.category.color}40)`
                      : "none",
                  }}
                >
                  {item.category.icon}
                </span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm text-gray-200">
                    {item.category.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.lessons.length} lessons
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                )}
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="ml-6 pl-4 border-l-2 border-neutral-800 space-y-0.5">
                  {item.lessons.map((lesson, lessonIndex) => {
                    const isActive = isLessonActive(
                      item.category.category,
                      lesson.slug
                    );

                    return (
                      <Link
                        key={lesson.slug}
                        href={`/lessons/${item.category.category}/${lesson.slug}`}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-all duration-150",
                          "hover:bg-neutral-800 hover:translate-x-0.5",
                          isActive
                            ? "text-white font-medium shadow-sm"
                            : "text-gray-400 hover:text-gray-200"
                        )}
                        style={{
                          backgroundColor: isActive ? item.category.color : undefined,
                        }}
                      >
                        <div className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              "text-xs font-mono",
                              isActive ? "text-white/80" : "text-gray-600"
                            )}
                          >
                            {String(lesson.order).padStart(2, "0")}
                          </span>
                          <span className="flex-1">{lesson.title}</span>
                        </div>
                        {lesson.estimatedTime && (
                          <div
                            className={cn(
                              "text-xs mt-1",
                              isActive ? "text-white/60" : "text-gray-600"
                            )}
                          >
                            {lesson.estimatedTime}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-neutral-800 shadow-lg border border-neutral-700"
      >
        {mobileOpen ? <X className="w-5 h-5 text-gray-200" /> : <Menu className="w-5 h-5 text-gray-200" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-80 bg-neutral-900 border-r border-neutral-800 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-14 bottom-0 w-80 bg-neutral-900 border-r border-neutral-800 z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(23, 23, 23, 0.4);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(115, 115, 115, 0.3);
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(115, 115, 115, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(115, 115, 115, 0.7);
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(115, 115, 115, 0.3) rgba(23, 23, 23, 0.4);
        }
      `}</style>
    </>
  );
}
