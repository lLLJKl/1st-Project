import { useEffect, useMemo, useState } from "react";
import { Accordion, Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

/**
 * MeasuresCard (MVP, v03-ish)
 * 핵심 원칙:
 * - "선택된 활동만" 서버에 저장 (OFF면 row 삭제/미생성)
 * - Scope1: tCO2e/yr 직접 입력
 * - Scope2: kWh/MWh 입력 → 환산은 백엔드(배출계수)에서 수행
 * - IDEA는 계산에 미반영(서버 preview에서 제외)
 *
 * UX 정책(기준연도 이전 활동):
 * - 기준연도 이전(이미 실행중/기존 운영)은 인벤토리 기준값에 반영된 것으로 보고 별도 입력하지 않는 것이 기본.
 * - 다만 “추가 감축분”만 모델링하고 싶으면 시작연도를 기준연도+1 이후로 설정.
 */

const MEASURE_STATUS = {
  ACTIVE: "ACTIVE", // 계획/진행 중(계산 반영)
  CONFIRMED: "CONFIRMED", // 예산/계약 등 확정(계산 반영)
  IDEA: "IDEA", // 아이디어(계산 제외)
};

// ✅ 현업형 taxonomy (MVP 최소, 확장 가능)
const MEASURE_CATALOG = [
  // Scope 1 (직접배출)
  {
    scope: "S1",
    category: "FUEL_SWITCHING_BOILER_PROCESS",
    title: "연료 전환(보일러/공정)",
    description: "LNG/유류 → 전기/수소/저탄소 연료로 전환한 연간 감축량",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },
  {
    scope: "S1",
    category: "PROCESS_EFFICIENCY",
    title: "공정/설비 효율 개선(Scope1)",
    description: "공정 최적화, 열회수 등으로 발생하는 연간 감축량(직접 입력)",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },
  {
    scope: "S1",
    category: "FUGITIVE_EMISSIONS_REDUCTION",
    title: "누출/냉매 등 비연소 배출 저감",
    description: "냉매 누출/가스 누출 저감 등(직접 입력)",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },

  // Scope 2 (간접배출: 전력)
  {
    scope: "S2",
    category: "PPA_DIRECT",
    title: "재생에너지 PPA(직접)",
    description: "직접 PPA로 전환한 연간 전력량 입력(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "PPA_THIRD_PARTY",
    title: "재생에너지 PPA(제3자/중개)",
    description: "제3자 PPA/중개 구조로 전환한 연간 전력량 입력",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "GREEN_PREMIUM",
    title: "녹색프리미엄",
    description: "녹색프리미엄으로 전환한 연간 전력량 입력",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "REC_PURCHASE",
    title: "REC 구매",
    description: "REC로 상계할 연간 전력량(또는 적용량)을 입력",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "ELECTRICITY_EFFICIENCY",
    title: "전력 효율 개선(설비/조명/EMS)",
    description: "절감된 연간 전력량 입력(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
];

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

function buildDefaultForm(years) {
  const next = {};
  for (const item of MEASURE_CATALOG) {
    next[item.category] = {
      enabled: false,
      id: null,
      scope: item.scope,
      measure_category: item.category,
      input_unit: item.defaultUnit,
      input_value: "",
      start_year: years[0],
      measure_status: MEASURE_STATUS.ACTIVE,
      annual_reduction_tco2e: null,
    };
  }
  return next;
}

export default function MeasuresCard({
  projectId,
  scenarioId,
  apiBase = "/api",
  minStartYear,
  maxStartYear,
  onChanged,
}) {
  const [activeScope, setActiveScope] = useState("S1");
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState(null);

  const years = useMemo(() => {
    const start = Number(minStartYear);
    const end = Number(maxStartYear);
    const arr = [];
    for (let y = start; y <= end; y += 1) arr.push(y);
    return arr;
  }, [minStartYear, maxStartYear]);

  const [formByCategory, setFormByCategory] = useState(() => buildDefaultForm([new Date().getFullYear() + 1]));

  const catalogByScope = useMemo(
    () => ({
      S1: MEASURE_CATALOG.filter((m) => m.scope === "S1"),
      S2: MEASURE_CATALOG.filter((m) => m.scope === "S2"),
    }),
    []
  );

  const baseUrl = `${apiBase}/projects/${encodeURIComponent(projectId)}/netzero/${encodeURIComponent(scenarioId)}`;

  function updateForm(category, patch) {
    setFormByCategory((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), ...patch },
    }));
  }

  function validate(category) {
    const f = formByCategory[category];
    if (!f?.enabled) return { ok: true };

    const cat = MEASURE_CATALOG.find((m) => m.category === category);
    const unit = f.input_unit || cat?.defaultUnit;

    if (!f.start_year) return { ok: false, msg: "시작연도를 선택하세요." };
    if (!unit) return { ok: false, msg: "단위를 선택하세요." };
    if (cat && !cat.allowedUnits.includes(unit)) return { ok: false, msg: "단위가 올바르지 않습니다." };

    const raw = String(f.input_value ?? "").trim();
    if (!raw) return { ok: false, msg: "수치를 입력하세요." };

    const val = Number(raw);
    if (!Number.isFinite(val)) return { ok: false, msg: "유효한 숫자를 입력하세요." };
    if (val < 0) return { ok: false, msg: "0 이상만 입력 가능합니다." };

    return { ok: true };
  }

  async function load() {
    setLoading(true);
    setError(null);

    // 백엔드가 없어도 UI는 동작해야 함: 기본 폼을 먼저 생성
    const defaults = buildDefaultForm(years);
    setFormByCategory(defaults);

    try {
      const rows = await apiFetch(`${baseUrl}/measures`, { method: "GET" });
      const arr = Array.isArray(rows) ? rows : rows?.items || [];

      const next = { ...defaults };
      for (const item of MEASURE_CATALOG) {
        const existing = arr.find((r) => r.measure_category === item.category);
        if (!existing) continue;

        next[item.category] = {
          enabled: true,
          id: existing.id,
          scope: existing.scope,
          measure_category: existing.measure_category,
          input_unit: existing.input_unit || item.defaultUnit,
          input_value:
            existing.input_value === null || existing.input_value === undefined ? "" : String(existing.input_value),
          start_year: existing.start_year || years[0],
          measure_status: existing.measure_status || MEASURE_STATUS.ACTIVE,
          annual_reduction_tco2e: existing.annual_reduction_tco2e ?? null,
        };
      }

      setFormByCategory(next);
    } catch (e) {
      // 백엔드 미구현/미가동이면 여기로 옴. UI만 확인 가능한 상태 유지.
      setError(
        `감축활동 조회 API가 아직 준비되지 않았습니다. (UI는 사용 가능) · ${e.message || "로드 실패"}`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!projectId || !scenarioId || years.length === 0) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId, years.join(",")]);

  async function upsert(category) {
    const check = validate(category);
    if (!check.ok) return setError(check.msg);

    setError(null);
    setSavingKey(category);

    try {
      const f = formByCategory[category];
      const cat = MEASURE_CATALOG.find((m) => m.category === category);

      const payload = {
        id: f.id,
        scope: f.scope,
        measure_category: f.measure_category,
        input_unit: f.input_unit || cat?.defaultUnit,
        input_value: f.input_value === "" ? null : Number(f.input_value),
        start_year: Number(f.start_year),
        measure_status: f.measure_status,
      };

      const saved = await apiFetch(`${baseUrl}/measures`, { method: "POST", body: JSON.stringify(payload) });

      updateForm(category, {
        enabled: true,
        id: saved.id,
        annual_reduction_tco2e: saved.annual_reduction_tco2e ?? null,
      });

      if (onChanged) onChanged();
    } catch (e) {
      setError(e.message || "저장 실패");
    } finally {
      setSavingKey(null);
    }
  }

  async function remove(category) {
    setError(null);
    const f = formByCategory[category];

    // 서버 row 없으면 UI만 OFF
    if (!f?.id) {
      updateForm(category, { enabled: false, input_value: "", annual_reduction_tco2e: null });
      if (onChanged) onChanged();
      return;
    }

    setSavingKey(category);
    try {
      await apiFetch(`${baseUrl}/measures/${encodeURIComponent(f.id)}`, { method: "DELETE" });
      updateForm(category, { enabled: false, id: null, input_value: "", annual_reduction_tco2e: null });
      if (onChanged) onChanged();
    } catch (e) {
      setError(e.message || "삭제 실패");
    } finally {
      setSavingKey(null);
    }
  }

  const visibleCatalog = catalogByScope[activeScope] || [];

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div>
            <Card.Title className="fw-bold mb-1">감축활동 입력</Card.Title>
            <div className="text-muted small">
              선택된 활동만 저장됩니다. Scope2는 kWh/MWh 입력 → 환산은 백엔드에서 수행합니다.
              <div className="mt-1">
                <span className="fw-semibold">기준연도 이전 활동</span>은 인벤토리 기준값에 반영된 것으로 간주(기본).
                추가 감축분만 시작연도(기준연도+1 이후)로 모델링하세요.
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant={activeScope === "S1" ? "primary" : "outline-primary"}
              onClick={() => setActiveScope("S1")}
            >
              Scope1
            </Button>
            <Button
              size="sm"
              variant={activeScope === "S2" ? "primary" : "outline-primary"}
              onClick={() => setActiveScope("S2")}
            >
              Scope2
            </Button>
          </div>
        </div>

        {error && <div className="alert alert-warning py-2 small mb-3">{error}</div>}

        {loading ? (
          <div className="text-muted small">불러오는 중…</div>
        ) : (
          <div style={{ maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
            <Accordion alwaysOpen>
              {visibleCatalog.map((m) => {
                const f = formByCategory[m.category];
                const isSaving = savingKey === m.category;

                const statusLabel =
                  f?.measure_status === MEASURE_STATUS.ACTIVE
                    ? "ACTIVE(반영)"
                    : f?.measure_status === MEASURE_STATUS.CONFIRMED
                    ? "CONFIRMED(반영)"
                    : "IDEA(미반영)";

                return (
                  <Accordion.Item eventKey={m.category} key={m.category}>
                    <Accordion.Header>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold">{m.title}</span>
                        <Badge bg="light" text="dark">
                          {m.scope}
                        </Badge>
                        <Badge bg={f?.measure_status === MEASURE_STATUS.IDEA ? "warning" : "secondary"}>
                          {statusLabel}
                        </Badge>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      <div className="text-muted small mb-3">{m.description}</div>

                      <div className="text-muted small mb-3">
                        <div className="mb-1">
                          <span className="fw-semibold">ACTIVE</span>: 계획/진행 중(연산 반영)
                        </div>
                        <div className="mb-1">
                          <span className="fw-semibold">CONFIRMED</span>: 계약/투자 확정(연산 반영)
                        </div>
                        <div>
                          <span className="fw-semibold">IDEA</span>: 아이디어(연산 제외)
                        </div>
                      </div>

                      <Row className="g-3 align-items-end">
                        <Col md={3}>
                          <Form.Label className="small text-muted">선택</Form.Label>
                          <div className="d-flex gap-3">
                            <Form.Check
                              type="radio"
                              name={`enable_${m.category}`}
                              label="미선택"
                              checked={!f?.enabled}
                              disabled={isSaving}
                              onChange={() => remove(m.category)}
                            />
                            <Form.Check
                              type="radio"
                              name={`enable_${m.category}`}
                              label="선택"
                              checked={!!f?.enabled}
                              disabled={isSaving}
                              onChange={() => updateForm(m.category, { enabled: true })}
                            />
                          </div>
                        </Col>

                        <Col md={3}>
                          <Form.Label className="small text-muted">상태</Form.Label>
                          <Form.Select
                            value={f?.measure_status || MEASURE_STATUS.ACTIVE}
                            disabled={isSaving || !f?.enabled}
                            onChange={(e) => updateForm(m.category, { measure_status: e.target.value })}
                          >
                            <option value={MEASURE_STATUS.ACTIVE}>ACTIVE</option>
                            <option value={MEASURE_STATUS.CONFIRMED}>CONFIRMED</option>
                            <option value={MEASURE_STATUS.IDEA}>IDEA</option>
                          </Form.Select>
                        </Col>

                        <Col md={2}>
                          <Form.Label className="small text-muted">시작연도</Form.Label>
                          <Form.Select
                            value={f?.start_year ?? ""}
                            disabled={isSaving || !f?.enabled}
                            onChange={(e) => updateForm(m.category, { start_year: e.target.value })}
                          >
                            {years.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>

                        <Col md={2}>
                          <Form.Label className="small text-muted">단위</Form.Label>
                          <Form.Select
                            value={f?.input_unit ?? m.defaultUnit}
                            disabled={isSaving || !f?.enabled || m.allowedUnits.length === 1}
                            onChange={(e) => updateForm(m.category, { input_unit: e.target.value })}
                          >
                            {m.allowedUnits.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </Form.Select>
                          {m.allowedUnits.length === 1 && (
                            <div className="text-muted small mt-1">이 항목은 단위가 고정입니다.</div>
                          )}
                        </Col>

                        <Col md={2}>
                          <Form.Label className="small text-muted">
                            {m.inputType === "DIRECT_TCO2E" ? "연간 감축량" : "연간 전력량"}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={f?.input_value ?? ""}
                            disabled={isSaving || !f?.enabled}
                            min={0}
                            onChange={(e) => updateForm(m.category, { input_value: e.target.value })}
                            placeholder={m.inputType === "DIRECT_TCO2E" ? "예: 1200" : "예: 500000"}
                          />
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted small">
                          환산 감축량(참고):{" "}
                          <span className="fw-semibold">
                            {f?.annual_reduction_tco2e == null
                              ? "저장 후 계산"
                              : `${Math.round(Number(f.annual_reduction_tco2e)).toLocaleString("ko-KR")} tCO₂e/yr`}
                          </span>
                          {f?.measure_status === MEASURE_STATUS.IDEA && (
                            <span className="ms-2 text-warning fw-semibold">(IDEA는 연산 제외)</span>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={isSaving || !f?.enabled}
                            onClick={() => upsert(m.category)}
                          >
                            {isSaving ? "저장 중…" : "저장"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={isSaving}
                            onClick={() => remove(m.category)}
                            title="OFF 시 DB row도 삭제됩니다."
                          >
                            제거
                          </Button>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
