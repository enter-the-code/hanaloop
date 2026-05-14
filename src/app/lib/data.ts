import type { Country, Company, EmissionRecord, Post } from "./types";

export const countries: Country[] = [
  { code: "US", name: "United States", region: "North America" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "KR", name: "South Korea", region: "Asia" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "GB", name: "United Kingdom", region: "Europe" },
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "Atlas Steel Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "natural_gas", emissions: 1820 },
      { yearMonth: "2024-02", source: "natural_gas", emissions: 1750 },
      { yearMonth: "2024-03", source: "natural_gas", emissions: 1690 },
      { yearMonth: "2024-04", source: "natural_gas", emissions: 1620 },
      { yearMonth: "2024-05", source: "natural_gas", emissions: 1580 },
      { yearMonth: "2024-06", source: "natural_gas", emissions: 1540 },
    ],
  },
  {
    id: "c2",
    name: "Rhine Chemicals GmbH",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "lpg", emissions: 980 },
      { yearMonth: "2024-02", source: "lpg", emissions: 1020 },
      { yearMonth: "2024-03", source: "lpg", emissions: 960 },
      { yearMonth: "2024-04", source: "lpg", emissions: 910 },
      { yearMonth: "2024-05", source: "lpg", emissions: 870 },
      { yearMonth: "2024-06", source: "lpg", emissions: 830 },
    ],
  },
  {
    id: "c3",
    name: "한강 로지스틱스",
    country: "KR",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 430 },
      { yearMonth: "2024-02", source: "diesel", emissions: 460 },
      { yearMonth: "2024-03", source: "diesel", emissions: 490 },
      { yearMonth: "2024-04", source: "diesel", emissions: 510 },
      { yearMonth: "2024-05", source: "diesel", emissions: 520 },
      { yearMonth: "2024-06", source: "diesel", emissions: 505 },
    ],
  },
  {
    id: "c4",
    name: "Sakura Electronics",
    country: "JP",
    emissions: [
      { yearMonth: "2024-01", source: "electricity", emissions: 310 },
      { yearMonth: "2024-02", source: "electricity", emissions: 295 },
      { yearMonth: "2024-03", source: "electricity", emissions: 280 },
      { yearMonth: "2024-04", source: "electricity", emissions: 270 },
      { yearMonth: "2024-05", source: "electricity", emissions: 265 },
      { yearMonth: "2024-06", source: "electricity", emissions: 258 },
    ],
  },
];

