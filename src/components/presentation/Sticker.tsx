import type { StickerPlacement } from "@/types/trip";

export function Sticker({ s }: { s: StickerPlacement }) {
  const animCls = s.anim === "spin" ? "sticker-spin" : s.dur ? "sticker-float" : "sticker";

  const style: Record<string, string> = {
    "--rot": s.rot || "0deg",
    "--op": String(s.op || 0.12),
    width: s.size || "100px",
  } as Record<string, string>;

  if (s.top) style.top = s.top;
  if (s.bottom) style.bottom = s.bottom;
  if (s.left) style.left = s.left;
  if (s.right) style.right = s.right;
  if (s.dur) style["--dur"] = s.dur;
  if (s.drift) style["--drift"] = s.drift;
  if (s.swing) style["--swing"] = s.swing;
  if (s.delay) style["--pop-delay"] = s.delay;

  return (
    <div className={animCls} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.src} alt="" loading="lazy" />
    </div>
  );
}
