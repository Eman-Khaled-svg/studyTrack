import { useState } from "react";

export default function Avatar({ user, size = 40, className = "" }) {
  const [bad, setBad] = useState(false);
  const initial = (user?.displayName || user?.email || "?").trim().charAt(0).toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.45, flex: "none" };
  if (user?.photoURL && !bad)
    return (
      <img
        src={user.photoURL}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBad(true)}
        className={`rounded-full border-2 border-black object-cover ${className}`}
        style={style}
      />
    );
  return (
    <div aria-hidden="true" className={`grid place-items-center rounded-full border-2 border-black bg-yellow-300 font-extrabold ${className}`} style={style}>
      {initial}
    </div>
  );
}