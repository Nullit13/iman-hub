import { useState, useEffect } from "react";
import athkarData from "../azkar.json";
import "../styles/athkar.css";

function useAthkar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (athkarData && typeof athkarData === "object") {
      const parsed = Object.entries(athkarData).map(([title, items]) => ({
        title,
        items: items || [],
      }));
      setCategories(parsed);
    }
    setLoading(false);
  }, []);

  return { categories, loading };
}

function AthkarCategory({ category, isActive, onToggle }) {
  return (
    <div className="athkar__category">
      <button
        className={`athkar__category-header ${isActive ? "athkar__category-header--active" : ""}`}
        onClick={() => onToggle(category.title)}
        aria-expanded={isActive}
      >
        <span className="athkar__category-icon">
          {category.title.includes("صباح") || category.title.includes("Morning")
            ? "🌅"
            : category.title.includes("مساء") || category.title.includes("Evening")
            ? "🌙"
            : category.title.includes("نوم") || category.title.includes("Sleep")
            ? "😴"
            : category.title.includes("صلاة") || category.title.includes("Prayer")
            ? "🕌"
            : category.title.includes("مسجد") || category.title.includes("Mosque")
            ? "🕌"
            : category.title.includes("استيقاظ") || category.title.includes("Waking")
            ? "🌄"
            : category.title.includes("طعام") || category.title.includes("Food")
            ? "🍽️"
            : category.title.includes("لباس") || category.title.includes("Dress")
            ? "👔"
            : category.title.includes("خلاء") || category.title.includes("Bathroom")
            ? "🚿"
            : category.title.includes("سفر") || category.title.includes("Travel")
            ? "✈️"
            : category.title.includes("مطر") || category.title.includes("Rain")
            ? "🌧️"
            : category.title.includes("ريح") || category.title.includes("Wind")
            ? "💨"
            : category.title.includes("رعد") || category.title.includes("Thunder")
            ? "⛈️"
            : "📿"}
        </span>
        <div className="athkar__category-info">
          <h3 className="athkar__category-title">{category.title}</h3>
          <span className="athkar__category-count">
            {category.items.length} {category.items.length === 1 ? "dhikr" : "adhkar"}
          </span>
        </div>
        <span className={`athkar__category-arrow ${isActive ? "athkar__category-arrow--open" : ""}`}>
          ▼
        </span>
      </button>

      {isActive && (
        <div className="athkar__category-content">
          {category.items.map((dhikr, index) => (
            <AthkarCard key={index} dhikr={dhikr} />
          ))}
        </div>
      )}
    </div>
  );
}

function AthkarCard({ dhikr }) {
  const [count, setCount] = useState(0);
  const rawCount = dhikr.count ? String(dhikr.count) : "1";
  const maxCount = parseInt(rawCount, 10) || 1;

  const increment = () => {
    if (count < maxCount) {
      setCount((c) => c + 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const progress = maxCount > 0 ? (count / maxCount) * 100 : 100;
  const isComplete = count >= maxCount;

  return (
    <div className={`athkar__card ${isComplete ? "athkar__card--complete" : ""}`}>
      <div className="athkar__card-main">
        <p className="athkar__zekr" lang="ar" dir="rtl">
          {dhikr.content}
        </p>

        {dhikr.description && (
          <p className="athkar__desc">{dhikr.description}</p>
        )}

        {dhikr.reference && (
          <p className="athkar__ref">{dhikr.reference}</p>
        )}
      </div>

      {maxCount > 1 && (
        <div className="athkar__counter">
          <div className="athkar__counter-bar">
            <div
              className="athkar__counter-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="athkar__counter-controls">
            <span className="athkar__counter-label">
              {count} / {maxCount}
            </span>
            <button
              className="athkar__counter-btn"
              onClick={increment}
              disabled={isComplete}
            >
              {isComplete ? "✓ Done" : "+ Count"}
            </button>
            {count > 0 && (
              <button className="athkar__counter-reset" onClick={reset}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Athkar() {
  const { categories, loading } = useAthkar();
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (title) => {
    setActiveCategory((prev) => (prev === title ? null : title));
  };

  return (
    <main className="athkar">
      <section className="athkar__hero">
        <div className="athkar__hero-bg" aria-hidden="true">
          <div className="athkar__hero-orb athkar__hero-orb--1" />
          <div className="athkar__hero-orb athkar__hero-orb--2" />
          <div className="athkar__hero-grid" />
        </div>
        <div className="athkar__hero-content">
          <p className="athkar__greeting">📿 Daily Remembrance</p>
          <h1 className="athkar__headline">
            <span className="athkar__headline-brand">Athkar</span>
          </h1>
          <p className="athkar__sub">
            Morning and evening adhkar, after-prayer remembrances, and daily
            supplications from the Quran and Sunnah.
          </p>
        </div>
      </section>

      <section className="athkar__content">
        <div className="athkar__container">
          {loading && (
            <div className="athkar__loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="athkar__skeleton-category">
                  <div className="athkar__skeleton athkar__skeleton--header" />
                  <div className="athkar__skeleton athkar__skeleton--card" />
                </div>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="athkar__empty">
              <p>No athkar categories available at the moment.</p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="athkar__categories">
              {categories.map((category) => (
                <AthkarCategory
                  key={category.title}
                  category={category}
                  isActive={activeCategory === category.title}
                  onToggle={toggleCategory}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="athkar__quote-section">
        <div className="athkar__container">
          <div className="athkar__quote-card">
            <p className="athkar__quote-arabic" lang="ar" dir="rtl">
              ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ
            </p>
            <p className="athkar__quote-english">
              Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.
            </p>
            <p className="athkar__quote-ref">Surah Ar-Rad (13:28)</p>
          </div>
        </div>
      </section>
    </main>
  );
}