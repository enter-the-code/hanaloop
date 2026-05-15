import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "HanaLoop API",
    version: "1.0.0",
    description: "PCF 전과정 탄소 배출 대시보드 REST API",
  },
  servers: [{ url: "/api", description: "Next.js API Routes" }],
  tags: [
    { name: "companies", description: "기업 조회" },
    { name: "records",   description: "배출 기록 CRUD" },
    { name: "posts",     description: "탄소 메모 CRUD" },
    { name: "import",    description: "CSV/TSV 파일 임포트" },
  ],
  paths: {
    "/companies": {
      get: {
        tags: ["companies"],
        summary: "기업 목록 조회",
        responses: {
          "200": {
            description: "기업 배열",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Company" } },
                example: [{ id: "ct045", name: "CT-045", country: "KR", emissions: [] }],
              },
            },
          },
        },
      },
    },
    "/records": {
      get: {
        tags: ["records"],
        summary: "배출 기록 조회 (필터 가능)",
        parameters: [
          { name: "period",    in: "query", schema: { type: "string" }, example: "2025-03", description: "연-월 필터" },
          { name: "companyId", in: "query", schema: { type: "string" }, example: "ct045",   description: "기업 ID 필터" },
          { name: "scope",     in: "query", schema: { type: "integer", enum: [1, 2, 3] },   description: "Scope 필터" },
        ],
        responses: {
          "200": {
            description: "배출 기록 배열",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/EmissionRecord" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["records"],
        summary: "배출 기록 직접 입력",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmissionRecordInput" },
              example: {
                companyId: "ct045", productName: "CT-045 제품",
                yearMonth: "2025-05", scope: 2, stage: "manufacturing",
                source: "electricity", activityAmount: 5000, activityUnit: "kWh",
                emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",
                emissionsKgCo2e: 2280, dataSourceType: "primary",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "생성된 배출 기록",
            content: { "application/json": { schema: { $ref: "#/components/schemas/EmissionRecord" } } },
          },
          "400": { description: "유효성 검사 실패", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/posts": {
      get: {
        tags: ["posts"],
        summary: "탄소 메모 전체 조회 (최신순)",
        responses: {
          "200": {
            description: "메모 배열",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Post" } } } },
          },
        },
      },
      post: {
        tags: ["posts"],
        summary: "메모 생성 (id 없음) 또는 수정 (id 포함)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PostInput" },
              example: { companyId: "ct045", title: "4월 절전 조치", content: "절전 계획 수립", dateTime: "2025-05-01 10:00" },
            },
          },
        },
        responses: {
          "200": { description: "수정된 메모", content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } },
          "201": { description: "생성된 메모", content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } },
          "400": { description: "유효성 검사 실패", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/import": {
      post: {
        tags: ["import"],
        summary: "CSV/TSV 파일 일괄 임포트",
        description: "탭 구분(TSV) 파일을 업로드해 배출 기록을 일괄 삽입합니다. 헤더: 일자(원본) / 활동 유형 / 설명 / 량 / 단위",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: { file: { type: "string", format: "binary", description: "TSV/CSV 파일" } },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "임포트 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ImportResult" },
                example: { inserted: 10, errors: [] },
              },
            },
          },
          "400": { description: "파일 없음 또는 파싱 실패", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
  components: {
    schemas: {
      Company: {
        type: "object",
        properties: {
          id:        { type: "string", example: "ct045" },
          name:      { type: "string", example: "CT-045" },
          country:   { type: "string", example: "KR" },
          emissions: { type: "array", items: {}, example: [] },
        },
      },
      EmissionRecord: {
        type: "object",
        properties: {
          id:               { type: "string", example: "r-e-01" },
          companyId:        { type: "string", example: "ct045" },
          productName:      { type: "string", example: "CT-045 제품" },
          yearMonth:        { type: "string", example: "2025-01" },
          scope:            { type: "integer", enum: [1, 2, 3], example: 2 },
          stage:            { type: "string", example: "manufacturing" },
          source:           { type: "string", example: "electricity" },
          activityAmount:   { type: "number", example: 12000 },
          activityUnit:     { type: "string", example: "kWh" },
          emissionFactor:   { type: "number", example: 0.456 },
          factorUnit:       { type: "string", example: "kgCO2e/kWh" },
          emissionsKgCo2e:  { type: "number", example: 5472 },
          dataSourceType:   { type: "string", enum: ["primary", "secondary"], example: "primary" },
        },
      },
      EmissionRecordInput: {
        type: "object",
        required: ["companyId", "yearMonth", "scope", "stage", "source", "activityAmount", "activityUnit", "emissionFactor", "factorUnit", "emissionsKgCo2e", "dataSourceType"],
        properties: {
          companyId:        { type: "string" },
          productName:      { type: "string" },
          yearMonth:        { type: "string", pattern: "^\\d{4}-\\d{2}$" },
          scope:            { type: "integer", enum: [1, 2, 3] },
          stage:            { type: "string" },
          source:           { type: "string" },
          activityAmount:   { type: "number", minimum: 0.001 },
          activityUnit:     { type: "string" },
          emissionFactor:   { type: "number" },
          factorUnit:       { type: "string" },
          emissionsKgCo2e:  { type: "number" },
          dataSourceType:   { type: "string", enum: ["primary", "secondary"] },
        },
      },
      Post: {
        type: "object",
        properties: {
          id:        { type: "string", example: "p1" },
          companyId: { type: "string", example: "ct045" },
          title:     { type: "string", example: "4월 전력 사용량 급증" },
          content:   { type: "string" },
          dateTime:  { type: "string", example: "2025-05-02T09:00" },
        },
      },
      PostInput: {
        type: "object",
        required: ["companyId", "title", "content", "dateTime"],
        properties: {
          id:        { type: "string", description: "포함 시 수정, 없으면 생성" },
          companyId: { type: "string" },
          title:     { type: "string" },
          content:   { type: "string" },
          dateTime:  { type: "string" },
        },
      },
      ImportResult: {
        type: "object",
        properties: {
          inserted: { type: "integer", example: 10 },
          errors:   { type: "array", items: { type: "string" }, example: [] },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
