"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import {
  Upload,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Premium Gradient Options
const GRADIENTS = [
  { id: "mint-fresh", name: "Mint Fresh", class: "bg-gradient-to-br from-[#4ade80] to-[#2dd4bf]" },
  { id: "nebula", name: "Nebula", class: "bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899]" },
  { id: "sunset", name: "Sunset", class: "bg-gradient-to-br from-[#f43f5e] via-[#f97316] to-[#f59e0b]" },
  { id: "ocean", name: "Deep Ocean", class: "bg-gradient-to-br from-[#0e7490] via-[#0284c7] to-[#1d4ed8]" },
  { id: "aurora", name: "Aurora", class: "bg-gradient-to-br from-[#10b981] via-[#3b82f6] to-[#8b5cf6]" },
  { id: "midnight", name: "Midnight", class: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]" },
  { id: "cotton-candy", name: "Cotton Candy", class: "bg-gradient-to-br from-[#fbc2eb] via-[#a6c1ee] to-[#c2e9fb]" },
  { id: "cyber", name: "Cyberpunk", class: "bg-gradient-to-br from-[#ff00cc] via-[#333399] to-[#6600ff]" },
  { id: "lime", name: "Neon Lime", class: "bg-gradient-to-br from-[#84ffc9] via-[#aab2ff] to-[#eca0ff]" },
  { id: "gold", name: "Gold Dust", class: "bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728]" },
  { id: "peach", name: "Soft Peach", class: "bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]" },
  { id: "royal", name: "Royal Purple", class: "bg-gradient-to-br from-[#667eea] to-[#764ba2]" },
  { id: "cherry", name: "Cherry Blossom", class: "bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ee9ca7]" },
  { id: "arctic", name: "Arctic", class: "bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]" },
  { id: "fire", name: "Fire", class: "bg-gradient-to-br from-[#f12711] to-[#f5af19]" },
  { id: "forest", name: "Forest", class: "bg-gradient-to-br from-[#134e5e] to-[#71b280]" },
  { id: "berry", name: "Berry", class: "bg-gradient-to-br from-[#8e2de2] to-[#4a00e0]" },
  { id: "coral", name: "Coral Reef", class: "bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#fecfef]" },
  { id: "slate-gray", name: "Slate Gray", class: "bg-gradient-to-br from-[#bdc3c7] to-[#2c3e50]" },
  { id: "warm", name: "Warm Glow", class: "bg-gradient-to-br from-[#f093fb] to-[#f5576c]" },
];

// Solid Colors
const SOLID_COLORS = [
  { id: "clean-white", name: "Clean White", color: "#ffffff" },
  { id: "off-white", name: "Off White", color: "#fafafa" },
  { id: "pure-black", name: "Pure Black", color: "#000000" },
  { id: "charcoal", name: "Charcoal", color: "#1f2937" },
  { id: "slate", name: "Slate", color: "#334155" },
  { id: "stone", name: "Stone", color: "#78716c" },
  { id: "indigo", name: "Indigo", color: "#4f46e5" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "cyan", name: "Cyan", color: "#06b6d4" },
  { id: "teal", name: "Teal", color: "#14b8a6" },
  { id: "emerald", name: "Emerald", color: "#059669" },
  { id: "lime", name: "Lime", color: "#84cc16" },
  { id: "yellow", name: "Yellow", color: "#eab308" },
  { id: "orange", name: "Orange", color: "#f97316" },
  { id: "rose", name: "Rose", color: "#e11d48" },
  { id: "pink", name: "Pink", color: "#ec4899" },
  { id: "purple", name: "Purple", color: "#a855f7" },
  { id: "violet", name: "Violet", color: "#7c3aed" },
  { id: "sky", name: "Sky", color: "#0ea5e9" },
  { id: "lavender", name: "Lavender", color: "#c4b5fd" },
];

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 hover:text-blue-600 transition-colors group"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600">
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && <div className="pb-6">{children}</div>}
    </div>
  );
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [padding, setPadding] = useState(80);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadow, setShadow] = useState(25);
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">("gradient");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[1]); // Mint Fresh default
  const [selectedColor, setSelectedColor] = useState(SOLID_COLORS[0]);

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  }, [handleFileChange]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current || !image) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `shotify-export-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [image]);

  const getShadowStyle = () => {
    const s = shadow * 1.5;
    return `0 ${s / 3}px ${s}px rgba(0, 0, 0, 0.35), 0 ${s / 6}px ${s / 2}px rgba(0, 0, 0, 0.15)`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFileChange(e.target.files?.[0] || null);
          e.target.value = "";
        }}
      />

      {/* Centered Container for ALL content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">

        {/* Header - Inside Container */}
        <header className="flex items-center justify-between mb-6 sm:mb-10">
          <span className="font-bold text-base sm:text-lg text-black">
            Shotify by <span className="text-blue-600">Pelz</span>
          </span>
          <button
            onClick={handleExport}
            disabled={isExporting || !image}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download
          </button>
        </header>

        {/* Main Layout: Preview + Controls */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Preview Area */}
          <div className="flex-1">
            {!image ? (
              <div
                className={`w-full aspect-[16/10] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                  ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 rounded-xl bg-white shadow flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Drop image or click to upload</p>
              </div>
            ) : (
              <div
                ref={previewRef}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden ${backgroundType === "gradient" ? selectedGradient.class : ""}`}
                style={{
                  padding: `${padding}px`,
                  background: backgroundType === "solid" ? selectedColor.color : undefined,
                }}
              >
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-[60vh] object-contain"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    boxShadow: getShadowStyle(),
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls Panel - Right Side on desktop, Below on mobile */}
          <div className="w-full lg:w-72 shrink-0 bg-gray-50 lg:bg-transparent rounded-xl p-4 lg:p-0">

            <CollapsibleSection title="BACKGROUND" defaultOpen={false}>
              <div className="space-y-3">
                <button
                  onClick={() => setBackgroundType(backgroundType === "gradient" ? "solid" : "gradient")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Switch to {backgroundType === "gradient" ? "Solid Colors" : "Gradients"}
                </button>
                <div className="grid grid-cols-6 sm:grid-cols-5 gap-2">
                  {(backgroundType === "gradient" ? GRADIENTS : SOLID_COLORS).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => backgroundType === "gradient" ? setSelectedGradient(opt as any) : setSelectedColor(opt as any)}
                      className={`aspect-square rounded-full border-2 transition-all hover:scale-110 ${(backgroundType === "gradient" ? selectedGradient.id : selectedColor.id) === opt.id
                        ? "ring-2 ring-blue-600 ring-offset-2 border-transparent"
                        : "border-gray-200"
                        } ${backgroundType === "gradient" ? (opt as any).class : ""}`}
                      style={backgroundType === "solid" ? { background: (opt as any).color } : {}}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="STYLE" defaultOpen={false}>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <span>Padding</span><span>{padding}px</span>
                  </div>
                  <input type="range" min="16" max="150" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <span>Shadow</span><span>{shadow}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <span>Corners</span><span>{borderRadius}px</span>
                  </div>
                  <input type="range" min="0" max="48" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            </CollapsibleSection>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 sm:py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <Upload className="w-4 h-4" /> Change Image
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || !image}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 sm:py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-40 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> {isExporting ? "Exporting..." : "Download"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
