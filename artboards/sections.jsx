/* global React */

// ─────────────────────────────────────────────────────────────────
// BENEFITS — изящная сетка, мягкая иерархия
// ─────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    n: "01",
    title: "Эмоциональный ландшафт группы до\u00a0практики",
    body: "За 12–24 часа до сессии участники отмечают своё состояние: простой выбор из трёх вариантов с возможностью оставить комментарий и написать запрос на практику. Вы получаете агрегированную картину группы заранее и можете адаптировать практику по реальным данным. Четверо из двенадцати отметили тревогу? Вы узнаете об этом до начала сессии. Со временем из этих данных складывается динамика — как меняется эмоциональный фон ваших участников от сессии к сессии, от месяца к месяцу.",
    accent: "var(--amber)",
  },
  {
    n: "02",
    title: "Раннее обнаружение кризисных состояний",
    body: "Глубокая практика — медитация, дыхательные техники, самоисследование — иногда приводит к периоду дестабилизации. Защитные механизмы психики начинают рассыпаться быстрее, чем человек готов это интегрировать: тревога, диссоциация, экзистенциальный кризис, ощущение что «стало хуже, чем до практики». <span class=\"velo-mark\">VEL<span class=\"theta\">Θ</span></span> отслеживает эмоциональный ландшафт через AI-аналитику и распознаёт ранние сигналы. Когда система замечает характерный паттерн — участник получает контекст и поддержку, вы получаете уведомление, а при необходимости подключается рекомендация обратиться к квалифицированному терапевту.",
    accent: "var(--rose)",
  },
  {
    n: "03",
    title: "AI-рефлексия после практики",
    body: "После каждой сессии участники оставляют оценку и комментарий. Но вы не просто получаете отзывы — AI обрабатывает обратную связь и выделяет повторяющиеся темы, частые запросы и динамику удовлетворённости. Вместо «всем понравилось» или «было нормально» вы видите, что конкретно работает, какие темы вызывают наибольший отклик, где участники чувствуют сопротивление.",
    accent: "var(--teal)",
  },
  {
    n: "04",
    title: 'Ваше пространство внутри <span class="velo-mark">VEL<span class="theta">Θ</span></span>',
    body: "Персональное пространство с вашим профилем, описанием метода, расписанием и записями практик. Участники находят вас внутри экосистемы, видят ваш подход и могут записаться на ближайшую сессию. Чем дольше вы проводите практики в <span class=\"velo-mark\">VEL<span class=\"theta\">Θ</span></span>, тем точнее система рекомендует вас новым участникам.",
    accent: "var(--lavender)",
  },
  {
    n: "05",
    title: "Новая аудитория",
    body: "Экосистема <span class=\"velo-mark\">VEL<span class=\"theta\">Θ</span></span> рекомендует ваши практики участникам на основе их текущего состояния, эмоциональных запросов и результатов тестирований — это подбор по реальным данным. Участник, которому прямо сейчас нужна дыхательная практика для работы с тревогой, увидит именно вас, если это ваша специализация.",
    accent: "var(--amber)",
  },
  {
    n: "06",
    title: "Автоматизация, которая убирает рутину",
    body: "Расписание, запись, видеотрансляция и оплата собраны в единой системе. Участник записывается в три клика и автоматически получает ссылку на сессию и напоминание. Вам не нужно вручную отправлять ссылки, собирать оплату или напоминать о встрече в чатах. Перед сессией вы видите, сколько человек записалось и как они себя чувствуют.",
    accent: "var(--teal)",
  },
  {
    n: "07",
    title: "Интеграция с биометрикой",
    body: "Участники, которые подключают Apple Health, Oura или Whoop, добавляют ещё один слой данных. Как ваша дыхательная практика повлияла на вариабельность сердечного ритма? Как медитация отразилась на качестве сна? Эти корреляции обогащают аналитику и делают результаты вашей работы измеримыми.",
    accent: "var(--rose)",
  },
];

