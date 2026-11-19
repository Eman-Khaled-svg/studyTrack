/* عناصر مشتركة + ستايل Neo-Brutalist (حدود سودا وظلال صلبة) */
export const card = "rounded-2xl border-2 border-black bg-white p-5 mb-4 shadow-[4px_4px_0_0_#000]";
export const input =
  "min-w-0 flex-1 basis-40 rounded-xl border-2 border-black bg-white px-3 py-2 text-sm outline-none placeholder:text-black/40 focus:bg-yellow-100";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_#000] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";
export const btnMain = `${btn} bg-yellow-300 hover:bg-yellow-200`;
export const btnGhost = `${btn} bg-white hover:bg-black/5`;
export const btnDel =
  "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-red-600 transition hover:bg-red-100";
export const muted = "text-sm text-black/55";

export const Icon = ({ n, className = "" }) => <i className={`fa-solid ${n} ${className}`} aria-hidden="true" />;

export const Bar = ({ p, color, className = "" }) => (
  <span className={`block h-3 flex-1 overflow-hidden rounded-full border-2 border-black bg-white ${className}`}>
    <i className="block h-full transition-all duration-500" style={{ width: p + "%", background: color }} />
  </span>
);

export function Ring({ value, size = 64, stroke = 7, color = "#000", text = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}%`} className="flex-none">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(0,0,0,.1)" strokeWidth={stroke} />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dashoffset .5s" }}
      />
      {text && (
        <text x={cx} y={cx + size * 0.08} textAnchor="middle" fontSize={size * 0.24} fontWeight="800" fill="#000">
          {value}%
        </text>
      )}
    </svg>
  );
}

export const IconBox = ({ icon, color, className = "h-11 w-11 text-lg" }) => (
  <div
    className={`grid flex-none place-items-center rounded-xl border-2 border-black ${className}`}
    style={{ background: color }}
  >
    <Icon n={icon} />
  </div>
);

