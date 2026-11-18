import { useState } from "react";
import { Icon, Bar, IconBox, card, input, btnMain, btnGhost, btnDel, muted } from "./ui";
import { stat, pct, daysLeft } from "../utils/helpers";
import { ico, TYPES, PRESETS } from "../data/subjects";

export default function SubjectView({ s, upd, toggleItem, remove }) {
  const [closed, setClosed] = useState({});
  const [drafts, setDrafts] = useState({});
  const [secName, setSecName] = useState("");
  const [first, setFirst] = useState("");
  const [q, setQ] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const st = stat(s);
  const left = daysLeft(s.exam);
  const rest = st.t - st.d;
  const examLabel =
    left === null
      ? ""
      : left < 0
      ? "الامتحان عدّى"
      : left === 0
      ? "الامتحان النهارده!"
      : `باقي ${left} يوم` + (rest > 0 ? ` · المطلوب ${Math.ceil((rest / left) * 10) / 10} درس/يوم` : " · خلصت كل حاجة");

  const setUnits = (fn) => upd(s.id, (x) => ({ ...x, units: fn(x.units) }));
  const mapUnit = (uid, fn) => setUnits((us) => us.map((u) => (u.id === uid ? fn(u) : u)));

  const draft = (u) => ({ name: "", count: 1, type: u.type || "pdf", ...drafts[u.id] });
  const setDraft = (u, patch) => setDrafts({ ...drafts, [u.id]: { ...draft(u), ...patch } });

  const toggle = (uid, lid) => toggleItem(s.id, uid, lid);

  // إضافة درس واحد، أو كذا درس مرقّمين مرة واحدة
  const addItems = (u, multi = false) => {
    const d = draft(u);
    const n = multi ? Math.max(1, Math.min(60, parseInt(d.count) || 1)) : 1;
    const base = d.name.trim() || "درس";
    const start = u.lectures.length;
    const numbered = n > 1 || !d.name.trim();
    const items = Array.from({ length: n }, (_, i) => ({
      id: Date.now() + i,
      title: numbered ? `${base} ${start + i + 1}` : base,
      type: d.type,
      done: false,
    }));
    mapUnit(u.id, (x) => ({ ...x, type: d.type, lectures: [...x.lectures, ...items] }));
    setDrafts({ ...drafts, [u.id]: { ...d, name: "", count: 1 } });
  };

  // أول درس في المادة: بنعمل القسم تلقائي علشان المستخدم ما يحتاجش يفهم "الأقسام" الأول
  const addFirst = () => {
    const t = first.trim() || "الدرس 1";
    setUnits(() => [{ id: Date.now(), title: "الدروس", type: "pdf", lectures: [{ id: Date.now() + 1, title: t, type: "pdf", done: false }] }]);
    setFirst("");
  };

  const delItem = (uid, lid) => mapUnit(uid, (u) => ({ ...u, lectures: u.lectures.filter((x) => x.id !== lid) }));

  const addSection = (title, type = "pdf") => {
    const t = title.trim() || "قسم " + (s.units.length + 1);
    setUnits((us) => [...us, { id: Date.now(), title: t, type, lectures: [] }]);
    setSecName("");
  };

  const allClosed = s.units.length > 0 && s.units.every((u) => closed[u.id]);
  const toggleAll = () => setClosed(Object.fromEntries(s.units.map((u) => [u.id, !allClosed])));

  return (
    <div>
      <div className={`${card} grid grid-cols-[auto_1fr] items-center gap-4 sm:grid-cols-[auto_1fr_auto]`} style={{ background: s.color + "55" }}>
        <IconBox icon={ico(s)} color={s.color} className="h-14 w-14 text-2xl" />
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold sm:text-2xl">
            {s.name}
            {st.p === 100 && st.t > 0 && (
              <span className="ms-3 rounded-lg border-2 border-black bg-green-400 px-2 align-middle text-xs font-extrabold">
                <Icon n="fa-circle-check" /> مكتملة
              </span>
            )}
          </h1>
          <div className={muted}>
            {s.units.length} أقسام · {st.t} درس للمذاكرة
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <label className="flex flex-wrap items-center gap-1.5 font-bold">
              <Icon n="fa-calendar-day" /> الامتحان:
              <input
                type="date"
                value={s.exam || ""}
                onChange={(e) => upd(s.id, (x) => ({ ...x, exam: e.target.value }))}
                className="w-36 min-w-0 rounded-lg border-2 border-black bg-white px-2 py-0.5 font-mono"
              />
            </label>
            {s.exam && (
              <button
                type="button"
                onClick={() => upd(s.id, (x) => ({ ...x, exam: "" }))}
                className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2 py-0.5 font-bold text-red-600 transition hover:bg-red-100"
              >
                <Icon n="fa-calendar-xmark" /> إلغاء الموعد
              </button>
            )}
            {examLabel && (
              <span
                className="rounded-lg border-2 border-black px-2 py-0.5 font-extrabold"
                style={{ background: left <= 3 ? "#FF3B4E" : left <= 7 ? "#FF8A3D" : "#22E55E" }}
              >
                {examLabel}
              </span>
            )}
          </div>
        </div>
        <div className="col-span-2 flex items-baseline justify-between border-t-2 border-black/20 pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-end">
          <div className="text-4xl font-extrabold leading-none">{st.p}%</div>
          <div className="mt-1 font-mono text-xs text-black/55">
            {st.d}/{st.t} خلصت
          </div>
        </div>
      </div>
      <Bar p={st.p} color={s.color} className="mb-4 !h-4 w-full !flex-none" />

      {s.units.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[180px] flex-1">
            <Icon n="fa-magnifying-glass" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-xs text-black/40" />
            <input
              type="text"
              className={`${input} !basis-auto w-full !ps-9`}
              placeholder="دوّر في الدروس…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="بحث"
            />
          </div>
          <button className={`${btnGhost} !py-2 ${hideDone ? "!bg-yellow-300" : ""}`} onClick={() => setHideDone(!hideDone)} aria-pressed={hideDone}>
            <Icon n={hideDone ? "fa-eye-slash" : "fa-eye"} /> {hideDone ? "المخلّص مخفي" : "إخفاء المخلّص"}
          </button>
          <button className={`${btnGhost} !py-2`} onClick={toggleAll}>
            <Icon n={allClosed ? "fa-angles-down" : "fa-angles-up"} /> {allClosed ? "فتح الكل" : "طي الكل"}
          </button>
        </div>
      )}

      {s.units.length === 0 && (
        <div className={`${card} text-center`}>
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border-2 border-black bg-yellow-300 text-2xl">
            <Icon n="fa-circle-plus" />
          </div>
          <h2 className="text-xl font-extrabold">ضيف أول درس في المادة</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-7 text-black/60">اكتب اسم الدرس (مثلاً: المحاضرة الأولى) وكمّل بعدها بنفس الطريقة.</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              type="text"
              className={`${input} !py-3`}
              placeholder="مثلاً: المحاضرة الأولى"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFirst()}
              aria-label="اسم أول درس"
              autoFocus
            />
            <button className={btnMain} onClick={addFirst}>
              <Icon n="fa-plus" /> إضافة
            </button>
          </div>
        </div>
      )}

      {s.units.map((u) => {
        const d = u.lectures.filter((x) => x.done).length;
        const isOpen = !closed[u.id];
        const f = draft(u);
        const vis = u.lectures.filter((l) => (!hideDone || !l.done) && l.title.toLowerCase().includes(q.trim().toLowerCase()));
        if (q.trim() && vis.length === 0) return null;
        return (
          <div key={u.id} className="mb-4 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-start font-extrabold"
              aria-expanded={isOpen}
              onClick={() => setClosed({ ...closed, [u.id]: isOpen })}
            >
              <span className="min-w-0 flex-1 truncate text-lg">{u.title}</span>
              <Bar p={pct(d, u.lectures.length)} color={s.color} className="!h-2.5 !flex-none w-16 sm:w-24" />
              <span className="w-10 text-end font-mono text-xs" dir="ltr">
                {d}/{u.lectures.length}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-lg border-2 border-black bg-yellow-300 text-[10px]">
                <Icon n={isOpen ? "fa-chevron-up" : "fa-chevron-down"} />
              </span>
            </button>
            {isOpen && (
              <div className="border-t-2 border-black bg-[#FAF6EB] px-3 pb-3">
                {u.lectures.length === 0 && <div className="py-5 text-center text-sm text-black/45">القسم فاضي. اكتب اسم الدرس تحت واضغط إضافة.</div>}
                <div className="divide-y divide-black/10">
                  {vis.map((l) => {
                    const t = TYPES[l.type] || TYPES.other;
                    return (
                      <label key={l.id} className="group flex cursor-pointer items-center gap-3 px-1 py-2.5 text-sm hover:bg-black/5">
                        <input type="checkbox" checked={l.done} onChange={() => toggle(u.id, l.id)} aria-label={l.title} className="peer sr-only" />
                        <span
                          className="grid h-5 w-5 flex-none place-items-center rounded-md border-2 border-black bg-white text-[10px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                          style={l.done ? { background: s.color } : undefined}
                        >
                          {l.done && <Icon n="fa-check" />}
                        </span>
                        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border-2 border-black" style={{ background: t.color }}>
                          <Icon n={t.icon} />
                        </span>
                        <span className="w-12 flex-none font-mono text-[11px] font-bold text-black/50">{t.label}</span>
                        <span className={`flex-1 break-words ${l.done ? "text-black/40 line-through" : "font-semibold"}`}>{l.title}</span>
                        <button
                          type="button"
                          className={`${btnDel} sm:opacity-0 sm:group-hover:opacity-100`}
                          aria-label="حذف الدرس"
                          onClick={(e) => {
                            e.preventDefault();
                            delItem(u.id, l.id);
                          }}
                        >
                          <Icon n="fa-trash-can" />
                        </button>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-xl border-2 border-dashed border-black/40 bg-white p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className={`${input} !py-3`}
                      placeholder="اكتب اسم الدرس واضغط Enter… مثلاً: المحاضرة الثانية"
                      value={f.name}
                      onChange={(e) => setDraft(u, { name: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addItems(u)}
                      aria-label="اسم الدرس"
                    />
                    <button className={btnMain} onClick={() => addItems(u)}>
                      <Icon n="fa-plus" /> إضافة
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-black/50">النوع:</span>
                    {Object.keys(TYPES)
                      .filter((k) => k !== "other")
                      .map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setDraft(u, { type: k })}
                          aria-pressed={f.type === k}
                          className={`inline-flex items-center gap-1 rounded-lg border-2 border-black px-2 py-1 font-bold transition ${f.type === k ? "shadow-[2px_2px_0_0_#000]" : "bg-white opacity-60 hover:opacity-100"}`}
                          style={f.type === k ? { background: TYPES[k].color } : undefined}
                        >
                          <Icon n={TYPES[k].icon} /> {TYPES[k].label}
                        </button>
                      ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/10 pt-3 text-xs">
                    <span className="font-bold text-black/50">عايز تضيف كذا درس مرة واحدة؟</span>
                    <input
                      type="number"
                      min="2"
                      max="60"
                      className={`${input} !flex-none !basis-auto w-16 !py-1 text-center`}
                      value={f.count}
                      onChange={(e) => setDraft(u, { count: e.target.value })}
                      aria-label="العدد"
                    />
                    <button className={`${btnGhost} !px-3 !py-1 !text-xs`} onClick={() => addItems(u, true)}>
                      ضيفهم مرقّمين
                    </button>
                    <button className={`${btnDel} ms-auto`} onClick={() => setUnits((us) => us.filter((x) => x.id !== u.id))}>
                      <Icon n="fa-folder-minus" /> حذف القسم
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {s.units.length > 0 && (
        <div className={`${card} mt-5`}>
          <h2 className="mb-3 font-extrabold">
            <Icon n="fa-folder-plus" className="me-2" />
            تنظيم الدروس في أقسام (اختياري)
          </h2>
          <p className="mb-3 text-xs text-black/55">القسم زي درج بتحط فيه دروسك. اختار من الجاهز أو اكتب اسم من عندك.</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.title} className={`${btnGhost} !px-3 !py-1.5`} onClick={() => addSection(p.title, p.type)}>
                <Icon n="fa-plus" className="text-xs" /> {p.title}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              className={input}
              placeholder="أو اكتب اسم قسم مخصص"
              value={secName}
              onChange={(e) => setSecName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection(secName)}
              aria-label="قسم جديد"
            />
            <button className={btnMain} onClick={() => addSection(secName)}>
              إضافة
            </button>
          </div>
        </div>
      )}
      <button className={btnDel} onClick={remove}>
        <Icon n="fa-trash-can" /> حذف المادة
      </button>
    </div>
  );
}