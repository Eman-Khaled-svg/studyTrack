import { Icon, IconBox, card, btnMain } from "./ui";

const sections = [
  {
    icon: "fa-rocket",
    color: "#FFD60A",
    title: "ابدأ من هنا",
    steps: [
      "من صفحة «نظرة عامة» اختار مادة جاهزة أو اكتب اسم مادتك.",
      "ادخل المادة واكتب اسم أول درس.",
      "لما تخلّص درس، دوس على المربع اللي جنبه علشان تعلّم عليه.",
    ],
  },
  {
    icon: "fa-book",
    color: "#22E55E",
    title: "المواد",
    steps: [
      "إضافة مادة: من «نظرة عامة» اكتب اسمها في الخانة واضغط Enter.",
      "فتح مادة: دوس على اسمها في القائمة الجانبية أو على كارتها.",
      "حذف مادة: من أسفل صفحة المادة، زرار «حذف المادة».",
    ],
  },
  {
    icon: "fa-list-check",
    color: "#FF8A3D",
    title: "الدروس",
    steps: [
      "اكتب اسم الدرس في الخانة الكبيرة واضغط Enter أو «إضافة».",
      "اختار نوعه (PDF أو PPTX أو كتاب أو كويز أو فيديو) من الأزرار الصغيرة، وده اختياري.",
      "عايز تضيف 10 محاضرات مرة واحدة؟ اكتب الرقم في خانة «كذا درس» وادوس «ضيفهم مرقّمين».",
      "علّم على الدرس بالمربع، وامسحه بأيقونة السلة.",
      "الأقسام اختيارية: بتفيدك لو عايز تقسّم دروسك (محاضرات، سكاشن، كويزات).",
    ],
  },
  {
    icon: "fa-calendar-day",
    color: "#FF3B4E",
    title: "الامتحانات",
    steps: [
      "حدد تاريخ الامتحان من أعلى صفحة المادة.",
      "هيظهر لك كام يوم فاضل، وكام درس تذاكر كل يوم علشان تلحق.",
      "كل الامتحانات بتتجمع في «جدول الامتحانات» في نظرة عامة، مرتبة بالتاريخ.",
      "الامتحان اتأجل؟ دوس «إلغاء الموعد» وحدد تاريخ جديد.",
      "اللون بيقولك الموقف: أخضر بعيد، برتقالي أسبوع أو أقل، أحمر 3 أيام أو أقل.",
    ],
  },
  {
    icon: "fa-table-cells-large",
    color: "#A3E635",
    title: "صفحة نظرة عامة",
    steps: [
      "التقدم الكلي في كل المواد، ونسبة كل مادة لوحدها.",
      "عدد الأيام المتتالية اللي ذاكرت فيها، وعدد اللي خلّصته النهارده.",
      "«المذاكرة الجاية»: أول دروس تذاكرها، وتقدر تعلّم عليها من هناك مباشرة.",
    ],
  },
  {
    icon: "fa-sliders",
    color: "#FFD60A",
    title: "أزرار صفحة المادة",
    steps: [
      "دوّر في الدروس: بيدوّر في كل الأقسام.",
      "إخفاء المخلّص: بيخفي الدروس اللي علّمت عليها علشان تشوف المتبقي بس (ما بيمسحش حاجة).",
      "طي الكل / فتح الكل: بيقفل أو يفتح كل الأقسام مرة واحدة.",
    ],
  },
  {
    icon: "fa-stopwatch",
    color: "#22E55E",
    title: "الأدوات",
    steps: [
      "بومودورو: 25 دقيقة تركيز وبعدها راحة 5 دقايق، وكل 4 جلسات راحة أطول.",
      "المهام: قايمة بأي حاجة تفتكرها (مش لازم تكون دروس).",
      "الملاحظات: اكتب أي حاجة وبتتحفظ لوحدها.",
    ],
  },
];

const faq = [
  ["بياناتي محفوظة فين؟", "على جهازك أنت بس، في المتصفح. مفيش حساب ولا مزامنة بين الأجهزة، ولو مسحت بيانات المتصفح هتتمسح."],
  ["ليه الأيام المتتالية صفر؟", "علشان تتحسب لازم تعلّم على درس واحد على الأقل النهارده. ولو فاتك يوم بترجع من الأول."],
  ["إزاي أصفّر التقدم من الأول؟", "من أسفل القائمة الجانبية دوس «إعادة ضبط التقدم» مرتين. ده بيشيل علامات الصح بس ومش بيمسح الدروس."],
  ["أقدر أعدّل اسم درس؟", "لسه لأ. احذفه بالسلة وضيفه من جديد بالاسم الصح."],
  ["الشاشة الترحيبية راحت، أشوفها تاني؟", "دوس على زرار ؟ الأصفر اللي تحت على الشمال."],
];

export default function Guide({ setView }) {
  return (
    <div>
      <div className={`${card} !bg-yellow-300`}>
        <h2 className="text-2xl font-extrabold">إزاي تستخدم متابعة الدراسة؟</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7">
          الفكرة بسيطة: تكتب موادك ودروسك، وتعلّم على اللي خلّصته، وتحدد ميعاد الامتحان. والموقع يحسب لك التقدم ويقولك تذاكر إيه.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.title} className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
            <div className="mb-3 flex items-center gap-3">
              <IconBox icon={s.icon} color={s.color} className="h-11 w-11 text-lg" />
              <h3 className="text-lg font-extrabold">{s.title}</h3>
            </div>
            <ol className="grid gap-2.5">
              {s.steps.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm leading-7">
                  <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full border-2 border-black bg-white text-[10px] font-extrabold">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className={`${card} mt-4`}>
        <h3 className="mb-3 text-lg font-extrabold">
          <Icon n="fa-circle-question" className="me-2 text-red-500" />
          أسئلة شائعة
        </h3>
        <div className="grid gap-2">
          {faq.map(([q, a]) => (
            <details key={q} className="rounded-xl border-2 border-black bg-white px-4 py-3">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-2 text-sm leading-7 text-black/65">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className={btnMain} onClick={() => setView("overview")}>
          <Icon n="fa-rocket" /> يلا نبدأ
        </button>
      </div>
    </div>
  );
}
