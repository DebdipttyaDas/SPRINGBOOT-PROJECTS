import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CIVIC_WARDS } from '../data/civicData';
import { AlertTriangle, Clock, MapPin, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

// Custom Map Center updater when an issue is selected
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Marker Icon Generator
function createCustomIcon(urgency, category) {
  let color = '#f59e0b'; // Medium/Amber
  let emoji = '⚠️';

  if (urgency === 'CRITICAL') {
    color = '#ef4444'; // Red
  } else if (urgency === 'LOW') {
    color = '#10b981'; // Green
  }

  if (category === 'POTHOLE') emoji = '🕳️';
  else if (category === 'ILLEGAL_CONSTRUCTION') emoji = '🏗️';
  else if (category === 'WATERLOGGING') emoji = '🌊';
  else if (category === 'GARBAGE_DUMP') emoji = '🗑️';
  else if (category === 'FALLEN_TREE') emoji = '🌲';
  else if (category === 'STREETLIGHT_DAMAGE') emoji = '⚡';

  return L.divIcon({
    className: 'custom-civic-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background: #0f172a;
        border: 2.5px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 16px ${color}80;
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span>${emoji}</span>
        ${urgency === 'CRITICAL' ? `<span style="position:absolute; top:-2px; right:-2px; width:10px; height:10px; background:#ef4444; border-radius:50%; box-shadow:0 0 8px #ef4444;"></span>` : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

export default function CivicMap({ issues, selectedIssue, onSelectIssue, showWards = true }) {
  const defaultCenter = [12.9352, 77.6350]; // Bengaluru Central tech corridor
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (selectedIssue && selectedIssue.latitude && selectedIssue.longitude) {
      setMapCenter([selectedIssue.latitude, selectedIssue.longitude]);
    }
  }, [selectedIssue]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <MapContainer
        center={defaultCenter}
        zoom={12.5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={mapCenter} zoom={selectedIssue ? 15 : 12.5} />

        {/* High contrast dark mode map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Municipal Ward Geo-Boundaries & Offices */}
        {showWards && CIVIC_WARDS.map((ward, idx) => (
          <React.Fragment key={idx}>
            <Circle
              center={[ward.centerLat, ward.centerLng]}
              radius={ward.radiusKm * 1000}
              pathOptions={{
                color: ward.color,
                fillColor: ward.color,
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 8',
              }}
            />
            <Circle
              center={[ward.centerLat, ward.centerLng]}
              radius={120}
              pathOptions={{
                color: ward.color,
                fillColor: ward.color,
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 text-xs space-y-1">
                  <div className="font-bold text-sm text-blue-700">{ward.wardNumber}</div>
                  <div className="text-slate-600">{ward.wardName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{ward.officeAddress}</div>
                  <div className="pt-1 border-t border-slate-200 text-slate-700">
                    <strong>Officer:</strong> {ward.officerName} ({ward.officerPhone})
                  </div>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        ))}

        {/* Civic Issue Pins */}
        {issues.map((issue) => {
          if (!issue.latitude || !issue.longitude) return null;
          const isSelected = selectedIssue?.id === issue.id;

          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(issue.urgency, issue.category)}
              eventHandlers={{
                click: () => onSelectIssue(issue),
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 max-w-xs space-y-2">
                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-28 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${issue.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {issue.urgency} URGENCY
                    </span>
                    <span className="ml-1 text-[11px] text-slate-500 font-mono">{issue.category}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{issue.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{issue.description}</p>
                  <div className="text-[11px] bg-slate-100 p-1.5 rounded text-slate-700">
                    <strong>Ward:</strong> {issue.wardNumber || 'Auto-Assigned'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend & Status HUD */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-2 max-w-[220px]">
        <div className="font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> Geo-Intelligence
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{issues.length} Active</span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" /> Critical Severity
            </span>
            <span className="font-mono text-slate-400">
              {issues.filter(i => i.urgency === 'CRITICAL').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High / Medium
            </span>
            <span className="font-mono text-slate-400">
              {issues.filter(i => i.urgency !== 'CRITICAL').length}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-blue-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-blue-500" /> Ward GIS Zones
            </span>
            <span className="font-mono text-slate-400">{CIVIC_WARDS.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
