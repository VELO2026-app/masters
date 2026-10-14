/* global React */
const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────
// HERO VARIANTS — приглашение крупно
// ─────────────────────────────────────────────────────────────────

// SacredComet — медленно дрейфующая комета с шлейфом сакральных символов.
// Движение: сумма синусоид с разными частотами по x и y → плавная,
// но непредсказуемая траектория, без петель.
const SACRED_GLYPHS = ["✦", "✧", "✶", "✷", "❋", "✺", "⊕", "◯", "△", "▽", "⬡", "✸", "❉", "⚹"];

function SacredComet({ count = 14, speed = 1, color = "var(--amber)", opacity = 0.55 }) {
  const ref = useRef(null);
  const trailRef = useRef([]);
  const startRef = useRef(performance.now() + Math.random() * 1000);

  useEffect(() => {
    let raf;
    const step = (now) => {
      const t = (now - startRef.current) / 1000 * speed;
      // Organic drift — sum of 3 sine waves of different freqs
      const x =
        50 +
        24 * Math.sin(t * 0.13) +
        10 * Math.sin(t * 0.27 + 1.2) +
        6 * Math.sin(t * 0.61 + 0.4);
      const y =
        50 +
        20 * Math.cos(t * 0.11 + 0.8) +
        10 * Math.cos(t * 0.31 + 2.1) +
        6 * Math.sin(t * 0.49);

      trailRef.current.unshift({ x, y });
      if (trailRef.current.length > count) trailRef.current.length = count;

      const el = ref.current;
      if (el) {
        const children = el.children;
        for (let i = 0; i < count; i++) {
          const node = children[i];
          if (!node) continue;
          const p = trailRef.current[i];
          if (!p) { node.style.opacity = 0; continue; }
          const k = i / Math.max(1, count - 1);
          const fade = Math.pow(1 - k, 1.6);
          const scale = 0.4 + (1 - k) * 0.85;
          node.style.transform = `translate(${p.x}vw, ${p.y}vh) translate(-50%, -50%) scale(${scale})`;
          node.style.opacity = fade * opacity;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [count, speed, opacity]);

  return (
    <div ref={ref} style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      zIndex: 1, overflow: "hidden"
    }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const isHead = i === 0;
        return (
          <span key={i} style={{
            position: "absolute", left: 0, top: 0,
            willChange: "transform, opacity",
            fontSize: isHead ? 28 : Math.max(10, 22 - i * 0.6),
            color,
            filter: isHead ? `drop-shadow(0 0 18px ${color})` : `drop-shadow(0 0 6px ${color})`,
            transition: "opacity 200ms linear"
          }}>{SACRED_GLYPHS[i % SACRED_GLYPHS.length]}</span>
        );
      })}
    </div>
  );
}

function VeloMark() {
  // VELΘ wordmark — Bricolage Grotesque, weight contrast: VEL 500, Θ 300
  return (
    <span className="velo-mark">VEL<span className="theta">Θ</span></span>);

}

function NavBar({ deep = false }) {
  return (
    <div className="velo-nav">
      <img
        src="icons/velo-wordmark-extracted.png"
        alt="VELΘ"
        style={{
          height: 28,
          width: "auto",
          display: "block",
          filter: deep ? "none" : "brightness(0) saturate(100%) invert(11%) sepia(8%) saturate(632%) hue-rotate(11deg) brightness(94%) contrast(89%)",
        }}
      />
      <a className="btn btn-primary" href="https://t.me/masters_velo" target="_blank" rel="noopener noreferrer" style={deep ? { background: "var(--amber)", color: "var(--deep)", borderColor: "var(--amber)" } : null}>
        Telegram <span className="dot" style={deep ? { background: "var(--deep)" } : null}></span>
      </a>
    </div>);

}

// Hero A — Editorial: aura center, large "Рады вас видеть" with VELΘ as small mark above
function HeroEditorial({ aura = true, grain = true, noComet = false }) {
  return (
    <div className={`surface ${grain ? "grain" : ""}`}>
      {aura && <div className="aura" />}
      {!noComet && <SacredComet />}
      <NavBar />
      <div className="hero-content" style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 60px"
      }}>
        <span className="eyebrow-pill" style={{ marginBottom: 36 }}>
          <span className="dot" /> Для Мастеров
        </span>
        <h1 className="display" style={{
          fontSize: "clamp(56px, 6.4vw, 112px)",
          maxWidth: "16ch",
          lineHeight: 0.98,
          marginBottom: 28
        }}>
          Рады вас <em>видеть</em>!
        </h1>
        <p style={{
          fontSize: 18,
          lineHeight: 1.55,
          color: "color-mix(in oklch, var(--deep) 70%, transparent)",
          maxWidth: "60ch",
          marginBottom: 40
        }}>Приглашаем вас в развитие пространства VELΘ, созданного, чтобы общая работа стала более осознанной. Вы ведёте людей через трансформацию — мы даём инфраструктуру, которая делает эту работу глубже, безопаснее и более видимой. VELΘ — экосистема, где мастера проводят живые практики, видят то, что раньше было невидимым, и получают инструменты, которых нет ни у кого на рынке.

        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <a className="btn btn-primary" href="https://t.me/masters_velo" target="_blank" rel="noopener noreferrer"><span className="dot" /> Написать в&nbsp;Telegram</a>
          <a className="btn btn-ghost" href="#ecosystem">Узнать больше ↓</a>
        </div>
      </div>
    </div>);

}

