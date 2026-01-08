export interface LessonMetadata {
  title: string;
  description: string;
  category: string;
  slug: string;
  order: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: string;
  keywords?: string[];
  prerequisites?: string[];
}

export interface CategoryMetadata {
  category: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
}

export interface LessonContent {
  metadata: LessonMetadata;
  content: any; // MDX content
}

export interface LessonTree {
  category: CategoryMetadata;
  lessons: LessonMetadata[];
}
