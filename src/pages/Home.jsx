import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaBookOpen, 
  FaHands, 
  FaMosque, 
  FaCalendarAlt, 
  FaStar,
  FaArrowRight,
  FaQuran,
  FaPrayingHands,
  FaClock,
  FaUserFriends,
  FaHeart,
  FaGithub
} from 'react-icons/fa';
import GitHubBadge from "../GitHubBadge";
import "../styles/home.css";

const FEATURES = [
  {
    icon: <FaQuran />,
    title: "Al-Quran",
    desc: "Read and listen to the complete Quran with translations in multiple languages.",
    to: "/quran",
    cta: "Open Quran",
  },
  {
    icon: <FaPrayingHands />,
    title: "Athkar",
    desc: "Daily remembrance — morning, evening, and after-prayer dhikr collections.",
    to: "/athkar",
    cta: "Browse Athkar",
  },
  {
    icon: <FaMosque />,
    title: "Salah Times",
    desc: "Accurate prayer times based on your location with Qibla direction.",
    to: "/salah",
    cta: "Check Times",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Islamic Calendar",
    desc: "Upcoming Islamic holidays, Hijri dates, and significant occasions.",
    to: "/holidays",
    cta: "View Calendar",
  },
];

const STATS = [
  { value: "6,236", label: "Quranic Verses" },
  { value: "114",   label: "Surahs" },
  { value: "99",    label: "Names of Allah" },
  { value: "5",     label: "Daily Prayers" },
];

function useAyahOfDay() {
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const today = new Date();
    const ayahNumber = (today.getDate() + today.getMonth() * 30) % 6236 + 1;

    fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          const arabic = data.data[0];
          const english = data.data[1];
          setAyah({
            arabic: arabic.text,
            english: english.text,
            surah: arabic.surah.englishName,
            surahArabic: arabic.surah.name,
            ayahNum: arabic.numberInSurah,
            surahNum: arabic.surah.number,
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { ayah, loading, error };
}

export default function Home() {
  const { ayah, loading, error } = useAyahOfDay();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Assalamu Alaikum, good morning ☀️" :
    hour < 17 ? "Assalamu Alaikum, good afternoon 🌤️" :
                "Assalamu Alaikum, good evening 🌙";

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-bg" aria-hidden="true">
          <div className="home__hero-orb home__hero-orb--1" />
          <div className="home__hero-orb home__hero-orb--2" />
          <div className="home__hero-grid" />
        </div>

        <div className="home__hero-content">
          <p className="home__greeting">{greeting}</p>
          <h1 className="home__headline">
            Welcome to<br />
            <span className="home__headline-brand">Iman Hub</span>
          </h1>
          <p className="home__sub">
            Your daily companion for Quran, Athkar, Salah times,<br className="home__br" />
            and the Islamic calendar — all in one place.
          </p>
          <div className="home__hero-actions">
            <Link to="/quran" className="home__btn home__btn--primary">
              <FaBookOpen /> Start Reading Quran
            </Link>
            <Link to="/salah" className="home__btn home__btn--ghost">
              <FaClock /> Prayer Times
            </Link>
          </div>
        </div>
      </section>

      <GitHubBadge repo="https://github.com/Nullit13/iman-hub" repoUrl="https://github.com/Nullit13/iman-hub" />

      <section className="home__ayah-section">
        <div className="home__container">
          <p className="home__eyebrow"><FaStar /> Ayah of the Day</p>

          {loading && (
            <div className="home__ayah-card home__ayah-card--loading">
              <div className="home__skeleton home__skeleton--arabic" />
              <div className="home__skeleton home__skeleton--text" />
              <div className="home__skeleton home__skeleton--text home__skeleton--short" />
            </div>
          )}

          {error && !loading && (
            <div className="home__ayah-card">
              <p className="home__ayah-error">Could not load today's ayah. Please check your connection.</p>
            </div>
          )}

          {ayah && !loading && (
            <div className="home__ayah-card">
              <p className="home__ayah-arabic" lang="ar" dir="rtl">{ayah.arabic}</p>
              <p className="home__ayah-english">"{ayah.english}"</p>
              <p className="home__ayah-ref">
                — {ayah.surah} ({ayah.surahArabic}), {ayah.surahNum}:{ayah.ayahNum}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="home__stats">
        <div className="home__container">
          <div className="home__stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="home__stat">
                <span className="home__stat-value">{s.value}</span>
                <span className="home__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="home__container">
          <p className="home__eyebrow">Everything you need</p>
          <h2 className="home__section-title">Your Islamic toolkit</h2>
          <div className="home__features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="home__feature-card">
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
                <Link to={f.to} className="home__feature-link">
                  {f.cta} <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home__banner">
        <div className="home__container">
          <div className="home__banner-inner">
            <div className="home__banner-text">
              <h2 className="home__banner-title">Begin with Bismillah</h2>
              <p className="home__banner-arabic" lang="ar" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="home__banner-desc">
                Start every session with the name of Allah — the Most Gracious, the Most Merciful.
              </p>
            </div>
            <Link to="/quran" className="home__btn home__btn--gold">
              Open Quran <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="home__footer">
        <div className="home__container">
          <p className="home__footer-brand">
            <img width="20px" src="/logo1-no-background.png" alt="logo" /> Iman Hub
          </p>
          <p className="home__footer-copy">
            Built with love for the Muslim community · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}