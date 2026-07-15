// src/lib/correlation.ts
//
// Propagates a per-request correlationId via Node's AsyncLocalStorage so that
// any code running inside the request (services, repositories, Prisma hooks)
// can retrieve the same ID without prop-drilling.
//
// Usage in middleware / route handlers:
//   correlationStore.run(uuid(), () => handler(req, res));
//
// Usage inside services / repositories:
//   const cid = getCorrelationId();   // → string | undefined

import { AsyncLocalStorage } from "async_hooks";

export const correlationStore = new AsyncLocalStorage<string>();

export function getCorrelationId(): string | undefined {
  return correlationStore.getStore();
}
