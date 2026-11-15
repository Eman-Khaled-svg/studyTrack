import { useState } from "react";
import { Icon, card, input, btnMain, btnDel, muted } from "./ui";
import { usePersist } from "../hooks/usePersist";

export default function Todos({ cheer }) {
  const [items, setItems] = usePersist("st_todos", []);
  const [text, setText] = useState("");

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setItems([{ id: Date.now(), text: t, done: false }, ...items]);
    setText("");
  };

  const toggle = (id) => {
    const it = items.find((i) => i.id === id);
    if (it && !it.done) cheer();
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const left = items.filter((i) => !i.done).length;

  return (
    <div className={`${card} !mb-0`}>
      <h2 className="mb-3 font-extrabold">
        <Icon n="fa-list-check" className="me-2 text-green-600" />
        المهام {items.length > 0 && <span className={muted}>({left} متبقية)</span>}
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          className={input}
          placeholder="مهمة جديدة"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          aria-label="مهمة جديدة"
        />
        <button className={btnMain} onClick={add}>
          إضافة
        </button>
      </div>
      <div className="mt-3">
        {items.length === 0 && <div className="py-4 text-center text-sm text-black/45">مفيش مهام لسه. اكتب أول مهمة.</div>}
        {items.map((i) => (
          <label key={i.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-black/5">
            <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} aria-label={i.text} className="peer sr-only" />
            <span
              className="grid h-5 w-5 flex-none place-items-center rounded-md border-2 border-black text-[10px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
              style={{ background: i.done ? "#22E55E" : "#fff" }}
            >
              {i.done && <Icon n="fa-check" />}
            </span>
            <span className={`flex-1 break-words ${i.done ? "text-black/40 line-through" : ""}`}>{i.text}</span>
            <button
              type="button"
              className={btnDel}
              aria-label="حذف المهمة"
              onClick={(e) => {
                e.preventDefault();
                setItems(items.filter((x) => x.id !== i.id));
              }}
            >
              <Icon n="fa-trash-can" />
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}
