"use client";

import { useEffect, useState, useRef } from "react";

export interface Branch {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  mapsUrl: string;
}

const BRANCHES: Branch[] = [
  {
    id: "b1",
    name: "Lollipop The Cake Shop — Branch 1",
    address: "Rockfort Main Road, Trichy, Tamil Nadu",
    hours: "10:00 AM – 10:00 PM (Open Daily)",
    phone: "+91 98765 43210",
    lat: 10.805,
    lng: 78.6856,
    mapsUrl: "https://maps.app.goo.gl/GwYnU3FhX1ruqYEo6?g_st=aw",
  },
  {
    id: "b2",
    name: "Lollipop The Cake Shop — Branch 2",
    address: "Thillai Nagar Main Road, Trichy, Tamil Nadu",
    hours: "10:00 AM – 10:00 PM (Open Daily)",
    phone: "+91 98765 43210",
    lat: 10.815,
    lng: 78.6956,
    mapsUrl: "https://maps.app.goo.gl/Cd1qR172h1AQNF1C8?g_st=aw",
  },
];

export default function BranchSection() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("b1");
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Dynamically load Leaflet CSS & JS
    if (typeof window === "undefined") return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current || leafletMapInstance.current) return;

      try {
        const map = L.map(mapRef.current, { scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customIcon = L.divIcon({
          className: "",
          html: '<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#962854;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 6px 14px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:15px;">🎂</span></div>',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -32],
        });

        const bounds = L.latLngBounds(BRANCHES.map((b) => [b.lat, b.lng]));
        map.fitBounds(bounds.pad(0.5));

        BRANCHES.forEach((b) => {
          const marker = L.marker([b.lat, b.lng], { icon: customIcon, title: b.name }).addTo(map);
          marker.bindPopup(`<strong>${b.name}</strong><br>${b.address}`);
          marker.on("click", () => {
            setSelectedBranchId(b.id);
          });
          markersRef.current[b.id] = marker;
        });

        leafletMapInstance.current = map;
        setMapLoaded(true);

        // Open first popup
        if (markersRef.current["b1"]) {
          markersRef.current["b1"].openPopup();
        }
      } catch (err) {
        console.error("Leaflet init error:", err);
      }
    };

    if ((window as any).L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranchId(branch.id);
    if (leafletMapInstance.current && markersRef.current[branch.id]) {
      leafletMapInstance.current.flyTo([branch.lat, branch.lng], 16, { duration: 0.8 });
      markersRef.current[branch.id].openPopup();
    }
  };

  const currentBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];

  return (
    <section className="bg-[#250527] text-white py-16 sm:py-24 scroll-mt-20" id="branches">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Visit either of our two branches
          </h2>
          <p className="text-[#D8C3B3] text-sm sm:text-base mt-3 max-w-xl">
            Pick a branch below to see it on the interactive map, then get turn-by-turn directions in Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* Branch List Cards */}
          <div className="lg:col-span-5 space-y-5">
            {BRANCHES.map((b) => {
              const isSelected = b.id === selectedBranchId;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBranch(b)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#E6C184] bg-[#2A082C] shadow-xl opacity-100 ring-1 ring-[#E6C184]"
                      : "border-white/15 bg-white/5 opacity-70 hover:opacity-100 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                      {b.name}
                    </h3>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#E6C184] text-[#1C0D0A]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#D8C3B3] mt-2 leading-relaxed">
                    📍 {b.address}
                  </p>

                  <dl className="mt-4 text-xs sm:text-sm space-y-1.5 text-[#E5D2E7] pt-3 border-t border-white/10">
                    <div className="flex gap-2">
                      <dt className="font-bold text-white">Hours:</dt>
                      <dd>{b.hours}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-bold text-white">Phone:</dt>
                      <dd>
                        <a
                          href={`tel:${b.phone.replace(/\s/g, "")}`}
                          className="text-[#E6C184] hover:underline font-bold"
                        >
                          {b.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-white text-[#2A082C] font-bold text-xs hover:bg-[#E6C184] transition-colors shadow-md"
                  >
                    <span>📍 Open in Google Maps</span>
                    <span className="material-symbols-outlined text-sm">east</span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Interactive Leaflet / OpenStreetMap Map Container */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#E8E0D8] min-h-[420px] h-full shadow-2xl relative">
              <div ref={mapRef} id="branch-map" className="w-full h-full min-h-[420px] z-10" />

              {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2A082C] text-white p-8 text-center z-20">
                  <span className="material-symbols-outlined text-4xl text-[#E6C184] animate-spin mb-3">
                    refresh
                  </span>
                  <h4 className="font-bold text-lg mb-1">{currentBranch.name}</h4>
                  <p className="text-xs text-[#D8C3B3] mb-4">{currentBranch.address}</p>
                  <a
                    href={currentBranch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-6 rounded-xl bg-[#E6C184] text-[#1C0D0A] font-bold text-xs"
                  >
                    📍 Open Directions in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
