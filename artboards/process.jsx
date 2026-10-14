/* global React */

// ─────────────────────────────────────────────────────────────────
// PROCESS VARIANTS — карта-маршрут с линией (4 шага)
// ─────────────────────────────────────────────────────────────────

const STEPS = [
  { n: "I",   title: "Напишите нам",     body: "Короткое сообщение в Telegram — кто вы, что практикуете, что важно." },
  { n: "II",  title: "Знакомство",       body: "Созвон 30–40 минут. Уточняем детали, проверяем совпадение ценностей." },
  { n: "III", title: "Онбординг",        body: "Помогаем оформить пространство Мастера: профиль, расписание, материалы." },
  { n: "IV",  title: "Первая практика",  body: "Ведёте первую сессию. Мы рядом — поддерживаем и собираем обратную связь." },
];

// Variant A — Horizontal river: ОДНА непрерывная волна, которая каждым своим
// «гребнем» касается тангенциально соответствующего кружка (I — снизу, II — сверху,
// III — снизу, IV — сверху). Линия не пересекает ни одну цифру.
function ProcessRiver({ grain = true }) {
  // viewBox 0 0 1200 420. Sigil radius = 30.
  const SIGILS = [
    { x: 150,  y: 110, n: "I"   },  // верхний — линия касается снизу (y=140)
    { x: 470,  y: 310, n: "II"  },  // нижний — линия касается сверху (y=280)
    { x: 760,  y: 110, n: "III" },  // верхний — снизу (y=140)
    { x: 1060, y: 310, n: "IV"  },  // нижний — сверху (y=280)
  ];
  // Непрерывная Bezier-волна. На каждой точке касания control-points горизонтальны
  // (одинаковая y), что гарантирует, что линия не входит внутрь кружка, а аккуратно
  // прижимается к его краю.
  const RIVER_D = `
    M 30 90
    C 80 90, 110 140, 150 140
    C 240 140, 360 280, 470 280
    C 580 280, 660 140, 760 140
    C 870 140, 970 280, 1060 280
    C 1130 280, 1180 340, 1180 340
  `;

  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "80px 60px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48, height: "100%" }}>
        <div>
          <span className="eyebrow" style={{ marginBottom: 16, display: "inline-flex" }}>02 · Как это работает</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 4.5vw, 64px)", marginTop: 16, maxWidth: "20ch" }}>
            Четыре шага — от&nbsp;знакомства до&nbsp;<em>старта</em>
          </h2>
        </div>

        <div className="river-canvas" style={{ position: "relative", width: "100%", maxWidth: 1200, marginInline: "auto", aspectRatio: "1200 / 420", paddingTop: 8 }}>
          <svg className="river-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid meet" style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}>
            <defs>
              <linearGradient id="riverA" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%"  stopColor="var(--amber-soft)" />
                <stop offset="50%" stopColor="var(--rose)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--teal-soft)" />
              </linearGradient>
            </defs>
            <path d={RIVER_D} stroke="url(#riverA)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d={RIVER_D} stroke="color-mix(in oklch, var(--deep) 22%, transparent)" strokeWidth="0.7" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
          </svg>

          {/* Узлы и подписи */}
          <div className="river-nodes" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            {SIGILS.map((s, i) => {
              const xPct = (s.x / 1200) * 100;
              const yPct = (s.y / 420) * 100;
              const labelBelow = s.y < 200;
              return (
                <div key={s.n} className="river-node" style={{ position: "absolute", left: `${xPct}%`, top: `${yPct}%`, transform: "translate(-50%, -50%)" }}>
                  <div className="sigil" style={{ fontStyle: "italic", position: "relative", zIndex: 2 }}>{s.n}</div>
                  <div className="river-label" style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 220,
                    textAlign: "center",
                    [labelBelow ? "top" : "bottom"]: "calc(100% + 18px)",
                    pointerEvents: "none",
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--deep)", marginBottom: 6 }}>{STEPS[i].title}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: "color-mix(in oklch, var(--deep) 65%, transparent)", margin: 0, maxWidth: "24ch", marginInline: "auto" }}>{STEPS[i].body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Variant B — Vertical pilgrimage: trail meandering down with stations
function ProcessPilgrimage({ grain = true }) {
  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "80px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: 12 }}>
          <span className="eyebrow" style={{ marginBottom: 20 }}>02 · Как это работает</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 4.5vw, 64px)", maxWidth: "16ch" }}>
            Тропа от&nbsp;первого письма до&nbsp;<em>первой практики</em>
          </h2>
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 19,
            lineHeight: 1.55,
            color: "color-mix(in oklch, var(--deep) 65%, transparent)",
            marginTop: 28,
            maxWidth: "32ch",
          }}>
            Не воронка, а&nbsp;путь — каждый шаг можно пройти в&nbsp;своём темпе.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <svg className="trail-svg" viewBox="0 0 400 600" preserveAspectRatio="none" style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}>
            <path
              d="M 90 40 C 220 90, 60 200, 200 260 S 360 360, 200 430 S 50 540, 200 580"
              stroke="color-mix(in oklch, var(--amber) 75%, transparent)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 6"
            />
            <path
              d="M 90 40 C 220 90, 60 200, 200 260 S 360 360, 200 430 S 50 540, 200 580"
              stroke="color-mix(in oklch, var(--amber) 35%, transparent)"
              strokeWidth="6"
              fill="none"
              filter="blur(8px)"
            />
          </svg>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 18, height: "100%", justifyContent: "space-between" }}>
            {STEPS.map((s, i) => {
              const positions = [
                { left: "10%", top: 0 },
                { left: "40%", top: 0 },
                { left: "65%", top: 0 },
                { left: "35%", top: 0 },
              ];
              return (
                <div key={s.n} className="glass trail-card" style={{
                  alignSelf: ["flex-start","flex-end","flex-start","flex-end"][i],
                  width: "62%",
                  padding: "16px 20px",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}>
                  <div className="sigil" style={{ width: 36, height: 36, fontSize: 12, fontStyle: "italic", flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: "color-mix(in oklch, var(--deep) 65%, transparent)", margin: 0 }}>{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Variant C — Constellation map: nodes connected over a starfield background
function ProcessConstellation({ grain = true }) {
  return (
    <div className={`surface deep ${grain ? "grain" : ""}`} style={{ padding: "80px 60px", color: "var(--deep-foreground)" }}>
      {/* starfield */}
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35,
      }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 73) % 1200;
          const y = (i * 47) % 800;
          const r = (i % 3) * 0.4 + 0.5;
          return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.4 + (i % 4) * 0.15} />;
        })}
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 40, height: "100%" }}>
        <div>
          <span className="eyebrow" style={{ color: "color-mix(in oklch, var(--deep-foreground) 70%, transparent)" }}>02 · Как это работает</span>
          <h2 className="display" style={{
            fontSize: "clamp(40px, 4.5vw, 64px)",
            color: "var(--deep-foreground)",
            marginTop: 16,
            maxWidth: "20ch",
          }}>
            Созвездие из&nbsp;четырёх <em style={{ color: "var(--amber-soft)" }}>шагов</em>
          </h2>
        </div>

        <div style={{ position: "relative", flex: 1 }}>
          <svg className="const-lines" viewBox="0 0 1000 320" preserveAspectRatio="none" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
          }}>
            {/* connecting lines between stations */}
            <line x1="120" y1="240" x2="380" y2="80"  stroke="color-mix(in oklch, var(--amber) 70%, transparent)" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="380" y1="80"  x2="640" y2="200" stroke="color-mix(in oklch, var(--amber) 70%, transparent)" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="640" y1="200" x2="900" y2="60"  stroke="color-mix(in oklch, var(--amber) 70%, transparent)" strokeWidth="0.8" strokeDasharray="2 4" />
            {/* glow */}
            <circle cx="120" cy="240" r="6" fill="var(--amber)" />
            <circle cx="380" cy="80"  r="6" fill="var(--amber)" />
            <circle cx="640" cy="200" r="6" fill="var(--amber)" />
            <circle cx="900" cy="60"  r="6" fill="var(--amber)" />
          </svg>

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, height: "100%" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="const-station" style={{
                paddingTop: [220, 90, 180, 80][i],
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--amber-soft)",
                }}>СТАНЦИЯ {s.n}</span>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--deep-foreground)",
                }}>{s.title}</div>
                <p style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "color-mix(in oklch, var(--deep-foreground) 70%, transparent)",
                  margin: 0,
                  maxWidth: "24ch",
                }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ProcessRiver = ProcessRiver;
window.ProcessPilgrimage = ProcessPilgrimage;
window.ProcessConstellation = ProcessConstellation;
