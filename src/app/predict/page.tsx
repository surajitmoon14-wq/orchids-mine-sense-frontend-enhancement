"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function PickaxeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M20 80 L50 50 L45 45 L15 75 Z" />
      <path d="M50 50 L80 20 L90 25 L60 55 Z" />
      <path d="M80 20 L85 10 L95 15 L90 25 Z" />
      <circle cx="50" cy="50" r="5" />
    </svg>
  );
}

function LanternIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} fill="currentColor">
      <rect x="20" y="5" width="20" height="8" rx="2" />
      <path d="M15 15 L45 15 L50 85 L10 85 Z" opacity="0.3" />
      <rect x="12" y="13" width="36" height="5" rx="2" />
      <rect x="10" y="82" width="40" height="8" rx="2" />
      <ellipse cx="30" cy="50" rx="12" ry="20" fill="#FFD700" opacity="0.8" />
      <ellipse cx="30" cy="50" rx="6" ry="12" fill="#FFF8DC" opacity="0.9" />
    </svg>
  );
}

function GoldNuggetIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M30 70 L15 50 L25 25 L50 15 L75 25 L85 50 L70 70 L50 80 Z" />
      <path d="M40 55 L35 45 L45 35 L60 40 L65 55 L55 65 Z" fill="#FFF8DC" opacity="0.4" />
    </svg>
  );
}

function MineCartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="currentColor">
      <path d="M10 50 L15 20 L85 20 L90 50 Z" />
      <circle cx="25" cy="60" r="10" />
      <circle cx="75" cy="60" r="10" />
      <rect x="20" y="55" width="60" height="10" />
    </svg>
  );
}

const DUST_PARTICLES = [
  { left: "12%", top: "25%", width: 6, height: 8, opacity: 0.5, xMove: 8, duration: 5 },
  { left: "28%", top: "45%", width: 5, height: 6, opacity: 0.4, xMove: -6, duration: 6 },
  { left: "45%", top: "15%", width: 7, height: 5, opacity: 0.6, xMove: 10, duration: 4.5 },
  { left: "62%", top: "55%", width: 4, height: 7, opacity: 0.45, xMove: -8, duration: 5.5 },
  { left: "78%", top: "35%", width: 8, height: 6, opacity: 0.55, xMove: 5, duration: 6.5 },
  { left: "35%", top: "70%", width: 5, height: 9, opacity: 0.5, xMove: -10, duration: 5 },
  { left: "55%", top: "80%", width: 6, height: 5, opacity: 0.4, xMove: 7, duration: 4 },
  { left: "85%", top: "60%", width: 7, height: 7, opacity: 0.6, xMove: -5, duration: 6 },
  { left: "20%", top: "85%", width: 5, height: 6, opacity: 0.45, xMove: 9, duration: 5.5 },
  { left: "70%", top: "20%", width: 6, height: 8, opacity: 0.55, xMove: -7, duration: 4.5 },
  { left: "8%", top: "50%", width: 4, height: 5, opacity: 0.5, xMove: 6, duration: 6 },
  { left: "92%", top: "40%", width: 7, height: 6, opacity: 0.4, xMove: -8, duration: 5 },
  { left: "40%", top: "30%", width: 5, height: 7, opacity: 0.6, xMove: 10, duration: 5.5 },
  { left: "58%", top: "65%", width: 6, height: 5, opacity: 0.45, xMove: -6, duration: 4 },
  { left: "15%", top: "75%", width: 8, height: 8, opacity: 0.55, xMove: 8, duration: 6.5 },
];

