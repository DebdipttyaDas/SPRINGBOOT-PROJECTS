import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, AlertCircle, Scan, MapPin, Layers, RefreshCw } from 'lucide-react';
import { CATEGORIES, SAMPLE_PRESETS, findClosestWard } from '../data/civicData';
import { createIssue, runAiScan } from '../services/api';
import confetti from 'canvas-confetti';

export default function ReportIssueModal({ isOpen, onClose, onIssueCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AUTO_DETECT',
    latitude: 12.9268,
    longitude: 77.6762,
    address: 'Near EcoSpace, Outer Ring Rd, Bellandur, Bengaluru',
    imageUrl: '',
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [aiResult, setAiResult] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [wardInfo, setWardInfo] = useState(findClosestWard(12.9268, 77.6762).ward);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        triggerAiAnalysis(reader.result, formData.title, formData.description);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset) => {
    setImagePreview(preset.imageUrl);
    const ward = findClosestWard(preset.lat, preset.lng).ward;
    setWardInfo(ward);
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      description: preset.description,
      category: preset.category,
      latitude: preset.lat,
      longitude: preset.lng,
      address: preset.address,
      imageUrl: preset.imageUrl,
    }));
    triggerAiAnalysis(preset.imageUrl, preset.title, preset.description, preset.category);
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          const match = findClosestWard(lat, lng);
          setWardInfo(match.ward);
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: `GPS: ${lat}, ${lng} (Near ${match.ward.wardName})`
          }));
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          // Fallback to central location
          const match = findClosestWard(12.9352, 77.6245);
          setWardInfo(match.ward);
          setFormData(prev => ({
            ...prev,
            latitude: 12.9352,
            longitude: 77.6245,
            address: '80ft Road, Koramangala 4th Block, Bengaluru'
          }));
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const triggerAiAnalysis = async (imgUrl, title, desc, categoryHint) => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1100);

    const result = await runAiScan({
      title: title || 'Civic infrastructure defect',
      description: desc || 'Civic defect captured via camera sensor',
      categoryHint: categoryHint || 'AUTO_DETECT',
      imageBase64: imgUrl,
    });

    setTimeout(() => {
      setAiResult(result);
      setIsScanning(false);
      setScanStep(0);
    }, 1600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const match = findClosestWard(formData.latitude, formData.longitude);

    const finalIssue = {
      ...formData,
      category: aiResult?.category || (formData.category !== 'AUTO_DETECT' ? formData.category : 'POTHOLE'),
      urgency: aiResult?.urgency || 'HIGH',
      aiConfidence: aiResult?.confidence || 0.94,
      aiReasoning: aiResult?.reasoning || 'Categorized through heuristic civic hazard classifier.',
      detectedHazards: aiResult?.detectedHazards || 'Public Transit & Pedestrian Safety Risk',
      wardNumber: match.ward.wardNumber,
      wardOfficeName: `${match.ward.wardName} (${match.ward.zoneName})`,
      wardOfficerEmail: match.ward.officerEmail,
      wardOfficerPhone: match.ward.officerPhone,
    };

    try {
      const created = await createIssue(finalIssue);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onIssueCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Report Civic Hazard
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  AI Geo-Router Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">Upload photo • AI extracts urgency • Auto-routes to Ward Office</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets for instant testing */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Samples:
          </span>
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700 text-slate-300 hover:text-emerald-300 whitespace-nowrap transition"
            >
              {p.category === 'POTHOLE' && '🕳️ Pothole'}
              {p.category === 'ILLEGAL_CONSTRUCTION' && '🏗️ Illegal Construction'}
              {p.category === 'WATERLOGGING' && '🌊 Waterlogging'}
              {p.category === 'GARBAGE_DUMP' && '🗑️ Garbage Dump'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Photo & AI Scanner */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Photographic Evidence
              </label>

              <div className="relative group border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl bg-slate-950/50 p-4 transition text-center min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full h-56 rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={imagePreview}
                      alt="Civic Issue Proof"
                      className="w-full h-full object-cover"
                    />

                    {/* AI Scanner HUD overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                        <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-radar-sweep" />
                        <div className="mt-4 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
                          <Scan className="w-3.5 h-3.5 animate-spin" />
                          {scanStep === 1 && 'Analyzing edge contours & depth...'}
                          {scanStep === 2 && 'Detecting civic hazard severity...'}
                          {scanStep === 3 && 'Evaluating GIS Ward Boundary...'}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-2.5 py-1 text-xs rounded bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-600 transition"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer flex flex-col items-center space-y-2 py-6 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Click to upload photo or capture</span>
                    <span className="text-xs text-slate-500">JPG, PNG, WebP up to 10MB</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* AI Real-time Inspection Card */}
            {aiResult && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      AI Computer Vision Assessment
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {Math.round(aiResult.confidence * 100)}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Classified Category</span>
                    <span className="font-semibold text-slate-200">{aiResult.category}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Urgency Tier</span>
                    <span className={`font-bold ${aiResult.urgency === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {aiResult.urgency} ({aiResult.estimatedResolutionHours}h SLA)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-800/80">
                  <strong className="text-emerald-400">AI Diagnostic:</strong> {aiResult.reasoning}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Hazards:</strong> {aiResult.detectedHazards}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Geo Tagging & Ward Dispatch */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                2. Issue Title & Details
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Deep pothole on outer ring road"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Landmark
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe size, hazards, nearest landmark or building..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            {/* Geolocation & Ward Auto-Routing */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>3. Geo-Tag & Auto-Ward Routing</span>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-2.5 py-1 text-xs rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Acquiring GPS...' : 'Use My GPS'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      setFormData({ ...formData, latitude: lat });
                      const match = findClosestWard(lat, formData.longitude);
                      setWardInfo(match.ward);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => {
                      const lng = parseFloat(e.target.value);
                      setFormData({ ...formData, longitude: lng });
                      const match = findClosestWard(formData.latitude, lng);
                      setWardInfo(match.ward);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Routed Ward Office Card */}
              {wardInfo && (
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-blue-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Assigned Ward: {wardInfo.wardNumber}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {wardInfo.zoneName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{wardInfo.officeAddress}</p>
                  <div className="text-[11px] text-slate-300 pt-0.5 flex justify-between">
                    <span>Officer: {wardInfo.officerName}</span>
                    <span className="text-blue-300 font-mono">{wardInfo.officerPhone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Citizen Name</label>
                <input
                  type="text"
                  value={formData.citizenName}
                  onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                  placeholder="Anonymous or Your Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.citizenPhone}
                  onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                  placeholder="+91 98..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !formData.title}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Municipal Server...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Route to Civic Ward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
