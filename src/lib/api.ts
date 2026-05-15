import type { Post, EmissionRecord, Company } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function httpWrite<T>(url: string, init?: RequestInit): Promise<T> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");
  return http<T>(url, init);
}

export async function fetchCompanies(): Promise<Company[]> {
  return http<Company[]>("/api/companies");
}

export async function fetchPosts(): Promise<Post[]> {
  return http<Post[]>("/api/posts");
}

export async function createOrUpdatePost(
  p: Omit<Post, "id"> & { id?: string }
): Promise<Post> {
  return httpWrite<Post>("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
}

export async function fetchEmissionRecords(): Promise<EmissionRecord[]> {
  return http<EmissionRecord[]>("/api/records");
}

export async function createEmissionRecord(
  r: Omit<EmissionRecord, "id">
): Promise<EmissionRecord> {
  return httpWrite<EmissionRecord>("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(r),
  });
}

export async function deleteEmissionRecord(id: string): Promise<void> {
  return httpWrite<void>(`/api/records?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function importFile(file: File): Promise<{ inserted: number; errors: string[] }> {
  const fd = new FormData();
  fd.append("file", file);
  return http<{ inserted: number; errors: string[] }>("/api/import", {
    method: "POST",
    body: fd,
  });
}
