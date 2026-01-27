import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

/**
 * MeasuresCard (좌측 패널 최적화 버전)
 * 핵심 수정:
 * 1) md 기준 컬럼배치 제거 → xs/sm 중심으로 2줄(또는 3줄)로 안정 배치
 *    (viewport가 커도 좌측 패널은 좁기 때문에 md 기준 배치는 항상 깨짐)
 * 2) 단위는 UI 라벨("kWh/yr")와 서버 enum("KWH_YR")을 매핑해서 payload 정합
 * 3) API 응답이 JSON이 아닐 때도 안전하게 에러 메시지 처리(HTML 500/404 방지)
 */

const MEASURE_STATUS = {
  ACTIVE: "ACTIVE",
  CONFIRMED: "CONFIRMED",
  IDEA: "IDEA",
};

const STATUS_LABEL = {
  ACTIVE: "ACTIVE(반영)",
  CONFIRMED: "CONFIRMED(반영)",
  IDEA: "IDEA(미반영)",
};

const STATUS_BADGE_VARIANT = {
  ACTIVE: "secondary",
  CONFIRMED: "secondary",
  IDEA: "warning",
};

// UI 라벨 → 서버/DB enum 매핑(권장 스키마 기준)
const UNIT_TO_ENUM = {
  "tCO2e/yr": "TCO2E_YR",
  "kWh/yr": "KWH_YR",
  "MWh/yr": "MWH_YR",
};

