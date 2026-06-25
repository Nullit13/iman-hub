import { useState, useMemo } from "react";
import "../styles/holidays.css";

const TODAY = new Date();

const HOLIDAYS = [
    {
      id: 1,
      name: "Day of Ashura",
      arabic: "يوم عاشوراء",
      hijri: "10 Muharram 1448",
      date: new Date("2026-06-25"), // Happening tomorrow!
      endDate: null,
      icon: "📿",
      color: "purple",
      category: "Significant",
      description: "The 10th day of Muharram, commemorating the day Allah saved Prophet Musa (Moses) and the Children of Israel from Pharaoh. The Prophet Muhammad ﷺ highly encouraged fasting on this day.",
      observances: ["Optional fasting (9th & 10th Muharram)", "Extra prayers and dhikr", "Reflection and worship"],
    },
    {
      id: 2,
      name: "Mawlid al-Nabi",
      arabic: "المولد النبوي الشريف",
      hijri: "12 Rabi' al-Awwal 1448",
      date: new Date("2026-08-25"),
      endDate: null,
      icon: "⭐",
      color: "gold",
      category: "Major",
      description: "The commemoration of the birth of Prophet Muhammad ﷺ. Muslims around the world remember this occasion with gatherings, recitation of the Quran, prayers upon the Prophet, and learning about his noble character.",
      observances: ["Sending salawat upon the Prophet ﷺ", "Community gatherings and nasheeds", "Learning about the Seerah", "Charity and feeding the poor"],
    },
    {
      id: 3,
      name: "Laylat al-Miraj",
      arabic: "ليلة المعراج",
      hijri: "27 Rajab 1448",
      date: new Date("2027-01-05"),
      endDate: null,
      icon: "🌠",
      color: "indigo",
      category: "Significant",
      description: "The Night of the Ascension — commemorating the miraculous night journey (Isra) of Prophet Muhammad ﷺ from Makkah to Jerusalem, and his subsequent ascent (Mi'raj) through the heavens. The five daily prayers were ordained on this night.",
      observances: ["Night prayers and worship", "Reading about the Isra wal Mi'raj", "Voluntary fasting"],
    },
    {
      id: 4,
      name: "Ramadan Begins",
      arabic: "بداية رمضان المبارك",
      hijri: "1 Ramadan 1448",
      date: new Date("2027-02-08"),
      endDate: new Date("2027-03-09"),
      icon: "🌙",
      color: "green",
      category: "Pillar",
      description: "The holy month of Ramadan — during which Muslims fast from dawn (Fajr) to sunset (Maghrib). It is a time of intense worship, spiritual growth, charity, and community reflection.",
      observances: ["Daily fasting (Sawm)", "Tarawih prayers at night", "Increased Quran recitation", "Charity and Zakat"],
    },
    {
      id: 5,
      name: "Last 10 Nights of Ramadan",
      arabic: "العشر الأواخر من رمضان",
      hijri: "21–30 Ramadan 1448",
      date: new Date("2027-02-28"),
      endDate: new Date("2027-03-09"),
      icon: "💫",
      color: "gold",
      category: "Major",
      description: "The most blessed nights of the year. Seeking spiritual growth, forgiveness, and Laylat al-Qadr (The Night of Power), which is hidden within the odd nights and is better than a thousand months.",
      observances: ["Intense worship all night", "Recitation of Quran", "Du'a and seeking forgiveness", "I'tikaf (seclusion in the mosque)"],
    },
    {
      id: 6,
      name: "Eid al-Fitr",
      arabic: "عيد الفطر المبارك",
      hijri: "1 Shawwal 1448",
      date: new Date("2027-03-09"),
      endDate: new Date("2027-03-11"),
      icon: "🎊",
      color: "gold",
      category: "Eid",
      description: "The Festival of Breaking the Fast — marking the end of Ramadan. It is a day of immense joy, gratitude, feasting, gifts, and community. Muslims pay Zakat al-Fitr before the prayer.",
      observances: ["Eid prayer in congregation", "Paying Zakat al-Fitr", "Visiting family and friends", "Feasting and celebration"],
    },
    {
      id: 7,
      name: "Day of Arafah",
      arabic: "يوم عرفة",
      hijri: "9 Dhul Hijjah 1448",
      date: new Date("2027-05-15"),
      endDate: null,
      icon: "🕋",
      color: "green",
      category: "Major",
      description: "The pinnacle of Hajj, where pilgrims gather on the plain of Arafah in intense prayer. Fasting on this day for non-pilgrims is highly rewarded and expiates sins of two years.",
      observances: ["Fasting for non-pilgrims", "Abundant du'a and dhikr", "Seeking forgiveness"],
    },
    {
      id: 8,
      name: "Eid al-Adha",
      arabic: "عيد الأضحى المبارك",
      hijri: "10 Dhul Hijjah 1448",
      date: new Date("2027-05-16"),
      endDate: new Date("2027-05-19"),
      icon: "🐑",
      color: "emerald",
      category: "Eid",
      description: "The Festival of Sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son in obedience to Allah. Muslims perform Udhiyah and distribute meat to those in need.",
      observances: ["Eid prayer in congregation", "Udhiyah (animal sacrifice)", "Distributing meat to the poor", "Visiting family"],
    },
    {
      id: 9,
      name: "Days of Tashriq",
      arabic: "أيام التشريق",
      hijri: "11–13 Dhul Hijjah 1448",
      date: new Date("2027-05-17"),
      endDate: new Date("2027-05-19"),
      icon: "🌿",
      color: "teal",
      category: "Significant",
      description: "The three days following Eid al-Adha. These are days for eating, drinking, celebrating, and the abundant remembrance of Allah. Fasting is strictly prohibited during this time.",
      observances: ["Abundant dhikr and takbir", "Continuation of Eid celebration", "Pilgrims: stoning the Jamarat"],
    },
    {
      id: 10,
      name: "Islamic New Year",
      arabic: "رأس السنة الهجرية",
      hijri: "1 Muharram 1449",
      date: new Date("2027-06-06"),
      endDate: null,
      icon: "🌙",
      color: "blue",
      category: "Major",
      description: "The beginning of a new Hijri year. A time for reflecting on the past year, practicing gratitude, and setting renewed spiritual goals.",
      observances: ["Reflection and du'a", "Reading about the Hijra", "Setting new spiritual goals"],
    }
  ];

