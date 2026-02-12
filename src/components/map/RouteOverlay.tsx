"use client";
import { Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { TripRoutes } from "@/types/trip";

interface RouteOverlayProps {
  routes: TripRoutes;
  selectedDay: number | null;
  showExtended?: boolean;
}

export function RouteOverlay({ routes, selectedDay, showExtended = false }: RouteOverlayProps) {
  const isHighlighted = selectedDay !== null;
  const main = routes.main;
  const mainCoords: LatLngExpression[] = main.coordinates.map((c) => [c.lat, c.lng]);
  const mainOpacity = isHighlighted ? main.opacity * 0.5 : main.opacity;

  return (
    <>
      <Polyline
        positions={mainCoords}
        pathOptions={{
          color: main.color,
          weight: main.weight,
          opacity: mainOpacity,
          dashArray: main.dashArray,
        }}
      />
      {routes.dayTrips.map((trip, i) => (
        <Polyline
          key={i}
          positions={[[trip.from.lat, trip.from.lng], [trip.to.lat, trip.to.lng]]}
          pathOptions={{
            color: main.color,
            weight: 1.5,
            opacity: isHighlighted ? 0.2 : 0.45,
            dashArray: "4,4",
          }}
        />
      ))}
      {showExtended && routes.extended && (
        <Polyline
          positions={routes.extended.coordinates.map((c) => [c.lat, c.lng] as LatLngExpression)}
          pathOptions={{
            color: routes.extended.color,
            weight: routes.extended.weight,
            opacity: isHighlighted ? routes.extended.opacity * 0.5 : routes.extended.opacity,
            dashArray: routes.extended.dashArray,
          }}
        />
      )}
    </>
  );
}
