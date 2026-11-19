import Avatar from "./Avatar";
import { Icon, IconBox, card, btnGhost, muted } from "./ui";
import { lecs, pct, streak, fmtMin, focusMin } from "../utils/helpers";

const date = (s) => (s ? new Date(s).toLocaleDateString("ar-EG", { dateStyle: "long" }) : "—");

export default function Profile({ user, isAdmin, subjects, sessions, logout }) {
  const all = subjects.flatMap(lecs);
  const done = all.filter((l) => l.done).length;
  const tiles = [
    { icon: "fa-chart-pie", color: "#22E55E", v: pct(done, all.length) + "%", l: "نسبة الإنجاز" },
    { icon: "fa-book-open", color: "#FFD60A", v: `${done}/${all.length}`, l: "درس خلصت" },
    { icon: "fa-clock", color: "#4D8BFF", v: fmtMin(focusMin(sessions)), l: "وقت التركيز" },
    { icon: "fa-fire", color: "#FF8A3D", v: streak(subjects), l: "يوم متتالي" },
  ];
  return (
    <div>
      <div className={`${card} flex flex-wrap items-center gap-4`}>
        <Avatar user={user} size={88} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-extrabold">
            {user.displayName || "حسابي"}
            {isAdmin && (
              <span className="ms-2 rounded-lg border-2 border-black bg-red-500 px-2 py-0.5 align-middle text-xs text-white">
                <Icon n="fa-user-shield" /> أدمن
              </span>
            )}
          </h2>
          <div className={`${muted} truncate`} dir="ltr" style={{ textAlign: "start" }}>
            {user.email}
          </div>
          <div className={`${muted} mt-1`}>
            عضو من {date(user.metadata?.creationTime)} · آخر دخول {date(user.metadata?.lastSignInTime)}
          </div>
        </div>
        <button className={btnGhost} onClick={logout}>
          <Icon n="fa-right-from-bracket" /> تسجيل الخروج
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}