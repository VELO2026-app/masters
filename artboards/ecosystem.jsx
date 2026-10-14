/* global React */

// ─────────────────────────────────────────────────────────────────
// ECOSYSTEM — Карта VELΘ (faithful port of the original)
// 16 узлов / 3 слоя / 32 связи. Кликабельные узлы, фильтр слоёв,
// панель описания, выделение связанных узлов и рёбер.
// Визуально доработано: убрана техно-схема, добавлены:
//  • дыхание фоновых ауры-зон по слоям,
//  • SVG-кривые вместо прямых линий,
//  • стеклянная панель описания с серифным заголовком.
// ─────────────────────────────────────────────────────────────────

// Layout — органичная констелляция (по референсу), вытянутый холст 1100×1280.
// Узлы расставлены неровно, с большим вертикальным воздухом, чтобы лейблы
// не наезжали на иконки соседних узлов.
const ECO_NODES = [
// верхний пояс — источники (y: 7–28)
{ id: "deepcards", label: "Deep Cards", icon: "icons/deep-cards.png", layer: "sources", desc: "Глубинное самоисследование: открытые вопросы с интерпретацией. Помогает выявить скрытые паттерны, архетипы, защитные стратегии.", x: 50, y: 7 },
{ id: "checkin", label: "Трекер состояний", icon: "icons/tracker.png", layer: "sources", desc: "Состояние до и после каждой практики. Самый частый тип данных, показывающий эмоциональную динамику в реальном времени.", x: 23, y: 11 },
{ id: "diary", label: "Дневник", icon: "icons/journal.png", layer: "sources", desc: "Свободные записи и рефлексия. Персонализированные промпты. Источник тем, образов и эмоционального тона.", x: 77, y: 11 },
{ id: "practices", label: "Практики с Мастерами", icon: "icons/live-practices.png", layer: "sources", desc: "Какие практики посещаете, как часто, с какими Мастерами больше резонанса.", x: 50, y: 26 },
{ id: "dreams", label: "Дневник сновидений", icon: "icons/dreams.png", layer: "sources", desc: "Расшифровка снов. Повторяющиеся образы и символы обогащают профиль и питают сценарии Inner Lab.", x: 14, y: 27 },
{ id: "tests", label: "Тесты", icon: "icons/tests.png", layer: "sources", desc: "Специализированные тесты: черты личности, мотивация, тип восприятия.", x: 86, y: 26 },

// средний пояс — обработка, Inner Lab в центре (y: 40–58)
{ id: "profile", label: "Карта актуальных тем", icon: "icons/topic-map.png", layer: "processing", desc: "Динамический профиль: топ 3–5 тем, актуальных сейчас. Обновляется после каждого взаимодействия. Основа всей персонализации.", x: 31, y: 40 },
{ id: "patterns", label: "Распознавание паттернов", icon: "icons/pattern-recognition.png", layer: "processing", desc: "Скрытые повторы в эмоциях, реакциях, действиях. Видит то, что не заметить изнутри.", x: 69, y: 39 },
{ id: "innerlab", label: "Inner Lab", icon: "icons/inner-lab.png", layer: "processing", desc: "Символические сценарии для проживания инсайтов. Персонализируются по карте тем.", x: 50, y: 50 },
{ id: "reports", label: "AI-отчёты", icon: "icons/ai-reports.png", layer: "processing", desc: "Сквозная аналитика: эмоциональные тренды, корреляции практик и состояний, расхождения рефлексии и действий.", x: 16, y: 53 },
{ id: "recommendations", label: "Рекомендации", icon: "icons/recommendations.png", layer: "processing", desc: "Персонализированный подбор практик, Мастеров и сцен Inner Lab по текущему состоянию.", x: 84, y: 54 },

// нижний пояс — ценность (y: 70–93)
{ id: "knowdogap", label: "Мост «знаю → делаю»", icon: "icons/bridge.png", layer: "outcomes", desc: "Главный разрыв: понимаю паттерн, но не могу изменить. Inner Lab и микро-задания — поведенческая репетиция в безопасной среде.", x: 50, y: 70 },
{ id: "blindspots", label: "Слепые зоны", icon: "icons/blind-spots.png", layer: "outcomes", desc: "То, что не видно изнутри: расхождение между дневником и реакцией в символических сценариях.", x: 23, y: 73 },
{ id: "emotional", label: "Эмоциональная сознательность", icon: "icons/emotional-literacy.png", layer: "outcomes", desc: "«Не могу назвать что чувствую» — трекер, дневник, Deep Cards формируют словарь внутренних состояний.", x: 77, y: 75 },
{ id: "integration", label: "Интеграция инсайтов", icon: "icons/insight-integration.png", layer: "outcomes", desc: "Знание без действия — информационный шум. Уникальный цикл: инсайты по актуальным темам попадают в Inner Lab.", x: 36, y: 89 },
{ id: "selfmap", label: "Карта себя", icon: "icons/self-map.png", layer: "outcomes", desc: "Все данные складываются в целостную картину: кто вы, куда движетесь, что триггерит, что помогает. Карта меняется вместе с вами.", x: 64, y: 91 }];


