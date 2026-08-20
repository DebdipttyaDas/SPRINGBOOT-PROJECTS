import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Camera,
  Layers,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Flame,
  Radio,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  User,
  Shield,
  LogIn,
  LogOut
} from 'lucide-react';
import CivicMap from './components/CivicMap';
import ReportIssueModal from './components/ReportIssueModal';
import IssueDetailView from './components/IssueDetailView';
import AuthModal from './components/AuthModal';
import { fetchIssues, fetchStats, getStoredUser, logoutUser, getMe } from './services/api';
import { CATEGORIES, CIVIC_WARDS } from './data/civicData';

export default function App() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchIssues();
      setIssues(data || []);
      const s = await fetchStats();
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Verify token validity on load
    getMe().then(user => {
      if (user) setCurrentUser(user);
    });
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleIssueCreated = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
    setSelectedIssue(newIssue);
  };

  const handleStatusUpdated = (updated) => {
    setIssues(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    setSelectedIssue(updated);
  };

  const handleUpvoted = (updated) => {
    setIssues(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    if (selectedIssue?.id === updated.id) {
      setSelectedIssue(updated);
    }
  };

  // Filtered list
  const filteredIssues = issues.filter(issue => {
    const matchesSearch =
      (issue.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.address || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || issue.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'ALL' || issue.urgency === selectedUrgency;
    const matchesWard = selectedWard === 'ALL' || (issue.wardNumber || '').includes(selectedWard);

    return matchesSearch && matchesCategory && matchesUrgency && matchesWard;
  });

  const criticalCount = issues.filter(i => i.urgency === 'CRITICAL').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg lg:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                CivicEye AI
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                JWT Auth Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Civic Hazard Detection & Ward Dispatch Engine</p>
          </div>
        </div>

        {/* User Profile & Action Buttons */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                {isAdmin ? (
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="text-left leading-none">
                  <div className="font-semibold text-slate-200">{currentUser.name}</div>
                  <div className={`text-[10px] ${isAdmin ? 'text-purple-400' : 'text-emerald-400'}`}>
                    {isAdmin ? 'Ward Admin' : 'Verified Citizen'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In / Register</span>
            </button>
          )}

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs lg:text-sm shadow-lg shadow-emerald-500/25 transition transform active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Report Pothole / Issue</span>
          </button>
        </div>
      </header>

      {/* Stats Counter Bar */}
      <section className="bg-slate-900/50 border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-rose-400">{criticalCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Critical Emergencies</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">{inProgressCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Under Repair / In-Action</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">{resolvedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Resolved & Verified</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-purple-400">{CIVIC_WARDS.length} Wards</div>
              <div className="text-[11px] text-slate-400 font-medium">MySQL + JWT Secured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Filter Sidebar & Issue Feed */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">

          {/* Search & Category Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search defects, street, landmark..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition cursor-pointer font-medium text-xs ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition cursor-pointer text-xs ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label.split('/')[0]}
                </button>
              ))}
            </div>

            {/* Urgency & Ward Selectors */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="CRITICAL">🔴 Critical Only</option>
                <option value="HIGH">🟠 High Urgency</option>
                <option value="MEDIUM">🟡 Medium Urgency</option>
                <option value="LOW">🟢 Low Urgency</option>
              </select>

              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 outline-none truncate"
              >
                <option value="ALL">All Civic Wards</option>
                {CIVIC_WARDS.map(w => (
                  <option key={w.wardNumber} value={w.wardNumber.split(' - ')[0]}>
                    {w.wardNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue List Feed */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg flex flex-col min-h-[380px] max-h-[620px] overflow-hidden">
            <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-800 text-xs text-slate-400 font-semibold">
              <span>CIVIC HAZARD LOGS ({filteredIssues.length})</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live MySQL
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pt-2 pr-1">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No civic hazards match your active filters.
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  const isCritical = issue.urgency === 'CRITICAL';

                  return (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex gap-3 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative">
                        {issue.imageUrl ? (
                          <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-600 text-[10px]">
                            No Pic
                          </div>
                        )}
                        {isCritical && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isCritical ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {issue.urgency}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {issue.wardNumber ? issue.wardNumber.split(' - ')[0] : 'Ward'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-200 truncate leading-snug">
                          {issue.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {issue.address || issue.description}
                        </p>

                        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                          <span className="text-emerald-400 font-medium">
                            {issue.aiConfidence ? `${Math.round(issue.aiConfidence * 100)}% AI Verified` : 'AI Analyzed'}
                          </span>
                          <span>▲ {issue.upvotes || 0} Upvotes</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Map & Detail View */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">

          {/* Interactive Leaflet OpenStreetMap with Ward Polygons */}
          <div className="h-[460px] w-full">
            <CivicMap
              issues={filteredIssues}
              selectedIssue={selectedIssue}
              onSelectIssue={(issue) => setSelectedIssue(issue)}
            />
          </div>

          {/* Selected Issue Detail & Officer Resolution Workflow Panel */}
          {selectedIssue ? (
            <IssueDetailView
              issue={selectedIssue}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onClose={() => setSelectedIssue(null)}
              onUpdateStatus={handleStatusUpdated}
              onUpvote={handleUpvoted}
            />
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs space-y-2">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto animate-bounce" />
              <div className="font-semibold text-slate-200">Select any Civic Defect on the Map or Feed</div>
              <p className="text-slate-500 max-w-md mx-auto">
                Inspect AI computer vision confidence, detected public hazards, and the auto-assigned municipal ward contact details.
              </p>
            </div>
          )}

        </div>

      </main>

      {/* Modal for Reporting Potholes / Construction */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onIssueCreated={handleIssueCreated}
      />

      {/* Modal for Citizen / Admin Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
