"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function MineIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
      <circle cx="50" cy="50" r="35" fill="#1a1a25" />
      <circle cx="50" cy="50" r="25" fill="currentColor" />
      <rect x="48" y="10" width="4" height="15" fill="currentColor" />
      <rect x="48" y="75" width="4" height="15" fill="currentColor" />
      <rect x="10" y="48" width="15" height="4" fill="currentColor" />
      <rect x="75" y="48" width="15" height="4" fill="currentColor" />
      <rect x="22" y="22" width="10" height="4" fill="currentColor" transform="rotate(45 27 24)" />
      <rect x="68" y="22" width="10" height="4" fill="currentColor" transform="rotate(-45 73 24)" />
      <rect x="22" y="74" width="10" height="4" fill="currentColor" transform="rotate(-45 27 76)" />
      <rect x="68" y="74" width="10" height="4" fill="currentColor" transform="rotate(45 73 76)" />
    </svg>
  );
}

function RockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 10 L75 25 L85 50 L75 75 L50 90 L25 75 L15 50 L25 25 Z" />
      <path d="M50 20 L65 30 L72 50 L65 70 L50 80 L35 70 L28 50 L35 30 Z" fill="#1a1a25" opacity="0.5" />
      <path d="M40 35 L55 40 L60 55 L50 65 L38 58 L35 45 Z" fill="#2a2a3a" />
    </svg>
  );
}

function SignalChart({ features, result }: { features: number[]; result: string | null }) {
  const maxValue = Math.max(...features, 0.001);
  const color = result === "Mine" ? "#ff3d3d" : result === "Rock" ? "#4fc3f7" : "#ff6b35";
  
  return (
    <div className="w-full h-48 relative bg-[#0a0a0f] rounded-xl p-4 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative h-full flex items-end justify-between gap-0.5">
        {features.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.01 }}
            className="flex-1 rounded-t-sm relative group"
            style={{ 
              background: `linear-gradient(to top, ${color}40, ${color})`,
              minWidth: "2px"
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a25] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Band {index + 1}: {value.toFixed(4)}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-2 left-4 text-xs text-muted-foreground font-mono">
        60 Frequency Bands
      </div>
    </div>
  );
}

