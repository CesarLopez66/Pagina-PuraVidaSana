import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Category } from "@/types";

export interface LocalProduct {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
  featured: boolean;
  images: string[];
  benefits: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

const FILE = path.join(process.cwd(), "data", "products.local.json");

async function readAll(): Promise<LocalProduct[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(products: LocalProduct[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(products, null, 2), "utf8");
}

function nextId(products: LocalProduct[]) {
  const nums = products
    .map((p) => {
      const m = /^PV-(\d+)$/.exec(p.id);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `PV-${String(max + 1).padStart(3, "0")}`;
}

export async function listLocalProducts(): Promise<LocalProduct[]> {
  const products = await readAll();
  return [...products].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function insertLocalProducts(
  rows: Array<{
    id?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    featured?: boolean;
    images?: string[];
    benefits?: string[];
    tags?: string[];
  }>
): Promise<LocalProduct[]> {
  const products = await readAll();
  const now = new Date().toISOString();
  const created: LocalProduct[] = [];

  for (const row of rows) {
    const item: LocalProduct = {
      id: row.id ?? nextId([...products, ...created]),
      name: row.name,
      category: row.category as Category,
      price: row.price,
      stock: row.stock,
      description: row.description,
      image: row.image || "",
      featured: !!row.featured,
      images: row.images ?? [],
      benefits: row.benefits ?? [],
      tags: row.tags ?? [],
      created_at: now,
      updated_at: now,
    };
    created.push(item);
  }

  await writeAll([...created, ...products]);
  return created;
}

export async function updateLocalProduct(
  id: string,
  updates: Partial<LocalProduct>
): Promise<LocalProduct | null> {
  const products = await readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const next: LocalProduct = {
    ...products[index],
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  };
  products[index] = next;
  await writeAll(products);
  return next;
}

export async function deleteLocalProduct(id: string): Promise<boolean> {
  const products = await readAll();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await writeAll(next);
  return true;
}
