import React, { useEffect, useState } from "react";

export default function MapApp() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        setError(`Error: ${err.message}`);
      }
    );
  }, []);

  // Compute bounding box with a small margin for map zoom
  const getBBox = (lon, lat, delta = 0.01) => {
    const left = lon - delta;
    const bottom = lat - delta;
    const right = lon + delta;
    const top = lat + delta;
    // Encode URI components for safe URLs
    return encodeURIComponent(`${left},${bottom},${right},${top}`);
  };

  return (
    <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      {error && <p>{error}</p>}
      {!error && !location && <p>Loading location...</p>}
      {location && (
        <iframe
          title="Map"
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${getBBox(
            location.lon,
            location.lat
          )}&layer=mapnik&marker=${location.lat}%2C${location.lon}`}
          allowFullScreen
        />
      )}
    </div>
  );
}
