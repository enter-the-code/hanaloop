-- 배출계수 테이블 (버전 이력 추적)
CREATE TABLE IF NOT EXISTS emission_factors (
  id          SERIAL PRIMARY KEY,
  source      TEXT    NOT NULL,
  scope       INTEGER NOT NULL CHECK (scope IN (1,2,3)),
  stage       TEXT    NOT NULL,
  factor      NUMERIC NOT NULL,
  unit        TEXT    NOT NULL,
  label       TEXT    NOT NULL,
  version     INTEGER NOT NULL DEFAULT 1,
  valid_from  DATE    NOT NULL DEFAULT CURRENT_DATE,
  valid_to    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 회사 테이블
CREATE TABLE IF NOT EXISTS companies (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  country     TEXT NOT NULL
);

-- 배출 기록 테이블
CREATE TABLE IF NOT EXISTS emission_records (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  company_id        TEXT NOT NULL REFERENCES companies(id),
  product_name      TEXT NOT NULL,
  year_month        TEXT NOT NULL,
  scope             INTEGER NOT NULL CHECK (scope IN (1,2,3)),
  stage             TEXT NOT NULL,
  source            TEXT NOT NULL,
  activity_amount   NUMERIC NOT NULL,
  activity_unit     TEXT NOT NULL,
  emission_factor   NUMERIC NOT NULL,
  factor_unit       TEXT NOT NULL,
  emissions_kg_co2e NUMERIC NOT NULL,
  data_source_type  TEXT NOT NULL CHECK (data_source_type IN ('primary','secondary')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 메모 테이블
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  company_id  TEXT NOT NULL REFERENCES companies(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  date_time   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 시드 데이터 ───────────────────────────────────────────────────────────────

-- 배출계수 (버전 1)
INSERT INTO emission_factors (source, scope, stage, factor, unit, label, version, valid_from) VALUES
  ('electricity', 2, 'manufacturing', 0.456, 'kgCO2e/kWh',    '전기 (한국전력)', 1, '2025-01-01'),
  ('plastic_1',   3, 'raw_material',  2.3,   'kgCO2e/kg',     '원소재 (플라스틱 1)', 1, '2025-01-01'),
  ('plastic_2',   3, 'raw_material',  3.2,   'kgCO2e/kg',     '원소재 (플라스틱 2)', 1, '2025-01-01'),
  ('truck',       3, 'transport',     3.5,   'kgCO2e/ton-km', '운송 (트럭)', 1, '2025-01-01')
ON CONFLICT DO NOTHING;

-- 회사
INSERT INTO companies (id, name, country) VALUES
  ('ct045', 'CT-045', 'KR')
ON CONFLICT DO NOTHING;

-- 배출 기록 (과제 원본 데이터 전체)
INSERT INTO emission_records (id, company_id, product_name, year_month, scope, stage, source, activity_amount, activity_unit, emission_factor, factor_unit, emissions_kg_co2e, data_source_type) VALUES
  ('r-e-01',  'ct045','CT-045 제품','2025-01',2,'manufacturing','electricity',110,  'kWh',    0.456,'kgCO2e/kWh',    50.16,  'primary'),
  ('r-e-02',  'ct045','CT-045 제품','2025-02',2,'manufacturing','electricity',112,  'kWh',    0.456,'kgCO2e/kWh',    51.07,  'primary'),
  ('r-e-03',  'ct045','CT-045 제품','2025-03',2,'manufacturing','electricity',115,  'kWh',    0.456,'kgCO2e/kWh',    52.44,  'primary'),
  ('r-e-04',  'ct045','CT-045 제품','2025-04',2,'manufacturing','electricity',130,  'kWh',    0.456,'kgCO2e/kWh',    59.28,  'primary'),
  ('r-e-05a', 'ct045','CT-045 제품','2025-05',2,'manufacturing','electricity',120,  'kWh',    0.456,'kgCO2e/kWh',    54.72,  'primary'),
  ('r-e-05b', 'ct045','CT-045 제품','2025-05',2,'manufacturing','electricity',101,  'kWh',    0.456,'kgCO2e/kWh',    46.06,  'primary'),
  ('r-e-06',  'ct045','CT-045 제품','2025-06',2,'manufacturing','electricity',110,  'kWh',    0.456,'kgCO2e/kWh',    50.16,  'primary'),
  ('r-e-07',  'ct045','CT-045 제품','2025-07',2,'manufacturing','electricity',120,  'kWh',    0.456,'kgCO2e/kWh',    54.72,  'primary'),
  ('r-e-08',  'ct045','CT-045 제품','2025-08',2,'manufacturing','electricity',111,  'kWh',    0.456,'kgCO2e/kWh',    50.62,  'primary'),
  ('r-p1-01', 'ct045','CT-045 제품','2025-01',3,'raw_material', 'plastic_1',  230,  'kg',     2.3,  'kgCO2e/kg',     529.0,  'secondary'),
  ('r-p1-02', 'ct045','CT-045 제품','2025-02',3,'raw_material', 'plastic_1',  340,  'kg',     2.3,  'kgCO2e/kg',     782.0,  'secondary'),
  ('r-p1-03', 'ct045','CT-045 제품','2025-03',3,'raw_material', 'plastic_1',  430,  'kg',     2.3,  'kgCO2e/kg',     989.0,  'secondary'),
  ('r-p1-04', 'ct045','CT-045 제품','2025-04',3,'raw_material', 'plastic_1',  510,  'kg',     2.3,  'kgCO2e/kg',     1173.0, 'secondary'),
  ('r-p1-05a','ct045','CT-045 제품','2025-05',3,'raw_material', 'plastic_1',  424,  'kg',     2.3,  'kgCO2e/kg',     975.2,  'secondary'),
  ('r-p1-05b','ct045','CT-045 제품','2025-05',3,'raw_material', 'plastic_1',  232,  'kg',     2.3,  'kgCO2e/kg',     533.6,  'secondary'),
  ('r-p1-06', 'ct045','CT-045 제품','2025-06',3,'raw_material', 'plastic_1',  450,  'kg',     2.3,  'kgCO2e/kg',     1035.0, 'secondary'),
  ('r-p1-07', 'ct045','CT-045 제품','2025-07',3,'raw_material', 'plastic_1',  340,  'kg',     2.3,  'kgCO2e/kg',     782.0,  'secondary'),
  ('r-p1-08', 'ct045','CT-045 제품','2025-08',3,'raw_material', 'plastic_1',  230,  'kg',     2.3,  'kgCO2e/kg',     529.0,  'secondary'),
  ('r-p2-03', 'ct045','CT-045 제품','2025-03',3,'raw_material', 'plastic_2',  23,   'kg',     3.2,  'kgCO2e/kg',     73.6,   'secondary'),
  ('r-p2-05', 'ct045','CT-045 제품','2025-05',3,'raw_material', 'plastic_2',  40,   'kg',     3.2,  'kgCO2e/kg',     128.0,  'secondary'),
  ('r-p2-07', 'ct045','CT-045 제품','2025-07',3,'raw_material', 'plastic_2',  43,   'kg',     3.2,  'kgCO2e/kg',     137.6,  'secondary'),
  ('r-t-01',  'ct045','CT-045 제품','2025-01',3,'transport',    'truck',       41,   'ton-km', 3.5,  'kgCO2e/ton-km', 143.5,  'secondary'),
  ('r-t-02',  'ct045','CT-045 제품','2025-02',3,'transport',    'truck',       211,  'ton-km', 3.5,  'kgCO2e/ton-km', 738.5,  'secondary'),
  ('r-t-03',  'ct045','CT-045 제품','2025-03',3,'transport',    'truck',       123,  'ton-km', 3.5,  'kgCO2e/ton-km', 430.5,  'secondary'),
  ('r-t-04',  'ct045','CT-045 제품','2025-04',3,'transport',    'truck',       42,   'ton-km', 3.5,  'kgCO2e/ton-km', 147.0,  'secondary'),
  ('r-t-05a', 'ct045','CT-045 제품','2025-05',3,'transport',    'truck',       123,  'ton-km', 3.5,  'kgCO2e/ton-km', 430.5,  'secondary'),
  ('r-t-05b', 'ct045','CT-045 제품','2025-05',3,'transport',    'truck',       12,   'ton-km', 3.5,  'kgCO2e/ton-km', 42.0,   'secondary'),
  ('r-t-06',  'ct045','CT-045 제품','2025-06',3,'transport',    'truck',       123,  'ton-km', 3.5,  'kgCO2e/ton-km', 430.5,  'secondary'),
  ('r-t-07',  'ct045','CT-045 제품','2025-07',3,'transport',    'truck',       41,   'ton-km', 3.5,  'kgCO2e/ton-km', 143.5,  'secondary'),
  ('r-t-08',  'ct045','CT-045 제품','2025-08',3,'transport',    'truck',       123,  'ton-km', 3.5,  'kgCO2e/ton-km', 430.5,  'secondary')
ON CONFLICT DO NOTHING;

-- 메모
INSERT INTO posts (id, company_id, title, content, date_time) VALUES
  ('p1','ct045','4월 전력 사용량 급증','4월 전력 소비가 130kWh로 전월 대비 13% 증가했습니다. Scope 2 배출량 상승 원인 파악 및 절전 조치가 필요합니다.','2025-05-02T09:00'),
  ('p2','ct045','원소재 단계가 전체 배출의 약 75%','1~8월 LCA 분석 결과 플라스틱 원소재 조달(Scope 3) 단계가 전체 PCF의 약 75%를 차지했습니다. 저탄소 원료 대체 검토를 권장합니다.','2025-09-01T10:00'),
  ('p3','ct045','2월 운송 배출량 최대치','2월 트럭 운송량이 211 ton-km로 전 기간 최고치를 기록했습니다.','2025-03-05T08:30'),
  ('p4','ct045','플라스틱 2 배출계수 검증 완료','플라스틱 2(EF 3.2 kgCO2e/kg)에 대한 외부 검증을 완료했습니다.','2025-06-15T14:00'),
  ('p5','ct045','하반기 감축 목표 수립','9월부터 재생에너지 PPA 및 트럭 운송 최적화를 통해 연간 총 배출량 10% 감축을 목표로 설정했습니다.','2025-08-20T16:00')
ON CONFLICT DO NOTHING;
