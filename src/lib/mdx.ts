import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { LessonMetadata, CategoryMetadata, LessonTree } from "@/types/lesson";
import { CodeEditor } from "@/components/lesson/CodeEditor";

const contentDirectory = path.join(process.cwd(), "content", "lessons");

// MDX components that can be used in lessons
const mdxComponents = {
  CodeEditor,
};

/**
 * Get all categories from the content directory
 */
export async function getAllCategories(): Promise<CategoryMetadata[]> {
  const categories = fs.readdirSync(contentDirectory);

  const categoryMetadata = categories
    .filter((category) => {
      const categoryPath = path.join(contentDirectory, category);
      return fs.statSync(categoryPath).isDirectory();
    })
    .map((category) => {
      const metadataPath = path.join(contentDirectory, category, "metadata.json");
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        return metadata as CategoryMetadata;
      }
      return null;
    })
    .filter(Boolean) as CategoryMetadata[];

  return categoryMetadata.sort((a, b) => a.order - b.order);
}

/**
 * Get all lessons from a specific category
 */
export async function getLessonsByCategory(category: string): Promise<LessonMetadata[]> {
  const categoryPath = path.join(contentDirectory, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const lessons = mdxFiles.map((file) => {
    const filePath = path.join(categoryPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      ...data,
      slug: file.replace(/\.mdx$/, ""),
      category,
    } as LessonMetadata;
  });

  return lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get a specific lesson by category and slug
 */
export async function getLessonBySlug(category: string, slug: string) {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: markdownContent } = matter(fileContent);

  // Compile MDX content with custom components
  const { content } = await compileMDX({
    source: markdownContent,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    metadata: {
      ...data,
      slug,
      category,
    } as LessonMetadata,
    content,
  };
}

/**
 * Get the full lesson tree (all categories with their lessons)
 */
export async function getLessonTree(): Promise<LessonTree[]> {
  const categories = await getAllCategories();

  const tree = await Promise.all(
    categories.map(async (category) => {
      const lessons = await getLessonsByCategory(category.category);
      return {
        category,
        lessons,
      };
    })
  );

  return tree;
}

/**
 * Get next and previous lessons for navigation
 */
export async function getAdjacentLessons(category: string, slug: string) {
  const lessons = await getLessonsByCategory(category);
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // If no next lesson in current category, try to get first lesson from next category
  if (!next) {
    const categories = await getAllCategories();
    const categoryIndex = categories.findIndex((c) => c.category === category);

    if (categoryIndex < categories.length - 1) {
      const nextCategory = categories[categoryIndex + 1];
      const nextCategoryLessons = await getLessonsByCategory(nextCategory.category);
      if (nextCategoryLessons.length > 0) {
        return { prev, next: nextCategoryLessons[0] };
      }
    }
  }

  return { prev, next };
}

/**
 * Check if a lesson file exists
 */
export function lessonExists(category: string, slug: string): boolean {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
  return fs.existsSync(filePath);
}
