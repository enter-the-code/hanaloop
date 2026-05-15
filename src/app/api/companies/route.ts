import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM companies ORDER BY id");
  return NextResponse.json(
    rows.map((r) => ({ id: r.id, name: r.name, country: r.country, emissions: [] }))
  );
}
