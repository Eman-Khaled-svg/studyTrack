import { Icon, Bar, Ring, IconBox, card, muted } from "./ui";
import { lecs, stat, pct, today, daysLeft, streak } from "../utils/helpers";
import { ico, TYPES } from "../data/subjects";

const key = (s) => {
  const n = daysLeft(s.exam);
  return n === null || n < 0 ? 9999 : n;
};

export default function Overview({ subjects, open, toggleItem }) {
  const all = subjects.flatMap(lecs);
  const d = all.filter((x) => x.done).length;
  const p = pct(d, all.length);
  const doneToday = all.filter((l) => l.doneAt === today()).length;
  const byExam = [...subjects].sort((a, b) => key(a) - key(b));
  const nextExam = byExam[0] && key(byExam[0]) < 9999 ? byExam[0] : null;
  // أول عنصرين لسه ما اتذاكروش من كل مادة، والمواد القريب امتحانها الأول
  const next = byExam
    .flatMap((s) => s.units.flatMap((u) => u.lectures.filter((l) => !l.done).map((l) => ({ s, u, l }))).slice(0, 2))
    .slice(0, 6);
    const exams = subjects.filter((s) => daysLeft(s.exam) !== null).sort((a, b) => a.exam.localeCompare(b.exam));

  const tiles = [
    { icon: "fa-fire", color: "#FF8A3D", v: streak(subjects), l: "يوم متتالي" },
    { icon: "fa-bolt", color: "#FFD60A", v: doneToday, l: "خلصت النهارده" },
    {
      icon: "fa-calendar-day",
      color: "#FF3B4E",
      v: nextExam ? daysLeft(nextExam.exam) : "—",
      l: nextExam ? `يوم لامتحان ${nextExam.name}` : "حدد موعد امتحان",
    },
  ];

  return (
    <div>
      <div className={`${card} flex flex-wrap items-center gap-6 !bg-yellow-300`}>
        <Ring value={p} size={124} stroke={12} />
        <div>
          <div className="text-sm font-bold">التقدم الكلي</div>
          <div className="text-5xl font-extrabold leading-tight">
            {d} <span className="text-2xl font-semibold text-black/50">/ {all.length}</span>
          </div>
          <div className="text-sm">عنصر مكتمل</div>
        </div>
        <div className="grid min-w-[220px] flex-1 gap-2 rounded-xl border-2 border-black bg-white p-3">
          {subjects.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-sm">
              <span className="w-28 truncate font-semibold">{s.name}</span>
              <Bar p={stat(s).p} color={s.color} className="!h-2.5" />
              <b className="w-10 text-end font-mono text-xs">{stat(s).p}%</b>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.icon} className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000]">
            <IconBox icon={t.icon} color={t.color} className="h-11 w-11 text-lg" />
            <div className="min-w-0">
              <div className="text-2xl font-extrabold leading-none">{t.v}</div>
              <div className="mt-1 truncate text-xs text-black/55">{t.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={card}>
        <h2 className="mb-2 font-extrabold">
                <div className={card}>
        <h2 className="mb-3 font-extrabold">
          <Icon n="fa-calendar-check" className="me-2 text-red-500" />
          جدول الامتحانات
        </h2>
        {exams.length === 0 ? (
          <div className="py-3 text-center text-sm text-black/45">حدد موعد الامتحان من صفحة كل مادة وهيظهر هنا.</div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {exams.map((s) => {
              const n = daysLeft(s.exam);
              const rest = stat(s).t - stat(s).d;
              const dt = new Date(s.exam + "T00:00:00");
              return (
                <button
                  key={s.id}
                  onClick={() => open(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 border-black bg-white p-2.5 text-start text-sm transition hover:-translate-y-0.5 ${n < 0 ? "opacity-50" : ""}`}
                >
               <span className="grid h-16 w-16 flex-none place-items-center rounded-xl border-2 border-black leading-none shadow-[2px_2px_0_0_#000]" style={{ background: s.color }}>
  <b className="text-3xl">{dt.getDate()}</b>
  <span className="-mt-3 text-xs font-bold">{dt.toLocaleDateString("ar-EG", { month: "short" })}</span>
</span>
                  <span className="min-w-0 flex-1">
                    <b className="block leading-snug">{s.name}</b>
                    <span className="text-xs text-black/55">
                      {dt.toLocaleDateString("ar-EG", { weekday: "long" })} · باقي {rest} عنصر
                    </span>
                  </span>
                  <span
                    className="rounded-lg border-2 border-black px-2 py-0.5 text-xs font-extrabold"
                    style={{ background: n < 0 ? "#E5E5E5" : n <= 3 ? "#FF3B4E" : n <= 7 ? "#FF8A3D" : "#22E55E" }}
                  >
                    {n < 0 ? "عدّى" : n === 0 ? "النهارده" : `${n} يوم`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
          <Icon n="fa-bullseye" className="me-2 text-red-500" />
          المذاكرة الجاية
        </h2>
        {next.length === 0 ? (
          <div className="py-3 text-center text-sm text-black/45">مفيش حاجة متبقية. ضيف عناصر جوه المواد.</div>
        ) : (
          <div className="divide-y divide-black/10">
            {next.map(({ s, u, l }) => {
              const t = TYPES[l.type] || TYPES.other;
              return (
                <div key={l.id} className="flex items-center gap-3 py-2 text-sm">
                  <button
                    aria-label={`خلصت ${l.title}`}
                    onClick={() => toggleItem(s.id, u.id, l.id)}
                    className="grid h-5 w-5 flex-none place-items-center rounded-md border-2 border-black bg-white transition hover:bg-green-300"
                  />
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-lg border-2 border-black text-xs" style={{ background: t.color }}>
                    <Icon n={t.icon} />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{l.title}</span>
                  <button onClick={() => open(s.id)} className="rounded-md border-2 border-black px-2 text-[11px] font-bold" style={{ background: s.color }}>
                    {s.name}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {subjects.map((s) => {
          const st = stat(s);
          const n = daysLeft(s.exam);
          return (
            <button
              key={s.id}
              onClick={() => open(s.id)}
              className="rounded-2xl border-2 border-black bg-white p-4 text-start shadow-[4px_4px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[4px_8px_0_0_#000]"
            >
              <div className="flex items-start justify-between">
                <IconBox icon={ico(s)} color={s.color} className="h-12 w-12 text-xl" />
                {st.p === 100 && st.t > 0 ? (
                  <span className="rounded-lg border-2 border-black bg-green-400 px-2 text-xs font-extrabold">
                    <Icon n="fa-check" /> تمت
                  </span>
                ) : (
                  n !== null &&
                  n >= 0 && (
                    <span
                      className="rounded-lg border-2 border-black px-2 text-xs font-extrabold"
                      style={{ background: n <= 3 ? "#FF3B4E" : n <= 7 ? "#FF8A3D" : "#fff" }}
                    >
                      <Icon n="fa-calendar-day" /> {n} يوم
                    </span>
                  )
                )}
              </div>
              <div className="mt-3 font-extrabold">{s.name}</div>
              <div className={`${muted} font-mono text-xs`}>
                {st.d}/{st.t} عنصر
              </div>
              <div className="my-2 text-3xl font-extrabold">{st.p}%</div>
              <Bar p={st.p} color={s.color} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
