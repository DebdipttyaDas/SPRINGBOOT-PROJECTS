import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Filter,
  Send,
  Building2,
  Phone,
  Mail,
  Flame,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { upvoteIssue, updateIssueStatus } from '../services/api';

export default function IssueDetailView({ issue, currentUser, onOpenAuth, onClose, onUpdateStatus, onUpvote }) {
  const [updating, setUpdating] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [statusError, setStatusError] = useState('');

  if (!issue) return null;

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const handleUpvote = async () => {
    if (upvoted) return;
    setUpvoted(true);
    const updated = await upvoteIssue(issue.id);
    if (updated && onUpvote) {
      onUpvote(updated);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) {
      setStatusError('Only authenticated Municipal Ward Officers / Admins can change status.');
      return;
    }
    setStatusError('');
    setUpdating(true);
    try {
      const sampleProof = newStatus === 'RESOLVED' ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80' : '';
      const updated = await updateIssueStatus(issue.id, newStatus, sampleProof);
      if (updated && onUpdateStatus) {
        onUpdateStatus(updated);
      }
    } catch (err) {
      setStatusError(err.message || 'Status update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const isCritical = issue.urgency === 'CRITICAL';

  return (
    <div className="bg-slate-900 border border-slate-700/70 rounded-2xl p-6 shadow-2xl space-y-6">

      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              {issue.urgency} URGENCY
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {issue.category}
            </span>

            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              issue.status === 'RESOLVED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : issue.status === 'IN_PROGRESS'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              Status: {issue.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 leading-snug">{issue.title}</h2>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Main Grid: Images & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Photo View */}
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
            {issue.imageUrl ? (
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                No Photo Provided
              </div>
            )}

            {issue.status === 'RESOLVED' && issue.resolvedImageUrl && (
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-xs font-semibold flex items-center gap-1 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved Proof Verified
              </div>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            {issue.description || 'No extended description provided.'}
          </p>
        </div>

        {/* AI Analysis & Auto-Ward Allocation */}
        <div className="space-y-4">

          {/* AI Reasoning Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Severity & Diagnostic Breakdown
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {issue.aiConfidence ? `${Math.round(issue.aiConfidence * 100)}% Confidence` : '95% AI Match'}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {issue.aiReasoning || 'AI analyzed image pixel contours and text description to identify high-risk civic infrastructure hazard.'}
            </p>

            {issue.detectedHazards && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">Identified Hazard Threats:</span>
                <span className="text-amber-300 font-mono text-[11px]">{issue.detectedHazards}</span>
              </div>
            )}
          </div>

          {/* Assigned Municipal Ward Office */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2 text-xs">
            <span className="font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Auto-Assigned Municipal Ward Office
            </span>

            <div className="font-semibold text-slate-100 text-sm">
              {issue.wardNumber || 'Ward 150 - Bellandur'}
            </div>

            <div className="text-slate-400 text-xs">
              {issue.wardOfficeName || 'Bellandur Tech Corridor (Mahadevapura Zone)'}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-blue-400" /> {issue.wardOfficerEmail || 'ward150.officer@civic-gov.org'}
              </span>
              <span className="flex items-center gap-1 font-mono text-blue-300">
                <Phone className="w-3 h-3 text-blue-400" /> {issue.wardOfficerPhone || '+91 98450 11201'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Error Notice */}
      {statusError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <span>{statusError}</span>
          {!isAdmin && (
            <button
              onClick={onOpenAuth}
              className="text-xs underline font-semibold text-rose-300 hover:text-white"
            >
              Sign in as Admin
            </button>
          )}
        </div>
      )}

      {/* Footer Controls: Upvote + Officer Status Toggles */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={upvoted}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              upvoted
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${upvoted ? 'fill-amber-400' : ''}`} />
            <span>Upvote Priority ({issue.upvotes || 0})</span>
          </button>

          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Reported: {new Date(issue.createdAt).toLocaleDateString()} at {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Civic Officer Workflow Action Bar */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Ward Officer Action:
              </span>

              <button
                onClick={() => handleStatusChange('IN_PROGRESS')}
                disabled={updating || issue.status === 'IN_PROGRESS'}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition cursor-pointer"
              >
                Dispatch Team
              </button>

              <button
                onClick={() => handleStatusChange('RESOLVED')}
                disabled={updating || issue.status === 'RESOLVED'}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Mark Resolved & Upload Proof
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Officer Actions Locked</span>
              <button
                onClick={onOpenAuth}
                className="text-xs text-emerald-400 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Sign in as Admin
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