const CATEGORIES = ["All", "Pillar", "Eid", "Major", "Significant"];

const COLOR_MAP = {
  gold:    { bg: "rgba(212,168,67,0.10)",  border: "rgba(212,168,67,0.30)",  text: "#D4A843", badge: "#D4A843" },
  green:   { bg: "rgba(26,122,80,0.12)",   border: "rgba(26,122,80,0.35)",   text: "#22A86E", badge: "#22A86E" },
  emerald: { bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.30)",  text: "#10B981", badge: "#10B981" },
  blue:    { bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.30)",  text: "#60A5FA", badge: "#60A5FA" },
  purple:  { bg: "rgba(139,92,246,0.10)",  border: "rgba(139,92,246,0.30)",  text: "#A78BFA", badge: "#A78BFA" },
  indigo:  { bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.30)",  text: "#818CF8", badge: "#818CF8" },
  teal:    { bg: "rgba(20,184,166,0.10)",  border: "rgba(20,184,166,0.30)",  text: "#2DD4BF", badge: "#2DD4BF" },
};

function daysUntil(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const t = new Date(TODAY);
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ holiday }) {
  const diff = daysUntil(holiday.date);
  const isMultiDay = holiday.endDate;
  const endDiff = isMultiDay ? daysUntil(holiday.endDate) : null;
  const isOngoing = diff <= 0 && isMultiDay && endDiff >= 0;
  const isToday = diff === 0 && !isMultiDay;
  const isPast = isMultiDay ? endDiff < 0 : diff < 0;

  if (isOngoing || isToday) return <span className="hl__badge hl__badge--now">🟢 Happening Now</span>;
  if (isPast) return <span className="hl__badge hl__badge--past">✓ Passed</span>;
  if (diff === 1) return <span className="hl__badge hl__badge--soon">⚡ Tomorrow</span>;
  if (diff <= 7) return <span className="hl__badge hl__badge--soon">⚡ {diff} days away</span>;
  if (diff <= 30) return <span className="hl__badge hl__badge--upcoming">{diff} days</span>;
  return <span className="hl__badge hl__badge--future">{diff} days</span>;
}

