"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Report = {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  position: [number, number];
  status: string;
};

interface MapComponentProps {
  reports: Report[];
  defaultPosition: [number, number];
  onPositionSelect?: (position: [number, number]) => void;
  isSelectionMode?: boolean;
}

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
}

export default function MapComponent({ reports, defaultPosition, onPositionSelect, isSelectionMode = false }: MapComponentProps) {
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (selectedPosition && onPositionSelect) {
      onPositionSelect(selectedPosition);
    }
  }, [selectedPosition, onPositionSelect]);

  return (
    <MapContainer center={defaultPosition} zoom={13} className="h-96 w-full rounded-lg shadow-inner relative z-0">
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isSelectionMode ? (
        <LocationMarker position={selectedPosition} setPosition={setSelectedPosition} />
      ) : (
        reports.map(report => (
          <Marker key={report.id} position={report.position} icon={markerIcon}>
            <Popup>
              <div className="min-w-[180px]">
                <div className="font-bold text-blue-700 mb-1">{report.category}</div>
                <div className="text-gray-700 mb-2 text-sm">{report.description}</div>
                {report.imageUrl && (
                  <img src={report.imageUrl} alt="Report" className="rounded mb-2 max-h-24 max-w-full" />
                )}
                <div className="text-xs text-gray-500">Status: {report.status}</div>
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
} 