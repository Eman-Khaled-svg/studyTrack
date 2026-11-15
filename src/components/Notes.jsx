import { Icon, card, input, muted } from "./ui";
import { usePersist } from "../hooks/usePersist";

export default function Notes() {
  const [note, setNote] = usePersist("st_note", "");
  return (
    <div className={card}>
      <h2 className="mb-3 font-extrabold">
        <Icon n="fa-pen-to-square" className="me-2 text-orange-500" />
        ملاحظاتي
      </h2>
      <textarea
        className={`${input} min-h-[55vh] w-full resize-y leading-8`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="اكتب أي ملاحظة هنا… بتتحفظ تلقائي"
        aria-label="الملاحظات"
      />
      <div className={`${muted} mt-2`}>{note.length} حرف · بتتحفظ تلقائي على جهازك</div>
    </div>
  );
}