function CountdownPill({ holiday }) {
  const diff = daysUntil(holiday.date);
  const isMultiDay = holiday.endDate;
  const endDiff = isMultiDay ? daysUntil(holiday.endDate) : null;
  const isOngoing = diff <= 0 && isMultiDay && endDiff >= 0;
  const isToday = diff === 0 && !isMultiDay;
  const isPast = isMultiDay ? endDiff < 0 : diff < 0;

  if (isPast) return <p className="hl__card-countdown hl__card-countdown--past">Passed · {formatShort(holiday.date)}</p>;
  if (isOngoing) return <p className="hl__card-countdown hl__card-countdown--now">Ongoing · ends {formatShort(holiday.endDate)}</p>;
  if (isToday) return <p className="hl__card-countdown hl__card-countdown--now">Today!</p>;
  if (diff === 1) return <p className="hl__card-countdown hl__card-countdown--soon">Tomorrow · {formatShort(holiday.date)}</p>;
  return <p className="hl__card-countdown">{diff > 0 ? `${diff} days away` : ""} · {formatShort(holiday.date)}</p>;
}

export default function Holidays() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("grid");

  const nextHoliday = useMemo(() => {
    return HOLIDAYS.filter(h => {
      const diff = daysUntil(h.date);
      const endDiff = h.endDate ? daysUntil(h.endDate) : null;
      const isOngoing = diff <= 0 && h.endDate && endDiff >= 0;
      return diff > 0 || isOngoing;
    }).sort((a, b) => a.date - b.date)[0];
  }, []);

  const filtered = useMemo(() => {
    return HOLIDAYS.filter(h => {
      const matchCat = filter === "All" || h.category === filter;
      const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
                          h.arabic.includes(search) ||
                          h.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [filter, search]);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="hl">
      <div className="hl__hero">
        <div className="hl__hero-orb hl__hero-orb--1" />
        <div className="hl__hero-orb hl__hero-orb--2" />
        <div className="hl__hero-grid" />
        <div className="hl__hero-content">
          <p className="hl__eyebrow">🎉 Islamic Calendar</p>
          <h1 className="hl__title">المناسبات الإسلامية</h1>
          <p className="hl__subtitle">Islamic Holidays & Sacred Occasions</p>
          <p className="hl__hero-note">Dates are based on astronomical calculation and may vary ±1–2 days by moon sighting.</p>
        </div>
      </div>

      {nextHoliday && (
        <div className="hl__next-wrap">
          <div className="hl__next-card" style={{ borderColor: COLOR_MAP[nextHoliday.color].border }}>
            <div className="hl__next-glow" style={{ background: `radial-gradient(ellipse at 0% 50%, ${COLOR_MAP[nextHoliday.color].bg} 0%, transparent 70%)` }} />
            <div className="hl__next-left">
              <p className="hl__next-label">⏳ Next Islamic Occasion</p>
              <p className="hl__next-icon-big">{nextHoliday.icon}</p>
              <p className="hl__next-name-ar">{nextHoliday.arabic}</p>
              <p className="hl__next-name-en">{nextHoliday.name}</p>
              <p className="hl__next-hijri">{nextHoliday.hijri}</p>
            </div>
            <div className="hl__next-right">
              <p className="hl__next-date-label">Gregorian Date</p>
              <p className="hl__next-date">{formatDate(nextHoliday.date)}</p>
              {nextHoliday.endDate && <p className="hl__next-to">through {formatDate(nextHoliday.endDate)}</p>}
              <div className="hl__next-countdown-wrap">
                <p className="hl__next-countdown-num" style={{ color: COLOR_MAP[nextHoliday.color].text }}>
                  {daysUntil(nextHoliday.date) <= 0 ? "Today" : `${daysUntil(nextHoliday.date)}`}
                </p>
                {daysUntil(nextHoliday.date) > 0 && <p className="hl__next-countdown-label">days remaining</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hl__controls">
        <div className="hl__search-wrap">
          <span className="hl__search-icon">🔍</span>
          <input
            className="hl__search"
            placeholder="Search holidays…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="hl__filter-pills">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`hl__pill ${filter === c ? "hl__pill--active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="hl__view-toggle">
          <button className={`hl__view-btn ${view === "grid" ? "hl__view-btn--active" : ""}`} onClick={() => setView("grid")}>⊞ Grid</button>
          <button className={`hl__view-btn ${view === "list" ? "hl__view-btn--active" : ""}`} onClick={() => setView("list")}>☰ List</button>
        </div>
      </div>

      <div className="hl__count-row">
        <p className="hl__count">{filtered.length} occasion{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {view === "grid" ? (
        <div className="hl__grid">
          {filtered.map(h => {
            const c = COLOR_MAP[h.color];
            const isOpen = expanded === h.id;
            return (
              <div
                key={h.id}
                className={`hl__card ${isOpen ? "hl__card--open" : ""}`}
                style={{ "--card-border": c.border, "--card-bg": c.bg, "--card-text": c.text }}
              >
                <div className="hl__card-top-bar" style={{ background: `linear-gradient(90deg, ${c.text}40 0%, transparent 100%)` }} />

                <div className="hl__card-header">
                  <div className="hl__card-icon-wrap" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <span className="hl__card-icon">{h.icon}</span>
                  </div>
                  <div className="hl__card-badge-row">
                    <span className="hl__category-badge" style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>{h.category}</span>
                    <StatusBadge holiday={h} />
                  </div>
                </div>

                <div className="hl__card-body">
                  <p className="hl__card-arabic">{h.arabic}</p>
                  <p className="hl__card-name">{h.name}</p>
                  <p className="hl__card-hijri">🗓 {h.hijri}</p>
                  <CountdownPill holiday={h} />
                </div>

                <div className={`hl__card-details ${isOpen ? "hl__card-details--open" : ""}`}>
                  <div className="hl__card-divider" />
                  <p className="hl__card-desc">{h.description}</p>
                  <div className="hl__card-obs">
                    <p className="hl__card-obs-title">How to Observe</p>
                    <ul className="hl__card-obs-list">
                      {h.observances.map((o, i) => (
                        <li key={i} className="hl__card-obs-item">
                          <span className="hl__obs-dot" style={{ background: c.text }} />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hl__card-dates">
                    <div className="hl__date-item">
                      <span className="hl__date-label">Hijri</span>
                      <span className="hl__date-val">{h.hijri}</span>
                    </div>
                    <div className="hl__date-item">
                      <span className="hl__date-label">Gregorian</span>
                      <span className="hl__date-val">{formatShort(h.date)}{h.endDate ? ` – ${formatShort(h.endDate)}` : ""}</span>
                    </div>
                  </div>
                </div>

                <button className="hl__expand-btn" onClick={() => toggle(h.id)} style={{ color: c.text }}>
                  {isOpen ? "▲ Less" : "▼ Learn More"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="hl__list">
          {filtered.map(h => {
            const c = COLOR_MAP[h.color];
            const isOpen = expanded === h.id;
            return (
              <div key={h.id} className="hl__list-item" style={{ "--card-border": c.border }}>
                <div className="hl__list-left" style={{ background: c.bg, borderRight: `1px solid ${c.border}` }}>
                  <span className="hl__list-icon">{h.icon}</span>
                </div>
                <div className="hl__list-body">
                  <div className="hl__list-top">
                    <div>
                      <p className="hl__list-arabic">{h.arabic}</p>
                      <p className="hl__list-name">{h.name}</p>
                      <p className="hl__list-hijri">🗓 {h.hijri}</p>
                    </div>
                    <div className="hl__list-meta">
                      <span className="hl__category-badge" style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>{h.category}</span>
                      <StatusBadge holiday={h} />
                      <p className="hl__list-date">{formatShort(h.date)}{h.endDate ? ` – ${formatShort(h.endDate)}` : ""}</p>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="hl__list-details">
                      <p className="hl__card-desc">{h.description}</p>
                      <ul className="hl__card-obs-list">
                        {h.observances.map((o, i) => (
                          <li key={i} className="hl__card-obs-item">
                            <span className="hl__obs-dot" style={{ background: c.text }} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button className="hl__list-expand" onClick={() => toggle(h.id)} style={{ color: c.text }}>
                    {isOpen ? "▲ Less" : "▼ Details"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="hl__empty">
          <p className="hl__empty-icon">🔎</p>
          <p className="hl__empty-text">No occasions found</p>
          <p className="hl__empty-sub">Try a different search or category filter.</p>
        </div>
      )}

      <div className="hl__footer-note">
        <p>📌 Islamic holiday dates are based on the Hijri lunar calendar and may vary by 1–2 days depending on moon sighting in your region. Always confirm with your local mosque or Islamic authority.</p>
      </div>
    </div>
  );
}