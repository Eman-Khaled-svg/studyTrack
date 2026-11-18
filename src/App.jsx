import { useState, useEffect } from "react";
import { usePersist, load } from "./hooks/usePersist";
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
import Welcome from "./components/Welcome";
import Guide from "./components/Guide";

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
    const [help, setHelp] = useState(() => !load("st_welcome"));
  const closeHelp = () => {
    setHelp(false);
    try {
      localStorage.setItem("st_welcome", "1");
    } catch (e) {}
  };
    const [menu, setMenu] = useState(false);


  // Esc يقفل القائمة + منع سكرول الصفحة وهي مفتوحة
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menu]);

  const go = (k) => {
    setView(k);
    setMenu(false);
  };

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
  const quickAdd = (name, icon, color) => {
    const id = Date.now();
    setSubjects([...subjects, { id, name, icon, color, units: [] }]);
    setView(id);
  };
  const title = { overview: "نظرة عامة", tasks: "المهام والبومودورو", notes: "الملاحظات", guide: "دليل الاستخدام" }[view] || (cur ? cur.name : "");

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
            <header
        className="sticky z-20 flex items-center gap-3 border-b-2 border-black bg-white px-3 py-2 lg:hidden"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <button
          onClick={() => setMenu(true)}
          aria-label="فتح القائمة"
          aria-expanded={menu}
          className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-yellow-300 shadow-[2px_2px_0_0_#000] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Icon n="fa-bars" />
        </button>
        <b className="min-w-0 flex-1 truncate">{title}</b>
        <Ring value={pct(done, all.length)} size={36} stroke={4} />
      </header>
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <Sidebar
          subjects={subjects}
          view={view}
          setView={go}
          done={done}
          confirmReset={confirmReset}
          reset={reset}
          open={menu}
          onClose={() => setMenu(false)}
        />

        <main className="min-w-0 px-4 pb-16 pt-5 lg:px-8 lg:pt-7">
                    <div className="mb-5 hidden items-center justify-between lg:flex">
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
              <Overview subjects={subjects} open={setView} toggleItem={toggleItem} quickAdd={quickAdd}/>
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
          {view === "guide" && <Guide setView={go} />}

          <Footer setView={setView} done={done} total={all.length} subjects={subjects.length} />
        </main>
      </div>
      <button
        onClick={() => setHelp(true)}
        aria-label="مساعدة"
        className="fixed start-4 z-30 grid h-12 w-12 place-items-center rounded-full border-2 border-black bg-yellow-300 text-lg shadow-[3px_3px_0_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <Icon n="fa-question" />
      </button>
      <Welcome open={help} onClose={closeHelp} />
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
