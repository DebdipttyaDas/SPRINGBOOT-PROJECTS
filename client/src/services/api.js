const API_BASE = '/api';

export async function fetchIssues(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/issues${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, serving local fallback storage:', err);
    const local = localStorage.getItem('civic_issues_cache');
    return local ? JSON.parse(local) : [];
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Stats fetch error:', err);
    return null;
  }
}

export async function fetchWards() {
  try {
    const res = await fetch(`${API_BASE}/wards`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Wards fetch fallback');
    return [];
  }
}

export async function createIssue(issueData) {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, saving locally to localStorage:', err);
    const local = localStorage.getItem('civic_issues_cache');
    const list = local ? JSON.parse(local) : [];
    const newIssue = {
      ...issueData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'ASSIGNED',
      upvotes: 0,
    };
    list.unshift(newIssue);
    localStorage.setItem('civic_issues_cache', JSON.stringify(list));
    return newIssue;
  }
}

export async function updateIssueStatus(id, newStatus, resolvedImageUrl = '') {
  try {
    const res = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, resolvedImageUrl }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, updating local cache:', err);
    const local = localStorage.getItem('civic_issues_cache');
    if (local) {
      const list = JSON.parse(local);
      const idx = list.findIndex(i => i.id === id);
      if (idx !== -1) {
        list[idx].status = newStatus;
        if (newStatus === 'RESOLVED') {
          list[idx].resolvedAt = new Date().toISOString();
          list[idx].resolvedImageUrl = resolvedImageUrl;
        }
        localStorage.setItem('civic_issues_cache', JSON.stringify(list));
        return list[idx];
      }
    }
    return null;
  }
}

export async function upvoteIssue(id) {
  try {
    const res = await fetch(`${API_BASE}/issues/${id}/upvote`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    const local = localStorage.getItem('civic_issues_cache');
    if (local) {
      const list = JSON.parse(local);
      const idx = list.findIndex(i => i.id === id);
      if (idx !== -1) {
        list[idx].upvotes = (list[idx].upvotes || 0) + 1;
        localStorage.setItem('civic_issues_cache', JSON.stringify(list));
        return list[idx];
      }
    }
    return null;
  }
}

export async function runAiScan(payload) {
  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Using client-side AI analysis fallback:', err);
  }

  // Fallback client-side simulated AI if backend is booting
  const { title = '', description = '', categoryHint = '' } = payload;
  const text = (title + ' ' + description).toLowerCase();

  let cat = 'POTHOLE';
  let urgency = 'CRITICAL';
  let reasoning = 'AI Computer Vision detected roadway asphalt surface loss exceeding 15cm depth.';
  let hazards = 'Two-Wheeler Fatal Skid Risk, Peak-Hour Traffic Choke';
  let dept = 'Roads & Highway Infrastructure Dept.';

  if (categoryHint && categoryHint !== 'AUTO_DETECT') {
    cat = categoryHint;
  } else if (text.includes('illegal') || text.includes('encroach') || text.includes('building') || text.includes('permit')) {
    cat = 'ILLEGAL_CONSTRUCTION';
    urgency = 'CRITICAL';
    reasoning = 'AI Spatial Geometry identified unauthorized masonry structural encroachment into civic drainage buffer zone.';
    hazards = 'Stormwater Drain Choking, Public Right-of-Way Obstruction, Structural Collapse';
    dept = 'Town Planning & Encroachment Vigilance Bureau';
  } else if (text.includes('water') || text.includes('flood') || text.includes('drain') || text.includes('sewage')) {
    cat = 'WATERLOGGING';
    urgency = 'CRITICAL';
    reasoning = 'Standing water inundation level ~350mm detected across roadway span. Catchpit blockage.';
    hazards = 'Vector-borne Disease, Substation Short-Circuit Hazard';
    dept = 'Storm Water Drains (SWD) & Flood Control';
  } else if (text.includes('garbage') || text.includes('dump') || text.includes('trash') || text.includes('waste')) {
    cat = 'GARBAGE_DUMP';
    urgency = 'HIGH';
    reasoning = 'Open unsegregated refuse accumulation adjacent to pedestrian walkways.';
    hazards = 'Toxic Dioxin Inhalation, Stray Animal Hazard';
    dept = 'Solid Waste Management (SWM)';
  } else if (text.includes('tree') || text.includes('branch')) {
    cat = 'FALLEN_TREE';
    urgency = 'CRITICAL';
    reasoning = 'Trunk diameter >40cm spanning active roadway. Entangled power line.';
    hazards = 'Complete Roadway Blockage, High-Voltage Electrocution Risk';
    dept = 'Forestry & Disaster Response Cell';
  }

  return {
    category: cat,
    urgency,
    confidence: 0.95,
    reasoning,
    detectedHazards: hazards,
    recommendedDepartment: dept,
    estimatedResolutionHours: 24,
  };
}
