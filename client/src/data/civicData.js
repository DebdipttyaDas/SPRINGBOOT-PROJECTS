export const CIVIC_WARDS = [
  {
    wardNumber: "Ward 150 - Bellandur",
    wardName: "Bellandur Tech Corridor",
    zoneName: "Mahadevapura Zone",
    officerName: "Er. Rajesh Kumar",
    officerEmail: "ward150.officer@civic-gov.org",
    officerPhone: "+91 98450 11201",
    officeAddress: "BBMP Ward Office, Green Glen Layout, Bellandur, Bengaluru 560103",
    centerLat: 12.9250,
    centerLng: 77.6750,
    radiusKm: 4.5,
    color: "#3b82f6"
  },
  {
    wardNumber: "Ward 174 - HSR Layout",
    wardName: "HSR Layout & Silk Board",
    zoneName: "Bommanahalli Zone",
    officerName: "Smt. Ananya Sen",
    officerEmail: "ward174.officer@civic-gov.org",
    officerPhone: "+91 98450 22302",
    officeAddress: "Municipal Corporation Office, 27th Main Rd, Sector 1, HSR Layout, Bengaluru 560102",
    centerLat: 12.9121,
    centerLng: 77.6446,
    radiusKm: 3.8,
    color: "#10b981"
  },
  {
    wardNumber: "Ward 151 - Koramangala",
    wardName: "Koramangala Central",
    zoneName: "South Zone",
    officerName: "Shri Vikramaditya Rao",
    officerEmail: "ward151.officer@civic-gov.org",
    officerPhone: "+91 98450 33403",
    officeAddress: "Civic Utility Complex, 80 Feet Rd, 4th Block, Koramangala, Bengaluru 560034",
    centerLat: 12.9352,
    centerLng: 77.6245,
    radiusKm: 3.2,
    color: "#f59e0b"
  },
  {
    wardNumber: "Ward 112 - Indiranagar",
    wardName: "Indiranagar & Domlur",
    zoneName: "East Zone",
    officerName: "Er. Kavita Hegde",
    officerEmail: "ward112.officer@civic-gov.org",
    officerPhone: "+91 98450 44504",
    officeAddress: "Ward 112 HQ, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    centerLat: 12.9719,
    centerLng: 77.6412,
    radiusKm: 3.0,
    color: "#8b5cf6"
  },
  {
    wardNumber: "Ward 110 - MG Road & CBD",
    wardName: "Central Business District",
    zoneName: "Central Zone",
    officerName: "Shri Suresh Menon",
    officerEmail: "ward110.officer@civic-gov.org",
    officerPhone: "+91 98450 55605",
    officeAddress: "Town Hall Annexe, JC Road, Central Bengaluru 560002",
    centerLat: 12.9756,
    centerLng: 77.6066,
    radiusKm: 3.5,
    color: "#ec4899"
  },
  {
    wardNumber: "Ward 192 - Electronic City",
    wardName: "Electronic City Phase 1 & 2",
    zoneName: "Anekal - ELCITA Zone",
    officerName: "Er. Deepa Nair",
    officerEmail: "ward192.officer@civic-gov.org",
    officerPhone: "+91 98450 66706",
    officeAddress: "ELCITA Administrative Building, West Phase, Electronic City, Bengaluru 560100",
    centerLat: 12.8399,
    centerLng: 77.6770,
    radiusKm: 5.0,
    color: "#06b6d4"
  }
];

export const CATEGORIES = [
  { id: "POTHOLE", label: "Pothole / Road Fracture", icon: "AlertTriangle", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { id: "ILLEGAL_CONSTRUCTION", label: "Illegal / Encroachment Construction", icon: "Building2", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  { id: "WATERLOGGING", label: "Waterlogging & Drainage Overflow", icon: "Droplets", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { id: "GARBAGE_DUMP", label: "Solid Waste / Illegal Garbage Dump", icon: "Trash2", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { id: "FALLEN_TREE", label: "Fallen Tree & Power Line Blockage", icon: "Trees", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { id: "STREETLIGHT_DAMAGE", label: "Damaged Streetlight & Exposed Wire", icon: "Zap", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" }
];

export const SAMPLE_PRESETS = [
  {
    title: "Dangerous Pothole on Outer Ring Road under Flyover",
    description: "Deep crater in the high-speed lane near tech park. Two-wheelers are losing balance in dark hours.",
    category: "POTHOLE",
    lat: 12.9268,
    lng: 77.6762,
    address: "Near EcoSpace, Outer Ring Rd, Bellandur, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Unauthorized 4-Story Commercial Building encroaching canal",
    description: "Builder pouring concrete beams right on top of the municipal stormwater drainage channel.",
    category: "ILLEGAL_CONSTRUCTION",
    lat: 12.9145,
    lng: 77.6498,
    address: "19th Main, Sector 2, HSR Layout, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Flooded 80ft road intersection, water entering storefronts",
    description: "Rainwater stagnated up to 40cm. Primary storm drain clogged with construction debris.",
    category: "WATERLOGGING",
    lat: 12.9348,
    lng: 77.6212,
    address: "80 Feet Rd, 4th Block, Koramangala, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Large roadside debris pile with toxic plastic burning",
    description: "Mixed municipal solid waste dumped on sidewalk, smoldering fumes entering residential apartments.",
    category: "GARBAGE_DUMP",
    lat: 12.9734,
    lng: 77.6438,
    address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80"
  }
];

export function findClosestWard(lat, lng) {
  let closest = CIVIC_WARDS[0];
  let minDistance = Infinity;

  CIVIC_WARDS.forEach(ward => {
    const dLat = ((ward.centerLat - lat) * Math.PI) / 180;
    const dLng = ((ward.centerLng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((ward.centerLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c; // Earth radius in km

    if (dist < minDistance) {
      minDistance = dist;
      closest = ward;
    }
  });

  return { ward: closest, distanceKm: Math.round(minDistance * 10) / 10 };
}
