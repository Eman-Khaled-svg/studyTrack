import { useState, useEffect } from "react";

export function load(k) {
  try {
    const s = localStorage.getItem(k);
    return s === null ? null : JSON.parse(s);
  } catch (e) {
    return null;
  }
}

export function usePersist(key, init) {
  const [v, setV] = useState(() => {
    const s = load(key);
    return s !== null ? s : typeof init === "function" ? init() : init;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {}
  }, [key, v]);
  return [v, setV];
}
