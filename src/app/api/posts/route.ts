import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM posts ORDER BY date_time DESC");
  return NextResponse.json(
    rows.map((r) => ({
      id:        r.id,
      companyId: r.company_id,
      title:     r.title,
      content:   r.content,
      dateTime:  r.date_time,
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, companyId, title, content, dateTime } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  if (id) {
    const { rows } = await pool.query(
      `UPDATE posts SET company_id=$1, title=$2, content=$3, date_time=$4 WHERE id=$5 RETURNING *`,
      [companyId, title, content, dateTime, id]
    );
    if (!rows.length) return NextResponse.json({ error: "존재하지 않는 메모입니다." }, { status: 404 });
    const r = rows[0];
    return NextResponse.json({ id: r.id, companyId: r.company_id, title: r.title, content: r.content, dateTime: r.date_time });
  }

  const { rows } = await pool.query(
    `INSERT INTO posts (company_id, title, content, date_time) VALUES ($1,$2,$3,$4) RETURNING *`,
    [companyId, title, content, dateTime]
  );
  const r = rows[0];
  return NextResponse.json(
    { id: r.id, companyId: r.company_id, title: r.title, content: r.content, dateTime: r.date_time },
    { status: 201 }
  );
}