function GlowingDust() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {DUST_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.width,
            height: particle.height,
            background: `radial-gradient(circle, rgba(255,215,0,${particle.opacity}) 0%, transparent 70%)`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xMove, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: particle.duration,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function LiveSignalGraph({ features, isAnalyzing }: { features: number[]; isAnalyzing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0d0a07';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1a1510';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    if (features.length === 60) {
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(255,215,0,0)');
      gradient.addColorStop(0.5, 'rgba(255,215,0,0.3)');
      gradient.addColorStop(1, '#FFD700');

      ctx.beginPath();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;

      const pointWidth = width / 60;
      const baseY = height * 0.7;

      for (let i = 0; i < 60; i++) {
        const x = i * pointWidth + pointWidth / 2;
        const waveOffset = isAnalyzing ? Math.sin((i + offset) * 0.1) * 5 : 0;
        const y = baseY - (features[i] * height * 0.6) + waveOffset;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.fillStyle = '#8B7355';
    ctx.font = '10px monospace';
    for (let i = 0; i <= 6; i++) {
      const label = (i * 10 + 1).toString();
      ctx.fillText(label, i * (width / 6) + 10, height - 5);
    }
  }, [features, offset, isAnalyzing]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={120} 
        className="w-full h-28 rounded-lg border border-[#8B7355]/30"
      />
      <div className="absolute top-2 right-3 text-xs text-[#FFD700] font-mono tracking-wider">
        SONAR CHANNELS
      </div>
    </div>
  );
}

function MineImage() {
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at 50% 60%, rgba(255,200,100,0.15) 0%, transparent 50%),
        linear-gradient(180deg, #1a1510 0%, #0d0a07 100%)
      `
    }}>
      <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="mineGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#8B7355" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <ellipse cx="200" cy="200" rx="70" ry="15" fill="#0d0a07" opacity="0.6" />
        
        <g filter="url(#glow)">
          <circle cx="200" cy="120" r="50" fill="url(#mineGold)" />
          
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + Math.cos(rad) * 50;
            const y1 = 120 + Math.sin(rad) * 50;
            const x2 = 200 + Math.cos(rad) * 75;
            const y2 = 120 + Math.sin(rad) * 75;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8860B" strokeWidth="7" strokeLinecap="round" />
                <circle cx={x2} cy={y2} r="5" fill="#FFD700" />
              </g>
            );
          })}
          
          <circle cx="200" cy="120" r="40" fill="none" stroke="#8B7355" strokeWidth="3" />
          <circle cx="200" cy="120" r="30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
          <circle cx="185" cy="105" r="10" fill="#FFF8DC" opacity="0.4" />
        </g>
      </svg>
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.2) 0%, transparent 60%)'
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="absolute bottom-3 left-3 text-xs font-mono text-[#FFD700]/70 tracking-wider">
        EXPLOSIVE DETECTED
      </div>
    </div>
  );
}

function RockImage() {
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at 50% 70%, rgba(139,115,85,0.2) 0%, transparent 50%),
        linear-gradient(180deg, #1a1510 0%, #0d0a07 100%)
      `
    }}>
      <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="50%" stopColor="#5D4E37" />
            <stop offset="100%" stopColor="#4A3C2A" />
          </linearGradient>
        </defs>
        
        <ellipse cx="200" cy="195" rx="90" ry="18" fill="#0d0a07" opacity="0.5" />
        
        <path d="M120 180 L100 150 L110 110 L140 85 L180 75 L220 80 L260 95 L290 125 L300 160 L280 185 L240 195 L180 200 L140 190 Z" fill="url(#rockGrad)" />
        <path d="M140 170 L130 145 L150 115 L190 105 L230 110 L260 135 L270 165 L250 185 L200 190 L160 180 Z" fill="#6B5344" opacity="0.6" />
        <path d="M160 155 L155 135 L175 120 L205 125 L220 145 L210 165 L180 170 Z" fill="#7D6B5D" opacity="0.4" />
        
        <ellipse cx="170" cy="125" rx="12" ry="8" fill="#8B7355" opacity="0.3" />
        <ellipse cx="230" cy="150" rx="10" ry="6" fill="#5D4E37" opacity="0.4" />
        
        <path d="M80 185 L60 165 L70 145 L95 165 Z" fill="#5D4E37" opacity="0.5" />
        <path d="M310 175 L325 155 L335 175 L320 190 Z" fill="#5D4E37" opacity="0.4" />
      </svg>
      
      <div className="absolute bottom-3 left-3 text-xs font-mono text-[#8B7355]/70 tracking-wider">
        MINERAL FORMATION
      </div>
    </div>
  );
}

