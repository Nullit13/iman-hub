import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/quran.css";

const SURAHS = [
  { number: 1,   name: "الفاتحة",    english: "Al-Fatihah",    startPage: 1,   ayahs: 7   },
  { number: 2,   name: "البقرة",     english: "Al-Baqarah",    startPage: 2,   ayahs: 286 },
  { number: 3,   name: "آل عمران",   english: "Ali 'Imran",    startPage: 50,  ayahs: 200 },
  { number: 4,   name: "النساء",     english: "An-Nisa",       startPage: 77,  ayahs: 176 },
  { number: 5,   name: "المائدة",    english: "Al-Ma'idah",    startPage: 106, ayahs: 120 },
  { number: 6,   name: "الأنعام",    english: "Al-An'am",      startPage: 128, ayahs: 165 },
  { number: 7,   name: "الأعراف",    english: "Al-A'raf",      startPage: 151, ayahs: 206 },
  { number: 8,   name: "الأنفال",    english: "Al-Anfal",      startPage: 177, ayahs: 75  },
  { number: 9,   name: "التوبة",     english: "At-Tawbah",     startPage: 187, ayahs: 129 },
  { number: 10,  name: "يونس",       english: "Yunus",         startPage: 208, ayahs: 109 },
  { number: 11,  name: "هود",        english: "Hud",           startPage: 221, ayahs: 123 },
  { number: 12,  name: "يوسف",       english: "Yusuf",         startPage: 235, ayahs: 111 },
  { number: 13,  name: "الرعد",      english: "Ar-Ra'd",       startPage: 249, ayahs: 43  },
  { number: 14,  name: "إبراهيم",    english: "Ibrahim",       startPage: 255, ayahs: 52  },
  { number: 15,  name: "الحجر",      english: "Al-Hijr",       startPage: 262, ayahs: 99  },
  { number: 16,  name: "النحل",      english: "An-Nahl",       startPage: 267, ayahs: 128 },
  { number: 17,  name: "الإسراء",    english: "Al-Isra",       startPage: 282, ayahs: 111 },
  { number: 18,  name: "الكهف",      english: "Al-Kahf",       startPage: 293, ayahs: 110 },
  { number: 19,  name: "مريم",       english: "Maryam",        startPage: 305, ayahs: 98  },
  { number: 20,  name: "طه",         english: "Ta-Ha",         startPage: 312, ayahs: 135 },
  { number: 21,  name: "الأنبياء",   english: "Al-Anbiya",     startPage: 322, ayahs: 112 },
  { number: 22,  name: "الحج",       english: "Al-Hajj",       startPage: 332, ayahs: 78  },
  { number: 23,  name: "المؤمنون",   english: "Al-Mu'minun",   startPage: 342, ayahs: 118 },
  { number: 24,  name: "النور",      english: "An-Nur",        startPage: 350, ayahs: 64  },
  { number: 25,  name: "الفرقان",    english: "Al-Furqan",     startPage: 359, ayahs: 77  },
  { number: 26,  name: "الشعراء",    english: "Ash-Shu'ara",   startPage: 367, ayahs: 227 },
  { number: 27,  name: "النمل",      english: "An-Naml",       startPage: 377, ayahs: 93  },
  { number: 28,  name: "القصص",      english: "Al-Qasas",      startPage: 385, ayahs: 88  },
  { number: 29,  name: "العنكبوت",   english: "Al-'Ankabut",   startPage: 396, ayahs: 69  },
  { number: 30,  name: "الروم",      english: "Ar-Rum",        startPage: 404, ayahs: 60  },
  { number: 31,  name: "لقمان",      english: "Luqman",        startPage: 411, ayahs: 34  },
  { number: 32,  name: "السجدة",     english: "As-Sajdah",     startPage: 415, ayahs: 30  },
  { number: 33,  name: "الأحزاب",    english: "Al-Ahzab",      startPage: 418, ayahs: 73  },
  { number: 34,  name: "سبأ",        english: "Saba",          startPage: 428, ayahs: 54  },
  { number: 35,  name: "فاطر",       english: "Fatir",         startPage: 434, ayahs: 45  },
  { number: 36,  name: "يس",         english: "Ya-Sin",        startPage: 440, ayahs: 83  },
  { number: 37,  name: "الصافات",    english: "As-Saffat",     startPage: 446, ayahs: 182 },
  { number: 38,  name: "ص",          english: "Sad",           startPage: 453, ayahs: 88  },
  { number: 39,  name: "الزمر",      english: "Az-Zumar",      startPage: 458, ayahs: 75  },
  { number: 40,  name: "غافر",       english: "Ghafir",        startPage: 467, ayahs: 85  },
  { number: 41,  name: "فصلت",       english: "Fussilat",      startPage: 477, ayahs: 54  },
  { number: 42,  name: "الشورى",     english: "Ash-Shura",     startPage: 483, ayahs: 53  },
  { number: 43,  name: "الزخرف",     english: "Az-Zukhruf",    startPage: 489, ayahs: 89  },
  { number: 44,  name: "الدخان",     english: "Ad-Dukhan",     startPage: 496, ayahs: 59  },
  { number: 45,  name: "الجاثية",    english: "Al-Jathiyah",   startPage: 499, ayahs: 37  },
  { number: 46,  name: "الأحقاف",    english: "Al-Ahqaf",      startPage: 502, ayahs: 35  },
  { number: 47,  name: "محمد",       english: "Muhammad",      startPage: 507, ayahs: 38  },
  { number: 48,  name: "الفتح",      english: "Al-Fath",       startPage: 511, ayahs: 29  },
  { number: 49,  name: "الحجرات",    english: "Al-Hujurat",    startPage: 515, ayahs: 18  },
  { number: 50,  name: "ق",          english: "Qaf",           startPage: 518, ayahs: 45  },
  { number: 51,  name: "الذاريات",   english: "Adh-Dhariyat",  startPage: 520, ayahs: 60  },
  { number: 52,  name: "الطور",      english: "At-Tur",        startPage: 523, ayahs: 49  },
  { number: 53,  name: "النجم",      english: "An-Najm",       startPage: 526, ayahs: 62  },
  { number: 54,  name: "القمر",      english: "Al-Qamar",      startPage: 528, ayahs: 55  },
  { number: 55,  name: "الرحمن",     english: "Ar-Rahman",     startPage: 531, ayahs: 78  },
  { number: 56,  name: "الواقعة",    english: "Al-Waqi'ah",    startPage: 534, ayahs: 96  },
  { number: 57,  name: "الحديد",     english: "Al-Hadid",      startPage: 537, ayahs: 29  },
  { number: 58,  name: "المجادلة",   english: "Al-Mujadila",   startPage: 542, ayahs: 22  },
  { number: 59,  name: "الحشر",      english: "Al-Hashr",      startPage: 545, ayahs: 24  },
  { number: 60,  name: "الممتحنة",   english: "Al-Mumtahanah", startPage: 549, ayahs: 13  },
  { number: 61,  name: "الصف",       english: "As-Saf",        startPage: 551, ayahs: 14  },
  { number: 62,  name: "الجمعة",     english: "Al-Jumu'ah",    startPage: 553, ayahs: 11  },
  { number: 63,  name: "المنافقون",  english: "Al-Munafiqun",  startPage: 554, ayahs: 11  },
  { number: 64,  name: "التغابن",    english: "At-Taghabun",   startPage: 556, ayahs: 18  },
  { number: 65,  name: "الطلاق",     english: "At-Talaq",      startPage: 558, ayahs: 12  },
  { number: 66,  name: "التحريم",    english: "At-Tahrim",     startPage: 560, ayahs: 12  },
  { number: 67,  name: "الملك",      english: "Al-Mulk",       startPage: 562, ayahs: 30  },
  { number: 68,  name: "القلم",      english: "Al-Qalam",      startPage: 564, ayahs: 52  },
  { number: 69,  name: "الحاقة",     english: "Al-Haqqah",     startPage: 566, ayahs: 52  },
  { number: 70,  name: "المعارج",    english: "Al-Ma'arij",    startPage: 568, ayahs: 44  },
  { number: 71,  name: "نوح",        english: "Nuh",           startPage: 570, ayahs: 28  },
  { number: 72,  name: "الجن",       english: "Al-Jinn",       startPage: 572, ayahs: 28  },
  { number: 73,  name: "المزمل",     english: "Al-Muzzammil",  startPage: 574, ayahs: 20  },
  { number: 74,  name: "المدثر",     english: "Al-Muddaththir",startPage: 575, ayahs: 56  },
  { number: 75,  name: "القيامة",    english: "Al-Qiyamah",    startPage: 577, ayahs: 40  },
  { number: 76,  name: "الإنسان",    english: "Al-Insan",      startPage: 578, ayahs: 31  },
  { number: 77,  name: "المرسلات",   english: "Al-Mursalat",   startPage: 580, ayahs: 50  },
  { number: 78,  name: "النبأ",      english: "An-Naba",       startPage: 582, ayahs: 40  },
  { number: 79,  name: "النازعات",   english: "An-Nazi'at",    startPage: 583, ayahs: 46  },
  { number: 80,  name: "عبس",        english: "'Abasa",        startPage: 585, ayahs: 42  },
  { number: 81,  name: "التكوير",    english: "At-Takwir",     startPage: 586, ayahs: 29  },
  { number: 82,  name: "الانفطار",   english: "Al-Infitar",    startPage: 587, ayahs: 19  },
  { number: 83,  name: "المطففين",   english: "Al-Mutaffifin", startPage: 587, ayahs: 36  },
  { number: 84,  name: "الانشقاق",   english: "Al-Inshiqaq",   startPage: 589, ayahs: 25  },
  { number: 85,  name: "البروج",     english: "Al-Buruj",      startPage: 590, ayahs: 22  },
  { number: 86,  name: "الطارق",     english: "At-Tariq",      startPage: 591, ayahs: 17  },
  { number: 87,  name: "الأعلى",     english: "Al-A'la",       startPage: 591, ayahs: 19  },
  { number: 88,  name: "الغاشية",    english: "Al-Ghashiyah",  startPage: 592, ayahs: 26  },
  { number: 89,  name: "الفجر",      english: "Al-Fajr",       startPage: 592, ayahs: 30  },
  { number: 90,  name: "البلد",      english: "Al-Balad",      startPage: 594, ayahs: 20  },
  { number: 91,  name: "الشمس",      english: "Ash-Shams",     startPage: 595, ayahs: 15  },
  { number: 92,  name: "الليل",      english: "Al-Layl",       startPage: 595, ayahs: 21  },
  { number: 93,  name: "الضحى",      english: "Ad-Duhaa",      startPage: 596, ayahs: 11  },
  { number: 94,  name: "الشرح",      english: "Ash-Sharh",     startPage: 596, ayahs: 8   },
  { number: 95,  name: "التين",      english: "At-Tin",        startPage: 597, ayahs: 8   },
  { number: 96,  name: "العلق",      english: "Al-'Alaq",      startPage: 597, ayahs: 19  },
  { number: 97,  name: "القدر",      english: "Al-Qadr",       startPage: 598, ayahs: 5   },
  { number: 98,  name: "البينة",     english: "Al-Bayyinah",   startPage: 598, ayahs: 8   },
  { number: 99,  name: "الزلزلة",    english: "Az-Zalzalah",   startPage: 599, ayahs: 8   },
  { number: 100, name: "العاديات",   english: "Al-'Adiyat",    startPage: 599, ayahs: 11  },
  { number: 101, name: "القارعة",    english: "Al-Qari'ah",    startPage: 600, ayahs: 11  },
  { number: 102, name: "التكاثر",    english: "At-Takathur",   startPage: 600, ayahs: 8   },
  { number: 103, name: "العصر",      english: "Al-'Asr",       startPage: 601, ayahs: 3   },
  { number: 104, name: "الهمزة",     english: "Al-Humazah",    startPage: 601, ayahs: 9   },
  { number: 105, name: "الفيل",      english: "Al-Fil",        startPage: 601, ayahs: 5   },
  { number: 106, name: "قريش",       english: "Quraysh",       startPage: 602, ayahs: 4   },
  { number: 107, name: "الماعون",    english: "Al-Ma'un",      startPage: 602, ayahs: 7   },
  { number: 108, name: "الكوثر",     english: "Al-Kawthar",    startPage: 602, ayahs: 3   },
  { number: 109, name: "الكافرون",   english: "Al-Kafirun",    startPage: 603, ayahs: 6   },
  { number: 110, name: "النصر",      english: "An-Nasr",       startPage: 603, ayahs: 3   },
  { number: 111, name: "المسد",      english: "Al-Masad",      startPage: 604, ayahs: 5   },
  { number: 112, name: "الإخلاص",    english: "Al-Ikhlas",     startPage: 604, ayahs: 4   },
  { number: 113, name: "الفلق",      english: "Al-Falaq",      startPage: 604, ayahs: 5   },
  { number: 114, name: "الناس",      english: "An-Nas",        startPage: 604, ayahs: 6   },
];

