"use client";

import { useState, useEffect } from "react";

interface LessonProgress {
  [lessonId: string]: {
    completed: boolean;
    lastVisited: string;
    timeSpent?: number;
  };
}

export function useLessonProgress() {
  const [progress, setProgress] = useState<LessonProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("lesson-progress");
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error("Failed to parse lesson progress:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lesson-progress", JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  /**
   * Mark a lesson as completed
   */
  const markComplete = (lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        completed: true,
        lastVisited: new Date().toISOString(),
      },
    }));
  };

  /**
   * Mark a lesson as incomplete
   */
  const markIncomplete = (lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        completed: false,
        lastVisited: new Date().toISOString(),
      },
    }));
  };

  /**
   * Update the last visited time for a lesson
   */
  const updateLastVisited = (lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        completed: prev[lessonId]?.completed || false,
        lastVisited: new Date().toISOString(),
      },
    }));
  };

  /**
   * Check if a lesson is completed
   */
  const isComplete = (lessonId: string): boolean => {
    return progress[lessonId]?.completed || false;
  };

  /**
   * Get the last visited date for a lesson
   */
  const getLastVisited = (lessonId: string): Date | null => {
    const dateString = progress[lessonId]?.lastVisited;
    return dateString ? new Date(dateString) : null;
  };

  /**
   * Get total number of completed lessons
   */
  const getTotalCompleted = (): number => {
    return Object.values(progress).filter((p) => p.completed).length;
  };

  /**
   * Get completion percentage for a category
   */
  const getCategoryProgress = (lessonIds: string[]): number => {
    if (lessonIds.length === 0) return 0;
    const completed = lessonIds.filter((id) => isComplete(id)).length;
    return Math.round((completed / lessonIds.length) * 100);
  };

  /**
   * Reset all progress
   */
  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem("lesson-progress");
  };

  /**
   * Export progress as JSON
   */
  const exportProgress = (): string => {
    return JSON.stringify(progress, null, 2);
  };

  /**
   * Import progress from JSON
   */
  const importProgress = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setProgress(imported);
    } catch (error) {
      console.error("Failed to import progress:", error);
      throw new Error("Invalid progress data");
    }
  };

  return {
    progress,
    isLoaded,
    markComplete,
    markIncomplete,
    updateLastVisited,
    isComplete,
    getLastVisited,
    getTotalCompleted,
    getCategoryProgress,
    resetProgress,
    exportProgress,
    importProgress,
  };
}