// ✅ 최소 taxonomy (MVP)
const MEASURE_CATALOG = [
  // S1
  {
    scope: "S1",
    category: "FUEL_SWITCHING_BOILER_PROCESS",
    title: "연료 전환",
    description: "연료 전환으로 발생하는 연간 감축량(직접 입력)",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },
  {
    scope: "S1",
    category: "PROCESS_EFFICIENCY",
    title: "공정/설비 효율 개선",
    description: "공정 최적화/열회수 등으로 발생하는 연간 감축량(직접 입력)",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },
  {
    scope: "S1",
    category: "FUGITIVE_EMISSIONS_REDUCTION",
    title: "비연소 배출 저감",
    description: "냉매/가스 누출 저감 등으로 발생하는 연간 감축량(직접 입력)",
    inputType: "DIRECT_TCO2E",
    defaultUnit: "tCO2e/yr",
    allowedUnits: ["tCO2e/yr"],
  },

  // S2
  {
    scope: "S2",
    category: "PPA_DIRECT",
    title: "PPA(직접)",
    description: "직접 PPA로 전환한 연간 전력량 입력(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "PPA_THIRD_PARTY",
    title: "PPA(제3자/중개)",
    description: "제3자/중개 PPA 전환 연간 전력량(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "GREEN_PREMIUM",
    title: "녹색프리미엄",
    description: "녹색프리미엄 적용 전력량(연간)(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "REC_PURCHASE",
    title: "REC 구매",
    description: "REC로 상계할 전력량(연간)(환산은 백엔드)",
    inputType: "ENERGY",
    defaultUnit: "kWh/yr",
    allowedUnits: ["kWh/yr", "MWh/yr"],
  },
  {
    scope: "S2",
    category: "ELECTRICITY_EFFICIENCY",
    title: "전력 효율 개선",
    description: "절감 전력량(연간)(환산은 백엔드)",
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

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      if (isJson) {
        const data = await res.json();
        msg = data?.detail || data?.message || msg;
      } else {
        const text = await res.text();
        msg = `${msg} (non-JSON response)`;
        if (text) msg += `: ${text.slice(0, 120)}`;
      }
    } catch (_) {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return isJson ? res.json() : res.text();
}

function buildDefaultForm(years) {
  const next = {};
  for (const item of MEASURE_CATALOG) {
    next[item.category] = {
      enabled: false,
      id: null,
      scope: item.scope,
      measure_category: item.category,
      input_unit: item.defaultUnit, // UI 라벨 값
      input_value: "",
      start_year: years?.[0] ?? new Date().getFullYear() + 1,
      measure_status: MEASURE_STATUS.ACTIVE,
      annual_reduction_tco2e: null,
    };
  }
  return next;
}

function StatusHelpTooltip() {
  return (
    <Tooltip>
      <div className="small">
        <div className="mb-1">
          <span className="fw-semibold">ACTIVE</span>: 계획/진행(연산 반영)
        </div>
        <div className="mb-1">
          <span className="fw-semibold">CONFIRMED</span>: 계약/투자 확정(연산 반영)
        </div>
        <div>
          <span className="fw-semibold">IDEA</span>: 아이디어(연산 제외)
        </div>
      </div>
    </Tooltip>
  );
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

  const [globalError, setGlobalError] = useState(null);
  const [rowErrorByCategory, setRowErrorByCategory] = useState({});

  const years = useMemo(() => {
    const start = Number(minStartYear);
    const end = Number(maxStartYear);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return [];
    const arr = [];
    for (let y = start; y <= end; y += 1) arr.push(y);
    return arr;
  }, [minStartYear, maxStartYear]);

  const [formByCategory, setFormByCategory] = useState(() =>
    buildDefaultForm([new Date().getFullYear() + 1])
  );

  const catalogByScope = useMemo(
    () => ({
      S1: MEASURE_CATALOG.filter((m) => m.scope === "S1"),
      S2: MEASURE_CATALOG.filter((m) => m.scope === "S2"),
    }),
    []
  );

  const baseUrl = useMemo(() => {
    if (!projectId || !scenarioId) return null;
    return `${apiBase}/projects/${encodeURIComponent(projectId)}/netzero/${encodeURIComponent(scenarioId)}`;
  }, [apiBase, projectId, scenarioId]);

  function updateForm(category, patch) {
    setFormByCategory((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), ...patch },
    }));
  }

  function setRowError(category, msg) {
    setRowErrorByCategory((prev) => ({ ...prev, [category]: msg }));
  }

  function clearRowError(category) {
    setRowErrorByCategory((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  }

  function validate(category) {
    const f = formByCategory[category];
    if (!f?.enabled) return { ok: true };

    const cat = MEASURE_CATALOG.find((m) => m.category === category);
    const unit = f.input_unit || cat?.defaultUnit;

    if (!f.start_year) return { ok: false, msg: "시작연도를 선택하세요." };
    if (!unit) return { ok: false, msg: "단위를 확인하세요." };
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
    setGlobalError(null);
    setRowErrorByCategory({});

    const defaults = buildDefaultForm(years.length ? years : [new Date().getFullYear() + 1]);
    setFormByCategory(defaults);

    if (!baseUrl) {
      setLoading(false);
      setGlobalError("프로젝트/시나리오 정보가 아직 준비되지 않았습니다.");
      return;
    }

    try {
      const rows = await apiFetch(`${baseUrl}/measures`, { method: "GET" });
      const arr = Array.isArray(rows) ? rows : rows?.items || [];

      const next = { ...defaults };
      for (const item of MEASURE_CATALOG) {
        const existing = arr.find((r) => r.measure_category === item.category);
        if (!existing) continue;

        next[item.category] = {
          enabled: true,
          id: existing.id ?? existing.measure_id ?? null,
          scope: existing.scope ?? item.scope,
          measure_category: existing.measure_category ?? item.category,

          // 서버에서 enum을 줄 수도 있으니 UI 라벨로 역매핑(없으면 default)
          input_unit: (() => {
            const serverUnit = existing.input_unit;
            if (!serverUnit) return item.defaultUnit;
            if (serverUnit === "TCO2E_YR") return "tCO2e/yr";
            if (serverUnit === "KWH_YR") return "kWh/yr";
            if (serverUnit === "MWH_YR") return "MWh/yr";
            return serverUnit; // 혹시 서버가 UI 라벨로 주는 경우
          })(),

          input_value:
            existing.input_value === null || existing.input_value === undefined ? "" : String(existing.input_value),
          start_year: existing.start_year || (years[0] ?? defaults[item.category].start_year),
          measure_status: existing.measure_status || MEASURE_STATUS.ACTIVE,
          annual_reduction_tco2e: existing.annual_reduction_tco2e ?? null,
        };
      }

      setFormByCategory(next);
    } catch (e) {
      // 현재 스샷처럼 500이 나고 있어서 여기로 옴
      setGlobalError(`감축활동을 불러오지 못했습니다. (${e.message || "오류"})`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!projectId || !scenarioId) return;
    if (years.length === 0) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId, years.join(",")]);

  async function upsert(category) {
    const check = validate(category);
    if (!check.ok) {
      setRowError(category, check.msg);
      return;
    }
    clearRowError(category);
    setGlobalError(null);

    if (!baseUrl) {
      setRowError(category, "API 경로가 준비되지 않았습니다.");
      return;
    }

    setSavingKey(category);

    try {
      const f = formByCategory[category];
      const cat = MEASURE_CATALOG.find((m) => m.category === category);

      const uiUnit = f.input_unit || cat?.defaultUnit;
      const payload = {
        id: f.id,
        scope: f.scope, // S1/S2
        measure_category: f.measure_category,

        // ✅ 서버에는 enum을 보내자 (500 원인 1순위)
        input_unit: UNIT_TO_ENUM[uiUnit] || uiUnit,

        input_value: f.input_value === "" ? null : Number(f.input_value),
        start_year: Number(f.start_year),
        measure_status: f.measure_status,
      };

      const saved = await apiFetch(`${baseUrl}/measures`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      updateForm(category, {
        enabled: true,
        id: saved.id ?? saved.measure_id ?? f.id,
        annual_reduction_tco2e: saved.annual_reduction_tco2e ?? null,
      });

      if (onChanged) onChanged();
    } catch (e) {
      setRowError(category, e.message || "저장 실패");
    } finally {
      setSavingKey(null);
    }
  }

  async function remove(category) {
    setGlobalError(null);
    clearRowError(category);

    const f = formByCategory[category];
    updateForm(category, { enabled: false });

    // 서버 row 없으면 UI만 OFF
    if (!f?.id || !baseUrl) {
      updateForm(category, { enabled: false, input_value: "", annual_reduction_tco2e: null, id: null });
      if (onChanged) onChanged();
      return;
    }

    setSavingKey(category);
    try {
      await apiFetch(`${baseUrl}/measures/${encodeURIComponent(f.id)}`, { method: "DELETE" });
      updateForm(category, { enabled: false, id: null, input_value: "", annual_reduction_tco2e: null });
      if (onChanged) onChanged();
    } catch (e) {
      updateForm(category, { enabled: true });
      setRowError(category, e.message || "삭제 실패");
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
            <div className="text-muted small" style={{ lineHeight: 1.4 }}>
              선택된 활동만 저장됩니다. Scope2는 kWh/MWh 입력 → 환산은 백엔드에서 수행합니다.
              <div className="mt-1">
                <span className="fw-semibold">기준연도 이전 활동</span>은 인벤토리에 반영된 것으로 간주(기본).
                <span className="ms-1">추가 감축분만 시작연도(기준연도+1 이후)로 모델링하세요.</span>
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

        {globalError && <div className="alert alert-warning py-2 small mb-3">{globalError}</div>}

        {loading ? (
          <div className="text-muted small">불러오는 중…</div>
        ) : (
          <div style={{ maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
            <Accordion alwaysOpen>
              {visibleCatalog.map((m) => {
                const f = formByCategory[m.category];
                const isSaving = savingKey === m.category;
                const rowErr = rowErrorByCategory[m.category];

                const unitFixed = (m.allowedUnits?.length || 0) <= 1;
                const scopeLabel = m.scope === "S1" ? "Scope1" : "Scope2";
                const status = f?.measure_status || MEASURE_STATUS.ACTIVE;

                const headerBadges = (
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Badge bg="light" text="dark">
                      {scopeLabel}
                    </Badge>
                    <Badge bg={STATUS_BADGE_VARIANT[status] || "secondary"}>{STATUS_LABEL[status]}</Badge>
                    {f?.enabled ? <Badge bg="success">선택됨</Badge> : <Badge bg="light" text="dark">미선택</Badge>}
                  </div>
                );

                return (
                  <Accordion.Item eventKey={m.category} key={m.category}>
                    <Accordion.Header>
                      <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                        <div className="fw-semibold">{m.title}</div>
                        <div className="d-none d-md-flex">{headerBadges}</div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      <div className="d-flex d-md-none justify-content-between align-items-center mb-2">
                        {headerBadges}
                      </div>

                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div className="text-muted small" style={{ lineHeight: 1.4 }}>
                          {m.description}
                        </div>
                      </div>

                      {/* ✅ 좌측 패널은 좁으므로: xs/sm 기준으로 “항상” 줄바꿈되게 설계 */}
                      <Row className="g-2">
                        {/* 1행: 사용/상태 */}
                        <Col xs={12} sm={4}>
                          <Form.Label className="text-muted">사용</Form.Label>
                          <Form.Check
                            type="switch"
                            id={`enable_${m.category}`}
                            label={f?.enabled ? "ON" : "OFF"}
                            checked={!!f?.enabled}
                            disabled={isSaving}
                            onChange={(e) => {
                              if (e.target.checked) updateForm(m.category, { enabled: true });
                              else remove(m.category);
                            }}
                          />
                        </Col>

                        <Col xs={12} sm={8}>
                          <Form.Label className="text-muted">상태</Form.Label>
                          <Form.Select
                            value={status}
                            disabled={isSaving || !f?.enabled}
                            onChange={(e) => updateForm(m.category, { measure_status: e.target.value })}
                          >
                            <option value={MEASURE_STATUS.ACTIVE}>ACTIVE</option>
                            <option value={MEASURE_STATUS.CONFIRMED}>CONFIRMED</option>
                            <option value={MEASURE_STATUS.IDEA}>IDEA</option>
                          </Form.Select>
                        </Col>

                        {/* 2행: 시작연도/단위 */}
                        <Col xs={6} sm={6}>
                          <Form.Label className="text-muted">시작연도</Form.Label>
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

                        <Col xs={6} sm={6}>
                          <Form.Label className="text-muted">단위</Form.Label>
                          {unitFixed ? (
                            <Form.Control
                              plaintext
                              readOnly
                              value={`${m.defaultUnit} (고정)`}
                              className="px-2 py-1 bg-light rounded"
                            />
                          ) : (
                            <Form.Select
                              value={f?.input_unit ?? m.defaultUnit}
                              disabled={isSaving || !f?.enabled}
                              onChange={(e) => updateForm(m.category, { input_unit: e.target.value })}
                            >
                              {m.allowedUnits.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Col>

                        {/* 3행: 입력값 */}
                        <Col xs={12}>
                          <Form.Label className="text-muted">
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

                      {rowErr && <div className="alert alert-danger py-2 small mt-2 mb-0">{rowErr}</div>}

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted small" style={{ lineHeight: 1.4 }}>
                          환산 감축량(참고):{" "}
                          <span className="fw-semibold">
                            {f?.annual_reduction_tco2e == null ? "저장 후 계산" : `${Number(f.annual_reduction_tco2e).toLocaleString("ko-KR")} tCO₂e/yr`}
                          </span>
                          {status === MEASURE_STATUS.IDEA && (
                            <span className="ms-2 text-warning fw-semibold">(IDEA는 연산 제외)</span>
                          )}
                        </div>

                        <div className="measures-actions">
                          <Button size="sm" variant="primary" disabled={isSaving || !f?.enabled} onClick={() => upsert(m.category)}>
                            {isSaving ? "저장 중…" : "저장"}
                          </Button>
                          <Button size="sm" variant="outline-danger" disabled={isSaving || !f?.enabled} onClick={() => remove(m.category)}>
                            OFF
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
