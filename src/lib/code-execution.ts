/**
 * Code Execution Utility for Judge0 API Integration
 */

import type { ExecutionResult } from "@/types/code-execution";

// Judge0 Language IDs
const LANGUAGE_IDS: Record<string, number> = {
  csharp: 51, // C# (Mono 6.6.0.161)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
  cpp: 54, // C++ (GCC 9.2.0)
};

interface Judge0SubmissionResponse {
  token: string;
}

interface Judge0ResultResponse {
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

/**
 * Submit code to Judge0 API for execution
 */
export async function submitCodeExecution(
  code: string,
  language: string = "csharp",
  stdin?: string
): Promise<string> {
  const apiUrl = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
  const apiKey = process.env.JUDGE0_API_KEY;
  const apiHost = process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";

  if (!apiKey) {
    throw new Error("Judge0 API key not configured");
  }

  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const response = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=false`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: stdin || "",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to submit code: ${error}`);
  }

  const result: Judge0SubmissionResponse = await response.json();
  return result.token;
}

/**
 * Poll Judge0 API for execution result
 */
export async function getExecutionResult(token: string): Promise<ExecutionResult> {
  const apiUrl = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
  const apiKey = process.env.JUDGE0_API_KEY;
  const apiHost = process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";

  if (!apiKey) {
    throw new Error("Judge0 API key not configured");
  }

  // Poll with timeout
  const maxAttempts = 10;
  const delayMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `${apiUrl}/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get execution result");
    }

    const result: Judge0ResultResponse = await response.json();

    // Status IDs:
    // 1 = In Queue, 2 = Processing, 3 = Accepted
    // 4 = Wrong Answer, 5 = Time Limit Exceeded, 6 = Compilation Error
    // 7-14 = Various runtime errors
    if (result.status.id > 2) {
      // Execution completed
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        status: result.status,
        time: result.time,
        memory: result.memory,
      };
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Execution timeout - result not available");
}

/**
 * Execute code and return result (combines submit + poll)
 */
export async function executeCode(
  code: string,
  language: string = "csharp",
  stdin?: string
): Promise<ExecutionResult> {
  const token = await submitCodeExecution(code, language, stdin);
  return await getExecutionResult(token);
}
