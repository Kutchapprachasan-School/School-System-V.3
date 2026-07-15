// src/lib/indexeddb.ts
//
// Native IndexedDB helper class for storing local form drafts.
// Avoids dependencies and is private-browsing safe (gracefully falls back to memory).

const DB_NAME = "school_system_drafts";
const STORE_NAME = "home_visit_drafts";
const DB_VERSION = 2; // Current schema version

export interface DraftWrapper {
  draftId: string;
  version: number;
  updatedAt: number;
  data: any;
}

class DraftDB {
  private db: IDBDatabase | null = null;
  private isFallback = false;
  private memoryCache = new Map<string, string>();

  private async getDB(): Promise<IDBDatabase | null> {
    if (this.db) return this.db;
    if (this.isFallback) return null;

    return new Promise((resolve) => {
      try {
        if (typeof window === "undefined" || !window.indexedDB) {
          this.isFallback = true;
          resolve(null);
          return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "draftId" });
          }
        };

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = () => {
          // Graceful fallback to memory on blocked or private browsing restrictions
          this.isFallback = true;
          resolve(null);
        };
      } catch (e) {
        this.isFallback = true;
        resolve(null);
      }
    });
  }

  async saveDraft(draftId: string, data: any): Promise<boolean> {
    const db = await this.getDB();
    const payload: DraftWrapper = {
      draftId,
      version: DB_VERSION,
      updatedAt: Date.now(),
      data,
    };

    if (!db) {
      this.memoryCache.set(draftId, JSON.stringify(payload));
      return true;
    }

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(payload);

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async getDraft(draftId: string): Promise<DraftWrapper | null> {
    const db = await this.getDB();
    if (!db) {
      const cached = this.memoryCache.get(draftId);
      return cached ? JSON.parse(cached) : null;
    }

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(draftId);

        request.onsuccess = (event: any) => {
          resolve(event.target.result || null);
        };
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async deleteDraft(draftId: string): Promise<boolean> {
    const db = await this.getDB();
    if (!db) {
      return this.memoryCache.delete(draftId);
    }

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(draftId);

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async pruneOldDrafts(maxAgeMs: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    const db = await this.getDB();
    if (!db) {
      let prunedCount = 0;
      const now = Date.now();
      for (const [key, value] of this.memoryCache.entries()) {
        const wrapper = JSON.parse(value) as DraftWrapper;
        if (now - wrapper.updatedAt > maxAgeMs) {
          this.memoryCache.delete(key);
          prunedCount++;
        }
      }
      return prunedCount;
    }

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openCursor();
        const now = Date.now();
        let prunedCount = 0;

        request.onsuccess = (event: any) => {
          const cursor = event.target.result;
          if (cursor) {
            const record = cursor.value as DraftWrapper;
            if (now - record.updatedAt > maxAgeMs) {
              cursor.delete();
              prunedCount++;
            }
            cursor.continue();
          } else {
            resolve(prunedCount);
          }
        };

        request.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }
}

export const draftDB = new DraftDB();
export const SCHEMA_VERSION = DB_VERSION;
