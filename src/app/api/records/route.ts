import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });

  const { rowCount } = await pool.query("DELETE FROM emission_records WHERE id = $1", [id]);
  if (!rowCount) return NextResponse.json({ error: "존재하지 않는 레코드입니다." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period    = searchParams.get("period");
  const companyId = searchParams.get("companyId");
  const scope     = searchParams.get("scope");

  const conditions: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (period)    { conditions.push(`year_month = $${i++}`);  values.push(period); }
  if (companyId) { conditions.push(`company_id = $${i++}`);  values.push(companyId); }
  if (scope)     { conditions.push(`scope = $${i++}`);       values.push(Number(scope)); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT * FROM emission_records ${where} ORDER BY year_month, created_at`,
    values
  );

  const records = rows.map((r) => ({
    id:               r.id,
    companyId:        r.company_id,
    productName:      r.product_name,
    yearMonth:        r.year_month,
    scope:            r.scope,
    stage:            r.stage,
    source:           r.source,
    activityAmount:   Number(r.activity_amount),
    activityUnit:     r.activity_unit,
    emissionFactor:   Number(r.emission_factor),
    factorUnit:       r.factor_unit,
    emissionsKgCo2e:  Number(r.emissions_kg_co2e),
    dataSourceType:   r.data_source_type,
  }));

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    companyId, productName, yearMonth, scope, stage, source,
    activityAmount, activityUnit, emissionFactor, factorUnit,
    emissionsKgCo2e, dataSourceType,
  } = body;

  if (!yearMonth || !source || !activityAmount || activityAmount <= 0) {
    return NextResponse.json({ error: "필수 항목이 누락됐거나 활동량이 유효하지 않습니다." }, { status: 400 });
  }

  const { rows } = await pool.query(
    `INSERT INTO emission_records
      (company_id, product_name, year_month, scope, stage, source,
       activity_amount, activity_unit, emission_factor, factor_unit,
       emissions_kg_co2e, data_source_type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [companyId, productName, yearMonth, scope, stage, source,
     activityAmount, activityUnit, emissionFactor, factorUnit,
     emissionsKgCo2e, dataSourceType]
  );

  const r = rows[0];
  return NextResponse.json({
    id:               r.id,
    companyId:        r.company_id,
    productName:      r.product_name,
    yearMonth:        r.year_month,
    scope:            r.scope,
    stage:            r.stage,
    source:           r.source,
    activityAmount:   Number(r.activity_amount),
    activityUnit:     r.activity_unit,
    emissionFactor:   Number(r.emission_factor),
    factorUnit:       r.factor_unit,
    emissionsKgCo2e:  Number(r.emissions_kg_co2e),
    dataSourceType:   r.data_source_type,
  }, { status: 201 });
}
