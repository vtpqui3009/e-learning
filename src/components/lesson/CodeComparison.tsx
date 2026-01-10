"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeComparisonProps {
  leftCode: string;
  rightCode: string;
  leftTitle?: string;
  rightTitle?: string;
  language?: string;
  explanations?: { line: number; text: string; side?: "left" | "right" }[];
}

export function CodeComparison({
  leftCode,
  rightCode,
  leftTitle = "Before",
  rightTitle = "After",
  language = "csharp",
  explanations = [],
}: CodeComparisonProps) {
  const [activeExplanation, setActiveExplanation] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState<"left" | "right">("left");

  return (
    <div className="my-8 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      {/* Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-700">
        <div
          className={cn(
            "px-6 py-4 font-semibold text-sm border-b md:border-b-0 md:border-r border-neutral-700 bg-neutral-800/50",
            isMobileView === "left" && "md:bg-neutral-800"
          )}
        >
          <button
            onClick={() => setIsMobileView("left")}
            className="md:cursor-default flex items-center gap-2 text-blue-400"
          >
            <ChevronLeft className="w-4 h-4 md:hidden" />
            {leftTitle}
          </button>
        </div>
        <div
          className={cn(
            "px-6 py-4 font-semibold text-sm bg-neutral-800/50",
            isMobileView === "right" && "md:bg-neutral-800"
          )}
        >
          <button
            onClick={() => setIsMobileView("right")}
            className="md:cursor-default flex items-center gap-2 text-green-400"
          >
            {rightTitle}
            <ChevronRight className="w-4 h-4 md:hidden" />
          </button>
        </div>
      </div>

      {/* Code Editors */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Code */}
          <div className={cn("relative", isMobileView === "right" && "hidden md:block")}>
            <div className="md:border-r border-neutral-700">
              <Editor
                height="400px"
                language={language}
                value={leftCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "none",
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
                onMount={(editor) => {
                  // Highlight lines with explanations
                  const leftExplanations = explanations.filter(
                    (e) => e.side === "left" || !e.side
                  );
                  if (leftExplanations.length > 0) {
                    const decorations = leftExplanations.map((exp) => ({
                      range: {
                        startLineNumber: exp.line,
                        startColumn: 1,
                        endLineNumber: exp.line,
                        endColumn: 1,
                      },
                      options: {
                        isWholeLine: true,
                        className: "explanation-line",
                        glyphMarginClassName: "explanation-glyph",
                      },
                    }));
                    editor.deltaDecorations([], decorations);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Code */}
          <div className={cn("relative", isMobileView === "left" && "hidden md:block")}>
            <Editor
              height="400px"
              language={language}
              value={rightCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: "on",
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: "none",
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                },
              }}
              onMount={(editor) => {
                // Highlight lines with explanations
                const rightExplanations = explanations.filter((e) => e.side === "right");
                if (rightExplanations.length > 0) {
                  const decorations = rightExplanations.map((exp) => ({
                    range: {
                      startLineNumber: exp.line,
                      startColumn: 1,
                      endLineNumber: exp.line,
                      endColumn: 1,
                    },
                    options: {
                      isWholeLine: true,
                      className: "explanation-line",
                      glyphMarginClassName: "explanation-glyph",
                    },
                  }));
                  editor.deltaDecorations([], decorations);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Explanations */}
      {explanations.length > 0 && (
        <div className="border-t border-neutral-700 bg-neutral-800/30 p-6">
          <h4 className="text-sm font-semibold mb-4 text-gray-300">Key Differences:</h4>
          <div className="space-y-3">
            {explanations.map((exp, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  activeExplanation === idx
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50"
                )}
                onClick={() => setActiveExplanation(activeExplanation === idx ? null : idx)}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold",
                    exp.side === "right"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  )}
                >
                  {exp.line}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed">{exp.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .explanation-line {
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid rgba(59, 130, 246, 0.5);
        }
        .explanation-glyph {
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
