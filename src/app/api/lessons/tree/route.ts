import { NextResponse } from "next/server";
import { getLessonTree } from "@/lib/mdx";

export async function GET() {
  try {
    const tree = await getLessonTree();
    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error fetching lesson tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson tree" },
      { status: 500 }
    );
  }
}
