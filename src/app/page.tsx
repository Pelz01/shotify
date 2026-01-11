"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import {
  Upload,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Premium Gradient Options - now with inline CSS values for reliable export
const GRADIENTS = [
  { id: "mint-fresh", name: "Mint Fresh", css: "linear-gradient(to bottom right, #4ade80, #2dd4bf)" },
  { id: "nebula", name: "Nebula", css: "linear-gradient(to bottom right, #6366f1, #a855f7, #ec4899)" },
  { id: "sunset", name: "Sunset", css: "linear-gradient(to bottom right, #f43f5e, #f97316, #f59e0b)" },
  { id: "ocean", name: "Deep Ocean", css: "linear-gradient(to bottom right, #0e7490, #0284c7, #1d4ed8)" },
  { id: "aurora", name: "Aurora", css: "linear-gradient(to bottom right, #10b981, #3b82f6, #8b5cf6)" },
  { id: "midnight", name: "Midnight", css: "linear-gradient(to bottom right, #0f172a, #1e293b, #334155)" },
  { id: "cotton-candy", name: "Cotton Candy", css: "linear-gradient(to bottom right, #fbc2eb, #a6c1ee, #c2e9fb)" },
  { id: "cyber", name: "Cyberpunk", css: "linear-gradient(to bottom right, #ff00cc, #333399, #6600ff)" },
  { id: "lime", name: "Neon Lime", css: "linear-gradient(to bottom right, #84ffc9, #aab2ff, #eca0ff)" },
  { id: "gold", name: "Gold Dust", css: "linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728)" },
  { id: "peach", name: "Soft Peach", css: "linear-gradient(to bottom right, #ffecd2, #fcb69f)" },
  { id: "royal", name: "Royal Purple", css: "linear-gradient(to bottom right, #667eea, #764ba2)" },
  { id: "cherry", name: "Cherry Blossom", css: "linear-gradient(to bottom right, #ffecd2, #fcb69f, #ee9ca7)" },
  { id: "arctic", name: "Arctic", css: "linear-gradient(to bottom right, #e0eafc, #cfdef3)" },
  { id: "fire", name: "Fire", css: "linear-gradient(to bottom right, #f12711, #f5af19)" },
  { id: "forest", name: "Forest", css: "linear-gradient(to bottom right, #134e5e, #71b280)" },
  { id: "berry", name: "Berry", css: "linear-gradient(to bottom right, #8e2de2, #4a00e0)" },
  { id: "coral", name: "Coral Reef", css: "linear-gradient(to bottom right, #ff9a9e, #fecfef, #fecfef)" },
  { id: "slate-gray", name: "Slate Gray", css: "linear-gradient(to bottom right, #bdc3c7, #2c3e50)" },
  { id: "warm", name: "Warm Glow", css: "linear-gradient(to bottom right, #f093fb, #f5576c)" },
  // New gradients from uiGradients
  { id: "solid-vault", name: "Solid Vault", css: "linear-gradient(to right, #3a7bd5, #3a6073)" },
  { id: "bright-vault", name: "Bright Vault", css: "linear-gradient(to right, #00d2ff, #928dab)" },
  { id: "politics", name: "Politics", css: "linear-gradient(to right, #2196f3, #f44336)" },
  { id: "sweet-morning", name: "Sweet Morning", css: "linear-gradient(to right, #ff5f6d, #ffc371)" },
  { id: "sylvia", name: "Sylvia", css: "linear-gradient(to right, #ff4b1f, #ff9068)" },
  { id: "transfile", name: "Transfile", css: "linear-gradient(to right, #16bffd, #cb3066)" },
  { id: "tranquil", name: "Tranquil", css: "linear-gradient(to right, #eecda3, #ef629f)" },
  { id: "red-ocean", name: "Red Ocean", css: "linear-gradient(to right, #1d4350, #a43931)" },
  { id: "shahabi", name: "Shahabi", css: "linear-gradient(to right, #a80077, #66ff00)" },
  { id: "alihossein", name: "Alihossein", css: "linear-gradient(to right, #f7ff00, #db36a4)" },
  { id: "ali", name: "Ali", css: "linear-gradient(to right, #ff4b1f, #1fddff)" },
  // Image 1 gradients
  { id: "purple-white", name: "Purple White", css: "linear-gradient(to right, #ba5370, #f4e2d8)" },
  { id: "colors-of-sky", name: "Colors of Sky", css: "linear-gradient(to right, #e0eafc, #cfdef3)" },
  { id: "decent", name: "Decent", css: "linear-gradient(to right, #4ca1af, #c4e0e5)" },
  { id: "deep-space", name: "Deep Space", css: "linear-gradient(to right, #000000, #434343)" },
  { id: "dark-skies", name: "Dark Skies", css: "linear-gradient(to right, #4b79a1, #283e51)" },
  { id: "suzy", name: "Suzy", css: "linear-gradient(to right, #834d9b, #d04ed6)" },
  { id: "superman", name: "Superman", css: "linear-gradient(to right, #0099f7, #f11712)" },
  { id: "nighthawk", name: "Nighthawk", css: "linear-gradient(to right, #2980b9, #2c3e50)" },
  { id: "miami-dolphins", name: "Miami Dolphins", css: "linear-gradient(to right, #4da0b0, #d39d38)" },
  { id: "minnesota-vikings", name: "Minnesota Vikings", css: "linear-gradient(to right, #5614b0, #dbd65c)" },
  { id: "christmas", name: "Christmas", css: "linear-gradient(to right, #2f7336, #aa3a38)" },
  // Image 2 gradients
  { id: "joomla", name: "Joomla", css: "linear-gradient(to right, #1e3c72, #2a5298)" },
  { id: "pizelex", name: "Pizelex", css: "linear-gradient(to right, #114357, #f29492)" },
  { id: "haikus", name: "Haikus", css: "linear-gradient(to right, #fd746c, #ff9068)" },
  { id: "pale-wood", name: "Pale Wood", css: "linear-gradient(to right, #eacda3, #d6ae7b)" },
  { id: "purplin", name: "Purplin", css: "linear-gradient(to right, #6a3093, #a044ff)" },
  { id: "inbox", name: "Inbox", css: "linear-gradient(to right, #457fca, #5691c8)" },
  { id: "blush", name: "Blush", css: "linear-gradient(to right, #b24592, #f15f79)" },
  { id: "back-to-future", name: "Back to the Future", css: "linear-gradient(to right, #c02425, #f0cb35)" },
  { id: "poncho", name: "Poncho", css: "linear-gradient(to right, #403a3e, #be5869)" },
  { id: "green-and-blue", name: "Green and Blue", css: "linear-gradient(to right, #c2e59c, #64b3f4)" },
  { id: "light-orange", name: "Light Orange", css: "linear-gradient(to right, #ffb347, #ffcc33)" },
  { id: "netflix", name: "Netflix", css: "linear-gradient(to right, #8e0e00, #1f1c18)" },
  // Image 3 gradients
  { id: "little-leaf", name: "Little Leaf", css: "linear-gradient(to right, #76b852, #8dc26f)" },
  { id: "deep-purple", name: "Deep Purple", css: "linear-gradient(to right, #673ab7, #512da8)" },
  { id: "back-to-earth", name: "Back To Earth", css: "linear-gradient(to right, #00c9ff, #92fe9d)" },
  { id: "master-card", name: "Master Card", css: "linear-gradient(to right, #f46b45, #eea849)" },
  { id: "clear-sky", name: "Clear Sky", css: "linear-gradient(to right, #005c97, #363795)" },
  { id: "passion", name: "Passion", css: "linear-gradient(to right, #e53935, #e35d5b)" },
  { id: "timber", name: "Timber", css: "linear-gradient(to right, #fc00ff, #00dbde)" },
  { id: "between-night-day", name: "Between Night and Day", css: "linear-gradient(to right, #2c3e50, #3498db)" },
  { id: "sage-persuasion", name: "Sage Persuasion", css: "linear-gradient(to right, #ccccb2, #757519)" },
  { id: "lizard", name: "Lizard", css: "linear-gradient(to right, #304352, #d7d2cc)" },
  { id: "piglet", name: "Piglet", css: "linear-gradient(to right, #ee9ca7, #ffdde1)" },
  { id: "dark-knight", name: "Dark Knight", css: "linear-gradient(to right, #ba8b02, #181818)" },
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
const CollapsibleSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
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
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[1]);
  const [selectedColor, setSelectedColor] = useState(SOLID_COLORS[0]);

  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
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
    if (!exportRef.current || !image) return;
    setIsExporting(true);
    try {
      // Get the actual rendered dimensions of the export container
      const node = exportRef.current;

      // We need to temporarily ensure it's visible to calculations but hidden from view
      // Since it's fixed/absolute off-screen, it should be fine.

      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 2, // 2x is usually enough for high res if base is natural size
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `shotify-export-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const getBackgroundStyle = () => {
    if (backgroundType === "solid") {
      return selectedColor.color;
    }
    return selectedGradient.css;
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

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
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
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

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
              /* Responsive Preview - Visible to User */
              <div
                className="w-full rounded-2xl"
                style={{
                  padding: `${Math.min(padding, 40)}px`,
                  background: getBackgroundStyle(),
                }}
              >
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-auto block"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    boxShadow: getShadowStyle(),
                  }}
                />
              </div>
            )}

            {/* Hidden Export Container - Natural Size for High Res Export */}
            {image && (
              <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none overflow-hidden" style={{ transform: 'translate(-9999px, -9999px)' }}>
                <div
                  ref={exportRef}
                  style={{
                    display: "inline-block",
                    padding: `${padding}px`,
                    background: getBackgroundStyle(),
                    minWidth: "100%", // Match logic but allowed to be natural size
                  }}
                >
                  <img
                    src={image}
                    alt="Export Target"
                    style={{
                      display: "block",
                      // No maxWidth constraint here - uses natural size
                      borderRadius: `${borderRadius}px`,
                      boxShadow: getShadowStyle(),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel - Right Side on desktop, Below on mobile */}
          <div className="w-full lg:w-80 shrink-0 bg-gray-50 lg:bg-transparent rounded-xl p-4 lg:p-0 lg:pr-6 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">

            <CollapsibleSection title="BACKGROUND" defaultOpen={false}>
              <div className="space-y-3">
                <button
                  onClick={() => setBackgroundType(backgroundType === "gradient" ? "solid" : "gradient")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Switch to {backgroundType === "gradient" ? "Solid Colors" : "Gradients"}
                </button>
                <div className="grid grid-cols-6 sm:grid-cols-5 gap-2">
                  {backgroundType === "gradient"
                    ? GRADIENTS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedGradient(opt)}
                        className={`aspect-square rounded-full border-2 transition-all hover:scale-110 ${selectedGradient.id === opt.id
                          ? "ring-2 ring-blue-600 ring-offset-2 border-transparent"
                          : "border-gray-200"
                          }`}
                        style={{ background: opt.css }}
                        title={opt.name}
                      />
                    ))
                    : SOLID_COLORS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedColor(opt)}
                        className={`aspect-square rounded-full border-2 transition-all hover:scale-110 ${selectedColor.id === opt.id
                          ? "ring-2 ring-blue-600 ring-offset-2 border-transparent"
                          : "border-gray-200"
                          }`}
                        style={{ background: opt.color }}
                        title={opt.name}
                      />
                    ))
                  }
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
