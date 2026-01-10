"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  height?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

interface ExecutionOutput {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

export function CodeEditor({
  initialCode = "// Write your C# code here\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(\"Hello, World!\");\n    }\n}",
  language = "csharp",
  height = "400px",
  readOnly = false,
  showLineNumbers = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<ExecutionOutput | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.stderr || errorData.error || "Failed to execute code");
      }

      const result: ExecutionOutput = await response.json();
      setOutput(result);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput({
        stderr: error instanceof Error ? error.message : "An error occurred",
        compile_output: "Make sure the Judge0 API key is configured in .env.local",
        status: { id: 0, description: "Error" },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (statusId: number) => {
    if (statusId === 3) return "text-green-600"; // Accepted
    if (statusId === 6) return "text-red-600"; // Compilation Error
    if (statusId === 5) return "text-yellow-600"; // Time Limit Exceeded
    return "text-neutral-600";
  };

  return (
    <div className="my-8 rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-mono text-gray-400">
            {language === "csharp" ? "C#" : language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-8 px-3"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" />
                Copy
              </>
            )}
          </Button>

          {!readOnly && (
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              size="sm"
              className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white"
              title="Run code (Ctrl+Enter or Cmd+Enter)"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5" />
                  Run Code
                  <span className="ml-2 text-xs opacity-70">⌘↵</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="bg-[#1e1e1e]">
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          onMount={(editor, monaco) => {
            // Add keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac) to run code
            if (!readOnly) {
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => {
                  handleRunCode();
                }
              );
            }
          }}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: showLineNumbers ? "on" : "off",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Output Section */}
      {output && (
        <div className="border-t border-neutral-700 bg-neutral-900">
          {/* Output Header */}
          <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">
                Output
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  getStatusColor(output.status.id)
                )}
              >
                {output.status.description}
              </span>
            </div>
          </div>

          {/* Output Content */}
          <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto bg-neutral-900">
            {/* Standard Output */}
            {output.stdout && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-green-400 mb-1">
                  STDOUT:
                </div>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {output.stdout}
                </pre>
              </div>
            )}

            {/* Standard Error */}
            {output.stderr && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-red-400 mb-1">
                  STDERR:
                </div>
                <pre className="text-red-300 whitespace-pre-wrap">
                  {output.stderr}
                </pre>
              </div>
            )}

            {/* Compilation Output */}
            {output.compile_output && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-amber-400 mb-1">
                  COMPILATION OUTPUT:
                </div>
                <pre className="text-amber-300 whitespace-pre-wrap">
                  {output.compile_output}
                </pre>
              </div>
            )}

            {/* Execution Stats */}
            {(output.time || output.memory) && (
              <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-neutral-800">
                {output.time && (
                  <div>
                    <span className="font-semibold">Time:</span> {output.time}s
                  </div>
                )}
                {output.memory && (
                  <div>
                    <span className="font-semibold">Memory:</span>{" "}
                    {(output.memory / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            )}

            {/* No Output Message */}
            {!output.stdout &&
              !output.stderr &&
              !output.compile_output &&
              output.status.id === 3 && (
                <div className="text-gray-500 italic">
                  Program executed successfully with no output.
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
