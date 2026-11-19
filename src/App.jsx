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
import Admin from "./components/Admin";
import Profile from "./components/Profile";
import Avatar from "./components/Avatar";
export default function App({ auth }) {
  const [subjects, setSubjects] = usePersist("st_v3", initSubjects);
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState(null);
  const [undo, setUndo] = useState(null);
  const [sessions, setSessions] = usePersist("st_sessions", []);
  const [goal, setGoal] = usePersist("st_goal", 3);
  const [theme, setTheme] = usePersist("st_theme", () =>
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light"
  );
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

  useEffect(() => {
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

  // الوضع الداكن: كلاس على <html> (الستايل في index.css)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0A0905" : "#FAF6EB");
  }, [theme]);

  useEffect(() => {
    if (!undo) return;
    const id = setTimeout(() => setUndo(null), 7000);
    return () => clearTimeout(id);
  }, [undo]);

  const askUndo = (label, restore) => setUndo({ label, restore });

  const addSession = (sid, m) => {
    setSessions((p) => [...p.slice(-1999), { d: today(), s: sid, m }]);
    setToast(`جلسة تركيز ${m} دقيقة اتسجّلت`);
  };

  const removeSubject = (s) => {
    const i = subjects.findIndex((x) => x.id === s.id);
    setSubjects(subjects.filter((x) => x.id !== s.id));
    setView("overview");
    askUndo(`تم حذف مادة «${s.name}»`, () =>
      setSubjects((prev) => (prev.some((x) => x.id === s.id) ? prev : [...prev.slice(0, i), s, ...prev.slice(i)]))
    );
  };

  const cheer = () => setToast(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  const upd = (id, fn) => setSubjects((prev) => prev.map((s) => (s.id === id ? fn(s) : s)));

  const toggleItem = (sid, uid, lid) => {
    const l = subjects.find((s) => s.id === sid).units.find((u) => u.id === uid).lectures.find((x) => x.id === lid);
    if (!l.done) {
      const before = subjects.flatMap(lecs).filter((x) => x.done && x.doneAt === today()).length;
      if (before + 1 === goal) setToast("حققت هدف النهارده! كمّل بنفس الحماس");
      else cheer();
    }
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
        units: s.units.map((u) => ({ ...u, lectures: u.lectures.map((l) => ({ ...l, done: false, doneAt: undefined })) })),
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
  const themeBtn = (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
      className="grid h-9 w-9 flex-none place-items-center rounded-lg border-2 border-black bg-white transition hover:bg-yellow-300"
    >
      <Icon n={theme === "dark" ? "fa-sun" : "fa-moon"} />
    </button>
  );
  const title = { profile: "حسابي" , overview: "نظرة عامة", tasks: "المهام والبومودورو", notes: "الملاحظات", guide: "دليل الاستخدام",admin: "لوحة الأدمن" }[view] || (cur ? cur.name : "");

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
                {auth?.user && (
          <button onClick={() => go("profile")} aria-label="حسابي" className="flex-none">
            <Avatar user={auth.user} size={36} />
          </button>
        )}
        {themeBtn}
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
           isAdmin={auth?.isAdmin}
          user={auth?.user}
          onLogout={auth?.logout}
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
              {themeBtn}
              <Ring value={pct(done, all.length)} size={44} stroke={5} />
              <span className={muted}>الإجمالي</span>
            </div>
          </div>

          {view === "overview" && (
            <>
              <Overview subjects={subjects} open={setView} toggleItem={toggleItem} quickAdd={quickAdd} goal={goal} setGoal={setGoal} sessions={sessions} />
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
              remove={() => removeSubject(cur)}
              sessions={sessions}
              askUndo={askUndo}
            />
          )}

          {/* بيفضل شغال في الخلفية علشان العدّاد ما يتصفّرش لما تنتقل لصفحة تانية */}
          <div className={view === "tasks" ? "" : "hidden"}>
            <div className="grid items-start gap-4 md:grid-cols-2">
              <Pomodoro subjects={subjects} sessions={sessions} onSession={addSession} />
              <Todos cheer={cheer} askUndo={askUndo} />
            </div>
          </div>
                   {view === "notes" && <Notes />}
          {view === "guide" && <Guide setView={go} />}
          {view === "admin" && auth?.isAdmin && <Admin />}
                    {view === "profile" && auth?.user && (
            <Profile user={auth.user} isAdmin={auth.isAdmin} subjects={subjects} sessions={sessions} logout={auth.logout} />
          )}
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
      {undo && (
        <div
          role="status"
          className="fixed start-1/2 z-[70] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-xl border-2 border-black bg-white px-4 py-2.5 shadow-[4px_4px_0_0_#000] rtl:translate-x-1/2"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.75rem)" }}
        >
          <span className="text-sm font-bold">{undo.label}</span>
          <button
            onClick={() => {
              undo.restore();
              setUndo(null);
            }}
            className="rounded-lg border-2 border-black bg-yellow-300 px-3 py-0.5 text-sm font-extrabold"
          >
            <Icon n="fa-rotate-left" className="me-1" /> تراجع
          </button>
        </div>
      )}
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
