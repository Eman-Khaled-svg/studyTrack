import { useState, useEffect } from "react";
import { Icon, Ring, card, btnMain, btnGhost, muted } from "./ui";
import { usePersist } from "../hooks/usePersist";
import { MODES } from "../data/subjects";
import { fmtMin, focusMin, today } from "../utils/helpers";

// صوت تنبيه بسيط (من غير أي ملفات) + اهتزاز على الموبايل
function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const c = new C();
    [0, 0.25, 0.5].forEach((t) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.15;
      o.connect(g);
      g.connect(c.destination);
      o.start(c.currentTime + t);
      o.stop(c.currentTime + t + 0.15);
    });
    navigator.vibrate?.([200, 100, 200]);
  } catch (e) {}
}

const clamp = (v) => Math.max(1, Math.min(180, parseInt(v) || 1));

export default function Pomodoro({ subjects, sessions, onSession }) {
  // المدد بالدقايق وبتتحفظ: تقدر تغيّر التركيز والراحة زي ما تحب
  const [cfg, setCfg] = usePersist("st_pomo_cfg", { focus: 25, short: 5, long: 15 });
  const [subj, setSubj] = usePersist("st_pomo_subj", "");
  const mins = (k) => clamp(cfg[k]);

  const [mode, setMode] = useState("focus");
  const [left, setLeft] = useState(() => clamp(cfg.focus) * 60);
  // وقت انتهاء العدّاد بالـ timestamp: بيفضل دقيق حتى لو التبويب في الخلفية
  const [endAt, setEndAt] = useState(null);
  const running = endAt !== null;

  const sid = subjects.some((s) => String(s.id) === String(subj)) ? Number(subj) : null;
  const todayMin = focusMin(sessions, { date: today() });
  const todayCount = sessions.filter((x) => x.d === today()).length;

  useEffect(() => {
    if (!running) return;
    const tick = () => setLeft(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endAt, running]);

  useEffect(() => {
    if (!running || left > 0) return;
    setEndAt(null);
    beep();
    if (mode === "focus") onSession(sid, mins("focus"));
    const n = mode === "focus" ? "short" : "focus";
    setMode(n);
    setLeft(mins(n) * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  useEffect(() => {
    document.title = running ? `${mm}:${ss} · متابعة الدراسة` : "متابعة الدراسة";
  }, [mm, ss, running]);

  const toggle = () => {
    if (running) {
      setLeft(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
      setEndAt(null);
    } else {
      setEndAt(Date.now() + left * 1000);
    }
  };
  const pick = (k) => {
    setMode(k);
    setLeft(mins(k) * 60);
    setEndAt(null);
  };
  const setMinutes = (v) => {
    const next = { ...cfg, [mode]: v };
    setCfg(next);
    if (!running) setLeft(clamp(v) * 60);
  };

  return (
    <div className={`${card} !mb-0`}>
      <h2 className="mb-3 font-extrabold">
        <Icon n="fa-stopwatch" className="me-2 text-red-500" />
        بومودورو
      </h2>
      <div className="flex flex-wrap justify-center gap-1.5">
        {Object.keys(MODES).map((k) => (
          <button
            key={k}
            onClick={() => pick(k)}
            aria-pressed={mode === k}
            className={`rounded-lg border-2 border-black px-3 py-1 text-sm font-bold ${mode === k ? "shadow-[2px_2px_0_0_#000]" : "bg-white hover:bg-black/5"}`}
            style={mode === k ? { background: MODES[k].color } : undefined}
          >
            {MODES[k].label} · {mins(k)}د
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold">
        <span>مدة «{MODES[mode].label}» (بالدقايق):</span>
        <button className={`${btnGhost} !px-2.5 !py-1`} disabled={running} onClick={() => setMinutes(clamp(cfg[mode]) - 1)} aria-label="قلّل دقيقة">
          <Icon n="fa-minus" />
        </button>
        <input
          type="number"
          min="1"
          max="180"
          dir="ltr"
          disabled={running}
          value={cfg[mode]}
          onChange={(e) => setMinutes(e.target.value.slice(0, 3))}
          onBlur={() => setMinutes(clamp(cfg[mode]))}
          aria-label="مدة الجلسة بالدقايق"
          className="w-16 rounded-xl border-2 border-black bg-white px-2 py-1 text-center font-mono disabled:opacity-50"
        />
        <button className={`${btnGhost} !px-2.5 !py-1`} disabled={running} onClick={() => setMinutes(clamp(cfg[mode]) + 1)} aria-label="زوّد دقيقة">
          <Icon n="fa-plus" />
        </button>
      </div>

      <div className="relative mx-auto my-5 grid w-fit place-items-center">
        <Ring value={100 - Math.round((left / (mins(mode) * 60)) * 100)} size={230} stroke={14} color={MODES[mode].color} text={false} />
        <div dir="ltr" className="absolute text-6xl font-extrabold tabular-nums">
          {mm}:{ss}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button className={btnMain} onClick={toggle}>
          <Icon n={running ? "fa-pause" : "fa-play"} />
          {running ? "إيقاف مؤقت" : "ابدأ"}
        </button>
        <button className={btnGhost} onClick={() => pick(mode)}>
          <Icon n="fa-rotate-right" /> إعادة
        </button>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-bold">
        <Icon n="fa-book" />
        بذاكر:
        <select
          value={sid ?? ""}
          onChange={(e) => setSubj(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border-2 border-black bg-white px-3 py-2 text-sm"
        >
          <option value="">من غير مادة معينة</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <p className={`${muted} mt-3 text-center`}>
        النهارده: <b className="text-black">{todayCount}</b> جلسة · <b className="text-black">{fmtMin(todayMin)}</b> تركيز
      </p>
    </div>
  );
}
