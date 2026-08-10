export type JsonRpcId = number | string;

export type JsonRpcMessage = {
  jsonrpc: "2.0";
  id?: JsonRpcId | null;
  method?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

export type AcpEvent =
  | { kind: "message"; data: { raw: string } }
  | { kind: "stderr"; data: { text: string } }
  | { kind: "protocolError"; data: { text: string } }
  | { kind: "exited"; data: { code?: number | null } };

export type PendingRequest = {
  resolve: (message: JsonRpcMessage) => void;
  reject: (error: Error) => void;
};

export type UpdateListener = (text: string) => void;

export function asError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value));
}

export function hasRequestId(id: JsonRpcMessage["id"]): id is JsonRpcId {
  return typeof id === "number" || typeof id === "string";
}
