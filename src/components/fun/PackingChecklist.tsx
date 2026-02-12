"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "jpn-packing";
const CUSTOM_KEY = "jpn-packing-custom";

interface PackingState {
  checked: Record<string, boolean>;
  customItems: string[];
}

function loadState(defaultItems: string[]): PackingState {
  if (typeof window === "undefined") {
    return { checked: {}, customItems: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const checked = raw ? JSON.parse(raw) : {};
    const customRaw = localStorage.getItem(CUSTOM_KEY);
    const customItems = customRaw ? JSON.parse(customRaw) : [];
    return { checked, customItems };
  } catch {
    return { checked: {}, customItems: [] };
  }
}

export function PackingChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state = loadState(items);
    setChecked(state.checked);
    setCustomItems(state.customItems);
    setMounted(true);
  }, [items]);

  const allItems = [...items, ...customItems];
  const checkedCount = allItems.filter((item) => checked[item]).length;
  const totalCount = allItems.length;

  const persist = useCallback(
    (newChecked: Record<string, boolean>, newCustom: string[]) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChecked));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(newCustom));
    },
    []
  );

  const toggle = (item: string) => {
    const next = { ...checked, [item]: !checked[item] };
    setChecked(next);
    persist(next, customItems);
  };

  const addCustom = () => {
    const trimmed = newItem.trim();
    if (!trimmed || allItems.includes(trimmed)) return;
    const nextCustom = [...customItems, trimmed];
    setCustomItems(nextCustom);
    setNewItem("");
    persist(checked, nextCustom);
  };

  const removeCustom = (item: string) => {
    const nextCustom = customItems.filter((c) => c !== item);
    const nextChecked = { ...checked };
    delete nextChecked[item];
    setCustomItems(nextCustom);
    setChecked(nextChecked);
    persist(nextChecked, nextCustom);
  };

  const resetAll = () => {
    setChecked({});
    setCustomItems([]);
    setNewItem("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOM_KEY);
  };

  if (!mounted) {
    return (
      <div className="pk-container">
        <div className="pk-progress-wrap">
          <div className="pk-progress-bar" style={{ width: "0%" }} />
        </div>
        <p className="pk-progress-label">0/{items.length} packed</p>
        {items.map((item) => (
          <div key={item} className="pk-row">
            <div className="pk-checkbox" />
            <span className="pk-label">{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pk-container">
      {/* Progress */}
      <div className="pk-progress-wrap">
        <div
          className="pk-progress-bar"
          style={{ width: `${totalCount ? (checkedCount / totalCount) * 100 : 0}%` }}
        />
      </div>
      <div className="pk-progress-row">
        <p className="pk-progress-label">
          {checkedCount}/{totalCount} packed
        </p>
        {(checkedCount > 0 || customItems.length > 0) && (
          <button className="pk-reset" onClick={resetAll}>
            Reset all
          </button>
        )}
      </div>

      {/* Items */}
      <div className="pk-list">
        {allItems.map((item) => {
          const isChecked = !!checked[item];
          const isCustom = customItems.includes(item);
          return (
            <div
              key={item}
              className={`pk-row ${isChecked ? "pk-row-checked" : ""}`}
              onClick={() => toggle(item)}
            >
              <div className={`pk-checkbox ${isChecked ? "pk-checkbox-on" : ""}`}>
                {isChecked && (
                  <svg viewBox="0 0 24 24" className="pk-check-svg">
                    <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`pk-label ${isChecked ? "pk-label-done" : ""}`}>
                {item}
              </span>
              {isCustom && (
                <button
                  className="pk-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustom(item);
                  }}
                  title="Remove item"
                >
                  x
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add custom item */}
      <div className="pk-add">
        <input
          className="pk-input"
          type="text"
          placeholder="Add custom item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCustom();
          }}
        />
        <button
          className="pk-add-btn"
          onClick={addCustom}
          disabled={!newItem.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
