import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Award } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { getLessonBySlug, getAdjacentLessons, getAllCategories } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "../../lessons.css";

interface LessonPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate static params for all lessons
export async function generateStaticParams() {
  const categories = await getAllCategories();
  const params: { category: string; slug: string }[] = [];

  for (const cat of categories) {
    const { getLessonsByCategory } = await import("@/lib/mdx");
    const lessons = await getLessonsByCategory(cat.category);

    for (const lesson of lessons) {
      params.push({
        category: cat.category,
        slug: lesson.slug,
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const lesson = await getLessonBySlug(category, slug);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `${lesson.metadata.title} | C# Learning`,
    description: lesson.metadata.description,
    keywords: lesson.metadata.keywords?.join(", "),
    openGraph: {
      title: lesson.metadata.title,
      description: lesson.metadata.description,
      type: "article",
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { category, slug } = await params;
  const lesson = await getLessonBySlug(category, slug);

  if (!lesson) {
    notFound();
  }

  const { prev, next } = await getAdjacentLessons(category, slug);
  const categories = await getAllCategories();
  const currentCategory = categories.find((c) => c.category === category);

  const breadcrumbItems = [
    { label: "Lessons", href: "/lessons" },
    { label: currentCategory?.title || category, href: `/lessons/${category}` },
    { label: lesson.metadata.title },
  ];

  const difficultyColors = {
    beginner: "bg-green-900/50 text-green-300 border-green-700",
    intermediate: "bg-amber-900/50 text-amber-300 border-amber-700",
    advanced: "bg-red-900/50 text-red-300 border-red-700",
  };

  const categoryColor = currentCategory?.color || '#3b82f6';

  return (
    <article className="lesson-page">
      {/* Category color styles for dynamic elements */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .lesson-page .prose blockquote {
            border-left-color: ${categoryColor};
          }
          .lesson-page .prose a {
            color: ${categoryColor};
            text-decoration-color: ${categoryColor}40;
          }
          .lesson-page .prose a:hover {
            text-decoration-color: ${categoryColor};
          }
        `
      }} />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} className="mb-12 animate-fadeIn" />

      {/* Lesson Header */}
      <header className="mb-16 pb-10 border-b border-neutral-700 space-y-8 animate-slideUp">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-100 tracking-tight leading-tight">
          {lesson.metadata.title}
        </h1>

        {/* Description */}
        {lesson.metadata.description && (
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            {lesson.metadata.description}
          </p>
        )}

        {/* Metadata Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {lesson.metadata.difficulty && (
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 font-medium",
                difficultyColors[lesson.metadata.difficulty]
              )}
            >
              <Award className="w-3 h-3 mr-1.5" />
              {lesson.metadata.difficulty.charAt(0).toUpperCase() +
                lesson.metadata.difficulty.slice(1)}
            </Badge>
          )}

          {lesson.metadata.estimatedTime && (
            <Badge variant="outline" className="px-3 py-1 border-neutral-600 text-gray-300 bg-neutral-800">
              <Clock className="w-3 h-3 mr-1.5" />
              {lesson.metadata.estimatedTime}
            </Badge>
          )}

          {lesson.metadata.keywords && lesson.metadata.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lesson.metadata.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="px-2.5 py-0.5 text-xs font-mono bg-neutral-800 text-gray-400 hover:bg-neutral-700 transition-colors border border-neutral-700"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Lesson Content - MDX */}
      <div className="prose prose-neutral prose-lg max-w-none mb-20 animate-fadeIn">
        {lesson.content}
      </div>

      {/* Navigation - Prev/Next */}
      <nav className="flex items-center justify-between pt-16 border-t border-neutral-700 gap-4 animate-fadeIn">
        {prev ? (
          <Link
            href={`/lessons/${prev.category}/${prev.slug}`}
            className="group flex items-center gap-3 px-6 py-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-200 flex-1 max-w-md"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400 group-hover:text-gray-200 group-hover:-translate-x-1 transition-all" />
            <div className="text-left">
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">
                Previous
              </div>
              <div className="text-sm font-semibold text-gray-200 group-hover:text-white">
                {prev.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <Link
            href={`/lessons/${next.category}/${next.slug}`}
            className="group flex items-center gap-3 px-6 py-4 rounded-lg border hover:bg-neutral-800 transition-all duration-200 flex-1 max-w-md text-right ml-auto"
            style={{
              borderColor: `${categoryColor}40`,
            }}
          >
            <div className="text-right flex-1">
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">
                Next Lesson
              </div>
              <div
                className="text-sm font-semibold group-hover:text-white"
                style={{ color: categoryColor }}
              >
                {next.title}
              </div>
            </div>
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-all"
              style={{ color: categoryColor }}
            />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </article>
  );
}