function ResultDisplay({ result, confidence, isLoading, warning, isFromDataset }: { 
  result: string | null; 
  confidence: number | null;
  isLoading: boolean;
  warning?: string;
  isFromDataset?: boolean;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-[#ff6b35]/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-t-[#ff6b35] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#ff6b35] font-orbitron text-sm">SCAN</span>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground font-medium">Analyzing sonar signal...</p>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-[#2a2a3a] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-muted-foreground">Enter sonar data or load a sample to start detection</p>
        <Link href="/dataset" className="mt-4 text-[#ff6b35] text-sm hover:underline">
          Browse Dataset →
        </Link>
      </div>
    );
  }

  const isMine = result === "Mine";
  const Icon = isMine ? MineIcon : RockIcon;
  const color = isMine ? "#ff3d3d" : "#4fc3f7";
  const bgGradient = isMine 
    ? "from-[#ff3d3d]/20 via-transparent to-transparent" 
    : "from-[#4fc3f7]/20 via-transparent to-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-2xl`} />
      
      <div className="relative flex flex-col items-center py-8 px-6">
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 left-2 right-2 px-3 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg text-xs text-[#f59e0b] text-center"
          >
            ⚠️ {warning}
          </motion.div>
        )}
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className={`relative ${warning ? 'mt-8' : ''}`}
        >
          <Icon className={`w-32 h-32 ${isMine ? "animate-mine-pulse" : "animate-rock-wobble"}`} style={{ color }} />
          
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}40` }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
            />
          ))}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-4xl font-bold font-orbitron"
          style={{ color }}
        >
          {result.toUpperCase()}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center gap-3"
        >
          <div className="text-sm text-muted-foreground">Confidence:</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(confidence || 0) * 100}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <span className="font-mono font-bold" style={{ color }}>
              {((confidence || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>

        {isFromDataset !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              isFromDataset 
                ? "bg-[#10b981]/10 text-[#10b981]" 
                : "bg-[#f59e0b]/10 text-[#f59e0b]"
            }`}
          >
            {isFromDataset ? "✓ Valid Dataset Entry" : "⚠ Not in Training Data"}
          </motion.div>
        )}
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-muted-foreground text-center max-w-xs"
        >
          {isMine 
            ? "Sonar signature indicates a metallic underwater mine. Exercise caution!"
            : "Sonar signature matches natural rock formation. Area appears safe."}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function PredictPage() {
  const [inputData, setInputData] = useState("");
  const [features, setFeatures] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualLabel, setActualLabel] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | undefined>(undefined);
  const [isFromDataset, setIsFromDataset] = useState<boolean | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("sonarData");
    const storedLabel = sessionStorage.getItem("actualLabel");
    
    if (storedData) {
      setInputData(storedData);
      const parsed = storedData.split(",").map(v => parseFloat(v.trim()));
      if (parsed.length === 60 && parsed.every(n => !isNaN(n))) {
        setFeatures(parsed);
        if (storedLabel) {
          setActualLabel(storedLabel);
        }
        sessionStorage.removeItem("sonarData");
        sessionStorage.removeItem("actualLabel");
        
        handlePredictWithData(parsed, storedLabel || null);
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

  const handlePredictWithData = async (parsed: number[], label: string | null) => {
    setFeatures(parsed);
    setError(null);
    setIsLoading(true);
    setResult(null);
    setConfidence(null);
    setWarning(undefined);
    setIsFromDataset(undefined);
    if (label) setActualLabel(label);

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
        setWarning(data.warning);
        setIsFromDataset(data.isFromDataset);
      }
    } catch (err) {
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

    await handlePredictWithData(parsed, null);
  };

  const loadRandomSample = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setConfidence(null);
    setActualLabel(null);
    setWarning(undefined);
    setIsFromDataset(undefined);

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
      setActualLabel(data.actualLabel);

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
        setWarning(predictData.warning);
        setIsFromDataset(predictData.isFromDataset);
      }
    } catch (err) {
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
    setActualLabel(null);
    setWarning(undefined);
    setIsFromDataset(undefined);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 noise-overlay" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-50" />

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <MineIcon className="w-10 h-10 text-[#ff6b35]" />
          </motion.div>
          <span className="text-2xl font-bold font-orbitron text-gradient">MineSense</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            href="/dataset"
            className="px-4 py-2 rounded-lg border border-[#4fc3f7]/30 text-[#4fc3f7] text-sm font-medium hover:bg-[#4fc3f7]/10 transition-colors"
          >
            Browse Dataset
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-[#2a2a3a] text-sm font-medium hover:bg-[#2a2a3a] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 lg:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-orbitron mb-4">
              <span className="text-gradient">Sonar</span> Detection
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter 60 comma-separated sonar frequency values to classify the underwater object
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-orbitron flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Input Data
                </h2>
                <span className="text-xs text-muted-foreground bg-[#2a2a3a] px-2 py-1 rounded">
                  60 values required
                </span>
              </div>

              <textarea
                ref={textareaRef}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter 60 comma-separated values (e.g., 0.0200,0.0371,0.0428,...)"
                className="w-full h-40 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/50 resize-none scrollbar-hide"
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 px-4 py-2 bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 rounded-lg text-sm text-[#ff3d3d]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict}
                  disabled={isLoading || !inputData.trim()}
                  className="flex-1 min-w-[140px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8555] text-black font-bold font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Analyzing..." : "Detect Object"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadRandomSample}
                  disabled={isLoading}
                  className="flex-1 min-w-[140px] px-6 py-3 rounded-xl border-2 border-[#4fc3f7]/30 text-[#4fc3f7] font-semibold font-orbitron hover:bg-[#4fc3f7]/10 disabled:opacity-50"
                >
                  Load Sample
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAll}
                  className="px-4 py-3 rounded-xl border border-[#2a2a3a] text-muted-foreground hover:bg-[#2a2a3a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>

              <div className="mt-4 p-3 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-lg">
                <p className="text-xs text-[#f59e0b]">
                  <strong>Note:</strong> This model is trained on 208 specific sonar samples. For accurate results, use data from the{" "}
                  <Link href="/dataset" className="underline hover:text-[#f59e0b]/80">
                    training dataset
                  </Link>
                  . Custom values may produce unreliable predictions.
                </p>
              </div>

              {features.length === 60 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Signal Visualization
                  </h3>
                  <SignalChart features={features} result={result} />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold font-orbitron mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Detection Result
              </h2>

              <ResultDisplay 
                result={result} 
                confidence={confidence} 
                isLoading={isLoading} 
                warning={warning}
                isFromDataset={isFromDataset}
              />

              {actualLabel && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-[#0a0a0f] rounded-xl border border-[#2a2a3a]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Actual Label:</span>
                    <span className={`font-bold font-orbitron ${actualLabel === "Mine" ? "text-[#ff3d3d]" : "text-[#4fc3f7]"}`}>
                      {actualLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Prediction:</span>
                    <span className={`font-bold ${result === actualLabel ? "text-[#10b981]" : "text-[#ff3d3d]"}`}>
                      {result === actualLabel ? "✓ Correct!" : "✗ Incorrect"}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 glass-effect rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold font-orbitron mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-orbitron font-bold text-[#ff6b35]">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Input Sonar Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter 60 frequency band values from sonar readings or load a sample from the dataset
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4fc3f7]/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-orbitron font-bold text-[#4fc3f7]">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">ML Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Logistic regression model with standardized features analyzes the signal pattern
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-orbitron font-bold text-[#10b981]">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly receive classification (Mine/Rock) with confidence score and validation status
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
