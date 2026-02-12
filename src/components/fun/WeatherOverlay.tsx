"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTripData } from "@/context/TripContext";
import type { DayWeather } from "@/types/trip";

export function WeatherOverlay() {
  const data = useTripData();
  const weatherByDay = useMemo(() => {
    if (!data.weather) return {};
    return Object.fromEntries(data.weather.map((w) => [w.day, w]));
  }, [data.weather]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("weather-overlay") !== "off";
    }
    return true;
  });

  useEffect(() => {
    const container = document.getElementById("snap-root");
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.id.replace("slide-", ""));
            if (!isNaN(idx)) setCurrentSlide(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    container.querySelectorAll(".slide").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const toggleVisible = useCallback(() => {
    setVisible((v) => {
      const next = !v;
      localStorage.setItem("weather-overlay", next ? "on" : "off");
      if (!next) setExpanded(false);
      return next;
    });
  }, []);

  const dayNumber = currentSlide;
  const weather: DayWeather | undefined = weatherByDay[dayNumber];
  const isHeroOrClosing = currentSlide === 0 || !weather;

  if (!data.weather || data.weather.length === 0) return null;

  return (
    <>
      <button
        className="ui-toggle weather-toggle"
        onClick={toggleVisible}
        title={visible ? "Hide weather" : "Show weather"}
        aria-label={visible ? "Hide weather overlay" : "Show weather overlay"}
      >
        {"\uD83C\uDF21\uFE0F"}
        {!visible && <span className="weather-toggle-off" />}
      </button>

      {visible && !isHeroOrClosing && weather && (
        <div
          className={`weather-overlay ${expanded ? "weather-overlay--expanded" : ""} weather-condition--${weather.condition}`}
          onClick={() => setExpanded((e) => !e)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setExpanded((v) => !v);
            }
          }}
        >
          <div className="weather-badge">
            <span className="weather-badge-icon">{weather.icon}</span>
            <span className="weather-badge-temp">
              {weather.highC}&deg; / {weather.lowC}&deg;
            </span>
            <span className="weather-badge-rain">
              <span className="weather-rain-drop">{"\uD83D\uDCA7"}</span>
              {weather.rainChance}%
            </span>
          </div>

          <div className="weather-expanded">
            <div className="weather-expanded-location">{weather.location}</div>
            <div className="weather-detail-row">
              <span className="weather-detail-label">Condition</span>
              <span className="weather-detail-value">
                {weather.icon} {weather.condition.replace("-", " ")}
              </span>
            </div>
            <div className="weather-detail-row">
              <span className="weather-detail-label">Humidity</span>
              <span className="weather-detail-value">{weather.humidity}%</span>
            </div>
            <div className="weather-detail-row">
              <span className="weather-detail-label">Sunrise</span>
              <span className="weather-detail-value">{weather.sunrise}</span>
            </div>
            <div className="weather-detail-row">
              <span className="weather-detail-label">Sunset</span>
              <span className="weather-detail-value">{weather.sunset}</span>
            </div>
            <div className="weather-tip">{weather.tip}</div>
          </div>
        </div>
      )}
    </>
  );
}
