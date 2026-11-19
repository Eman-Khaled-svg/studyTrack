import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Icon, card, input, btnGhost, muted } from "./ui";

const fmt = (t) => (t && t.toDate ? t.toDate().toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }) : "—");

export default function Admin() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const load = () => {
    setRows(null);
    setErr("");
    getDocs(query(collection(db, "users"), orderBy("lastSeen", "desc")))
      .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch((e) => setErr(e.code === "permission-denied" ? "مفيش صلاحية: راجع قواعد Firestore وإيميل الأدمن." : e.message));
  };
  useEffect(load, []);

  const list = useMemo(
    () => (rows || []).filter((r) => `${r.email} ${r.name}`.toLowerCase().includes(q.trim().toLowerCase())),
    [rows, q]
  );

  const csv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["الإيميل", "الاسم", "أول دخول", "آخر دخول", "عدد مرات الدخول"];
    const body = [head, ...list.map((r) => [r.email, r.name, fmt(r.firstSeen), fmt(r.lastSeen), r.visits || 0])]
      .map((r) => r.map(esc).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + body], { type: "text/csv;charset=utf-8" }));
    a.download = "users.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className={card}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-extrabold">
          <Icon n="fa-user-shield" className="me-2 text-red-500" />
          المستخدمين {rows && <span className={muted}>({rows.length})</span>}
        </h2>
        <input className={`${input} !w-56 !flex-none ms-auto`} placeholder="ابحث بالإيميل أو الاسم" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
        <button className={btnGhost} onClick={load}><Icon n="fa-rotate" /> تحديث</button>
        <button className={btnGhost} onClick={csv} disabled={!list.length}><Icon n="fa-file-csv" /> تصدير CSV</button>
      </div>
      {err && <p className="font-bold text-red-600">{err}</p>}
      {!err && rows === null && <p className={muted}>جاري التحميل…</p>}
      {rows && rows.length === 0 && <p className={`${muted} py-6 text-center`}>لسه حد ما سجّلش دخول.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                {["الإيميل", "الاسم", "أول دخول", "آخر دخول", "الدخول"].map((h) => (
                  <th key={h} className="px-2 py-2 text-start font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-black/15">
                  <td className="px-2 py-2" dir="ltr">
                    <span className="flex items-center gap-2">
                      {r.photo && <img src={r.photo} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full border border-black" />}
                      {r.email}
                    </span>
                  </td>
                  <td className="px-2 py-2">{r.name || "—"}</td>
                  <td className="px-2 py-2">{fmt(r.firstSeen)}</td>
                  <td className="px-2 py-2">{fmt(r.lastSeen)}</td>
                  <td className="px-2 py-2 font-mono">{r.visits || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}