const ECO_EDGES = [
{ from: "checkin", to: "profile" }, { from: "checkin", to: "patterns" },
{ from: "deepcards", to: "profile" }, { from: "deepcards", to: "patterns" }, { from: "deepcards", to: "innerlab" },
{ from: "diary", to: "profile" }, { from: "diary", to: "patterns" }, { from: "diary", to: "reports" },
{ from: "dreams", to: "profile" }, { from: "dreams", to: "innerlab" },
{ from: "tests", to: "profile" }, { from: "tests", to: "recommendations" },
{ from: "practices", to: "patterns" }, { from: "practices", to: "reports" }, { from: "practices", to: "recommendations" },
{ from: "profile", to: "innerlab" }, { from: "profile", to: "recommendations" },
{ from: "patterns", to: "reports" }, { from: "patterns", to: "innerlab" },
{ from: "innerlab", to: "knowdogap" }, { from: "innerlab", to: "blindspots" }, { from: "innerlab", to: "integration" },
{ from: "reports", to: "blindspots" }, { from: "reports", to: "selfmap" },
{ from: "patterns", to: "blindspots" }, { from: "patterns", to: "emotional" },
{ from: "recommendations", to: "integration" },
{ from: "profile", to: "selfmap" },
{ from: "knowdogap", to: "diary", dashed: true },
{ from: "integration", to: "checkin", dashed: true },
{ from: "selfmap", to: "practices", dashed: true }];


const ECO_LAYER_META = {
  sources: { label: "Источники данных", color: "var(--teal)", soft: "var(--teal-soft)" },
  processing: { label: "Обработка", color: "var(--lavender)", soft: "var(--lavender)" },
  outcomes: { label: "Ценность", color: "var(--amber)", soft: "var(--amber-soft)" }
};