function BenefitsEditorial({ grain = true }) {
  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "80px 60px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 56, height: "100%" }}>
        <div style={{ maxWidth: "60ch" }}>
          <span className="eyebrow">Для Мастеров</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 4.5vw, 64px)", marginTop: 16, maxWidth: "18ch", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span>Что даёт</span>
            <img
              src="icons/velo-wordmark-extracted.png"
              alt="VELΘ"
              style={{
                height: "0.85em",
                width: "auto",
                display: "inline-block",
                verticalAlign: "middle",
                filter: "brightness(0) saturate(100%) invert(11%) sepia(8%) saturate(632%) hue-rotate(11deg) brightness(94%) contrast(89%)",
              }}
            />
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "color-mix(in oklch, var(--deep) 12%, transparent)", border: "1px solid color-mix(in oklch, var(--deep) 12%, transparent)" }}>
          {BENEFITS.map((b, i) => (
            <article key={b.n} style={{
              background: "var(--soft)",
              padding: "36px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: "relative",
              gridColumn: i === BENEFITS.length - 1 && BENEFITS.length % 2 === 1 ? "1 / -1" : "auto",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", color: "color-mix(in oklch, var(--deep) 50%, transparent)" }}>{b.n}</span>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: b.accent, opacity: 0.7 }} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 26,
                lineHeight: 1.15,
                color: "var(--deep)",
                margin: 0,
                maxWidth: "20ch",
              }} dangerouslySetInnerHTML={{ __html: b.title }}></h3>
              <p
                style={{ fontSize: 14.5, lineHeight: 1.6, color: "color-mix(in oklch, var(--deep) 72%, transparent)", margin: 0, maxWidth: i === BENEFITS.length - 1 && BENEFITS.length % 2 === 1 ? "60ch" : "42ch" }}
                dangerouslySetInnerHTML={{ __html: b.body }}
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// INVITATION — итоговый CTA
// ─────────────────────────────────────────────────────────────────

function InvitationFinal({ aura = true, grain = true }) {
  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "80px 60px" }}>
      {aura && <div className="aura" style={{
        background: `radial-gradient(50% 60% at 50% 60%, color-mix(in oklch, var(--amber-soft) 50%, transparent) 0%, transparent 65%)`,
      }} />}
      <div style={{
        position: "relative",
        zIndex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 28,
      }}>
        <span className="eyebrow-pill"><span className="dot" /> Приглашение</span>
        <h2 className="display" style={{ fontSize: "clamp(56px, 7vw, 112px)", maxWidth: "16ch", margin: 0, lineHeight: 0.96 }}>
          Напишите нам
          <br />
          в&nbsp;<em>Telegram</em>
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "color-mix(in oklch, var(--deep) 68%, transparent)", maxWidth: "52ch", margin: 0 }}>
          У&nbsp;вас есть уникальная возможность поучаствовать в&nbsp;первых импульсах развития нашей экосистемы. Каждый взгляд и&nbsp;подход интересен.
        </p>
        <a className="btn btn-primary" href="https://t.me/masters_velo" target="_blank" rel="noopener noreferrer" style={{ padding: "18px 32px", fontSize: 14 }}>
          <span className="dot" /> @masters_velo
        </a>
        <ul style={{
          display: "flex", flexWrap: "wrap", gap: "8px 28px",
          listStyle: "none", padding: 0, margin: "8px 0 0",
          fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "color-mix(in oklch, var(--deep) 55%, transparent)",
        }}>
          <li>Ответ в&nbsp;течение 2&nbsp;дней</li>
          <li>· hello@velo.space</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FAQ — два варианта
// ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: "Сколько это стоит для Мастера?", a: "Подключение бесплатное. Берём небольшую комиссию с платных практик; всё подробно — на звонке." },
  { q: "Нужен ли свой сайт?", a: 'Нет. <span class="velo-mark">VEL<span class="theta">Θ</span></span> даёт пространство — профиль, расписание, записи. Существующий сайт остаётся вашим.' },
  { q: "Кого вы берёте в Мастера?", a: "Практикующих с живым опытом. Регалии важны меньше, чем присутствие и глубина." },
  { q: "Что с приватностью?", a: "Контакты и заметки — закрытые. Публично виден только профиль и расписание." },
];

function FaqEditorial({ grain = true }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className={`surface ${grain ? "grain" : ""}`} style={{ padding: "80px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 64, height: "100%" }}>
        <div>
          <span className="eyebrow">03 · FAQ</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4vw, 56px)", marginTop: 16, maxWidth: "12ch" }}>
            Коротко о&nbsp;<em>важном</em>
          </h2>
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 19,
            lineHeight: 1.55,
            color: "color-mix(in oklch, var(--deep) 60%, transparent)",
            marginTop: 24,
            maxWidth: "28ch",
          }}>
            Не нашли свой вопрос — напишите в Telegram, ответим лично.
          </p>
        </div>

        <div>
          {FAQ_ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{
                borderTop: i === 0 ? "1px solid color-mix(in oklch, var(--deep) 14%, transparent)" : "none",
                borderBottom: "1px solid color-mix(in oklch, var(--deep) 14%, transparent)",
              }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "22px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    textAlign: "left",
                    color: "var(--deep)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.2 }}>{it.q}</span>
                  <span style={{
                    width: 32, height: 32, borderRadius: 999,
                    border: "1px solid color-mix(in oklch, var(--deep) 25%, transparent)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "var(--font-mono)", fontSize: 14,
                    color: "color-mix(in oklch, var(--deep) 70%, transparent)",
                    transition: "transform 200ms ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}>+</span>
                </button>
                <div
                  style={{
                  display: isOpen ? "block" : "none",
                  paddingBottom: 22,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "color-mix(in oklch, var(--deep) 70%, transparent)",
                  maxWidth: "62ch",
                }}
                  dangerouslySetInnerHTML={{ __html: it.a }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.BenefitsEditorial = BenefitsEditorial;
window.InvitationFinal = InvitationFinal;
window.FaqEditorial = FaqEditorial;
