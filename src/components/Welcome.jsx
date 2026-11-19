import { Icon, btnMain } from "./ui";

const steps = [
  { icon: "fa-folder-plus", color: "#FFD60A", t: "ضيف موادك", d: "من صفحة «نظرة عامة» اختار مادة جاهزة أو اكتب اسم مادتك." },
  { icon: "fa-list-check", color: "#22E55E", t: "ضيف دروسك وعلّم اللي خلّصته", d: "ادخل المادة وضيف المحاضرات والسكاشن. ولما تخلّص درس علّم عليه والنسبة بتزيد لوحدها." },
  { icon: "fa-calendar-day", color: "#FF3B4E", t: "حدد ميعاد الامتحان", d: "هتعرف فاضل كام يوم، وتذاكر كام درس في اليوم علشان تلحق." },
];

export default function Welcome({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000]"
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 id="welcome-title" className="text-2xl font-extrabold">
            أهلاً بيك في متابعة الدراسة
          </h2>
          <button onClick={onClose} aria-label="إغلاق" className="grid h-9 w-9 flex-none place-items-center rounded-lg border-2 border-black hover:bg-red-100">
            <Icon n="fa-xmark" />
          </button>
        </div>
        <p className="mb-5 text-sm leading-7 text-black/60">
          مكان واحد ترتّب فيه مذاكرتك وتعرف إنت وصلت فين وفاضل عليك إيه. هتبدأ في 3 خطوات بسيطة:
        </p>
        <ol className="grid gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 rounded-xl border-2 border-black p-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border-2 border-black text-lg" style={{ background: s.color }}>
                <Icon n={s.icon} />
              </span>
              <div>
                <b className="block">
                  {i + 1}. {s.t}
                </b>
                <span className="text-sm leading-6 text-black/60">{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg bg-yellow-100 p-3 text-xs leading-6">
          <Icon n="fa-lock" className="me-1" /> بياناتك محفوظة على جهازك إنت بس، ومفيش تسجيل ولا حساب.
        </p>
        <button onClick={onClose} className={`${btnMain} mt-5 w-full`}>
          يلا نبدأ
        </button>
      </div>
    </div>
  );
}