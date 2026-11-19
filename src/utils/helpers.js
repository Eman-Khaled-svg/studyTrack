export const pct = (d, t) => (t > 0 ? Math.round((d / t) * 100) : 0);
export const lecs = (s) => s.units.flatMap((u) => u.lectures);
export const stat = (s) => {
  const l = lecs(s);
  const d = l.filter((x) => x.done).length;
  return { d, t: l.length, p: pct(d, l.length) };
};

const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const today = () => fmt(new Date());
export const daysLeft = (iso) =>
  iso ? Math.round((new Date(iso + "T00:00:00") - new Date(today() + "T00:00:00")) / 864e5) : null;
// عدد الأيام المتتالية اللي خلصت فيها عنصر على الأقل
export const streak = (subjects) => {
  const days = new Set(subjects.flatMap(lecs).filter((l) => l.done && l.doneAt).map((l) => l.doneAt));
  const d = new Date();
  if (!days.has(fmt(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(fmt(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
};

export const fmtMin = (m) => (m < 60 ? `${m} د` : `${Math.floor(m / 60)} س${m % 60 ? ` ${m % 60} د` : ""}`);
// دقايق التركيز (من البومودورو): ممكن تفلتر بمادة أو بتاريخ
export const focusMin = (sessions, { sid, date } = {}) =>
  sessions.filter((x) => (sid === undefined || x.s === sid) && (!date || x.d === date)).reduce((a, x) => a + x.m, 0);
