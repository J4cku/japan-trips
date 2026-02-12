"use client";
import Link from "next/link";

export function SplitBanner({ isExtendedPage = false, slug }: { isExtendedPage?: boolean; slug?: string }) {
  const prefix = slug ? `/trip/${slug}` : "";

  return (
    <div className="split-banner">
      <div className="split-line">
        <span className="split-scissors">{"\u2702"}</span>
        <div className="split-dash" />
      </div>
      <div className="split-content">
        <p className="split-title">Group splits here</p>
        {!isExtendedPage && (
          <Link href={`${prefix}/extended`} className="split-cta">
            Continue to Extended Trip &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
