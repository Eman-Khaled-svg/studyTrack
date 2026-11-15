import { useState, useEffect } from "react";
import { usePersist } from "./hooks/usePersist";
import { initSubjects, migrate, CHEERS } from "./data/subjects";
import { lecs, pct, today } from "./utils/helpers";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import SubjectView from "./components/SubjectView";
import Pomodoro from "./components/Pomodoro";
import Todos from "./components/Todos";
import Notes from "./components/Notes";
import Footer from "./components/Footer";
import { Icon, Ring, card, input, btnMain, muted } from "./components/ui";

const FONTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&display=swap",
];

export default function App() {
  const [subjects, setSubjects] = usePersist("st_v3", initSubjects);
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newName, setNewName] = useState("");

  // Font Awesome + Cairo (احذفهم لو ضفتهم في index.html)
  useEffect(() => {
    FONTS.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    });
    setSubjects((s) => migrate(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!confirmReset) return;
    const id = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(id);
  }, [confirmReset]);

  const cheer = () => setToast(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  const upd = (id, fn) => setSubjects(subjects.map((s) => (s.id === id ? fn(s) : s)));

  const toggleItem = (sid, uid, lid) => {
    const l = subjects.find((s) => s.id === sid).units.find((u) => u.id === uid).lectures.find((x) => x.id === lid);
    if (!l.done) cheer();
    upd(sid, (s) => ({
      ...s,
      units: s.units.map((u) =>
        u.id !== uid
          ? u
          : { ...u, lectures: u.lectures.map((x) => (x.id !== lid ? x : { ...x, done: !x.done, doneAt: !x.done ? today() : undefined })) }
      ),
    }));
  };

  const all = subjects.flatMap(lecs);
  const done = all.filter((x) => x.done).length;
  const cur = subjects.find((s) => s.id === view);

  const reset = () => {
    if (!confirmReset) return setConfirmReset(true);
    setSubjects(
      subjects.map((s) => ({
        ...s,
        units: s.units.map((u) => ({ ...u, lectures: u.lectures.map((l) => ({ ...l, done: false })) })),
      }))
    );
    setConfirmReset(false);
  };

  const addSubject = () => {
    const n = newName.trim();
    if (!n) return;
    const id = Date.now();
    setSubjects([...subjects, { id, name: n, icon: "fa-book", color: "#FFD60A", units: [] }]);
    setNewName("");
    setView(id);
  };

  const title = { overview: "نظرة عامة", tasks: "المهام والبومودورو", notes: "الملاحظات" }[view] || (cur ? cur.name : "");

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-[#FAF6EB] text-black"
      style={{
        fontFamily: "'Cairo', system-ui, 'Segoe UI', Tahoma, sans-serif",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundImage: "radial-gradient(rgba(0,0,0,.13) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="fixed inset-x-0 top-0 z-[60] bg-white" style={{ height: "env(safe-area-inset-top, 0px)" }} />
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <Sidebar subjects={subjects} view={view} setView={setView} done={done} confirmReset={confirmReset} reset={reset} />

        <main className="min-w-0 px-4 pb-16 pt-5 lg:px-8 lg:pt-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">{title}</h1>
              <p className="font-mono text-xs text-black/55">
                {subjects.length} مواد · {done}/{all.length} عنصر
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_#000]">
              <Ring value={pct(done, all.length)} size={44} stroke={5} />
              <span className={muted}>الإجمالي</span>
            </div>
          </div>

          {view === "overview" && (
            <>
              <Overview subjects={subjects} open={setView} toggleItem={toggleItem} />
              <div className={`${card} mt-4`}>
                <h2 className="mb-3 font-extrabold">
                  <Icon n="fa-circle-plus" className="me-2" />
                  إضافة مادة
                </h2>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    className={input}
                    placeholder="اسم المادة"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubject()}
                    aria-label="اسم المادة"
                  />
                  <button className={btnMain} onClick={addSubject}>
                    إضافة
                  </button>
                </div>
              </div>
            </>
          )}

          {cur && (
            <SubjectView
              key={cur.id}
              s={cur}
              upd={upd}
              toggleItem={toggleItem}
              remove={() => {
                setSubjects(subjects.filter((x) => x.id !== cur.id));
                setView("overview");
              }}
            />
          )}

          {view === "tasks" && (
            <div className="grid items-start gap-4 md:grid-cols-2">
              <Pomodoro />
              <Todos cheer={cheer} />
            </div>
          )}
                   {view === "notes" && <Notes />}

          <Footer setView={setView} done={done} total={all.length} subjects={subjects.length} />
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed start-1/2 z-[70] max-w-[92vw] -translate-x-1/2 rounded-xl border-2 border-black bg-yellow-300 px-5 py-3 text-center font-bold shadow-[4px_4px_0_0_#000] rtl:translate-x-1/2"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
        >
          <Icon n="fa-star" className="me-2" />
          {toast}
        </div>
      )}
    </div>
  );
}
