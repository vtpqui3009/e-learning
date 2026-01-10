/**
 * Code Execution Utility using Piston API (FREE - No API Key Required!)
 * https://github.com/engineer-man/piston
 */

import type { ExecutionResult } from "@/types/code-execution";

// Piston API language mappings
const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  csharp: { language: "csharp", version: "6.12.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.68.2" },
  php: { language: "php", version: "8.2.3" },
  ruby: { language: "ruby", version: "3.0.1" },
};

interface PistonExecuteRequest {
  language: string;
  version: string;
  files: Array<{
    name?: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
}

interface PistonExecuteResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

// Piston API endpoint (completely free, no key needed!)
const PISTON_API_URL = "https://emkc.org/api/v2/piston";

/**
 * Execute code using Piston API
 */
export async function executeCode(
  code: string,
  language: string = "csharp",
  stdin?: string
): Promise<ExecutionResult> {
  const langConfig = PISTON_LANGUAGES[language.toLowerCase()];
  
  if (!langConfig) {
    return {
      stdout: "",
      stderr: `Unsupported language: ${language}. Supported: ${Object.keys(PISTON_LANGUAGES).join(", ")}`,
      compile_output: "",
      status: {
        id: 0,
        description: "Unsupported Language",
      },
    };
  }

  try {
    const requestBody: PistonExecuteRequest = {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          name: getFileName(language),
          content: code,
        },
      ],
      stdin: stdin || "",
      compile_timeout: 10000,
      run_timeout: 5000,
    };

    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Piston API error: ${response.status} - ${errorText}`);
    }

    const result: PistonExecuteResponse = await response.json();

    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      return {
        stdout: "",
        stderr: result.compile.stderr || "",
        compile_output: result.compile.output || result.compile.stderr,
        status: {
          id: 6,
          description: "Compilation Error",
        },
      };
    }

    // Check for runtime errors
    if (result.run.code !== 0) {
      return {
        stdout: result.run.stdout || "",
        stderr: result.run.stderr || "",
        compile_output: result.compile?.output || "",
        status: {
          id: 11,
          description: "Runtime Error",
        },
      };
    }

    // Success
    return {
      stdout: result.run.stdout || "",
      stderr: result.run.stderr || "",
      compile_output: result.compile?.output || "",
      status: {
        id: 3,
        description: "Accepted",
      },
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown error occurred",
      compile_output: "",
      status: {
        id: 0,
        description: "Execution Error",
      },
    };
  }
}

/**
 * Get appropriate file name for language
 */
function getFileName(language: string): string {
  const extensions: Record<string, string> = {
    csharp: "Program.cs",
    javascript: "script.js",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c",
    typescript: "script.ts",
    go: "main.go",
    rust: "main.rs",
    php: "script.php",
    ruby: "script.rb",
  };
  return extensions[language.toLowerCase()] || "code.txt";
}

/**
 * Get list of available languages (for UI)
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(PISTON_LANGUAGES);
}
