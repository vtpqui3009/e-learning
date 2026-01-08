export interface ExecutionResult {
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

export interface ExecutionRequest {
  code: string;
  language?: string;
  stdin?: string;
}
