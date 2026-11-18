import { Icon, Bar } from "./ui";
import { stat } from "../utils/helpers";
import { ico } from "../data/subjects";

export default function Sidebar({ subjects, view, setView, done, confirmReset, reset, open, onClose }) {
  const base = "flex w-full items-center gap-3 whitespace-nowrap rounded-xl border-2 px-3 py-2 text-start text-sm transition";
  const off = "border-transparent hover:border-black/20 hover:bg-black/5";
  const on = "border-black font-bold shadow-[3px_3px_0_0_#000]";

  const item = (k, icon, label) => (
    <button
      className={`${base} ${view === k ? `${on} bg-yellow-300` : off}`}
      aria-current={view === k ? "page" : undefined}
      onClick={() => setView(k)}
    >
      <Icon n={icon} className="w-5 text-center" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {/* الطبقة المعتمة (موبايل فقط) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="القائمة الجانبية"
        className={`fixed inset-y-0 start-0 z-40 flex w-72 max-w-[85vw] flex-col gap-1.5 overflow-y-auto border-e-2 border-black bg-white p-4 transition-[transform,visibility] duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:max-w-none lg:translate-x-0 lg:visible ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        <div className="flex items-center gap-3 px-1 pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-black bg-red-500 text-lg text-white shadow-[3px_3px_0_0_#000]">
            <Icon n="fa-graduation-cap" />
          </div>
          <div className="flex-1 leading-tight">
            <b className="block">متابعة الدراسة</b>
            <small className="text-black/55">{done} عنصر خلصت</small>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-black bg-white hover:bg-red-100 lg:hidden"
          >
            <Icon n="fa-xmark" />
          </button>
        </div>

        {item("overview", "fa-table-cells-large", "نظرة عامة")}
        <div className="px-2 pb-1 pt-4 text-xs font-extrabold text-black/40">المواد</div>
        {subjects.map((s) => (
          <button
            key={s.id}
            className={`${base} ${view === s.id ? on : off}`}
            style={view === s.id ? { background: s.color } : undefined}
            aria-current={view === s.id ? "page" : undefined}
            onClick={() => setView(s.id)}
          >
            <Icon n={ico(s)} className="w-5 text-center" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{s.name}</span>
              <span className="mt-1 block">
                <Bar p={stat(s).p} color={s.color} className="!h-1.5 !border" />
              </span>
            </span>
            <span className="font-mono text-xs">{stat(s).p}%</span>
          </button>
        ))}
        <div className="px-2 pb-1 pt-4 text-xs font-extrabold text-black/40">أدوات</div>
        {item("tasks", "fa-stopwatch", "المهام والبومودورو")}
        {item("notes", "fa-pen-to-square", "الملاحظات")}
        {item("guide", "fa-book-open", "دليل الاستخدام")}
        <button className={`${base} ${off} mt-auto text-black/50 hover:!text-red-600`} onClick={reset}>
          <Icon n="fa-arrow-rotate-left" className="w-5 text-center" />
          {confirmReset ? "اضغط تاني للتأكيد" : "إعادة ضبط التقدم"}
        </button>
      </aside>
    </>
  );
}