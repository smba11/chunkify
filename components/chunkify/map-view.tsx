"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { CopySeedButton } from "@/components/chunkify/copy-seed-button";
import type { Seed } from "@/types/chunkify";

const markerIcon = new L.DivIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:999px;background:#fff;box-shadow:0 0 0 6px rgba(255,255,255,.18),0 12px 34px rgba(0,0,0,.35)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

export function MapView({ seeds }: { seeds: Seed[] }) {
  return (
    <MapContainer center={[35, -40]} zoom={3} scrollWheelZoom className="h-[70vh] min-h-[520px] overflow-hidden rounded-[2rem]">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {seeds.map((seed) => (
        <Marker key={seed.id} position={[seed.mapPosition.lat, seed.mapPosition.lng]} icon={markerIcon}>
          <Popup>
            <div className="w-56">
              <p className="font-semibold">{seed.name}</p>
              <p className="mt-1 text-xs text-neutral-600">Seed #{seed.seedNumber}</p>
              <p className="mt-2 text-xs leading-5 text-neutral-700">{seed.description}</p>
              <div className="mt-3 flex flex-col gap-2">
                <CopySeedButton seedNumber={seed.seedNumber} />
                <Link href={`/seed/${seed.slug}`} className="rounded-full bg-neutral-900 px-3 py-2 text-center text-xs font-medium text-white">
                  Open seed
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
