import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          C# Learning Platform
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Master C# with interactive lessons, detailed explanations, and visualizations.
          Go beyond Microsoft's documentation with hands-on practice and comprehensive examples.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/lessons/01-fundamentals/01-variables"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Learning
          </Link>
          <Link
            href="/lessons"
            className="px-6 py-3 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors font-medium text-gray-200"
          >
            Browse Lessons
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900">
            <div className="text-3xl mb-4">💻</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Interactive Code Editor</h3>
            <p className="text-sm text-gray-400">
              Write and run C# code directly in your browser with instant feedback
            </p>
          </div>

          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Visual Learning</h3>
            <p className="text-sm text-gray-400">
              Understand complex concepts with diagrams, animations, and visualizations
            </p>
          </div>

          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-100">Interview Ready</h3>
            <p className="text-sm text-gray-400">
              Learn everything you need to ace interviews and join C# projects
            </p>
          </div>
        </div>

        <div className="pt-12 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-100">What You'll Learn</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm max-w-3xl mx-auto">
            <div className="p-3 rounded bg-neutral-800 text-gray-300">C# Fundamentals</div>
            <div className="p-3 rounded bg-neutral-800 text-gray-300">Object-Oriented Programming</div>
            <div className="p-3 rounded bg-neutral-800 text-gray-300">LINQ & Collections</div>
            <div className="p-3 rounded bg-neutral-800 text-gray-300">Async/Await</div>
            <div className="p-3 rounded bg-neutral-800 text-gray-300">Pattern Matching</div>
            <div className="p-3 rounded bg-neutral-800 text-gray-300">Modern C# Features</div>
          </div>
        </div>
      </div>
    </main>
  );
}
