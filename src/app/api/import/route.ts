import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import pool from "@/lib/db";

const FACTOR_MAP: Record<string, { scope: number; stage: string; factor: number; unit: string }> = {
  "전기":   { scope: 2, stage: "manufacturing", factor: 0.456, unit: "kgCO2e/kWh" },
  "원소재": { scope: 3, stage: "raw_material",  factor: 0,     unit: "kgCO2e/kg"  },
  "운송":   { scope: 3, stage: "transport",      factor: 3.5,   unit: "kgCO2e/ton-km" },
};

const DETAIL_FACTOR: Record<string, { source: string; factor: number }> = {
  "한국전력":   { source: "electricity", factor: 0.456 },
  "플라스틱 1": { source: "plastic_1",   factor: 2.3 },
  "플라스틱 2": { source: "plastic_2",   factor: 3.2 },
  "트럭":       { source: "truck",       factor: 3.5 },
};

function parseRows(file: File, buf: ArrayBuffer): Record<string, string>[] {
  const name = file.name.toLowerCase();

  // Excel (.xlsx / .xls)
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = XLSX.read(buf, { type: "array", cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
    return raw.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim(), String(v).trim()]))
    );
  }

  // CSV / TSV (탭 구분)
  const text = new TextDecoder("utf-8").decode(buf);
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split("\t");
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? "").trim()]));
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });

  const buf = await file.arrayBuffer();
  const rows = parseRows(file, buf);
  if (!rows.length) return NextResponse.json({ error: "파싱할 데이터가 없습니다." }, { status: 400 });

  const inserted: unknown[] = [];
  const errors: string[] = [];

  for (const [i, row] of rows.entries()) {
    const lineNum = i + 2;
    const rawDate   = row["일자(원본)"] ?? row["date"] ?? "";
    const actType   = row["활동 유형"]   ?? row["type"] ?? "";
    const desc      = row["설명"]        ?? row["description"] ?? "";
    const amtStr    = row["량"]          ?? row["amount"] ?? "";
    const unit      = row["단위"]        ?? row["unit"] ?? "";

    const yearMonth = rawDate.slice(0, 7);
    const amount    = parseFloat(amtStr);

    if (!yearMonth || isNaN(amount) || amount <= 0) {
      errors.push(`${lineNum}행: 날짜 또는 활동량이 유효하지 않습니다.`);
      continue;
    }

    const detail = DETAIL_FACTOR[desc];
    const meta   = FACTOR_MAP[actType];
    if (!meta || !detail) {
      errors.push(`${lineNum}행: 알 수 없는 활동 유형 또는 설명 ("${actType}" / "${desc}")`);
      continue;
    }

    const ef      = detail.factor;
    const co2e    = amount * ef;
    const source  = detail.source;
    const stage   = meta.stage;
    const scope   = meta.scope;
    const factorUnit = meta.unit;

    try {
      const { rows: r } = await pool.query(
        `INSERT INTO emission_records
          (company_id, product_name, year_month, scope, stage, source,
           activity_amount, activity_unit, emission_factor, factor_unit,
           emissions_kg_co2e, data_source_type)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id`,
        ["ct045", "CT-045 제품", yearMonth, scope, stage, source,
         amount, unit, ef, factorUnit, co2e, "primary"]
      );
      inserted.push(r[0].id);
    } catch {
      errors.push(`${lineNum}행: DB 저장 실패`);
    }
  }

  return NextResponse.json({ inserted: inserted.length, errors });
}
