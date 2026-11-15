import { load } from "../hooks/usePersist";

export const META = [
  ["مبادئ إدارة أعمال", "fa-chart-line", "#22E55E"],
  ["مبادئ محاسبة مالية", "fa-receipt", "#FFD60A"],
  ["مبادئ قانون", "fa-scale-balanced", "#FF3B4E"],
  ["إنجليزي", "fa-language", "#A3E635"],
  ["مبادئ اقتصاد", "fa-coins", "#FF8A3D"],
];

// بيانات قديمة: إيموجي وألوان قديمة → أيقونات وألوان جديدة
const EMOJI = { "📊": "fa-chart-line", "🧾": "fa-receipt", "⚖️": "fa-scale-balanced", "🔤": "fa-language", "📈": "fa-coins" };
const COLORS = { "#2EE59D": "#22E55E", "#B14DFF": "#FF3B4E", "#FF9F1C": "#A3E635", "#FF4D8D": "#FF8A3D", "#8B5CF6": "#FFD60A", "#FF6B3D": "#FF8A3D" };

export const ico = (s) => (s.icon && s.icon.startsWith("fa-") ? s.icon : EMOJI[s.icon] || "fa-book");
export const migrate = (list) => list.map((s) => ({ ...s, color: COLORS[s.color] || s.color }));

const seed = () =>
  META.map((m, i) => ({
    id: i + 1,
    name: m[0],
    icon: m[1],
    color: m[2],
    units: [
      {
        id: (i + 1) * 100,
        title: "Lectures",
        type: "pdf",
        lectures: [{ id: (i + 1) * 100 + 1, title: "Lecture 1", type: "pdf", done: false }],
      },
    ],
  }));

export function initSubjects() {
  const old = load("st_subjects_v2");
  if (old && old.length) {
    return old.map((s, i) => ({
      id: s.id,
      name: s.name,
      icon: META[i] ? META[i][1] : "fa-book",
      color: META[i] ? META[i][2] : "#FFD60A",
      units: [{ id: s.id * 100, title: "الوحدة 1", lectures: s.lectures }],
    }));
  }
  return seed();
}

export const CHEERS = [
  "عاش يا بطل! خلصت واحدة كمان",
  "برافو عليك! كل خطوة بتقربك من هدفك",
  "شغل جامد! كمّل كده",
  "إنت ماشي صح، استمر!",
  "تعبك مش هيروح هدر، فخور بيك",
  "ممتاز! النهارده أحسن من إمبارح",
];

export const MODES = {
  focus: { label: "تركيز", sec: 1500, color: "#FFD60A" },
  short: { label: "راحة قصيرة", sec: 300, color: "#22E55E" },
  long: { label: "راحة طويلة", sec: 900, color: "#FF3B4E" },
};

// أنواع الملفات المطلوب مذاكرتها
export const TYPES = {
  pdf: { label: "PDF", icon: "fa-file-pdf", color: "#FF3B4E" },
  pptx: { label: "PPTX", icon: "fa-file-powerpoint", color: "#FF8A3D" },
  book: { label: "BOOK", icon: "fa-book", color: "#FFD60A" },
  quiz: { label: "QUIZ", icon: "fa-circle-question", color: "#22E55E" },
  video: { label: "VIDEO", icon: "fa-circle-play", color: "#A3E635" },
  other: { label: "أخرى", icon: "fa-file-lines", color: "#E5E5E5" },
};

// أقسام جاهزة بضغطة واحدة
export const PRESETS = [
  { title: "Lectures", type: "pdf" },
  { title: "Sections", type: "pptx" },
  { title: "Course Textbook", type: "book" },
  { title: "Quiz", type: "quiz" },
  { title: "Revision", type: "pdf" },
];
