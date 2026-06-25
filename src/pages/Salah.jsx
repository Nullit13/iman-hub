import { useState, useEffect, useRef } from "react";
import "../styles/salah.css";

const PRAYERS = [
  { key: "Fajr",    arabic: "الفجر",   english: "Fajr",    icon: "🌙", desc: "Pre-dawn" },
  { key: "Sunrise", arabic: "الشروق",  english: "Sunrise", icon: "🌅", desc: "Sunrise",  info: true },
  { key: "Dhuhr",   arabic: "الظهر",   english: "Dhuhr",   icon: "☀️",  desc: "Midday" },
  { key: "Asr",     arabic: "العصر",   english: "Asr",     icon: "🌤️", desc: "Afternoon" },
  { key: "Maghrib", arabic: "المغرب",  english: "Maghrib", icon: "🌆", desc: "Sunset" },
  { key: "Isha",    arabic: "العشاء",  english: "Isha",    icon: "🌃", desc: "Night" },
];

const METHODS = [
  { id: 2,  name: "ISNA (North America)" },
  { id: 1,  name: "University of Islamic Sciences, Karachi" },
  { id: 3,  name: "Muslim World League" },
  { id: 4,  name: "Umm Al-Qura, Makkah" },
  { id: 5,  name: "Egyptian General Authority" },
  { id: 7,  name: "Institute of Geophysics, Tehran" },
  { id: 8,  name: "Gulf Region" },
  { id: 9,  name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura" },
  { id: 12, name: "Union des Organisations Islamiques de France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
  { id: 15, name: "Moonsighting Committee Worldwide" },
];

function toAmPm(time24) {
  if (!time24) return "--:--";
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function timeToMinutes(time24) {
  if (!time24) return 0;
  const [h, m] = time24.split(":");
  return parseInt(h) * 60 + parseInt(m);
}

function getNextPrayer(timings) {
  if (!timings) return null;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const prayers = PRAYERS.filter(p => p.key !== "Sunrise");
  for (const p of prayers) {
    const mins = timeToMinutes(timings[p.key]);
    if (mins > nowMins) return { ...p, time: timings[p.key], minsLeft: mins - nowMins };
  }
  return { ...prayers[0], time: timings[prayers[0].key], minsLeft: null, tomorrow: true };
}

function minsToCountdown(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getQiblaAngle(lat, lng) {
  const makkahLat = 21.4225 * (Math.PI / 180);
  const makkahLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const dLng = makkahLng - lng * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(makkahLat);
  const x = Math.cos(userLat) * Math.sin(makkahLat) - Math.sin(userLat) * Math.cos(makkahLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export default function Salah() {
  const [timings, setTimings] = useState(null);
  const [hijri, setHijri] = useState(null);
  const [gregorian, setGregorian] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [method, setMethod] = useState(2);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timings) setNextPrayer(getNextPrayer(timings));
  }, [timings, now]);

  const fetchByCoords = async (lat, lng) => {
    setLoading(true); setError("");
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=${method}`
      );
      const data = await res.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijri(data.data.date.hijri);
        setGregorian(data.data.date.gregorian);
        setMeta(data.data.meta);
        setQiblaAngle(getQiblaAngle(lat, lng));
      } else {
        setError("Could not fetch prayer times. Try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    }
    setLoading(false);
  };

  const fetchByCity = async () => {
    if (!cityInput.trim() || !countryInput.trim()) return;
    setLoading(true); setError("");
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(cityInput)}&country=${encodeURIComponent(countryInput)}&method=${method}`
      );
      const data = await res.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijri(data.data.date.hijri);
        setGregorian(data.data.date.gregorian);
        setMeta(data.data.meta);
        setCity(cityInput);
        setCountry(countryInput);
        const lat = data.data.meta.latitude;
        const lng = data.data.meta.longitude;
        setQiblaAngle(getQiblaAngle(lat, lng));
      } else {
        setError("City not found. Check city and country spelling.");
      }
    } catch {
      setError("Network error. Check your connection.");
    }
    setLoading(false);
  };

  const fetchMonthly = async () => {
    if (!meta) return;
    const today = new Date();
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/calendar/${today.getFullYear()}/${today.getMonth() + 1}?latitude=${meta.latitude}&longitude=${meta.longitude}&method=${method}`
      );
      const data = await res.json();
      if (data.code === 200) { setMonthlyData(data.data); setShowMonthly(true); }
    } catch {}
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported by your browser."); return; }
    setGeoLoading(true); setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        await fetchByCoords(lat, lng);
        setGeoLoading(false);
      },
      () => { setError("Location access denied. Enter city manually."); setGeoLoading(false); }
    );
  };

  const currentPrayerKey = (() => {
    if (!timings) return null;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const prayers = PRAYERS.filter(p => p.key !== "Sunrise");
    let current = null;
    for (const p of prayers) {
      if (timeToMinutes(timings[p.key]) <= nowMins) current = p.key;
    }
    return current;
  })();

  const todayDate = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="sl">
      <div className="sl__hero">
        <div className="sl__hero-orb sl__hero-orb--1" />
        <div className="sl__hero-orb sl__hero-orb--2" />
        <div className="sl__hero-grid" />

        <div className="sl__hero-content">
          <p className="sl__eyebrow">🕌 Daily Prayer Times</p>
          <h1 className="sl__hero-title">مواقيت الصلاة</h1>
          <p className="sl__hero-date">{todayDate}</p>

          {hijri && (
            <div className="sl__hijri">
              <span className="sl__hijri-day">{hijri.day}</span>
              <span className="sl__hijri-month">{hijri.month.ar}</span>
              <span className="sl__hijri-year">{hijri.year} هـ</span>
            </div>
          )}

          <div className="sl__location-form">
            <div className="sl__location-inputs">
              <input
                className="sl__input"
                placeholder="City (e.g. Cairo)"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchByCity()}
              />
              <input
                className="sl__input"
                placeholder="Country (e.g. Egypt)"
                value={countryInput}
                onChange={e => setCountryInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchByCity()}
              />
              <select className="sl__input sl__select" value={method} onChange={e => setMethod(Number(e.target.value))}>
                {METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="sl__location-btns">
              <button className="sl__btn sl__btn--gold" onClick={fetchByCity} disabled={loading}>
                {loading ? "Loading…" : "🔍 Get Times"}
              </button>
              <button className="sl__btn sl__btn--ghost" onClick={useMyLocation} disabled={geoLoading}>
                {geoLoading ? "Locating…" : "📍 Use My Location"}
              </button>
            </div>
          </div>

          {error && <p className="sl__error">{error}</p>}
        </div>
      </div>

      {timings && (
        <>
          {nextPrayer && (
            <div className="sl__next-banner">
              <div className="sl__next-inner">
                <div className="sl__next-left">
                  <span className="sl__next-icon">{nextPrayer.icon}</span>
                  <div>
                    <p className="sl__next-label">{nextPrayer.tomorrow ? "Next prayer (tomorrow)" : "Next prayer"}</p>
                    <p className="sl__next-name">{nextPrayer.arabic} — {nextPrayer.english}</p>
                  </div>
                </div>
                <div className="sl__next-right">
                  <p className="sl__next-time">{toAmPm(nextPrayer.time)}</p>
                  {nextPrayer.minsLeft && (
                    <p className="sl__next-countdown">in {minsToCountdown(nextPrayer.minsLeft)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="sl__main">
            <div className="sl__prayers-section">
              <div className="sl__section-header">
                <div>
                  <h2 className="sl__section-title">Prayer Times</h2>
                  {meta && <p className="sl__section-sub">{city || ""}{city && country ? ", " : ""}{country || ""} · {meta.timezone}</p>}
                </div>
                <button className="sl__monthly-btn" onClick={fetchMonthly}>📅 Monthly View</button>
              </div>

              <div className="sl__prayers-grid">
                {PRAYERS.map(prayer => {
                  const isCurrent = currentPrayerKey === prayer.key;
                  const isNext = nextPrayer?.key === prayer.key;
                  const time = timings[prayer.key];
                  const nowMins = now.getHours() * 60 + now.getMinutes();
                  const isPast = timeToMinutes(time) < nowMins && prayer.key !== "Sunrise";
                  return (
                    <div
                      key={prayer.key}
                      className={`sl__prayer-card ${isCurrent ? "sl__prayer-card--current" : ""} ${isNext ? "sl__prayer-card--next" : ""} ${isPast ? "sl__prayer-card--past" : ""} ${prayer.info ? "sl__prayer-card--info" : ""}`}
                    >
                      {isNext && <div className="sl__prayer-next-tag">Next</div>}
                      {isCurrent && <div className="sl__prayer-now-tag">Now</div>}
                      <div className="sl__prayer-icon">{prayer.icon}</div>
                      <div className="sl__prayer-names">
                        <p className="sl__prayer-arabic">{prayer.arabic}</p>
                        <p className="sl__prayer-english">{prayer.english}</p>
                        <p className="sl__prayer-desc">{prayer.desc}</p>
                      </div>
                      <div className="sl__prayer-time">
                        <p className="sl__prayer-time-main">{toAmPm(time)}</p>
                        <p className="sl__prayer-time-24">{time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sl__side">
              {qiblaAngle !== null && (
                <div className="sl__qibla-card">
                  <h3 className="sl__card-title">🕋 Qibla Direction</h3>
                  <div className="sl__qibla-compass">
                    <div className="sl__compass-ring">
                      <span className="sl__compass-n">N</span>
                      <span className="sl__compass-s">S</span>
                      <span className="sl__compass-e">E</span>
                      <span className="sl__compass-w">W</span>
                      <div
                        className="sl__compass-needle"
                        style={{ transform: `rotate(${qiblaAngle}deg)` }}
                      >
                        <div className="sl__needle-tip" />
                        <div className="sl__needle-tail" />
                      </div>
                      <div className="sl__compass-center" />
                    </div>
                  </div>
                  <p className="sl__qibla-angle">{Math.round(qiblaAngle)}° from North</p>
                  <p className="sl__qibla-sub">Face this direction to pray towards Makkah</p>
                </div>
              )}

              <div className="sl__extra-card">
                <h3 className="sl__card-title">📊 More Times</h3>
                <div className="sl__extra-list">
                  {["Imsak", "Midnight", "Firstthird", "Lastthird"].map(key => (
                    timings[key] && (
                      <div key={key} className="sl__extra-row">
                        <span className="sl__extra-label">
                          {key === "Imsak" ? "Imsak" : key === "Midnight" ? "Midnight" : key === "Firstthird" ? "First Third" : "Last Third"}
                        </span>
                        <span className="sl__extra-time">{toAmPm(timings[key])}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {meta && (
                <div className="sl__extra-card">
                  <h3 className="sl__card-title">⚙️ Calculation Info</h3>
                  <div className="sl__extra-list">
                    <div className="sl__extra-row">
                      <span className="sl__extra-label">Method</span>
                      <span className="sl__extra-time sl__extra-time--sm">{meta.method?.name?.split(",")[0]}</span>
                    </div>
                    <div className="sl__extra-row">
                      <span className="sl__extra-label">Latitude</span>
                      <span className="sl__extra-time">{meta.latitude?.toFixed(4)}°</span>
                    </div>
                    <div className="sl__extra-row">
                      <span className="sl__extra-label">Longitude</span>
                      <span className="sl__extra-time">{meta.longitude?.toFixed(4)}°</span>
                    </div>
                    <div className="sl__extra-row">
                      <span className="sl__extra-label">Timezone</span>
                      <span className="sl__extra-time sl__extra-time--sm">{meta.timezone}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showMonthly && monthlyData && (
            <div className="sl__monthly">
              <div className="sl__monthly-header">
                <h2 className="sl__section-title">
                  Monthly Prayer Times — {gregorian?.month?.en} {gregorian?.year}
                </h2>
                <button className="sl__close-btn" onClick={() => setShowMonthly(false)}>✕ Close</button>
              </div>
              <div className="sl__monthly-table-wrap">
                <table className="sl__monthly-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Fajr</th>
                      <th>Sunrise</th>
                      <th>Dhuhr</th>
                      <th>Asr</th>
                      <th>Maghrib</th>
                      <th>Isha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((day, i) => {
                      const isToday = parseInt(day.date.gregorian.day) === now.getDate();
                      return (
                        <tr key={i} className={isToday ? "sl__monthly-today" : ""}>
                          <td>
                            <span className="sl__monthly-day">{day.date.gregorian.day}</span>
                            <span className="sl__monthly-weekday">{day.date.gregorian.weekday.en.slice(0, 3)}</span>
                          </td>
                          <td>{toAmPm(day.timings.Fajr)}</td>
                          <td>{toAmPm(day.timings.Sunrise)}</td>
                          <td>{toAmPm(day.timings.Dhuhr)}</td>
                          <td>{toAmPm(day.timings.Asr)}</td>
                          <td>{toAmPm(day.timings.Maghrib)}</td>
                          <td>{toAmPm(day.timings.Isha)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!timings && !loading && (
        <div className="sl__empty">
          <div className="sl__empty-icon">🕌</div>
          <h2 className="sl__empty-title">Find Your Prayer Times</h2>
          <p className="sl__empty-sub">Enter your city and country above, or tap "Use My Location" to get accurate prayer times for your area.</p>
        </div>
      )}
    </div>
  );
}