function DetectionResult({ result, confidence, isLoading }: { 
  result: string | null; 
  confidence: number | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-[#8B7355]/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-[#FFD700] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <LanternIcon className="w-8 h-8 text-[#FFD700]" />
          </div>
        </div>
        <p className="mt-4 text-sm text-[#8B7355] font-mono tracking-wider">ANALYZING SIGNAL...</p>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a1510] border border-[#8B7355]/30 flex items-center justify-center mb-4">
          <PickaxeIcon className="w-8 h-8 text-[#8B7355]" />
        </div>
        <p className="text-[#8B7355] font-mono text-sm">AWAITING SIGNAL INPUT</p>
      </div>
    );
  }

  const isMine = result === "Mine";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className={`p-4 rounded-xl border-2 ${
        isMine 
          ? "border-[#FFD700]/50" 
          : "border-[#8B7355]/50"
      }`} style={{
        background: isMine 
          ? "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(184,134,11,0.05) 100%)"
          : "linear-gradient(135deg, rgba(139,115,85,0.1) 0%, rgba(93,78,55,0.05) 100%)"
      }}>
        <div className="flex items-center gap-3">
          <motion.div 
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isMine ? "bg-[#FFD700]/20" : "bg-[#8B7355]/20"
            }`}
            animate={{ 
              boxShadow: isMine 
                ? ["0 0 10px rgba(255,215,0,0.3)", "0 0 20px rgba(255,215,0,0.5)", "0 0 10px rgba(255,215,0,0.3)"]
                : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isMine ? (
              <GoldNuggetIcon className="w-6 h-6 text-[#FFD700]" />
            ) : (
              <svg className="w-6 h-6 text-[#8B7355]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M30 70 L15 50 L25 25 L50 15 L75 25 L85 50 L70 70 L50 80 Z" />
              </svg>
            )}
          </motion.div>
          <div>
            <h3 className={`text-xl font-bold tracking-wider ${
              isMine ? "text-[#FFD700]" : "text-[#C4A77D]"
            }`} style={{ fontFamily: "'Cinzel', serif", textShadow: isMine ? "0 0 10px rgba(255,215,0,0.3)" : "none" }}>
              {isMine ? "MINE DETECTED" : "ROCK DETECTED"}
            </h3>
            {isMine && (
              <p className="text-[#DAA520] text-xs font-mono flex items-center gap-1 mt-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                Explosive threat identified
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {isMine ? <MineImage /> : <RockImage />}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3 text-center border border-[#8B7355]/30" style={{ background: "rgba(26,21,16,0.8)" }}>
          <p className="text-[#8B7355] text-xs font-mono mb-1">Detection</p>
          <p className={`text-sm font-bold font-mono ${isMine ? "text-[#FFD700]" : "text-[#C4A77D]"}`}>
            {isMine ? "THREAT" : "SAFE"}
          </p>
        </div>
        <div className="rounded-lg p-3 text-center border border-[#8B7355]/30" style={{ background: "rgba(26,21,16,0.8)" }}>
          <p className="text-[#8B7355] text-xs font-mono mb-1">Confidence</p>
          <p className={`text-lg font-bold font-mono ${isMine ? "text-[#FFD700]" : "text-[#C4A77D]"}`}>
            {Math.round((confidence || 0) * 100)}%
          </p>
        </div>
        <div className="rounded-lg p-3 text-center border border-[#8B7355]/30" style={{ background: "rgba(26,21,16,0.8)" }}>
          <p className="text-[#8B7355] text-xs font-mono mb-1">Status</p>
          <p className={`text-sm font-bold font-mono ${isMine ? "text-[#B8860B]" : "text-[#6B8E23]"}`}>
            {isMine ? "DANGER" : "CLEAR"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ManualInputGrid({ features, setFeatures, setInputData }: { 
  features: number[]; 
  setFeatures: (f: number[]) => void;
  setInputData: (s: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    const num = parseFloat(value) || 0;
    newFeatures[index] = Math.max(0, Math.min(1, num));
    setFeatures(newFeatures);
    setInputData(newFeatures.map(f => f.toFixed(4)).join(','));
  };

  if (features.length !== 60) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[#8B7355] hover:text-[#FFD700] transition-colors font-mono tracking-wider"
      >
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        MANUAL SIGNAL ADJUSTMENT
      </button>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3"
        >
          <p className="text-xs text-[#DAA520] mb-3 font-mono">
            Training-specific values only (0.0 - 1.0)
          </p>
          <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto pr-2">
            {features.map((value, index) => (
              <div key={index} className="relative">
                <label className="absolute -top-4 left-0 text-[8px] text-[#8B7355] font-mono">
                  B{index + 1}
                </label>
                <input
                  type="number"
                  value={value.toFixed(4)}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  step="0.0001"
                  min="0"
                  max="1"
                  className="w-full px-1 py-1.5 text-xs font-mono bg-[#0d0a07] border border-[#8B7355]/30 rounded text-center text-[#FFE4B5] focus:border-[#FFD700] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function PredictPage() {
  const [inputData, setInputData] = useState("");
  const [features, setFeatures] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("sonarData");
    
    if (storedData) {
      setInputData(storedData);
      const parsed = storedData.split(",").map(v => parseFloat(v.trim()));
      if (parsed.length === 60 && parsed.every(n => !isNaN(n))) {
        setFeatures(parsed);
        sessionStorage.removeItem("sonarData");
        sessionStorage.removeItem("actualLabel");
        handlePredictWithData(parsed);
      }
    }
  }, []);

  const parseInput = (input: string): number[] | null => {
    const values = input.split(",").map(v => v.trim()).filter(v => v !== "");
    if (values.length !== 60) return null;
    
    const numbers = values.map(v => parseFloat(v));
    if (numbers.some(n => isNaN(n))) return null;
    
    return numbers;
  };

  const handlePredictWithData = async (parsed: number[]) => {
    setFeatures(parsed);
    setError(null);
    setIsLoading(true);
    setResult(null);
    setConfidence(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: parsed }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        setConfidence(data.confidence);
      }
    } catch {
      setError("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredict = async () => {
    const parsed = parseInput(inputData);
    if (!parsed) {
      setError("Please enter exactly 60 comma-separated numbers");
      return;
    }

    await handlePredictWithData(parsed);
  };

  const loadRandomSample = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setConfidence(null);

    try {
      const response = await fetch("/api/samples");
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      const featuresStr = data.features.map((f: number) => f.toFixed(4)).join(",");
      setInputData(featuresStr);
      setFeatures(data.features);

      const predictResponse = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: data.features }),
      });

      const predictData = await predictResponse.json();
      
      if (predictData.error) {
        setError(predictData.error);
      } else {
        setResult(predictData.result);
        setConfidence(predictData.confidence);
      }
    } catch {
      setError("Failed to load sample. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setInputData("");
    setFeatures([]);
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at 55% 30%, rgba(255,200,100,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 30% 70%, rgba(139,115,85,0.06) 0%, transparent 40%),
        linear-gradient(180deg, #1a1510 0%, #0d0a07 30%, #050403 100%)
      `
    }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.03
      }} />
      
      <GlowingDust />

      <div className="absolute top-0 left-0 w-full h-1" style={{
        background: "linear-gradient(90deg, transparent 0%, #8B7355 20%, #FFD700 50%, #8B7355 80%, transparent 100%)"
      }} />

      <nav className="relative z-50 flex items-center justify-between px-4 py-3 border-b border-[#8B7355]/30" style={{ background: "rgba(26,21,16,0.8)", backdropFilter: "blur(10px)" }}>
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            animate={{ filter: ["drop-shadow(0 0 5px #FFD700)", "drop-shadow(0 0 10px #FFD700)", "drop-shadow(0 0 5px #FFD700)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PickaxeIcon className="w-6 h-6 text-[#FFD700]" />
          </motion.div>
          <span className="text-lg font-bold text-[#FFE4B5]" style={{ fontFamily: "'Cinzel', serif" }}>
            MineSense
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 text-[#8B7355] hover:text-[#FFD700] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link href="/dataset" className="p-2 text-[#8B7355] hover:text-[#FFD700] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <LiveSignalGraph features={features} isAnalyzing={isLoading} />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DetectionResult 
                result={result} 
                confidence={confidence} 
                isLoading={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-4 relative border border-[#8B7355]/30"
              style={{ background: "linear-gradient(135deg, rgba(26,21,16,0.9) 0%, rgba(13,10,7,0.95) 100%)" }}
            >
              <h2 className="text-sm font-mono text-[#8B7355] tracking-wider mb-3 flex items-center gap-2">
                <MineCartIcon className="w-4 h-4 text-[#FFD700]" />
                SIGNAL INPUT
              </h2>

              <textarea
                ref={textareaRef}
                value={inputData}
                onChange={(e) => {
                  setInputData(e.target.value);
                  const parsed = parseInput(e.target.value);
                  if (parsed) setFeatures(parsed);
                }}
                placeholder="Enter 60 comma-separated values (0.0 - 1.0)..."
                className="w-full h-28 rounded-lg p-3 text-sm font-mono text-[#FFE4B5] placeholder-[#5D4E37] focus:outline-none focus:border-[#FFD700]/50 resize-none border border-[#8B7355]/30"
                style={{ background: "rgba(13,10,7,0.8)" }}
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 px-3 py-2 rounded-lg text-xs font-mono border border-[#B8860B]/30"
                    style={{ background: "rgba(184,134,11,0.1)", color: "#DAA520" }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict}
                  disabled={isLoading || !inputData.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg text-[#1a1510] font-bold font-mono text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ 
                    background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                    boxShadow: "0 4px 15px rgba(255,215,0,0.3)"
                  }}
                >
                  {isLoading ? "SCANNING..." : "RUN SCAN"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadRandomSample}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#8B7355]/50 text-[#C4A77D] font-mono text-sm tracking-wider hover:bg-[#8B7355]/10 hover:border-[#FFD700]/30 disabled:opacity-50 transition-all"
                >
                  LOAD SAMPLE
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="px-3 py-2.5 rounded-lg border border-[#8B7355]/30 text-[#8B7355] hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>

              <ManualInputGrid 
                features={features} 
                setFeatures={setFeatures}
                setInputData={setInputData}
              />

              <div className="absolute right-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#FFD700] via-[#B8860B]/50 to-transparent" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <Link
              href="/dataset"
              className="px-6 py-2 rounded-lg border border-[#8B7355]/30 text-[#8B7355] text-sm font-mono hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              BROWSE TRAINING DATASET
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