function curvePath(a, b) {
  // bezier curve from a to b — control point shifted perpendicular to the line
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x,dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular offset
  const nx = -dy / len,ny = dx / len;
  const k = Math.min(8, len * 0.08);
  const cx = mx + nx * k;
  const cy = my + ny * k;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function EcosystemOrbital({ grain = true }) {
  const [active, setActive] = React.useState(null);
  const [filter, setFilter] = React.useState("all");

  const byId = React.useMemo(() => {
    const m = {};
    ECO_NODES.forEach((n) => {m[n.id] = n;});
    return m;
  }, []);

  const connectedIds = active ?
  new Set([
  active,
  ...ECO_EDGES.filter((e) => e.from === active || e.to === active).map((e) => e.from === active ? e.to : e.from)]
  ) :
  null;

  const isNodeVisible = (n) => filter === "all" || n.layer === filter;
  const isEdgeVisible = (e) => {
    const f = byId[e.from],t = byId[e.to];
    if (!f || !t) return false;
    if (filter !== "all" && f.layer !== filter && t.layer !== filter) return false;
    return true;
  };
  const isEdgeHi = (e) => active && (e.from === active || e.to === active);
  const activeNode = active ? byId[active] : null;

  const FILTERS = [
  { key: "all", label: "Все слои", color: null },
  { key: "sources", label: "Источники данных", color: ECO_LAYER_META.sources.color },
  { key: "processing", label: "Обработка", color: ECO_LAYER_META.processing.color },
  { key: "outcomes", label: "Ценность", color: ECO_LAYER_META.outcomes.color }];


  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "60px 56px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <span className="eyebrow">01 · Экосистема <span className="velo-mark">VEL<span className="theta">Θ</span></span></span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 4vw, 56px)", marginTop: 14, maxWidth: "20ch" }}>
              Связи, которые сложно увидеть <em>изнутри</em>
            </h2>
            <p style={{
              marginTop: 18,
              maxWidth: "56ch",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(17px, 1.3vw, 20px)",
              lineHeight: 1.5,
              color: "color-mix(in oklch, var(--deep) 72%, transparent)"
            }}>
              Пространство, в&nbsp;котором различные инструменты и&nbsp;методологии работают вместе с&nbsp;вами. Данные, практики и&nbsp;жизнь пользователя&nbsp;— переплетаются в&nbsp;единую систему осознанности.
            </p>
          </div>
          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end", flex: "0 1 auto" }}>
            {FILTERS.map((f) => {
              const active2 = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => {setFilter(f.key);setActive(null);}}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: active2 ? "1px solid var(--deep)" : "1px solid color-mix(in oklch, var(--deep) 14%, transparent)",
                    background: active2 ? "var(--deep)" : "color-mix(in oklch, white 50%, transparent)",
                    color: active2 ? "var(--deep-foreground)" : "color-mix(in oklch, var(--deep) 75%, transparent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 200ms ease"
                  }}>
                  
                  {f.color && !active2 &&
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: f.color }} />
                  }
                  {f.label}
                </button>);

            })}
          </div>
        </div>

        {/* Map */}
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          {/* Layer zones — soft auras instead of flat blocks.
                  Boundaries match the constellation layout. */}
          {[
          { layer: "sources", top: "0%", height: "33%" },
          { layer: "processing", top: "33%", height: "29%" },
          { layer: "outcomes", top: "62%", height: "38%" }].
          map((z) =>
          <div key={z.layer} style={{
            position: "absolute",
            left: 0, right: 0,
            top: z.top, height: z.height,
            borderRadius: 24,
            background: `linear-gradient(180deg, color-mix(in oklch, ${ECO_LAYER_META[z.layer].soft} 14%, transparent) 0%, color-mix(in oklch, ${ECO_LAYER_META[z.layer].soft} 4%, transparent) 100%)`,
            opacity: filter === "all" || filter === z.layer ? 1 : 0.25,
            transition: "opacity 300ms ease",
            pointerEvents: "none"
          }} />
          )}

          {/* Layer labels — в левом верхнем углу каждого пояса */}
          {[
          { layer: "sources", top: "1.5%" },
          { layer: "processing", top: "34.5%" },
          { layer: "outcomes", top: "63.5%" }].
          map((z) =>
          <div key={z.layer} style={{
            position: "absolute",
            left: 16,
            top: z.top,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: ECO_LAYER_META[z.layer].color,
            opacity: filter === "all" || filter === z.layer ? 0.7 : 0.15,
            transition: "opacity 300ms ease",
            pointerEvents: "none"
          }}>
              · {ECO_LAYER_META[z.layer].label} ·
            </div>
          )}

          {/* SVG edges */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1
          }}>
            {ECO_EDGES.map((e, i) => {
              const f = byId[e.from],t = byId[e.to];
              if (!isEdgeVisible(e)) return null;
              const hi = isEdgeHi(e);
              return (
                <path
                  key={i}
                  d={curvePath(f, t)}
                  fill="none"
                  stroke={hi ? "var(--amber)" : "color-mix(in oklch, var(--deep) 35%, transparent)"}
                  strokeWidth={hi ? 0.45 : 0.18}
                  opacity={active ? hi ? 0.85 : 0.06 : 0.28}
                  strokeDasharray={e.dashed ? "1.2 1.6" : hi ? "none" : "0.8 1.5"}
                  style={{ transition: "opacity 400ms ease, stroke-width 200ms ease, stroke 200ms ease" }}
                  vectorEffect="non-scaling-stroke" />);


            })}
          </svg>

          {/* Nodes */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            {ECO_NODES.map((node) => {
              const visible = isNodeVisible(node);
              const isAct = active === node.id;
              const isConn = connectedIds ? connectedIds.has(node.id) : true;
              const meta = ECO_LAYER_META[node.layer];
              return (
                <button
                  key={node.id}
                  onClick={() => setActive(isAct ? null : node.id)}
                  style={{
                    position: "absolute",
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: `translate(-50%, -50%) scale(${!visible ? 0.55 : active && !isConn ? 0.85 : 1})`,
                    opacity: !visible ? 0.06 : active && !isConn ? 0.18 : 1,
                    pointerEvents: visible ? "auto" : "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "opacity 400ms ease, transform 400ms cubic-bezier(.2,.7,.3,1)", lineHeight: "0.94"
                  }}>
                  
                  {/* glow */}
                  <span style={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: 999,
                    background: meta.color,
                    opacity: isAct ? 0.18 : 0,
                    filter: "blur(14px)",
                    transition: "opacity 300ms ease",
                    pointerEvents: "none"
                  }} />
                  <span style={{
                    position: "relative",
                    width: 56, height: 56,
                    borderRadius: 999,
                    background: "white",
                    border: `1.5px solid ${isAct ? meta.color : "color-mix(in oklch, var(--deep) 18%, transparent)"}`,
                    boxShadow: isAct ?
                    "0 6px 20px -8px color-mix(in oklch, var(--deep) 30%, transparent)" :
                    "0 2px 6px -2px color-mix(in oklch, var(--deep) 18%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: isAct ? "scale(1.08)" : "scale(1)",
                    transition: "transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease"
                  }}>
                    <img
                      src={node.icon}
                      alt=""
                      style={{ width: 28, height: 28, objectFit: "contain" }} />
                    
                  </span>
                  <span style={{
                    fontSize: 11.5,
                    lineHeight: 1.25,
                    textAlign: "center",
                    color: isAct ? "var(--deep)" : "color-mix(in oklch, var(--deep) 75%, transparent)",
                    fontWeight: isAct ? 500 : 400,
                    maxWidth: 110,
                    letterSpacing: "0.005em",
                    marginTop: 2
                  }}>
                    {node.label}
                  </span>
                </button>);

            })}
          </div>
        </div>

        {/* Description panel — fixed footer */}
        <div style={{
          minHeight: 110,
          display: "flex",
          alignItems: "stretch"
        }}>
          {activeNode ?
          <div className="glass" style={{
            borderRadius: 18,
            background: "color-mix(in oklch, white 55%, var(--soft))",
            padding: "18px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: 18,
            width: "100%"
          }}>
              <span style={{
              width: 44, height: 44,
              borderRadius: 999,
              background: "white",
              border: `1.5px solid ${ECO_LAYER_META[activeNode.layer].color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
                <img src={activeNode.icon} alt="" style={{ width: 22, height: 22 }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--deep)"
                }}>{activeNode.label}</span>
                  <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: `color-mix(in oklch, ${ECO_LAYER_META[activeNode.layer].color} 14%, transparent)`,
                  color: ECO_LAYER_META[activeNode.layer].color,
                  padding: "3px 10px",
                  borderRadius: 999
                }}>{ECO_LAYER_META[activeNode.layer].label}</span>
                </div>
                <p style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "color-mix(in oklch, var(--deep) 72%, transparent)",
                margin: 0,
                maxWidth: "76ch"
              }}>{activeNode.desc}</p>
              </div>
              <button
              onClick={() => setActive(null)}
              aria-label="Закрыть"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 18, color: "color-mix(in oklch, var(--deep) 50%, transparent)",
                flexShrink: 0, padding: 4
              }}>
              ×</button>
            </div> :

          <p style={{
            alignSelf: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "color-mix(in oklch, var(--deep) 50%, transparent)",
            textAlign: "center",
            width: "100%",
            margin: 0
          }}>
              · Нажмите на узел, чтобы увидеть описание и связи ·
            </p>
          }
        </div>
      </div>
    </div>);

}

window.EcosystemOrbital = EcosystemOrbital;
window.ECO_NODES = ECO_NODES;
window.ECO_EDGES = ECO_EDGES;
window.ECO_LAYER_META = ECO_LAYER_META;