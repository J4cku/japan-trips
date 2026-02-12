import type { Day } from "@/types/trip";

interface RegionStyle {
  bg: string;
  border: string;
  badge: string;
  accent: string;
}

function InfoBox({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-slate-100">
      <p className="text-xs font-bold text-slate-500 mb-1">{icon} {title}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

export function DayCard({
  day,
  regionStyle,
  isOpen,
  onToggle,
}: {
  day: Day;
  regionStyle: RegionStyle;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const blocks = groupActivities(day.activities);

  return (
    <div
      className={`rounded-xl mb-3 overflow-hidden transition-all shadow-sm hover:shadow-md`}
      style={{
        border: `1px solid ${regionStyle.border}`,
        backgroundColor: isOpen ? regionStyle.bg : "#fff",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: regionStyle.badge }}
            >
              Day {day.day}
            </span>
            <span className="text-xs text-slate-500">{day.dateLabel}</span>
          </div>
          <p className="font-semibold text-slate-800 text-sm mt-0.5">{day.title}</p>
          {!isOpen && <p className="text-xs text-slate-500 mt-0.5 truncate">{day.tagline}</p>}
        </div>
        <span className="text-slate-400 text-lg flex-shrink-0">
          {isOpen ? "\u25B2" : "\u25BC"}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">{day.tagline}</p>

          {blocks.map((block, i) => (
            <div key={i}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{block.label}</p>
              <ul className="space-y-1">
                {block.items.map((item, j) => (
                  <li key={j} className="text-sm text-slate-700">
                    {"\u2022"} {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-3 mt-3">
            <InfoBox icon={"\uD83D\uDE86"} title="Transport" text={day.transport.note || `${day.transport.mode}${day.transport.from ? ` from ${day.transport.from}` : ""}${day.transport.to ? ` to ${day.transport.to}` : ""}${day.transport.duration ? ` (${day.transport.duration})` : ""}`} />
            <InfoBox icon={"\uD83C\uDF71"} title="Food" text={day.food} />
            <InfoBox icon={"\uD83C\uDFE8"} title="Stay" text={day.stay || "N/A"} />
            <InfoBox icon={"\uD83D\uDCA1"} title="Pro Tip" text={day.tip} />
          </div>
        </div>
      )}
    </div>
  );
}

function groupActivities(activities: Day["activities"]) {
  const blocks: { label: string; items: string[] }[] = [];
  let currentBlock: { label: string; items: string[] } | null = null;

  for (const a of activities) {
    const hour = parseInt(a.time.split(":")[0]);
    let label: string;
    if (hour < 12) label = "Morning";
    else if (hour < 17) label = "Afternoon";
    else label = "Evening";

    if (!currentBlock || currentBlock.label !== label) {
      currentBlock = { label, items: [] };
      blocks.push(currentBlock);
    }

    let text = `${a.time} \u2014 ${a.name}`;
    if (a.duration) text += ` (${a.duration})`;
    if (a.cost) text += ` \u2014 ${a.cost.toLocaleString()}`;
    currentBlock.items.push(text);
  }

  return blocks;
}
