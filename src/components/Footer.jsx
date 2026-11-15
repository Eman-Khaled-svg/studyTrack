import { Icon } from "./ui";

export default function Footer({ setView, done, total, subjects }) {
  const links = [
    ["overview", "fa-table-cells-large", "نظرة عامة"],
    ["tasks", "fa-stopwatch", "المهام والبومودورو"],
    ["notes", "fa-pen-to-square", "الملاحظات"],
  ];
  return (
    <footer className="mt-12 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
      <div className="grid gap-6 p-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-red-500 text-white shadow-[2px_2px_0_0_#000]">
              <Icon n="fa-graduation-cap" />
            </div>
            <b className="text-lg">متابعة الدراسة</b>
          </div>
          <p className="text-sm leading-7 text-black/60">رتّب مذاكرتك، تابع تقدمك، وخلّي كل يوم أحسن من اللي قبله.</p>
        </div>

        <nav aria-label="روابط سريعة">
          <h3 className="mb-3 text-xs font-extrabold text-black/40">روابط سريعة</h3>
          <ul className="grid gap-1">
            {links.map(([k, icon, label]) => (
              <li key={k}>
                <button
                  onClick={() => {
                    setView(k);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition hover:bg-yellow-300"
                >
                  <Icon n={icon} className="w-5 text-center" /> {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-3 text-xs font-extrabold text-black/40">ملخصك</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border-2 border-black bg-green-400 p-3 text-center">
              <div className="text-2xl font-extrabold">{done}</div>
              <div className="text-xs font-semibold">عنصر خلصان</div>
            </div>
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-3 text-center">
              <div className="text-2xl font-extrabold">{subjects}</div>
              <div className="text-xs font-semibold">مادة</div>
            </div>
          </div>
          <p className="mt-3 font-mono text-xs text-black/50">
            {total - done} عنصر متبقي من {total}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-black bg-yellow-300 px-6 py-3 text-xs font-bold">
        <span>© {new Date().getFullYear()} متابعة الدراسة</span>
        <span>
     <Icon n="fa-heart" className="mx-1 text-red-600" />Made  By Emoo.K<Icon n="fa-mug-hot" className="ms-1" />
        </span>
      </div>
    </footer>
  );
}