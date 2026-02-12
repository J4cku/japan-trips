"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Pin, PinCategory, PinStatus, PinsData, MapConfig, TripRoutes } from "@/types/trip";
import { PinPopup, HotelPinPopup } from "./PinPopup";
import { RouteOverlay } from "./RouteOverlay";
import { MapSidebar } from "./MapSidebar";

const TILES = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};

const STATUS_STYLE: Record<PinStatus, { color: string; radius: number; opacity: number; borderColor: Record<string, string>; borderWidth: number }> = {
  matched:   { color: "#BC002D", radius: 6, opacity: 1.0, borderColor: { dark: "#fff", light: "#fff" }, borderWidth: 2 },
  nearRoute: { color: "#c4956a", radius: 5, opacity: 0.75, borderColor: { dark: "#fff", light: "#8b7355" }, borderWidth: 1 },
  offRoute:  { color: "#888",    radius: 4, opacity: 0.4, borderColor: { dark: "#444", light: "#bbb" }, borderWidth: 1 },
};

function createHotelIcon(pin: Pin) {
  const fill = pin.chosen ? "#c4956a" : "#666";
  const isRyokan = pin.category === "ryokan";
  const markerClass = isRyokan ? "ryokan-marker" : "hotel-marker";

  return L.divIcon({
    html: `<div class="${markerClass}" style="
      width: 12px;
      height: 12px;
      background: ${fill};
      border: 2px solid ${pin.chosen ? "#fff" : "#999"};
      ${isRyokan ? "transform: rotate(45deg);" : ""}
      box-sizing: border-box;
    "></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const check = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function FitBoundsOnMount({ pins }: { pins: Pin[] }) {
  const map = useMap();
  const hasFit = useRef(false);
  useEffect(() => {
    if (hasFit.current || pins.length === 0) return;
    hasFit.current = true;
    const coords = pins.map((p) => [p.lat, p.lng] as [number, number]);
    map.fitBounds(L.latLngBounds(coords).pad(0.1));
  }, [pins, map]);
  return null;
}

function FlyToHandler({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 14, { duration: 1.5 });
    }
  }, [map, target]);
  return null;
}

function InitialDayHandler({ day, pins }: { day: number | null; pins: Pin[] }) {
  const map = useMap();
  const hasFlown = useRef(false);
  useEffect(() => {
    if (day !== null && !hasFlown.current) {
      hasFlown.current = true;
      const dayPins = pins.filter(
        (p) => (p.status === "matched" && p.day === day) ||
               (p.status === "nearRoute" && p.possibleDays.includes(day))
      );
      if (dayPins.length > 0) {
        const bounds = dayPins.map((p) => [p.lat, p.lng] as [number, number]);
        map.flyToBounds(L.latLngBounds(bounds).pad(0.3), { duration: 1.5 });
      }
    }
  }, [day, pins, map]);
  return null;
}

interface MapViewProps {
  pinsData: PinsData;
  totalDays: number;
  extendedTotalDays?: number;
  initialDay?: number | null;
  mapConfig?: MapConfig;
  routes?: TripRoutes;
}

export default function MapView({ pinsData, totalDays, extendedTotalDays = 21, initialDay = null, mapConfig, routes }: MapViewProps) {
  const allPins = pinsData.items;
  const mapRef = useRef<LeafletMap | null>(null);
  const theme = useTheme();

  const [statusFilters, setStatusFilters] = useState<Record<PinStatus, boolean>>({
    matched: true,
    nearRoute: true,
    offRoute: true,
  });
  const [categoryFilters, setCategoryFilters] = useState<Set<PinCategory>>(
    () => new Set(pinsData.categories as PinCategory[])
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDay);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [showExtended, setShowExtended] = useState(false);

  const toggleStatus = useCallback((s: PinStatus) => {
    setStatusFilters((prev) => ({ ...prev, [s]: !prev[s] }));
  }, []);

  const toggleCategory = useCallback((c: PinCategory) => {
    setCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }, []);

  const toggleHotels = useCallback(() => {
    setShowHotels((prev) => !prev);
  }, []);

  const toggleExtended = useCallback(() => {
    setShowExtended((prev) => !prev);
  }, []);

  const visiblePins = useMemo(() => {
    return allPins.filter((pin) => {
      if (pin.source === "hotels" && !showHotels) return false;
      const effectiveStatus = showExtended && pin.extendedStatus ? pin.extendedStatus : pin.status;
      if (!statusFilters[effectiveStatus]) return false;
      if (!categoryFilters.has(pin.category)) return false;
      return true;
    });
  }, [allPins, statusFilters, categoryFilters, showHotels, showExtended]);

  const regularPins = useMemo(() => visiblePins.filter((p) => p.source !== "hotels"), [visiblePins]);
  const hotelPins = useMemo(() => visiblePins.filter((p) => p.source === "hotels"), [visiblePins]);

  const getPinOpacity = useCallback((pin: Pin) => {
    const effectiveStatus = showExtended && pin.extendedStatus ? pin.extendedStatus : pin.status;
    if (selectedDay === null) return STATUS_STYLE[effectiveStatus].opacity;
    const isActive =
      (pin.status === "matched" && pin.day === selectedDay) ||
      (pin.status === "nearRoute" && pin.possibleDays.includes(selectedDay)) ||
      (showExtended && pin.extendedDay === selectedDay);
    return isActive ? 1.0 : 0.15;
  }, [selectedDay, showExtended]);

  const handleFlyTo = useCallback((pin: Pin) => {
    setFlyTarget({ lat: pin.lat, lng: pin.lng });
    setSidebarOpen(false);
  }, []);

  return (
    <div className="map-page">
      <MapSidebar
        pins={allPins}
        visiblePins={visiblePins}
        statusFilters={statusFilters}
        onToggleStatus={toggleStatus}
        categoryFilters={categoryFilters}
        allCategories={pinsData.categories}
        onToggleCategory={toggleCategory}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        totalDays={totalDays}
        extendedTotalDays={extendedTotalDays}
        stats={pinsData.stats}
        onFlyTo={handleFlyTo}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen((o) => !o)}
        showHotels={showHotels}
        onToggleHotels={toggleHotels}
        showExtended={showExtended}
        onToggleExtended={toggleExtended}
      />

      <MapContainer
        center={mapConfig?.defaultCenter || [0, 0]}
        zoom={mapConfig?.defaultZoom || 2}
        minZoom={mapConfig?.minZoom || 2}
        maxZoom={mapConfig?.maxZoom || 18}
        {...(mapConfig?.maxBounds ? { maxBounds: mapConfig.maxBounds, maxBoundsViscosity: mapConfig.maxBoundsViscosity ?? 1.0 } : {})}
        style={{ width: "100%", height: "100%", background: theme === "light" ? "#f2efe9" : "#0d1117" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url={TILES[theme]}
        />

        {routes && <RouteOverlay routes={routes} selectedDay={selectedDay} showExtended={showExtended} />}
        <FitBoundsOnMount pins={allPins} />
        <FlyToHandler target={flyTarget} />
        <InitialDayHandler day={initialDay} pins={allPins} />

        {/* Hotel pins - rendered first (below regular pins) */}
        {showHotels && hotelPins.map((pin) => {
          const opacity = getPinOpacity(pin);
          return (
            <Marker
              key={`hotel-${pin.id}`}
              position={[pin.lat, pin.lng]}
              icon={createHotelIcon(pin)}
              opacity={opacity}
              zIndexOffset={-1000}
            >
              <Popup
                closeButton={false}
                className="map-popup"
              >
                <HotelPinPopup pin={pin} />
              </Popup>
            </Marker>
          );
        })}

        {/* Regular pins */}
        {regularPins.map((pin) => {
          const effectiveStatus = showExtended && pin.extendedStatus ? pin.extendedStatus : pin.status;
          const style = STATUS_STYLE[effectiveStatus];
          const opacity = getPinOpacity(pin);
          const isGlowing =
            selectedDay !== null &&
            ((pin.status === "matched" && pin.day === selectedDay) ||
             (showExtended && pin.extendedDay === selectedDay));

          return (
            <CircleMarker
              key={pin.id}
              center={[pin.lat, pin.lng]}
              radius={style.radius}
              pathOptions={{
                fillColor: style.color,
                fillOpacity: opacity,
                color: pin.source === "itinerary" ? "#BC002D" : style.borderColor[theme],
                weight: style.borderWidth,
                opacity: opacity,
                dashArray: pin.source === "itinerary" ? "3,3" : undefined,
                className: isGlowing ? "pin-glow" : undefined,
              }}
            >
              <Popup
                closeButton={false}
                className="map-popup"
              >
                <PinPopup pin={pin} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
