"use client";

import { useState, useEffect } from "react";
import { useTripData } from "@/context/TripContext";

export function CurrencyConverter() {
  const data = useTripData();
  const config = data.currency;

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(config?.defaultAmount ?? 100));
  const [from, setFrom] = useState(config?.defaultFrom ?? "EUR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("mobile-menu-close", close);
    return () => window.removeEventListener("mobile-menu-close", close);
  }, []);

  if (!config || !mounted) return null;

  const numAmount = parseFloat(amount) || 0;
  const others = config.currencies.filter((c) => c !== from);

  const convert = (to: string) => {
    const rate = config.rates[from]?.[to] ?? 0;
    const decimals = rate >= 10 ? 0 : 2;
    return (numAmount * rate).toFixed(decimals);
  };

  const symbol = config.symbols[from] || from;

  return (
    <>
      <button
        className="ui-toggle cc-toggle"
        onClick={() => setOpen(!open)}
        title="Currency converter"
      >
        {open ? "\u2715" : symbol}
      </button>

      {open && (
        <div className="cc-panel">
          <div className="cc-header">
            <span className="cc-title">Currency</span>
          </div>

          <div className="cc-input-row">
            <input
              className="cc-input"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <select
              className="cc-select"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {config.currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="cc-results">
            {others.map((c) => (
              <div key={c} className="cc-result-row">
                <span className="cc-result-currency">{c}</span>
                <span className="cc-result-value">
                  {config.symbols[c] || c} {convert(c)}
                </span>
              </div>
            ))}
          </div>

          <div className="cc-footer">
            <span className="cc-rate-note">{config.rateNote}</span>
          </div>
        </div>
      )}
    </>
  );
}
