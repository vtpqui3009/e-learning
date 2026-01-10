"use client";

import { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface ClassNode {
  name: string;
  properties?: string[];
  methods?: string[];
  isAbstract?: boolean;
  isInterface?: boolean;
}

interface InheritanceTreeProps {
  classes: ClassNode[];
  relationships: { from: string; to: string; type?: "inherits" | "implements" }[];
}

export function InheritanceTree({ classes, relationships }: InheritanceTreeProps) {
  // Create nodes from classes
  const initialNodes: Node[] = classes.map((cls, index) => {
    const level = calculateLevel(cls.name, relationships);
    const positionInLevel = calculatePositionInLevel(cls.name, classes, relationships, level);

    return {
      id: cls.name,
      type: "default",
      position: {
        x: positionInLevel * 300,
        y: level * 200,
      },
      data: {
        label: (
          <div className="px-4 py-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              {cls.isInterface && (
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  interface
                </span>
              )}
              {cls.isAbstract && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  abstract
                </span>
              )}
            </div>
            <div className="font-bold text-base mb-2 text-gray-100">{cls.name}</div>
            {cls.properties && cls.properties.length > 0 && (
              <div className="border-t border-neutral-600 pt-2 mt-2">
                <div className="text-xs text-gray-400 mb-1">Properties:</div>
                {cls.properties.map((prop, idx) => (
                  <div key={idx} className="text-xs text-gray-300 font-mono">
                    {prop}
                  </div>
                ))}
              </div>
            )}
            {cls.methods && cls.methods.length > 0 && (
              <div className="border-t border-neutral-600 pt-2 mt-2">
                <div className="text-xs text-gray-400 mb-1">Methods:</div>
                {cls.methods.map((method, idx) => (
                  <div key={idx} className="text-xs text-gray-300 font-mono">
                    {method}
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
      style: {
        background: cls.isInterface
          ? "rgba(168, 85, 247, 0.1)"
          : cls.isAbstract
          ? "rgba(245, 158, 11, 0.1)"
          : "rgba(59, 130, 246, 0.1)",
        border: cls.isInterface
          ? "2px solid rgba(168, 85, 247, 0.5)"
          : cls.isAbstract
          ? "2px solid rgba(245, 158, 11, 0.5)"
          : "2px solid rgba(59, 130, 246, 0.5)",
        borderRadius: "8px",
        color: "#e5e7eb",
        fontSize: "14px",
      },
    };
  });

  // Create edges from relationships
  const initialEdges: Edge[] = relationships.map((rel, index) => ({
    id: `${rel.from}-${rel.to}-${index}`,
    source: rel.to, // Parent
    target: rel.from, // Child
    type: "smoothstep",
    animated: false,
    style: {
      stroke: rel.type === "implements" ? "#a855f7" : "#3b82f6",
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: rel.type === "implements" ? "#a855f7" : "#3b82f6",
      width: 20,
      height: 20,
    },
    label: rel.type === "implements" ? "implements" : "inherits",
    labelStyle: {
      fill: "#9ca3af",
      fontSize: "12px",
    },
    labelBgStyle: {
      fill: "#1f2937",
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="my-8 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-700 bg-neutral-800/50">
        <h3 className="font-semibold text-sm text-gray-200">Inheritance Hierarchy</h3>
        <p className="text-xs text-gray-400 mt-1">
          Drag to pan • Scroll to zoom • Click nodes for details
        </p>
      </div>
      <div style={{ height: "500px", background: "#0a0a0a" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#374151" gap={16} />
          <Controls className="bg-neutral-800 border-neutral-700" />
          <MiniMap
            nodeColor={(node) => {
              const cls = classes.find((c) => c.name === node.id);
              if (cls?.isInterface) return "#a855f7";
              if (cls?.isAbstract) return "#f59e0b";
              return "#3b82f6";
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
            className="bg-neutral-800 border border-neutral-700"
          />
        </ReactFlow>
      </div>
      <div className="px-6 py-4 border-t border-neutral-700 bg-neutral-800/30">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/10"></div>
            <span className="text-gray-300">Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-500/10"></div>
            <span className="text-gray-300">Abstract Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-500/10"></div>
            <span className="text-gray-300">Interface</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate the level of a class in the hierarchy
function calculateLevel(className: string, relationships: any[]): number {
  const parent = relationships.find((r) => r.from === className);
  if (!parent) return 0;
  return 1 + calculateLevel(parent.to, relationships);
}

// Helper function to calculate horizontal position within a level
function calculatePositionInLevel(
  className: string,
  classes: ClassNode[],
  relationships: any[],
  level: number
): number {
  const classesAtLevel = classes.filter(
    (cls) => calculateLevel(cls.name, relationships) === level
  );
  const index = classesAtLevel.findIndex((cls) => cls.name === className);
  return index - classesAtLevel.length / 2 + 0.5;
}