// ─── Atlas Steel Corp (c1) ────────────────────────────────────────────────────
// natural_gas: EF 2.02 kgCO2e/m³ | electricity: EF 0.386 kgCO2e/kWh | coal: EF 2.42 kgCO2e/kg
const atlasRecords: EmissionRecord[] = [
  // 2024-01
  { id: "r-c1-0101", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-01", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 900000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1818000, dataSourceType: "primary" },
  { id: "r-c1-0102", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-01", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 520000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  200720, dataSourceType: "secondary" },
  { id: "r-c1-0103", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-01", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 300000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  726000, dataSourceType: "secondary" },
  // 2024-02
  { id: "r-c1-0201", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-02", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 866000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1749320, dataSourceType: "primary" },
  { id: "r-c1-0202", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-02", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 498000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  192228, dataSourceType: "secondary" },
  { id: "r-c1-0203", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-02", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 282000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  682440, dataSourceType: "secondary" },
  // 2024-03
  { id: "r-c1-0301", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-03", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 836000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1688720, dataSourceType: "primary" },
  { id: "r-c1-0302", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-03", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 475000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  183350, dataSourceType: "secondary" },
  { id: "r-c1-0303", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-03", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 270000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  653400, dataSourceType: "secondary" },
  // 2024-04
  { id: "r-c1-0401", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-04", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 802000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1620040, dataSourceType: "primary" },
  { id: "r-c1-0402", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-04", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 455000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  175630, dataSourceType: "secondary" },
  { id: "r-c1-0403", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-04", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 256000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  619520, dataSourceType: "secondary" },
  // 2024-05
  { id: "r-c1-0501", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-05", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 782000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1579640, dataSourceType: "primary" },
  { id: "r-c1-0502", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-05", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 442000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  170612, dataSourceType: "secondary" },
  { id: "r-c1-0503", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-05", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 245000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  592900, dataSourceType: "secondary" },
  // 2024-06
  { id: "r-c1-0601", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-06", scope: 1, stage: "manufacturing", source: "natural_gas",       activityAmount: 762000, activityUnit: "m³",  emissionFactor: 2.02,  factorUnit: "kgCO2e/m³",  emissionsKgCo2e: 1539240, dataSourceType: "primary" },
  { id: "r-c1-0602", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-06", scope: 2, stage: "manufacturing", source: "electricity",       activityAmount: 430000, activityUnit: "kWh", emissionFactor: 0.386, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  165980, dataSourceType: "secondary" },
  { id: "r-c1-0603", companyId: "c1", productName: "Steel Beam", yearMonth: "2024-06", scope: 3, stage: "raw_material",  source: "coal",              activityAmount: 235000, activityUnit: "kg",  emissionFactor: 2.42,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  568700, dataSourceType: "secondary" },
];

// ─── Rhine Chemicals GmbH (c2) ────────────────────────────────────────────────
// lpg: EF 1.61 kgCO2e/kg | electricity: EF 0.338 kgCO2e/kWh (EU grid) | chemical_feedstock: EF 2.85 kgCO2e/kg
const rhineRecords: EmissionRecord[] = [
  // 2024-01
  { id: "r-c2-0101", companyId: "c2", productName: "Ethylene", yearMonth: "2024-01", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 608000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  978880, dataSourceType: "primary" },
  { id: "r-c2-0102", companyId: "c2", productName: "Ethylene", yearMonth: "2024-01", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 310000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  104780, dataSourceType: "secondary" },
  { id: "r-c2-0103", companyId: "c2", productName: "Ethylene", yearMonth: "2024-01", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount: 120000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  342000, dataSourceType: "secondary" },
  // 2024-02
  { id: "r-c2-0201", companyId: "c2", productName: "Ethylene", yearMonth: "2024-02", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 634000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e: 1020740, dataSourceType: "primary" },
  { id: "r-c2-0202", companyId: "c2", productName: "Ethylene", yearMonth: "2024-02", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 325000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  109850, dataSourceType: "secondary" },
  { id: "r-c2-0203", companyId: "c2", productName: "Ethylene", yearMonth: "2024-02", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount: 126000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  359100, dataSourceType: "secondary" },
  // 2024-03
  { id: "r-c2-0301", companyId: "c2", productName: "Ethylene", yearMonth: "2024-03", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 596000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  959560, dataSourceType: "primary" },
  { id: "r-c2-0302", companyId: "c2", productName: "Ethylene", yearMonth: "2024-03", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 298000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:  100724, dataSourceType: "secondary" },
  { id: "r-c2-0303", companyId: "c2", productName: "Ethylene", yearMonth: "2024-03", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount: 116000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  330600, dataSourceType: "secondary" },
  // 2024-04
  { id: "r-c2-0401", companyId: "c2", productName: "Ethylene", yearMonth: "2024-04", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 565000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  909650, dataSourceType: "primary" },
  { id: "r-c2-0402", companyId: "c2", productName: "Ethylene", yearMonth: "2024-04", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 280000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:   94640, dataSourceType: "secondary" },
  { id: "r-c2-0403", companyId: "c2", productName: "Ethylene", yearMonth: "2024-04", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount: 108000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  307800, dataSourceType: "secondary" },
  // 2024-05
  { id: "r-c2-0501", companyId: "c2", productName: "Ethylene", yearMonth: "2024-05", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 540000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  869400, dataSourceType: "primary" },
  { id: "r-c2-0502", companyId: "c2", productName: "Ethylene", yearMonth: "2024-05", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 265000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:   89570, dataSourceType: "secondary" },
  { id: "r-c2-0503", companyId: "c2", productName: "Ethylene", yearMonth: "2024-05", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount: 102000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  290700, dataSourceType: "secondary" },
  // 2024-06
  { id: "r-c2-0601", companyId: "c2", productName: "Ethylene", yearMonth: "2024-06", scope: 1, stage: "manufacturing", source: "lpg",                activityAmount: 516000, activityUnit: "kg",  emissionFactor: 1.61,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  830760, dataSourceType: "primary" },
  { id: "r-c2-0602", companyId: "c2", productName: "Ethylene", yearMonth: "2024-06", scope: 2, stage: "manufacturing", source: "electricity",        activityAmount: 252000, activityUnit: "kWh", emissionFactor: 0.338, factorUnit: "kgCO2e/kWh", emissionsKgCo2e:   85176, dataSourceType: "secondary" },
  { id: "r-c2-0603", companyId: "c2", productName: "Ethylene", yearMonth: "2024-06", scope: 3, stage: "raw_material",  source: "chemical_feedstock", activityAmount:  96000, activityUnit: "kg",  emissionFactor: 2.85,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:  273600, dataSourceType: "secondary" },
];

// ─── 한강 로지스틱스 (c3) ──────────────────────────────────────────────────────
// diesel: EF 2.68 kgCO2e/L | gasoline: EF 2.31 kgCO2e/L | packaging_material: EF 1.92 kgCO2e/kg
const hangangRecords: EmissionRecord[] = [
  // 2024-01
  { id: "r-c3-0101", companyId: "c3", productName: "Freight Service", yearMonth: "2024-01", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 128000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  343040, dataSourceType: "primary" },
  { id: "r-c3-0102", companyId: "c3", productName: "Freight Service", yearMonth: "2024-01", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  22000, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   50820, dataSourceType: "primary" },
  { id: "r-c3-0103", companyId: "c3", productName: "Freight Service", yearMonth: "2024-01", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  18000, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   34560, dataSourceType: "secondary" },
  // 2024-02
  { id: "r-c3-0201", companyId: "c3", productName: "Freight Service", yearMonth: "2024-02", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 136000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  364480, dataSourceType: "primary" },
  { id: "r-c3-0202", companyId: "c3", productName: "Freight Service", yearMonth: "2024-02", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  24000, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   55440, dataSourceType: "primary" },
  { id: "r-c3-0203", companyId: "c3", productName: "Freight Service", yearMonth: "2024-02", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  20000, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   38400, dataSourceType: "secondary" },
  // 2024-03
  { id: "r-c3-0301", companyId: "c3", productName: "Freight Service", yearMonth: "2024-03", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 145000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  388600, dataSourceType: "primary" },
  { id: "r-c3-0302", companyId: "c3", productName: "Freight Service", yearMonth: "2024-03", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  26000, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   60060, dataSourceType: "primary" },
  { id: "r-c3-0303", companyId: "c3", productName: "Freight Service", yearMonth: "2024-03", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  21500, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   41280, dataSourceType: "secondary" },
  // 2024-04
  { id: "r-c3-0401", companyId: "c3", productName: "Freight Service", yearMonth: "2024-04", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 152000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  407360, dataSourceType: "primary" },
  { id: "r-c3-0402", companyId: "c3", productName: "Freight Service", yearMonth: "2024-04", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  27500, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   63525, dataSourceType: "primary" },
  { id: "r-c3-0403", companyId: "c3", productName: "Freight Service", yearMonth: "2024-04", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  20500, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   39360, dataSourceType: "secondary" },
  // 2024-05
  { id: "r-c3-0501", companyId: "c3", productName: "Freight Service", yearMonth: "2024-05", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 155000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  415400, dataSourceType: "primary" },
  { id: "r-c3-0502", companyId: "c3", productName: "Freight Service", yearMonth: "2024-05", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  28000, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   64680, dataSourceType: "primary" },
  { id: "r-c3-0503", companyId: "c3", productName: "Freight Service", yearMonth: "2024-05", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  21000, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   40320, dataSourceType: "secondary" },
  // 2024-06
  { id: "r-c3-0601", companyId: "c3", productName: "Freight Service", yearMonth: "2024-06", scope: 1, stage: "transport",   source: "diesel",             activityAmount: 150000, activityUnit: "L",   emissionFactor: 2.68,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:  402000, dataSourceType: "primary" },
  { id: "r-c3-0602", companyId: "c3", productName: "Freight Service", yearMonth: "2024-06", scope: 1, stage: "transport",   source: "gasoline",           activityAmount:  27000, activityUnit: "L",   emissionFactor: 2.31,  factorUnit: "kgCO2e/L",   emissionsKgCo2e:   62370, dataSourceType: "primary" },
  { id: "r-c3-0603", companyId: "c3", productName: "Freight Service", yearMonth: "2024-06", scope: 3, stage: "packaging",   source: "packaging_material", activityAmount:  20800, activityUnit: "kg",  emissionFactor: 1.92,  factorUnit: "kgCO2e/kg",  emissionsKgCo2e:   39936, dataSourceType: "secondary" },
];

// ─── Sakura Electronics (c4) ──────────────────────────────────────────────────
// electricity: EF 0.457 kgCO2e/kWh (JP grid) | rare_earth: EF 35.0 kgCO2e/kg | logistics: EF 0.12 kgCO2e/tonne·km
const sakuraRecords: EmissionRecord[] = [
  // 2024-01
  { id: "r-c4-0101", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-01", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 680000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  310760, dataSourceType: "primary" },
  { id: "r-c4-0102", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-01", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2800, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   98000, dataSourceType: "secondary" },
  { id: "r-c4-0103", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-01", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 860000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:  103200, dataSourceType: "secondary" },
  // 2024-02
  { id: "r-c4-0201", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-02", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 645000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  294765, dataSourceType: "primary" },
  { id: "r-c4-0202", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-02", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2650, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   92750, dataSourceType: "secondary" },
  { id: "r-c4-0203", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-02", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 820000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:   98400, dataSourceType: "secondary" },
  // 2024-03
  { id: "r-c4-0301", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-03", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 612000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  279684, dataSourceType: "primary" },
  { id: "r-c4-0302", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-03", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2500, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   87500, dataSourceType: "secondary" },
  { id: "r-c4-0303", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-03", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 780000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:   93600, dataSourceType: "secondary" },
  // 2024-04
  { id: "r-c4-0401", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-04", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 590000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  269630, dataSourceType: "primary" },
  { id: "r-c4-0402", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-04", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2400, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   84000, dataSourceType: "secondary" },
  { id: "r-c4-0403", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-04", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 750000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:   90000, dataSourceType: "secondary" },
  // 2024-05
  { id: "r-c4-0501", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-05", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 580000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  265060, dataSourceType: "primary" },
  { id: "r-c4-0502", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-05", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2350, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   82250, dataSourceType: "secondary" },
  { id: "r-c4-0503", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-05", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 735000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:   88200, dataSourceType: "secondary" },
  // 2024-06
  { id: "r-c4-0601", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-06", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 565000, activityUnit: "kWh",       emissionFactor: 0.457, factorUnit: "kgCO2e/kWh",        emissionsKgCo2e:  258205, dataSourceType: "primary" },
  { id: "r-c4-0602", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-06", scope: 3, stage: "raw_material",  source: "rare_earth",  activityAmount:   2280, activityUnit: "kg",        emissionFactor: 35.0,  factorUnit: "kgCO2e/kg",          emissionsKgCo2e:   79800, dataSourceType: "secondary" },
  { id: "r-c4-0603", companyId: "c4", productName: "Circuit Board", yearMonth: "2024-06", scope: 3, stage: "transport",    source: "logistics",   activityAmount: 715000, activityUnit: "tonne·km",  emissionFactor: 0.12,  factorUnit: "kgCO2e/tonne·km",   emissionsKgCo2e:   85800, dataSourceType: "secondary" },
];

export const emissionRecords: EmissionRecord[] = [
  ...atlasRecords,
  ...rhineRecords,
  ...hangangRecords,
  ...sakuraRecords,
];

export const posts: Post[] = [
  {
    id: "p1",
    companyId: "c1",
    title: "Scope 2 상승: 전력 사용량 증가",
    content: "1월 대비 전력 소비가 8% 증가하면서 Scope 2 배출량이 200 tCO2e 이상 상승했습니다. 야간 조업 확대가 주요 원인으로 파악되며, 재생에너지 전력 구매계약(PPA) 검토를 권장합니다.",
    dateTime: "2024-02-05T09:30:00Z",
  },
  {
    id: "p2",
    companyId: "c2",
    title: "Raw material 단계가 전체의 48%",
    content: "2024년 1분기 LCA 분석 결과, chemical_feedstock 조달 단계가 전체 PCF의 48%를 차지했습니다. 저탄소 원료 공급사 전환 시 연간 약 320 tCO2e 절감 가능성이 있습니다.",
    dateTime: "2024-04-11T14:00:00Z",
  },
  {
    id: "p3",
    companyId: "c3",
    title: "디젤 소비 전월 대비 12% 증가",
    content: "3월 화물 물동량 급증으로 디젤 소비가 전월 대비 12% 증가했습니다. 전기 화물차 전환 파일럿(5대)을 4분기 착수 목표로 추진 중입니다.",
    dateTime: "2024-04-03T08:15:00Z",
  },
  {
    id: "p4",
    companyId: "c4",
    title: "희토류 조달 Scope 3 검증 완료",
    content: "외부 검증기관을 통해 rare_earth 조달 경로의 Scope 3 배출계수(35 kgCO2e/kg)를 확정했습니다. 재활용 희토류 비율을 현재 12%에서 30%로 높일 경우 약 58 tCO2e 절감이 예상됩니다.",
    dateTime: "2024-03-20T11:45:00Z",
  },
  {
    id: "p5",
    companyId: "c1",
    title: "석탄 원료 비중 축소 계획 수립",
    content: "Scope 3 raw_material 배출 절감을 위해 2024 하반기부터 석탄 사용량을 15% 감축하고 전기로 비율을 확대하는 로드맵을 확정했습니다. 목표 절감량은 연 180 tCO2e입니다.",
    dateTime: "2024-05-17T16:00:00Z",
  },
];
