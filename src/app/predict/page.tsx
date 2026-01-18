"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function SonarWave({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {isActive && [0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ff6b35]/30"
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ 
            width: ["0%", "150%"], 
            height: ["0%", "150%"], 
            opacity: [0.6, 0] 
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
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
    
    ctx.fillStyle = '#0d0d12';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1a1a25';
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
      gradient.addColorStop(0, '#ff6b3500');
      gradient.addColorStop(0.5, '#ff6b3580');
      gradient.addColorStop(1, '#ff6b35');

      ctx.beginPath();
      ctx.strokeStyle = '#ff6b35';
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

    ctx.fillStyle = '#666';
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
        className="w-full h-28 rounded-lg border border-[#2a2a3a]"
      />
      <div className="absolute top-2 right-3 text-xs text-[#ff6b35] font-mono tracking-wider">
        CHANNELS DATA
      </div>
    </div>
  );
}

function MineImage() {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 70%, rgba(60, 50, 40, 0.9) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(40, 35, 30, 0.8) 0%, transparent 60%),
            linear-gradient(180deg, #0d0d12 0%, #1a1815 50%, #252018 100%)
          `
        }}
      />
      
      <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="mineBody" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="70%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          <filter id="underwaterBlur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <linearGradient id="spikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
        </defs>
        
        <ellipse cx="200" cy="240" rx="80" ry="15" fill="#1a1510" opacity="0.6" />
        
        <g filter="url(#underwaterBlur)">
          <circle cx="200" cy="150" r="55" fill="url(#mineBody)" />
          
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + Math.cos(rad) * 55;
            const y1 = 150 + Math.sin(rad) * 55;
            const x2 = 200 + Math.cos(rad) * 80;
            const y2 = 150 + Math.sin(rad) * 80;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a3a3a" strokeWidth="8" strokeLinecap="round" />
                <circle cx={x2} cy={y2} r="6" fill="#4a4a4a" />
                <circle cx={x2} cy={y2} r="3" fill="#2a2a2a" />
              </g>
            );
          })}
          
          <circle cx="200" cy="150" r="45" fill="none" stroke="#3a3a3a" strokeWidth="3" />
          <circle cx="200" cy="150" r="35" fill="none" stroke="#4a4a4a" strokeWidth="2" />
          
          <circle cx="185" cy="135" r="8" fill="#5a5a5a" opacity="0.5" />
        </g>
      </svg>
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 61, 61, 0.1) 50%, transparent 100%)'
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function RockImage() {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 40% 80%, rgba(70, 60, 50, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 70%, rgba(50, 45, 40, 0.7) 0%, transparent 60%),
            linear-gradient(180deg, #0d1015 0%, #151820 50%, #1a1d25 100%)
          `
        }}
      />
      
      <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="rockGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a5a60" />
            <stop offset="50%" stopColor="#3a3a40" />
            <stop offset="100%" stopColor="#2a2a30" />
          </linearGradient>
          <linearGradient id="rockGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a4a50" />
            <stop offset="100%" stopColor="#2a2a30" />
          </linearGradient>
          <filter id="rockTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        
        <ellipse cx="200" cy="235" rx="100" ry="20" fill="#101215" opacity="0.5" />
        
        <path d="M120 200 L100 170 L110 130 L140 100 L180 90 L220 95 L260 110 L290 140 L300 180 L280 210 L240 220 L180 225 L140 215 Z" fill="url(#rockGrad1)" />
        <path d="M140 190 L130 160 L150 130 L190 120 L230 125 L260 150 L270 185 L250 205 L200 210 L160 200 Z" fill="url(#rockGrad2)" opacity="0.7" />
        
        <path d="M160 175 L155 150 L175 135 L205 140 L220 160 L210 180 L180 185 Z" fill="#4a4a55" opacity="0.5" />
        
        <ellipse cx="170" cy="140" rx="15" ry="10" fill="#5a5a65" opacity="0.3" />
        <ellipse cx="230" cy="165" rx="12" ry="8" fill="#3a3a40" opacity="0.4" />
        
        <path d="M80 210 L60 185 L70 160 L95 180 Z" fill="#3a3a45" opacity="0.6" />
        <path d="M300 195 L320 175 L330 195 L315 210 Z" fill="#3a3a45" opacity="0.5" />
      </svg>
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(79, 195, 247, 0.08) 50%, transparent 100%)'
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
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
            className="absolute inset-0 rounded-full border-4 border-[#ff6b35]/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-[#ff6b35] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#ff6b35] font-mono text-xs tracking-wider">SCAN</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#888] font-mono tracking-wider">ANALYZING SIGNAL...</p>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a1a25] border border-[#2a2a3a] flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-[#666] font-mono text-sm">AWAITING SIGNAL INPUT</p>
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
          ? "bg-[#ff3d3d]/10 border-[#ff3d3d]/50" 
          : "bg-[#4fc3f7]/10 border-[#4fc3f7]/50"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isMine ? "bg-[#ff3d3d]/20" : "bg-[#4fc3f7]/20"
          }`}>
            {isMine ? (
              <svg className="w-6 h-6 text-[#ff3d3d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L19 6L16.74 11.91L23 13.09L16.74 14.09L19 20L13.09 17.74L12 24L10.91 17.74L5 20L7.26 14.09L1 13.09L7.26 11.91L5 6L10.91 8.26L12 2Z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[#4fc3f7]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold font-mono tracking-wider ${
              isMine ? "text-[#ff3d3d]" : "text-[#4fc3f7]"
            }`}>
              {isMine ? "MINE DETECTED" : "ROCK DETECTED"}
            </h3>
            {isMine && (
              <p className="text-[#f59e0b] text-xs font-mono flex items-center gap-1 mt-1">
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
        <div className="bg-[#0d0d12] border border-[#2a2a3a] rounded-lg p-3 text-center">
          <p className="text-[#666] text-xs font-mono mb-1">Detection</p>
          <p className={`text-sm font-bold font-mono ${isMine ? "text-[#ff3d3d]" : "text-[#4fc3f7]"}`}>
            {isMine ? "SEVERE" : "SAFE"}
          </p>
        </div>
        <div className="bg-[#0d0d12] border border-[#2a2a3a] rounded-lg p-3 text-center">
          <p className="text-[#666] text-xs font-mono mb-1">Confidence</p>
          <p className={`text-lg font-bold font-mono ${isMine ? "text-[#ff3d3d]" : "text-[#4fc3f7]"}`}>
            {Math.round((confidence || 0) * 100)}%
          </p>
        </div>
        <div className="bg-[#0d0d12] border border-[#2a2a3a] rounded-lg p-3 text-center">
          <p className="text-[#666] text-xs font-mono mb-1">Status</p>
          <p className={`text-sm font-bold font-mono ${isMine ? "text-[#ff3d3d]" : "text-[#10b981]"}`}>
            {isMine ? "THREAT" : "CLEAR"}
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
        className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors font-mono tracking-wider"
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
          <p className="text-xs text-[#f59e0b] mb-3 font-mono">
            Training-specific values only (0.0 - 1.0)
          </p>
          <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {features.map((value, index) => (
              <div key={index} className="relative">
                <label className="absolute -top-4 left-0 text-[8px] text-[#666] font-mono">
                  B{index + 1}
                </label>
                <input
                  type="number"
                  value={value.toFixed(4)}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  step="0.0001"
                  min="0"
                  max="1"
                  className="w-full px-1 py-1.5 text-xs font-mono bg-[#0d0d12] border border-[#2a2a3a] rounded text-center text-white focus:border-[#ff6b35] focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff6b35] to-[#ff6b35]/20 rounded" />
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
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a25] via-[#0a0a0f] to-[#0a0a0f]" />
      <SonarWave isActive={isLoading} />

      <nav className="relative z-50 flex items-center justify-between px-4 py-3 border-b border-[#2a2a3a]/50 bg-[#0d0d12]/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-1 bg-[#ff6b35]" />
          <div className="w-4 h-1 bg-[#ff6b35]/60" />
          <span className="text-lg font-bold tracking-wider ml-2">
            <span className="text-white">SONAR</span>
            <span className="text-[#888] ml-1">ANALYSIS</span>
            <span className="text-[#555] ml-1 font-normal">SYSTEM</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 text-[#888] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link href="/dataset" className="p-2 text-[#888] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </Link>
          <button className="p-2 text-[#888] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
              className="bg-[#0d0d12] border border-[#2a2a3a] rounded-xl p-4 relative"
            >
              <h2 className="text-sm font-mono text-[#888] tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
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
                className="w-full h-28 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg p-3 text-sm font-mono text-white placeholder-[#444] focus:outline-none focus:border-[#ff6b35]/50 resize-none scrollbar-hide"
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 px-3 py-2 bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 rounded-lg text-xs text-[#ff3d3d] font-mono"
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
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#ff6b35] text-black font-bold font-mono text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff8555] transition-colors"
                >
                  {isLoading ? "SCANNING..." : "RUN SCAN"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadRandomSample}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#4fc3f7]/30 text-[#4fc3f7] font-mono text-sm tracking-wider hover:bg-[#4fc3f7]/10 disabled:opacity-50 transition-colors"
                >
                  LOAD SAMPLE
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="px-3 py-2.5 rounded-lg border border-[#2a2a3a] text-[#666] hover:text-white hover:border-[#444] transition-colors"
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

              <div className="absolute right-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#ff6b35] via-[#ff6b35]/50 to-transparent" />
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
              className="px-6 py-2 rounded-lg border border-[#2a2a3a] text-[#888] text-sm font-mono hover:text-white hover:border-[#444] transition-colors flex items-center gap-2"
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
