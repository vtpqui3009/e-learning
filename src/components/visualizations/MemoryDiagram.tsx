"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface MemoryItem {
  name: string;
  type: "value" | "reference";
  value: string;
  heapReference?: string;
}

interface HeapObject {
  id: string;
  type: string;
  fields: { name: string; value: string }[];
}

interface MemoryDiagramProps {
  stackItems: MemoryItem[];
  heapObjects?: HeapObject[];
  title?: string;
}

export function MemoryDiagram({
  stackItems,
  heapObjects = [],
  title = "Memory Allocation",
}: MemoryDiagramProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="my-8 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700 bg-neutral-800/50">
        <h3 className="font-semibold text-sm text-gray-200">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">
          Stack (left) stores value types • Heap (right) stores reference types
        </p>
      </div>

      {/* Memory Visualization */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stack */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold text-sm text-gray-200">Stack Memory</h4>
            </div>
            <div className="space-y-2">
              {stackItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedItem === item.name
                      ? "border-blue-500 bg-blue-500/10 scale-105"
                      : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/30"
                  }`}
                  onClick={() => setSelectedItem(item.name === selectedItem ? null : item.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-gray-200">{item.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            item.type === "value"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-gray-400">= {item.value}</div>
                    </div>
                    {item.heapReference && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-xs font-mono">{item.heapReference}</span>
                      </div>
                    )}
                  </div>

                  {/* Connection line to heap */}
                  {item.heapReference && selectedItem === item.name && (
                    <svg
                      className="absolute top-1/2 left-full w-8 h-1 pointer-events-none hidden lg:block"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      <motion.line
                        x1="0"
                        y1="0"
                        x2="32"
                        y2="0"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Heap */}
          {heapObjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="font-semibold text-sm text-gray-200">Heap Memory</h4>
              </div>
              <div className="space-y-2">
                {heapObjects.map((obj, index) => {
                  const isReferenced = stackItems.some((item) => item.heapReference === obj.id);
                  const isSelected = stackItems.some(
                    (item) => item.heapReference === obj.id && selectedItem === item.name
                  );

                  return (
                    <motion.div
                      key={obj.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`rounded-lg border p-4 transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10 scale-105"
                          : isReferenced
                          ? "border-neutral-600 bg-neutral-800/50"
                          : "border-neutral-700 bg-neutral-800/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-purple-400">{obj.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {obj.type}
                        </span>
                      </div>
                      <div className="space-y-1 pl-4 border-l-2 border-neutral-700">
                        {obj.fields.map((field, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-400">{field.name}:</span>
                            <span className="font-mono text-xs text-gray-300">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-neutral-700 bg-neutral-800/30">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/10"></div>
            <span className="text-gray-300">Value Type (Stack)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-500/10"></div>
            <span className="text-gray-300">Reference Type (Heap)</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Points to Heap Object</span>
          </div>
        </div>
      </div>
    </div>
  );
}
