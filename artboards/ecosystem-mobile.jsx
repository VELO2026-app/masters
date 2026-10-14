/* global React, ReactDOM */
// Reads window.ECO_NODES / ECO_EDGES / ECO_LAYER_META from ecosystem.jsx

// ─────────────────────────────────────────────────────────────────
// EcosystemMobile — pan/zoom adaptation of the orbital constellation.
// 1 finger = pan; 2 fingers = pinch-zoom. Tap a node = highlight + card.
// Tap empty area = clear. "↻" button resets the view.
// First-open hint disappears on first interaction.
// ─────────────────────────────────────────────────────────────────

function EcosystemMobile({ grain = true }) {
  const { useState, useRef, useEffect } = React;
  const ECO_NODES = window.ECO_NODES || [];
  const ECO_EDGES = window.ECO_EDGES || [];
  const ECO_LAYER_META = window.ECO_LAYER_META || {
    sources: {}, processing: {}, outcomes: {}
  };
  const [active, setActive] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [hintVisible, setHintVisible] = useState(true);

  // Inner canvas size — same as desktop layout reference (1100 × 1280).
  // We render the canvas at this fixed size and scale/translate it.
  const W = 1100;
  const H = 1280;

  // Initial fit: show full canvas centered.
  // The viewport is the wrapper (≈ 360 wide, 600 tall on phone).
  const fitToView = (vw, vh) => {
    const sx = vw / W;
    const sy = vh / H;
    const s = Math.min(sx, sy) * 0.96;
    const x = (vw - W * s) / 2;
    const y = (vh - H * s) / 2;
    return { x, y, s };
  };

  const wrapRef = useRef(null);
  const [view, setView] = useState({ x: 0, y: 0, s: 0.3 });
  const viewRef = useRef(view);
  viewRef.current = view;

  // Initial fit once mounted
  useEffect(() => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setView(fitToView(r.width, r.height));
  }, []);

  const reset = () => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setView(fitToView(r.width, r.height));
    setActive(null);
  };

  // ─── Touch / mouse pan + pinch zoom ────────────────────────────────
  const gestureRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const dist = (t1, t2) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const mid = (t1, t2) => ({
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    });

    const onTouchStart = (e) => {
      if (hintVisible) setHintVisible(false);
      if (e.touches.length === 1) {
        const t = e.touches[0];
        gestureRef.current = {
          mode: "pan",
          startX: t.clientX,
          startY: t.clientY,
          baseView: { ...viewRef.current },
          moved: false,
        };
      } else if (e.touches.length === 2) {
        const d = dist(e.touches[0], e.touches[1]);
        const m = mid(e.touches[0], e.touches[1]);
        gestureRef.current = {
          mode: "pinch",
          startDist: d,
          startMid: m,
          baseView: { ...viewRef.current },
          moved: true,
        };
      }
    };

    const onTouchMove = (e) => {
      const g = gestureRef.current;
      if (!g) return;
      if (g.mode === "pan" && e.touches.length === 1) {
        const t = e.touches[0];
        const dx = t.clientX - g.startX;
        const dy = t.clientY - g.startY;
        if (Math.abs(dx) + Math.abs(dy) > 4) g.moved = true;
        setView({
          x: g.baseView.x + dx,
          y: g.baseView.y + dy,
          s: g.baseView.s,
        });
        e.preventDefault();
      } else if (g.mode === "pinch" && e.touches.length === 2) {
        const d = dist(e.touches[0], e.touches[1]);
        const m = mid(e.touches[0], e.touches[1]);
        const rect = el.getBoundingClientRect();
        // Mid in element coords
        const mx = m.x - rect.left;
        const my = m.y - rect.top;
        // Scale change relative to baseView
        const k = d / g.startDist;
        let s = g.baseView.s * k;
        s = Math.max(0.18, Math.min(1.6, s));
        // Keep the midpoint stable: solve for new x/y so that
        // (mx - x)/s_new = (mx - x_base)/s_base when applied at gesture start
        const startMx = g.startMid.x - rect.left;
        const startMy = g.startMid.y - rect.top;
        const worldX = (startMx - g.baseView.x) / g.baseView.s;
        const worldY = (startMy - g.baseView.y) / g.baseView.s;
        const x = mx - worldX * s;
        const y = my - worldY * s;
        setView({ x, y, s });
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      // Tap (no movement, single finger) is handled per-node; nothing here.
      if (e.touches.length === 0) gestureRef.current = null;
      else if (e.touches.length === 1) {
        // Lift one finger out of pinch — switch to pan with new anchor
        const t = e.touches[0];
        gestureRef.current = {
          mode: "pan",
          startX: t.clientX,
          startY: t.clientY,
          baseView: { ...viewRef.current },
          moved: true,
        };
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [hintVisible]);

  // ─── Derived data — same logic as desktop ──────────────────────────
  const byId = Object.fromEntries(ECO_NODES.map((n) => [n.id, n]));
  const isNodeVisible = (n) => filter === "all" || n.layer === filter;
  const isEdgeVisible = (e) => {
    if (filter === "all") return true;
    return byId[e.from]?.layer === filter || byId[e.to]?.layer === filter;
  };
  const isEdgeHi = (e) => active && (e.from === active || e.to === active);
  const activeNode = active ? byId[active] : null;

  const FILTERS = [
    { key: "all", label: "Все", color: null },
    { key: "sources", label: "Источники", color: ECO_LAYER_META.sources?.color },
    { key: "processing", label: "Обработка", color: ECO_LAYER_META.processing?.color },
    { key: "outcomes", label: "Ценность", color: ECO_LAYER_META.outcomes?.color },
  ];

  const onNodeTap = (e, id) => {
    e.stopPropagation();
    // Suppress tap if a pan gesture moved
    if (gestureRef.current?.moved) {
      // Reset so subsequent stationary taps work
      if (gestureRef.current) gestureRef.current.moved = false;
      return;
    }
    if (active === id) {
      setActive(null);
      setDetailOpen(false);
    } else {
      setActive(id);
      setDetailOpen(false);
    }
  };

  return (
    <div className={`surface ${grain ? "grain" : ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div>
          <span className="eyebrow">
            01 · Экосистема{" "}
            <span className="velo-mark">
              VEL<span className="theta">Θ</span>
            </span>
          </span>
          <h2
            className="display"
            style={{
              fontSize: "clamp(28px, 8vw, 36px)",
              marginTop: 12,
              lineHeight: 1.08,
            }}>
            Связи, которые сложно увидеть <em>изнутри</em>
          </h2>
          <p
            style={{
              marginTop: 14,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.5,
              color: "color-mix(in oklch, var(--deep) 72%, transparent)",
            }}>
            Данные, практики и&nbsp;жизнь&nbsp;— переплетаются в&nbsp;единую систему осознанности.
          </p>
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            margin: "0 -22px",
            padding: "0 22px 4px",
            scrollbarWidth: "none",
          }}>
          {FILTERS.map((f) => {
            const active2 = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setActive(null);
                }}
                style={{
                  flex: "0 0 auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 999,
                  border: active2
                    ? "1px solid var(--deep)"
                    : "1px solid color-mix(in oklch, var(--deep) 14%, transparent)",
                  background: active2
                    ? "var(--deep)"
                    : "color-mix(in oklch, white 50%, transparent)",
                  color: active2
                    ? "var(--deep-foreground)"
                    : "color-mix(in oklch, var(--deep) 75%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                {f.color && !active2 && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 999,
                      background: f.color,
                    }}
                  />
                )}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Pan-zoom viewport */}
        <div
          ref={wrapRef}
          onClick={() => {
            const moved = gestureRef.current?.moved;
            if (gestureRef.current) gestureRef.current.moved = false;
            if (!moved) {
              setActive(null);
              setDetailOpen(false);
            }
          }}
          style={{
            position: "relative",
            width: "100%",
            height: 580,
            borderRadius: 18,
            overflow: "hidden",
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--soft) 60%, white) 0%, var(--soft) 100%)",
            border: "1px solid color-mix(in oklch, var(--deep) 8%, transparent)",
            touchAction: "none",
            cursor: "grab",
          }}>
          {/* Inner fixed-size canvas */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: H,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
              transformOrigin: "0 0",
              willChange: "transform",
            }}>
            {/* Layer zones */}
            {[
              { layer: "sources", top: "0%", height: "33%" },
              { layer: "processing", top: "33%", height: "29%" },
              { layer: "outcomes", top: "62%", height: "38%" },
            ].map((z) => (
              <div
                key={z.layer}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: z.top,
                  height: z.height,
                  borderRadius: 24,
                  background: `linear-gradient(180deg, color-mix(in oklch, ${ECO_LAYER_META[z.layer].soft} 14%, transparent) 0%, color-mix(in oklch, ${ECO_LAYER_META[z.layer].soft} 4%, transparent) 100%)`,
                  opacity:
                    filter === "all" || filter === z.layer ? 1 : 0.25,
                  transition: "opacity 300ms ease",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Layer labels */}
            {[
              { layer: "sources", top: "1.5%" },
              { layer: "processing", top: "34.5%" },
              { layer: "outcomes", top: "63.5%" },
            ].map((z) => (
              <div
                key={z.layer}
                style={{
                  position: "absolute",
                  left: 16,
                  top: z.top,
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: ECO_LAYER_META[z.layer].color,
                  opacity:
                    filter === "all" || filter === z.layer ? 0.7 : 0.15,
                  transition: "opacity 300ms ease",
                  pointerEvents: "none",
                }}>
                · {ECO_LAYER_META[z.layer].label} ·
              </div>
            ))}

            {/* Edges */}
            <svg
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}>
              {ECO_EDGES.map((e, i) => {
                const a = byId[e.from];
                const b = byId[e.to];
                if (!a || !b) return null;
                const visible = isEdgeVisible(e);
                const hi = isEdgeHi(e);
                const dim = active && !hi;
                const x1 = (a.x / 100) * W;
                const y1 = (a.y / 100) * H;
                const x2 = (b.x / 100) * W;
                const y2 = (b.y / 100) * H;
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2 - 30;
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    stroke={
                      hi
                        ? ECO_LAYER_META[a.layer].color
                        : "color-mix(in oklch, var(--deep) 22%, transparent)"
                    }
                    strokeWidth={hi ? 3 : 1.5}
                    strokeDasharray={e.kind === "back" ? "4 4" : "0"}
                    fill="none"
                    opacity={!visible ? 0 : dim ? 0.1 : hi ? 0.85 : 0.45}
                    style={{ transition: "all 300ms ease" }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {ECO_NODES.map((n) => {
              const visible = isNodeVisible(n);
              const isActive = active === n.id;
              const isNeighbor =
                active &&
                !isActive &&
                ECO_EDGES.some(
                  (e) =>
                    (e.from === active && e.to === n.id) ||
                    (e.to === active && e.from === n.id),
                );
              const dim = active && !isActive && !isNeighbor;
              const c = ECO_LAYER_META[n.layer].color;
              return (
                <button
                  key={n.id}
                  onClick={(e) => onNodeTap(e, n.id)}
                  style={{
                    position: "absolute",
                    left: `${n.x}%`,
                    top: `${n.y}%`,
                    transform: `translate(-50%, -50%) scale(${
                      !visible ? 0.55 : isActive ? 1.1 : 1
                    })`,
                    transition: "all 320ms cubic-bezier(.2,.7,.2,1)",
                    opacity: !visible ? 0.18 : dim ? 0.3 : 1,
                    background: "transparent",
                    border: "0",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    width: 130,
                  }}>
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background:
                        "color-mix(in oklch, var(--soft) 90%, white)",
                      border: isActive
                        ? `2px solid ${c}`
                        : `1.5px solid color-mix(in oklch, ${c} 30%, transparent)`,
                      boxShadow: isActive
                        ? `0 0 0 6px color-mix(in oklch, ${c} 18%, transparent), 0 8px 24px -8px color-mix(in oklch, ${c} 50%, transparent)`
                        : "0 1px 3px color-mix(in oklch, var(--deep) 10%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 320ms ease",
                    }}>
                    <img
                      src={n.icon}
                      alt=""
                      style={{ width: 36, height: 36, objectFit: "contain" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.15,
                      color: "var(--deep)",
                      textAlign: "center",
                      maxWidth: 130,
                      textWrap: "balance",
                    }}>
                    {n.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hint overlay */}
          {hintVisible && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                background:
                  "color-mix(in oklch, var(--soft) 60%, transparent)",
                backdropFilter: "blur(1px)",
                animation: "comet-fade 400ms ease both",
              }}>
              <div
                style={{
                  background: "color-mix(in oklch, white 80%, var(--soft))",
                  padding: "14px 18px",
                  borderRadius: 14,
                  border:
                    "1px solid color-mix(in oklch, var(--deep) 12%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklch, var(--deep) 70%, transparent)",
                  textAlign: "center",
                  lineHeight: 1.5,
                  boxShadow:
                    "0 8px 24px -10px color-mix(in oklch, var(--deep) 30%, transparent)",
                }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: "var(--amber)" }}>✦</span> Карта себя
                </div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>
                  Двиньте · сведите пальцы · нажмите узел
                </div>
              </div>
            </div>
          )}

          {/* Reset button */}
          <button
            type="button"
            onClick={reset}
            aria-label="Сбросить вид"
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              width: 40,
              height: 40,
              borderRadius: 999,
              border:
                "1px solid color-mix(in oklch, var(--deep) 12%, transparent)",
              background: "color-mix(in oklch, white 85%, var(--soft))",
              color: "var(--deep)",
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              cursor: "pointer",
              boxShadow:
                "0 4px 12px -4px color-mix(in oklch, var(--deep) 25%, transparent)",
            }}>
            ↻
          </button>

          {/* Floating "Подробнее" pill anchored to active node */}
          {activeNode && !detailOpen && (() => {
            // Project the node's % position onto the screen viewport,
            // accounting for pan/zoom transform.
            const px = (activeNode.x / 100) * W * view.s + view.x;
            const py = (activeNode.y / 100) * H * view.s + view.y;
            // The viewport (wrapRef) is 580px tall, ~360px wide. We anchor
            // the pill 56px above the node center; if that goes off-top,
            // anchor below instead. Clamp horizontally.
            const wrapW = wrapRef.current?.getBoundingClientRect().width || 360;
            const wrapH = 580;
            const above = py > 80;
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailOpen(true);
                }}
                style={{
                  position: "absolute",
                  left: Math.max(12, Math.min(wrapW - 144, px - 60)),
                  top: above ? Math.max(8, py - 56) : Math.min(wrapH - 44, py + 44),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "1px solid color-mix(in oklch, var(--deep) 14%, transparent)",
                  background: "color-mix(in oklch, var(--soft) 88%, white)",
                  color: "var(--deep)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px -8px color-mix(in oklch, var(--deep) 35%, transparent)",
                  animation: "comet-rise 240ms ease both",
                  whiteSpace: "nowrap",
                }}>
                <span style={{
                  width: 5, height: 5, borderRadius: 999,
                  background: ECO_LAYER_META[activeNode.layer].color
                }} />
                Подробнее →
              </button>
            );
          })()}
        </div>

        {/* Detail bottom-sheet — floats over the whole page (portal, so no
            section z-index can paint over it) */}
        {activeNode && detailOpen && ReactDOM.createPortal(
          <>
            <div
              onClick={() => setDetailOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9990,
                background: "color-mix(in oklch, var(--deep) 30%, transparent)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                animation: "comet-fade 200ms ease both",
              }}
            />
            <div
              role="dialog"
              aria-label={activeNode.label}
              style={{
                position: "fixed",
                left: 12, right: 12,
                bottom: 12,
                zIndex: 9991,
                padding: "22px 22px 24px",
                borderRadius: 18,
                background: "color-mix(in oklch, var(--soft) 96%, white)",
                border: "1px solid color-mix(in oklch, var(--deep) 12%, transparent)",
                boxShadow: "0 24px 60px -20px color-mix(in oklch, var(--deep) 40%, transparent)",
                animation: "comet-rise 320ms cubic-bezier(.2,.7,.2,1) both",
                fontFamily: "var(--font-sans)",
              }}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 14, gap: 12,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: ECO_LAYER_META[activeNode.layer].color,
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 999,
                    background: ECO_LAYER_META[activeNode.layer].color,
                  }} />
                  {ECO_LAYER_META[activeNode.layer].label}
                </div>
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  aria-label="Закрыть"
                  style={{
                    width: 32, height: 32, padding: 0,
                    borderRadius: 999, border: 0, background: "transparent",
                    color: "color-mix(in oklch, var(--deep) 60%, transparent)",
                    fontSize: 22, lineHeight: 1, cursor: "pointer",
                  }}>×</button>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "color-mix(in oklch, var(--soft) 80%, white)",
                  border: `1.5px solid color-mix(in oklch, ${ECO_LAYER_META[activeNode.layer].color} 30%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flex: "0 0 auto",
                }}>
                  <img src={activeNode.icon} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 22,
                  lineHeight: 1.15,
                  color: "var(--deep)",
                }}>
                  {activeNode.label}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.55,
                color: "color-mix(in oklch, var(--deep) 75%, transparent)",
              }}>
                {activeNode.desc}
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </div>
  );
}

window.EcosystemMobile = EcosystemMobile;
