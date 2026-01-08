import { NextResponse } from "next/server";
import { executeCode } from "@/lib/code-execution";
import type { ExecutionRequest } from "@/types/code-execution";

export async function POST(request: Request) {
  try {
    const body: ExecutionRequest = await request.json();

    // Validate request
    if (!body.code || typeof body.code !== "string") {
      return NextResponse.json(
        { error: "Code is required and must be a string" },
        { status: 400 }
      );
    }

    // Execute code
    const result = await executeCode(
      body.code,
      body.language || "csharp",
      body.stdin
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing code:", error);

    // Return error details
    return NextResponse.json(
      {
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown error occurred",
        compile_output: "",
        status: {
          id: 0,
          description: "Execution Error",
        },
      },
      { status: 500 }
    );
  }
}
