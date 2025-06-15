export type StorageType = "in_memory" | "database";

export const STORAGE_TYPE = {
  IN_MEMORY: "in_memory" as StorageType,
  DATABASE: "database" as StorageType,
} as const;

export const config = {
  storage: STORAGE_TYPE.IN_MEMORY as StorageType,
};
