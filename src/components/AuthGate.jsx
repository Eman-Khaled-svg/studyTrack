import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { auth, db, provider, isConfigured, ADMIN_EMAIL } from "../firebase";
import { Icon, card, btnMain, muted } from "./ui";

async function recordVisit(u) {
  const key = "st_seen_" + u.uid;
  try {
    if (sessionStorage.getItem(key)) return;
  } catch (e) {}
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  const base = { email: u.email, name: u.displayName || "", photo: u.photoURL || "", lastSeen: serverTimestamp() };
  if (snap.exists()) await updateDoc(ref, { ...base, visits: increment(1) });
  else await setDoc(ref, { ...base, firstSeen: serverTimestamp(), visits: 1 });
  try {
    sessionStorage.setItem(key, "1");
  } catch (e) {}
}

const shell = "grid min-h-screen place-items-center bg-[#FAF6EB] p-4 text-black";
const font = { fontFamily: "'Cairo', system-ui, 'Segoe UI', Tahoma, sans-serif" };

function Login() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const login = async () => {
    setErr("");
    setBusy(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code === "auth/popup-blocked") return signInWithRedirect(auth, provider);
      if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request")
        setErr("ما قدرناش نسجّل دخولك. جرّب تاني. (" + (e.code || e.message) + ")");
    }
    setBusy(false);
  };
  return (
    <div dir="rtl" lang="ar" className={shell} style={font}>
      <div className={`${card} w-full max-w-sm text-center`}>
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border-2 border-black bg-red-500 text-2xl text-white shadow-[3px_3px_0_0_#000]">
          <Icon n="fa-graduation-cap" />
        </div>
        <h1 className="text-2xl font-extrabold">متابعة الدراسة</h1>
        <p className={`${muted} mt-1 mb-5`}>سجّل دخولك بحساب جوجل علشان تبدأ.</p>
        <button className={`${btnMain} w-full justify-center`} onClick={login} disabled={busy}>
          <Icon n="fa-right-to-bracket" /> {busy ? "ثواني…" : "الدخول بحساب جوجل"}
        </button>
        {err && <p className="mt-3 text-sm font-bold text-red-600">{err}</p>}
        <p className="mt-5 text-xs text-black/55">
          بنسجّل إيميلك واسمك وتاريخ دخولك، علشان صاحب الموقع يعرف مين بيستخدمه. مذاكرتك نفسها بتفضل على جهازك.
        </p>
      </div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    if (!isConfigured) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) recordVisit(u).catch(() => {});
    });
  }, []);

  if (!isConfigured) return children({ user: null, isAdmin: false, logout: null });
  if (user === undefined)
    return (
      <div dir="rtl" className={shell} style={font}>
        <p className="font-bold">جاري التحميل…</p>
      </div>
    );
  if (!user) return <Login />;
  const isAdmin = !!ADMIN_EMAIL && user.emailVerified && (user.email || "").toLowerCase() === ADMIN_EMAIL;
  return children({ user, isAdmin, logout: () => signOut(auth) });
}