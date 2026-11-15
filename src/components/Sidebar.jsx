import { Icon, Bar } from "./ui";
import { stat } from "../utils/helpers";
import { ico } from "../data/subjects";

export default function Sidebar({ subjects, view, setView, done, confirmReset, reset }) {
  const base =
    "flex flex-none items-center gap-3 whitespace-nowrap rounded-xl border-2 px-3 py-2 text-start text-sm transition lg:w-full";
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
    <aside
      className="sticky z-20 flex gap-2 overflow-x-auto border-b-2 border-black bg-white p-2 lg:h-screen lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:border-b-0 lg:border-e-2 lg:p-4"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="hidden items-center gap-3 px-1 pb-4 lg:flex">
        <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-black bg-red-500 text-lg text-white shadow-[3px_3px_0_0_#000]">
          <Icon n="fa-graduation-cap" />
        </div>
        <div className="leading-tight">
          <b className="block">متابعة الدراسة</b>
          <small className="text-black/55">{done} عنصر خلصت</small>
        </div>
      </div>

      {item("overview", "fa-table-cells-large", "نظرة عامة")}
      <div className="hidden px-2 pb-1 pt-4 text-xs font-extrabold text-black/40 lg:block">المواد</div>
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
            {s.name}
            <span className="mt-1 hidden lg:block">
              <Bar p={stat(s).p} color={s.color} className="!h-1.5 !border" />
            </span>
          </span>
          <span className="hidden font-mono text-xs lg:inline">{stat(s).p}%</span>
        </button>
      ))}
      <div className="hidden px-2 pb-1 pt-4 text-xs font-extrabold text-black/40 lg:block">أدوات</div>
      {item("tasks", "fa-stopwatch", "المهام والبومودورو")}
      {item("notes", "fa-pen-to-square", "الملاحظات")}
      <button className={`${base} ${off} text-black/50 hover:!text-red-600 lg:mt-auto`} onClick={reset}>
        <Icon n="fa-arrow-rotate-left" className="w-5 text-center" />
        {confirmReset ? "اضغط تاني للتأكيد" : "إعادة ضبط التقدم"}
      </button>
    </aside>
  );
}
