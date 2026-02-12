"use client";

import { useEffect, useRef } from "react";

const cities = [
  { name: "Tokyo", lat: 35.68, lng: 139.69, color: "#E63946" },
  { name: "Kyoto", lat: 35.01, lng: 135.77, color: "#C9A96E" },
  { name: "Osaka", lat: 34.69, lng: 135.5, color: "#00D9FF" },
  { name: "Hiroshima", lat: 34.4, lng: 132.46, color: "#C9A96E" },
  { name: "Onomichi", lat: 34.41, lng: 133.2, color: "#00D9FF" },
  { name: "Kumamoto", lat: 32.8, lng: 130.71, color: "#E63946" },
];

const routeCoords: [number, number][] = [
  [35.68, 139.69],
  [35.01, 135.77],
  [34.69, 135.5],
  [34.41, 133.2],
  [34.4, 132.46],
  [32.8, 130.71],
];

interface JapanMapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
}

export function JapanMap({
  className,
  center = [34.5, 135.5],
  zoom = 6,
}: JapanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      // @ts-expect-error -- CSS import handled by bundler
      import("leaflet/dist/leaflet.css");

      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      // Route line
      L.polyline(routeCoords, {
        color: "#00D9FF",
        weight: 2,
        opacity: 0.7,
        dashArray: "8 6",
      }).addTo(map);

      // City markers
      cities.forEach((city) => {
        L.circleMarker([city.lat, city.lng], {
          radius: 10,
          fillColor: city.color,
          fillOpacity: 0.15,
          stroke: false,
        }).addTo(map);

        L.circleMarker([city.lat, city.lng], {
          radius: 4,
          fillColor: city.color,
          fillOpacity: 0.9,
          color: city.color,
          weight: 1,
          opacity: 0.5,
        }).addTo(map);

        // Offset Onomichi label to the right to avoid overlapping Hiroshima
        const anchorX = city.name === "Onomichi" ? -40 : 0;
        const anchorY = city.name === "Onomichi" ? 10 : 20;

        L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            className: "lp-map-label",
            html: `<span style="color:${city.color}">${city.name}</span>`,
            iconSize: [0, 0],
            iconAnchor: [anchorX, anchorY],
          }),
        }).addTo(map);
      });

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className={className} />;
}
