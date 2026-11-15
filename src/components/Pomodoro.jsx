import { useState, useEffect } from "react";
import { Icon, Ring, card, btnMain, btnGhost, btnDel, muted } from "./ui";
import { usePersist } from "../hooks/usePersist";
import { MODES } from "../data/subjects";

export default function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [left, setLeft] = useState(MODES.focus.sec);
  const [running, setRunning] = useState(false);
  const [count, setCount] = usePersist("st_pomos", 0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    setRunning(false);
    if (mode === "focus") setCount((c) => c + 1);
    const n = mode === "focus" ? "short" : "focus";
    setMode(n);
    setLeft(MODES[n].sec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  useEffect(() => {
    document.title = running ? `${mm}:${ss} · متابعة الدراسة` : "متابعة الدراسة";
  }, [mm, ss, running]);

  const pick = (k) => {
    setMode(k);
    setLeft(MODES[k].sec);
    setRunning(false);
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
            className={`rounded-lg border-2 border-black px-3 py-1 text-sm font-bold ${mode === k ? "shadow-[2px_2px_0_0_#000]" : "bg-white hover:bg-black/5"}`}
            style={mode === k ? { background: MODES[k].color } : undefined}
          >
            {MODES[k].label}
          </button>
        ))}
      </div>
      <div className="relative mx-auto my-5 grid w-fit place-items-center">
        <Ring value={100 - Math.round((Math.max(left, 0) / MODES[mode].sec) * 100)} size={230} stroke={14} color={MODES[mode].color} text={false} />
        <div dir="ltr" className="absolute text-6xl font-extrabold tabular-nums">
          {mm}:{ss}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button className={btnMain} onClick={() => setRunning(!running)}>
          <Icon n={running ? "fa-pause" : "fa-play"} />
          {running ? "إيقاف مؤقت" : "ابدأ"}
        </button>
        <button
          className={btnGhost}
          onClick={() => {
            setRunning(false);
            setLeft(MODES[mode].sec);
          }}
        >
          <Icon n="fa-rotate-right" /> إعادة
        </button>
      </div>
      <p className={`${muted} mt-4 text-center`}>
        جلسات التركيز المكتملة: <b className="text-black">{count}</b>{" "}
        {count > 0 && (
          <button className={btnDel} onClick={() => setCount(0)}>
            تصفير
          </button>
        )}
      </p>
    </div>
  );
}
