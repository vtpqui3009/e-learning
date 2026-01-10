"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import "reactflow/dist/style.css";

interface FlowStep {
  id: string;
  label: string;
  type: "sync" | "async" | "await" | "callback";
  description?: string;
}

interface AsyncFlowChartProps {
  steps: FlowStep[];
  connections: { from: string; to: string; label?: string }[];
  title?: string;
}

export function AsyncFlowChart({ steps, connections, title = "Async Flow" }: AsyncFlowChartProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Create nodes from steps
  const initialNodes: Node[] = steps.map((step, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    return {
      id: step.id,
      type: "default",
      position: {
        x: col * 250,
        y: row * 150,
      },
      data: {
        label: (
          <div className="px-4 py-3 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded border ${
                  step.type === "sync"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : step.type === "async"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    : step.type === "await"
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                {step.type}
              </span>
            </div>
            <div className="font-semibold text-sm mb-1 text-gray-100">{step.label}</div>
            {step.description && (
              <div className="text-xs text-gray-400 mt-2">{step.description}</div>
            )}
          </div>
        ),
      },
      style: {
        background:
          step.type === "sync"
            ? "rgba(59, 130, 246, 0.1)"
            : step.type === "async"
            ? "rgba(168, 85, 247, 0.1)"
            : step.type === "await"
            ? "rgba(34, 197, 94, 0.1)"
            : "rgba(245, 158, 11, 0.1)",
        border:
          step.type === "sync"
            ? "2px solid rgba(59, 130, 246, 0.5)"
            : step.type === "async"
            ? "2px solid rgba(168, 85, 247, 0.5)"
            : step.type === "await"
            ? "2px solid rgba(34, 197, 94, 0.5)"
            : "2px solid rgba(245, 158, 11, 0.5)",
        borderRadius: "8px",
        color: "#e5e7eb",
      },
    };
  });

  // Create edges from connections
  const initialEdges: Edge[] = connections.map((conn, index) => ({
    id: `${conn.from}-${conn.to}`,
    source: conn.from,
    target: conn.to,
    type: "smoothstep",
    animated: isAnimating,
    style: {
      stroke: "#6366f1",
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#6366f1",
    },
    label: conn.label,
    labelStyle: {
      fill: "#9ca3af",
      fontSize: "11px",
    },
    labelBgStyle: {
      fill: "#1f2937",
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handlePlayPause = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      setIsAnimating(true);
      animateFlow();
    }
  };

  const animateFlow = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setCurrentStep(0);
        return;
      }
      setCurrentStep(step);
      step++;
    }, 1500);
  };

  return (
    <div className="my-8 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700 bg-neutral-800/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-gray-200">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Click play to animate the execution flow
          </p>
        </div>
        <Button
          onClick={handlePlayPause}
          size="sm"
          variant="outline"
          className="border-neutral-600 hover:bg-neutral-700"
        >
          {isAnimating ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play
            </>
          )}
        </Button>
      </div>

      {/* Flow Diagram */}
      <div style={{ height: "500px", background: "#0a0a0a" }}>
        <ReactFlow
          nodes={nodes.map((node, index) => ({
            ...node,
            className:
              isAnimating && index === currentStep
                ? "animate-pulse ring-2 ring-indigo-500"
                : "",
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#374151" gap={16} />
          <Controls className="bg-neutral-800 border-neutral-700" />
        </ReactFlow>
      </div>

      {/* Current Step Info */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-t border-neutral-700 bg-indigo-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              {currentStep + 1}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-200">
                {steps[currentStep]?.label}
              </div>
              {steps[currentStep]?.description && (
                <div className="text-xs text-gray-400 mt-1">
                  {steps[currentStep].description}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="px-6 py-4 border-t border-neutral-700 bg-neutral-800/30">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/10"></div>
            <span className="text-gray-300">Synchronous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-500/10"></div>
            <span className="text-gray-300">Async Method</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/10"></div>
            <span className="text-gray-300">Await Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-500/10"></div>
            <span className="text-gray-300">Callback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
