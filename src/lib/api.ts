import { countries, companies, emissionRecords, posts } from "./data";
import type { Post, EmissionRecord } from "./types";
// eslint-disable-next-line prefer-const
let _countries = [...countries];
// eslint-disable-next-line prefer-const
let _companies = [...companies];
// eslint-disable-next-line prefer-const
let _records = [...emissionRecords];
let _posts = [...posts];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

export async function fetchCountries() {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies() {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts() {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(
  p: Omit<Post, "id"> & { id?: string }
) {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");
  if (p.id) {
    _posts = _posts.map((x) => (x.id === p.id ? (p as Post) : x));
    return p as Post;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}

export async function fetchEmissionRecords(): Promise<EmissionRecord[]> {
  await delay(jitter());
  return _records;
}
