import type { PolaroidPhoto } from "@/types/trip";

const SIZE_MAP = { sm: 260, md: 320, lg: 380 };

// Overlapping pile in center-right, close to content
const POSITION_SLOTS = [
  { top: "8%", right: "35%" },
  { top: "22%", right: "42%" },
  { top: "40%", right: "32%" },
];

export function Polaroid({ photo, delay, index = 0 }: { photo: PolaroidPhoto; delay?: string; index?: number }) {
  const w = SIZE_MAP[photo.size] || 200;
  const padding = 10;
  const totalW = w + padding * 2;

  const slot = POSITION_SLOTS[index % POSITION_SLOTS.length];

  const style: Record<string, string | number> = {
    position: "absolute",
    width: `${totalW}px`,
    zIndex: 2 + index,
    cursor: "pointer",
    opacity: 0,
    transform: `scale(0) rotate(${photo.rotation}deg)`,
    "--rot": `${photo.rotation}deg`,
    "--pop-delay": delay || "0.4s",
    top: slot.top,
    right: slot.right,
  };

  return (
    <div className="polaroid" style={style as React.CSSProperties}>
      <div className="polaroid-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.caption} loading="lazy" />
        <span className="polaroid-caption">{photo.caption}</span>
      </div>
    </div>
  );
}
