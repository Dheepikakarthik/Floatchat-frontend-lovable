import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type FloatData = {
  id: string;
  lat: number;
  lon: number;
  temp: number;
  status: string;
};

type Props = {
  floats: FloatData[];
};

export default function OceanMap({ floats }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Leaflet touches browser globals internally — only safe to run client-side
    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default ?? leafletModule;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div
        className="glass rounded-2xl p-6 lg:col-span-3 flex items-center justify-center"
        style={{ height: 500 }}
      >
        <span className="text-sm text-muted-foreground">Loading map…</span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 lg:col-span-3">
      <h2 className="mb-4 text-xl font-semibold">🌍 Live Ocean Float Map</h2>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {floats.map((f) => (
          <Marker key={f.id} position={[f.lat, f.lon]}>
            <Popup>
              <strong>{f.id}</strong>
              <br />
              🌡 Temperature: {f.temp}°C
              <br />
              📍 Latitude: {f.lat}
              <br />
              📍 Longitude: {f.lon}
              <br />
              ✅ Status: {f.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}