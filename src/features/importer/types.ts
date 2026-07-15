// src/features/importer/types.ts

export interface ImportChunkResult {
  successCount: number;
  failedCount: number;
  rowLogs: {
    rowIndex: number;
    status: "SUCCESS" | "FAILED" | "CONFLICT";
    targetEntityId?: string;
    errorDetails?: string;
    entitySnapshot?: any;
  }[];
}

export interface ImportProcessor {
  /**
   * Validate, check idempotency, and process a single chunk of records for an import job.
   */
  processChunk(
    jobId: string,
    chunkId: string,
    payloadHash: string,
    domain: string,
    startIndex: number,
    rows: any[]
  ): Promise<ImportChunkResult>;

  /**
   * Roll back the completed insertions/updates for a job, checking for manual edit conflicts.
   */
  rollbackJob(jobId: string): Promise<{
    rolledBackCount: number;
    conflictCount: number;
    conflictedIds: string[];
  }>;
}
