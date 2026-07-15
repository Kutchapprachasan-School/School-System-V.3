// src/features/importer/import-registry.ts

export interface DomainConfig {
  tableName: string;
  lookupKey: string;        // Field used to detect duplicates (e.g. "studentId")
  primaryKey: string;       // Primary key field (typically "id")
  chunkSize: number;        // Default chunk size for batching
}

export const IMPORT_CONFIG: Record<string, DomainConfig> = {
  STUDENT: {
    tableName: "student",
    lookupKey: "studentId",
    primaryKey: "id",
    chunkSize: 200,
  },
  HOME_VISIT: {
    tableName: "homeVisit",
    lookupKey: "studentId",
    primaryKey: "id",
    chunkSize: 100,
  },
  SARABAN: {
    tableName: "saraban",
    lookupKey: "docNumber",
    primaryKey: "id",
    chunkSize: 50,
  },
};