const TOTAL_PAGES = 604;

function loadLS(key, def) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; }
  catch { return def; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getPageSurah(page) {
  let result = SURAHS[0];
  for (const s of SURAHS) {
    if (s.startPage <= page) result = s;
    else break;
  }
  return result;
}

export default function Quran() {
  const [tab, setTab] = useState("read");

  const [currentPage, setCurrentPage] = useState(() => loadLS("q_page", 1));
  const [readPages, setReadPages] = useState(() => loadLS("q_readPages", []));
  const [khatams, setKhatams] = useState(() => loadLS("q_khatams", []));
  const [activeKhatam, setActiveKhatam] = useState(() => loadLS("q_activeKhatam", null));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showPageJump, setShowPageJump] = useState(false);
  const [jumpVal, setJumpVal] = useState("");
  const [newKhatamName, setNewKhatamName] = useState("");
  const [showNewKhatam, setShowNewKhatam] = useState(false);

  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [audioUrl, setAudioUrl] = useState("");
  const [recitersLoading, setRecitersLoading] = useState(false);
  const [reciterSearch, setReciterSearch] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const currentSurah = getPageSurah(currentPage);

  useEffect(() => { saveLS("q_page", currentPage); setImgLoaded(false); }, [currentPage]);
  useEffect(() => { saveLS("q_readPages", readPages); }, [readPages]);
  useEffect(() => { saveLS("q_khatams", khatams); }, [khatams]);
  useEffect(() => { saveLS("q_activeKhatam", activeKhatam); }, [activeKhatam]);

  const markPageRead = useCallback(() => {
    setReadPages(prev => prev.includes(currentPage) ? prev : [...prev, currentPage]);
    if (activeKhatam) {
      setKhatams(prev => prev.map(k => {
        if (k.id !== activeKhatam) return k;
        const pages = k.pages.includes(currentPage) ? k.pages : [...k.pages, currentPage];
        const completed = pages.length >= TOTAL_PAGES;
        return { ...k, pages, completed, completedAt: completed && !k.completed ? new Date().toISOString() : k.completedAt };
      }));
    }
  }, [currentPage, activeKhatam]);

  const goToPage = useCallback((p) => {
    const page = Math.max(1, Math.min(TOTAL_PAGES, p));
    setCurrentPage(page);
  }, []);

  const createKhatam = () => {
    if (!newKhatamName.trim()) return;
    const k = { id: Date.now(), name: newKhatamName.trim(), pages: [], createdAt: new Date().toISOString(), completed: false, completedAt: null };
    setKhatams(prev => [...prev, k]);
    setActiveKhatam(k.id);
    setNewKhatamName("");
    setShowNewKhatam(false);
  };

  const deleteKhatam = (id) => {
    setKhatams(prev => prev.filter(k => k.id !== id));
    if (activeKhatam === id) setActiveKhatam(null);
  };

  const activeKhatamData = khatams.find(k => k.id === activeKhatam);
  const khatamProgress = activeKhatamData ? Math.round((activeKhatamData.pages.length / TOTAL_PAGES) * 100) : 0;
  const totalReadPages = readPages.length;
  const overallProgress = Math.round((totalReadPages / TOTAL_PAGES) * 100);

  useEffect(() => {
    if (tab !== "listen") return;
    setRecitersLoading(true);
    fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
      .then(r => r.json())
      .then(data => {
        const list = data.reciters || [];
        setReciters(list);
        if (list.length > 0) setSelectedReciter(list[0]);
      })
      .catch(() => {})
      .finally(() => setRecitersLoading(false));
  }, [tab]);

  useEffect(() => {
    if (!selectedReciter || !selectedSurahNum) return;
    const server = selectedReciter.moshaf?.[0]?.server;
    if (!server) return;
    const padded = String(selectedSurahNum).padStart(3, "0");
    setAudioUrl(`${server}${padded}.mp3`);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [selectedReciter, selectedSurahNum]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play(); setIsPlaying(true); }
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * duration;
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filteredReciters = reciters.filter(r =>
    r.name.toLowerCase().includes(reciterSearch.toLowerCase())
  );

  const readPct = Math.round((readPages.length / TOTAL_PAGES) * 100);

  return (
    <div className="qr">
      <div className="qr__header">
        <div className="qr__header-inner">
          <div className="qr__header-left">
            <h1 className="qr__title">القرآن الكريم</h1>
            <p className="qr__subtitle">The Noble Quran</p>
          </div>
          <div className="qr__tabs">
            <button className={`qr__tab ${tab === "read" ? "qr__tab--active" : ""}`} onClick={() => setTab("read")}>
              <span>📖</span> Read
            </button>
            <button className={`qr__tab ${tab === "listen" ? "qr__tab--active" : ""}`} onClick={() => setTab("listen")}>
              <span>🎧</span> Listen
            </button>
            <button className={`qr__tab ${tab === "tracker" ? "qr__tab--active" : ""}`} onClick={() => setTab("tracker")}>
              <span>📊</span> Tracker
            </button>
          </div>
        </div>
      </div>

      {tab === "read" && (
        <div className="qr__read">
          <div className="qr__read-layout">
            <aside className="qr__sidebar">
              <div className="qr__sidebar-section">
                <p className="qr__sidebar-label">Current Surah</p>
                <p className="qr__sidebar-surah-ar">{currentSurah.name}</p>
                <p className="qr__sidebar-surah-en">{currentSurah.english}</p>
              </div>

              <div className="qr__sidebar-section">
                <p className="qr__sidebar-label">Jump to Surah</p>
                <select className="qr__select" onChange={e => goToPage(Number(e.target.value))} value={currentSurah.startPage}>
                  {SURAHS.map(s => (
                    <option key={s.number} value={s.startPage}>{s.number}. {s.name} — {s.english}</option>
                  ))}
                </select>
              </div>

              <div className="qr__sidebar-section">
                <p className="qr__sidebar-label">Page {currentPage} of {TOTAL_PAGES}</p>
                <div className="qr__progress-bar">
                  <div className="qr__progress-fill" style={{ width: `${(currentPage / TOTAL_PAGES) * 100}%` }} />
                </div>
              </div>

              <div className="qr__sidebar-section">
                <p className="qr__sidebar-label">Overall Progress</p>
                <div className="qr__stat-row">
                  <span className="qr__stat-num">{readPct}%</span>
                  <span className="qr__stat-sub">{totalReadPages} / {TOTAL_PAGES} pages read</span>
                </div>
                <div className="qr__progress-bar">
                  <div className="qr__progress-fill qr__progress-fill--gold" style={{ width: `${readPct}%` }} />
                </div>
              </div>

              {activeKhatamData && (
                <div className="qr__sidebar-section qr__khatam-badge">
                  <p className="qr__sidebar-label">Active Khatam</p>
                  <p className="qr__khatam-name">{activeKhatamData.name}</p>
                  <div className="qr__stat-row">
                    <span className="qr__stat-num">{khatamProgress}%</span>
                    <span className="qr__stat-sub">{activeKhatamData.pages.length} pages</span>
                  </div>
                  <div className="qr__progress-bar">
                    <div className="qr__progress-fill qr__progress-fill--green" style={{ width: `${khatamProgress}%` }} />
                  </div>
                </div>
              )}

              <button className="qr__mark-btn" onClick={markPageRead}>
                {readPages.includes(currentPage) ? "✅ Page Marked" : "✔ Mark as Read"}
              </button>
            </aside>

            <div className="qr__page-viewer">
              <div className="qr__img-wrap">
                {!imgLoaded && <div className="qr__img-skeleton" />}
                <div className="qr__img-paper">
                  <img
                    key={currentPage}
                    className={`qr__img ${imgLoaded ? "qr__img--loaded" : ""}`}
                    src={`https://raw.githubusercontent.com/BetimShala/quran-images-api/refs/heads/master/quran-images/${currentPage}.png`}
                    alt={`Quran page ${currentPage}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                </div>
              </div>

              <div className="qr__controls">
                <button className="qr__ctrl-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                  ← Prev
                </button>

                <button className="qr__page-pill" onClick={() => { setShowPageJump(true); setJumpVal(String(currentPage)); }}>
                  {currentPage} / {TOTAL_PAGES}
                </button>

                <button className="qr__ctrl-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= TOTAL_PAGES}>
                  Next →
                </button>
              </div>

              {showPageJump && (
                <div className="qr__jump-overlay" onClick={() => setShowPageJump(false)}>
                  <div className="qr__jump-box" onClick={e => e.stopPropagation()}>
                    <p className="qr__jump-title">Go to Page</p>
                    <input
                      className="qr__jump-input"
                      type="number"
                      min={1}
                      max={TOTAL_PAGES}
                      value={jumpVal}
                      onChange={e => setJumpVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { goToPage(Number(jumpVal)); setShowPageJump(false); }}}
                      autoFocus
                    />
                    <div className="qr__jump-actions">
                      <button className="qr__jump-cancel" onClick={() => setShowPageJump(false)}>Cancel</button>
                      <button className="qr__jump-go" onClick={() => { goToPage(Number(jumpVal)); setShowPageJump(false); }}>Go</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "listen" && (
        <div className="qr__listen">
          <div className="qr__listen-layout">
            <div className="qr__listen-panel">
              <p className="qr__sidebar-label">Reciters</p>
              <div className="qr__reciter-search-wrap">
                <span className="qr__reciter-search-icon">🔍</span>
                <input
                  className="qr__reciter-search"
                  placeholder="Search reciter…"
                  value={reciterSearch}
                  onChange={e => setReciterSearch(e.target.value)}
                />
              </div>
              {recitersLoading && <p className="qr__loading">Loading reciters…</p>}
              {!recitersLoading && reciters.length === 0 && (
                <p className="qr__error">Could not load reciters. Check your connection.</p>
              )}
              <div className="qr__reciters-list">
                {filteredReciters.map(r => (
                  <button
                    key={r.id}
                    className={`qr__reciter-btn ${selectedReciter?.id === r.id ? "qr__reciter-btn--active" : ""}`}
                    onClick={() => setSelectedReciter(r)}
                  >
                    <span className="qr__reciter-avatar">{r.name.charAt(0)}</span>
                    <span className="qr__reciter-name">{r.name}</span>
                  </button>
                ))}
                {filteredReciters.length === 0 && !recitersLoading && (
                  <p className="qr__error">No results for "{reciterSearch}"</p>
                )}
              </div>
            </div>

            <div className="qr__listen-main">
              <div className="qr__listen-section">
                <p className="qr__sidebar-label">Select Surah</p>
                <select className="qr__select" value={selectedSurahNum} onChange={e => setSelectedSurahNum(Number(e.target.value))}>
                  {SURAHS.map(s => (
                    <option key={s.number} value={s.number}>{s.number}. {s.name} — {s.english}</option>
                  ))}
                </select>
              </div>

              {selectedReciter && (
                <div className="qr__player-card">
                  <div className="qr__player-bg-art" aria-hidden="true">
                    <div className="qr__player-orb qr__player-orb--1" />
                    <div className="qr__player-orb qr__player-orb--2" />
                  </div>

                  <div className="qr__player-top">
                    <div className="qr__player-disc">
                      <span className="qr__player-disc-inner">{isPlaying ? "▶" : "🎙️"}</span>
                    </div>
                    <div className="qr__player-meta">
                      <p className="qr__player-reciter">{selectedReciter.name}</p>
                      <p className="qr__player-surah-ar">{SURAHS[selectedSurahNum - 1]?.name}</p>
                      <p className="qr__player-surah-en">{SURAHS[selectedSurahNum - 1]?.english} · Surah {selectedSurahNum}</p>
                    </div>
                  </div>

                  {audioUrl && (
                    <audio
                      ref={audioRef}
                      key={audioUrl}
                      src={audioUrl}
                      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}

                  <div className="qr__player-seek-wrap" onClick={handleSeek}>
                    <div className="qr__player-seek-track">
                      <div
                        className="qr__player-seek-fill"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                      />
                      <div
                        className="qr__player-seek-thumb"
                        style={{ left: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                      />
                    </div>
                    <div className="qr__player-times">
                      <span>{fmt(currentTime)}</span>
                      <span>{fmt(duration)}</span>
                    </div>
                  </div>

                  <div className="qr__player-controls">
                    <button
                      className="qr__player-skip"
                      onClick={() => setSelectedSurahNum(n => Math.max(1, n - 1))}
                      disabled={selectedSurahNum <= 1}
                      title="Previous Surah"
                    >⏮</button>

                    <button className="qr__player-play" onClick={togglePlay}>
                      {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button
                      className="qr__player-skip"
                      onClick={() => setSelectedSurahNum(n => Math.min(114, n + 1))}
                      disabled={selectedSurahNum >= 114}
                      title="Next Surah"
                    >⏭</button>
                  </div>

                  <div className="qr__player-volume">
                    <span className="qr__player-vol-icon">{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="qr__player-vol-slider"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "tracker" && (
        <div className="qr__tracker">
          <div className="qr__tracker-top">
            <div className="qr__tracker-stat-card">
              <p className="qr__tracker-stat-val">{overallProgress}%</p>
              <p className="qr__tracker-stat-label">Overall Quran Read</p>
              <div className="qr__progress-bar qr__progress-bar--lg">
                <div className="qr__progress-fill qr__progress-fill--gold" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
            <div className="qr__tracker-stat-card">
              <p className="qr__tracker-stat-val">{totalReadPages}</p>
              <p className="qr__tracker-stat-label">Pages Read</p>
            </div>
            <div className="qr__tracker-stat-card">
              <p className="qr__tracker-stat-val">{khatams.filter(k => k.completed).length}</p>
              <p className="qr__tracker-stat-label">Khatams Completed</p>
            </div>
            <div className="qr__tracker-stat-card">
              <p className="qr__tracker-stat-val">{TOTAL_PAGES - totalReadPages}</p>
              <p className="qr__tracker-stat-label">Pages Remaining</p>
            </div>
          </div>

          <div className="qr__tracker-body">
            <div className="qr__khatams-header">
              <h2 className="qr__khatams-title">Khatam Sessions</h2>
              <button className="qr__new-khatam-btn" onClick={() => setShowNewKhatam(true)}>+ New Khatam</button>
            </div>

            {showNewKhatam && (
              <div className="qr__new-khatam-form">
                <input
                  className="qr__jump-input"
                  placeholder="Khatam name (e.g. Ramadan 2025)"
                  value={newKhatamName}
                  onChange={e => setNewKhatamName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createKhatam()}
                  autoFocus
                />
                <div className="qr__jump-actions">
                  <button className="qr__jump-cancel" onClick={() => setShowNewKhatam(false)}>Cancel</button>
                  <button className="qr__jump-go" onClick={createKhatam}>Create</button>
                </div>
              </div>
            )}

            {khatams.length === 0 && (
              <div className="qr__empty">
                <p className="qr__empty-icon">📿</p>
                <p className="qr__empty-text">No khatam sessions yet.</p>
                <p className="qr__empty-sub">Start one to track your Quran completion journey.</p>
              </div>
            )}

            <div className="qr__khatams-list">
              {khatams.map(k => {
                const pct = Math.round((k.pages.length / TOTAL_PAGES) * 100);
                const isActive = k.id === activeKhatam;
                return (
                  <div key={k.id} className={`qr__khatam-card ${isActive ? "qr__khatam-card--active" : ""} ${k.completed ? "qr__khatam-card--done" : ""}`}>
                    <div className="qr__khatam-card-top">
                      <div>
                        <p className="qr__khatam-card-name">
                          {k.completed && "🏅 "}{k.name}
                          {isActive && <span className="qr__khatam-active-tag">Active</span>}
                        </p>
                        <p className="qr__khatam-card-date">Started {new Date(k.createdAt).toLocaleDateString()}</p>
                        {k.completed && <p className="qr__khatam-card-date">Completed {new Date(k.completedAt).toLocaleDateString()} · ماشاءالله!</p>}
                      </div>
                      <div className="qr__khatam-card-actions">
                        {!isActive && !k.completed && (
                          <button className="qr__khatam-action" onClick={() => setActiveKhatam(k.id)}>Set Active</button>
                        )}
                        <button className="qr__khatam-action qr__khatam-action--del" onClick={() => deleteKhatam(k.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="qr__stat-row">
                      <span className="qr__stat-num">{pct}%</span>
                      <span className="qr__stat-sub">{k.pages.length} / {TOTAL_PAGES} pages</span>
                    </div>
                    <div className="qr__progress-bar">
                      <div className={`qr__progress-fill ${k.completed ? "qr__progress-fill--gold" : "qr__progress-fill--green"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="qr__pages-grid-section">
              <h3 className="qr__pages-grid-title">Page Map — {TOTAL_PAGES} Pages</h3>
              <p className="qr__pages-grid-legend">
                <span className="qr__dot qr__dot--read" /> Read &nbsp;
                <span className="qr__dot qr__dot--current" /> Current &nbsp;
                <span className="qr__dot qr__dot--unread" /> Unread
              </p>
              <div className="qr__pages-grid">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    title={`Page ${p}`}
                    className={`qr__page-dot ${p === currentPage ? "qr__page-dot--current" : readPages.includes(p) ? "qr__page-dot--read" : ""}`}
                    onClick={() => { setTab("read"); goToPage(p); }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}