// Hero B — Sacred geometry: large geometric sigil behind type
function HeroSacred({ aura = true, grain = true, noComet = false }) {
  return (
    <div className={`surface ${grain ? "grain" : ""}`}>
      {aura && <div className="aura" style={{
        background: `radial-gradient(45% 50% at 50% 50%, color-mix(in oklch, var(--amber-soft) 45%, transparent) 0%, transparent 65%)`
      }} />}
      {!noComet && <SacredComet count={12} opacity={0.45} />}
      <NavBar />

      {/* Sacred geometry — flower of life inspired, simple */}
      <svg className="hero-sigil-svg" viewBox="0 0 800 800" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(80vmin, 720px)",
        height: "min(80vmin, 720px)",
        zIndex: 1,
        opacity: 0.35
      }}>
        <defs>
          <radialGradient id="sg-fade" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="var(--deep)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--deep)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="url(#sg-fade)" strokeWidth="0.8">
          <circle cx="400" cy="400" r="160" />
          <circle cx="400" cy="240" r="160" />
          <circle cx="538" cy="320" r="160" />
          <circle cx="538" cy="480" r="160" />
          <circle cx="400" cy="560" r="160" />
          <circle cx="262" cy="480" r="160" />
          <circle cx="262" cy="320" r="160" />
          <circle cx="400" cy="400" r="280" strokeOpacity="0.6" />
          <circle cx="400" cy="400" r="340" strokeOpacity="0.3" strokeDasharray="2 8" />
        </g>
      </svg>

      <div className="hero-content" style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 60px"
      }}>
        <span className="eyebrow" style={{ marginBottom: 32 }}>
          ДЛЯ МАСТЕРОВ · ВОЛНА I
        </span>
        <h1 className="display" style={{
          fontSize: "clamp(56px, 6.6vw, 116px)",
          maxWidth: "14ch",
          marginBottom: 24,
          lineHeight: 0.97
        }}>
          Рады
          <br />
          вас <em>видеть</em>!
        </h1>
        <p style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          lineHeight: 1.5,
          color: "color-mix(in oklch, var(--deep) 65%, transparent)",
          maxWidth: "42ch",
          marginBottom: 40
        }}>
          Пространство для тех, кто ведёт других.
        </p>
        <a className="btn btn-primary" href="https://t.me/masters_velo" target="_blank" rel="noopener noreferrer"><span className="dot" /> Написать в&nbsp;Telegram</a>
      </div>
    </div>);

}

// Hero C — Cinematic deep: dark background, amber accents
function HeroCinematic({ aura = true, grain = true, noComet = false }) {
  return (
    <div className={`surface deep ${grain ? "grain" : ""}`}>
      {aura && <div className="aura" style={{
        background: `
          radial-gradient(45% 35% at 50% 40%, color-mix(in oklch, var(--amber) 30%, transparent) 0%, transparent 65%),
          radial-gradient(40% 50% at 20% 90%, color-mix(in oklch, var(--rose) 18%, transparent) 0%, transparent 60%),
          radial-gradient(50% 50% at 85% 90%, color-mix(in oklch, var(--teal) 14%, transparent) 0%, transparent 60%)`
      }} />}
      {!noComet && <SacredComet color="var(--amber)" opacity={0.7} />}
      <NavBar deep />

      <div className="hero-content" style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 60px",
        color: "var(--deep-foreground)"
      }}>
        <span className="eyebrow-pill" style={{
          marginBottom: 36,
          background: "color-mix(in oklch, white 6%, transparent)",
          borderColor: "color-mix(in oklch, white 18%, transparent)",
          color: "color-mix(in oklch, var(--deep-foreground) 85%, transparent)"
        }}>
          <span className="dot" /> Приглашение Мастерам
        </span>
        <h1 className="display" style={{
          fontSize: "clamp(56px, 6.6vw, 116px)",
          maxWidth: "14ch",
          color: "var(--deep-foreground)",
          marginBottom: 24,
          lineHeight: 0.97
        }}>
          Рады вас <em style={{ color: "var(--amber-soft)" }}>видеть</em>!
        </h1>
        <p style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "color-mix(in oklch, var(--deep-foreground) 75%, transparent)",
          maxWidth: "60ch",
          marginBottom: 40
        }}>
          Приглашаем вас в&nbsp;развитие пространства, созданного, чтобы общая работа стала более осознанной.
        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <a className="btn" href="https://t.me/masters_velo" target="_blank" rel="noopener noreferrer" style={{
            background: "var(--amber)",
            color: "var(--deep)",
            borderColor: "var(--amber)"
          }}>
            <span className="dot" style={{ background: "var(--deep)" }} /> Telegram
          </a>
          <a className="btn btn-ghost" style={{
            color: "var(--deep-foreground)",
            borderColor: "color-mix(in oklch, white 20%, transparent)"
          }} href="#ecosystem">
            Узнать больше ↓
          </a>
        </div>
      </div>
    </div>);

}

window.HeroEditorial = HeroEditorial;
window.HeroSacred = HeroSacred;
window.HeroCinematic = HeroCinematic;