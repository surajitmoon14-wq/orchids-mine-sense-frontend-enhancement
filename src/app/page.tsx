"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function MineCartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="currentColor">
      <path d="M10 50 L15 20 L85 20 L90 50 Z" />
      <circle cx="25" cy="60" r="10" />
      <circle cx="75" cy="60" r="10" />
      <rect x="20" y="55" width="60" height="10" />
      <ellipse cx="50" cy="30" rx="25" ry="8" fill="#8B7355" opacity="0.6" />
    </svg>
  );
}

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

function RockFormation({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} fill="currentColor">
      <path d="M0 100 L20 60 L40 80 L60 40 L80 70 L100 30 L120 60 L140 45 L160 75 L180 50 L200 100 Z" />
    </svg>
  );
}

function FloatingDust({ delay, left, size }: { delay: number; left: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{ 
        left, 
        width: size, 
        height: size,
        background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(139,115,85,0.2) 50%, transparent 70%)"
      }}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ 
        y: "-20vh", 
        opacity: [0, 0.8, 0.6, 0],
        x: [0, 15, -10, 5, 0]
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function GlowingLight({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(255,200,100,0.6) 0%, rgba(255,180,50,0.3) 30%, rgba(255,150,0,0.1) 60%, transparent 70%)",
        filter: "blur(2px)"
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.9, 0.6]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

function TunnelLights() {
  return (
    <>
      <GlowingLight x="50%" y="30%" size={300} delay={0} />
      <GlowingLight x="60%" y="45%" size={200} delay={0.5} />
      <GlowingLight x="55%" y="60%" size={150} delay={1} />
    </>
  );
}

function MineRailTrack() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="railGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#5D4E37" />
          </linearGradient>
        </defs>
        <rect x="0" y="70" width="1200" height="8" fill="url(#railGradient)" />
        <rect x="0" y="85" width="1200" height="8" fill="url(#railGradient)" />
        {Array.from({ length: 25 }, (_, i) => (
          <rect key={i} x={i * 50} y="65" width="30" height="35" fill="#4A3C2A" rx="2" />
        ))}
      </svg>
      <motion.div
        className="absolute bottom-6 left-0"
        animate={{ x: ["100vw", "-200px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <MineCartIcon className="w-32 h-24 text-[#6B5344]" />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="rounded-2xl p-6 relative overflow-hidden group border border-[#8B7355]/30"
      style={{
        background: "linear-gradient(135deg, rgba(90,70,50,0.4) 0%, rgba(60,45,30,0.6) 100%)",
        backdropFilter: "blur(10px)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
          style={{ background: "linear-gradient(135deg, #8B7355 0%, #5D4E37 100%)" }}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#FFE4B5]" style={{ fontFamily: "'Cinzel', serif" }}>{title}</h3>
        <p className="text-[#C4A77D] text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

function RadarDisplay() {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <div className="absolute w-full h-full rounded-full border-2 border-[#8B7355]/40" />
      <div className="absolute w-3/4 h-3/4 rounded-full border border-[#8B7355]/30" />
      <div className="absolute w-1/2 h-1/2 rounded-full border border-[#8B7355]/20" />
      <div className="absolute w-1/4 h-1/4 rounded-full border border-[#8B7355]/10" />
      
      <motion.div
        className="absolute w-full h-1 origin-center"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{ top: "28%", left: "62%", background: "radial-gradient(circle, #FFD700 0%, #B8860B 100%)", boxShadow: "0 0 15px #FFD700" }}
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        style={{ top: "58%", left: "28%", background: "radial-gradient(circle, #CD853F 0%, #8B4513 100%)", boxShadow: "0 0 10px #CD853F" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute w-3.5 h-3.5 rounded-full"
        style={{ top: "42%", left: "72%", background: "radial-gradient(circle, #DAA520 0%, #B8860B 100%)", boxShadow: "0 0 12px #DAA520" }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.5, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)" }}>
          <LanternIcon className="w-12 h-12 text-[#FFD700]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dustParticles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 1.2,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 20,
  }));

  return (
    <div className="min-h-screen overflow-hidden relative" style={{
      background: `
        radial-gradient(ellipse at 55% 40%, rgba(180,140,80,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 70%, rgba(139,115,85,0.1) 0%, transparent 40%),
        linear-gradient(180deg, #1a1510 0%, #0d0a07 30%, #050403 100%)
      `
    }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.03
      }} />
      
      {mounted && (
        <>
          <TunnelLights />
          {dustParticles.map((p, i) => (
            <FloatingDust key={`dust-${i}`} {...p} />
          ))}
          <MineRailTrack />
        </>
      )}

      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <RockFormation className="w-full h-24 text-[#2A2118] opacity-60" />
      </div>
      <div className="absolute bottom-32 left-0 right-0 pointer-events-none transform rotate-180">
        <RockFormation className="w-full h-20 text-[#1A1510] opacity-40" />
      </div>

      <div className="absolute top-0 left-0 w-full h-1.5" style={{
        background: "linear-gradient(90deg, transparent 0%, #8B7355 20%, #FFD700 50%, #8B7355 80%, transparent 100%)"
      }} />

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                filter: ["drop-shadow(0 0 8px #FFD700)", "drop-shadow(0 0 15px #FFD700)", "drop-shadow(0 0 8px #FFD700)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PickaxeIcon className="w-10 h-10 text-[#FFD700]" />
            </motion.div>
          </div>
          <span className="text-2xl font-bold text-[#FFE4B5]" style={{ fontFamily: "'Cinzel', serif", textShadow: "0 0 20px rgba(255,215,0,0.3)" }}>
            MineSense
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/dataset"
            className="px-4 py-2 rounded-lg border border-[#8B7355]/50 text-[#C4A77D] text-sm font-medium hover:bg-[#8B7355]/20 hover:border-[#FFD700]/50 transition-all"
          >
            Dataset
          </Link>
          <Link
            href="/predict"
            className="px-6 py-2.5 rounded-xl text-[#1a1510] font-semibold text-sm transition-all hover:shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
              boxShadow: "0 4px 20px rgba(255,215,0,0.3)"
            }}
          >
            Start Detecting
          </Link>
        </motion.div>
      </nav>

      <main className="relative z-10 px-6 lg:px-12">
        <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 py-20">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[#8B7355]/40"
                style={{ background: "linear-gradient(135deg, rgba(139,115,85,0.2) 0%, rgba(90,70,50,0.3) 100%)" }}
                animate={{ boxShadow: ["0 0 10px rgba(255,215,0,0.1)", "0 0 20px rgba(255,215,0,0.2)", "0 0 10px rgba(255,215,0,0.1)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.span 
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#FFD700" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-[#FFD700]">AI-Powered Detection</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                <span className="text-[#FFE4B5]">Detect </span>
                <motion.span 
                  className="inline-block"
                  style={{ color: "#FFD700", textShadow: "0 0 30px rgba(255,215,0,0.5)" }}
                  animate={{ textShadow: ["0 0 20px rgba(255,215,0,0.3)", "0 0 40px rgba(255,215,0,0.6)", "0 0 20px rgba(255,215,0,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Mines
                </motion.span>
                <br />
                <span className="text-[#FFE4B5]">& </span>
                <span className="text-[#CD853F]">Rocks</span>
                <br />
                <span style={{ 
                  background: "linear-gradient(135deg, #FFD700 0%, #B8860B 50%, #CD853F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Instantly
                </span>
              </h1>
              
              <p className="text-lg text-[#A89070] mb-8 max-w-lg leading-relaxed">
                Advanced sonar signal analysis using machine learning to distinguish underwater mines from rocks with high accuracy.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/predict">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl text-[#1a1510] font-bold text-lg transition-all"
                    style={{ 
                      background: "linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)",
                      boxShadow: "0 8px 30px rgba(255,215,0,0.4)"
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <LanternIcon className="w-6 h-6" />
                      Launch Detector
                    </span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl border-2 border-[#8B7355]/50 text-[#FFE4B5] font-semibold hover:bg-[#8B7355]/20 hover:border-[#FFD700]/50 transition-all"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
                  filter: "blur(20px)"
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <RadarDisplay />
              
              <motion.div
                className="absolute -top-6 -right-6"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GoldNuggetIcon className="w-16 h-16 text-[#FFD700]" style={{ filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))" }} />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-6"
                animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <PickaxeIcon className="w-14 h-14 text-[#8B7355]" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              <span style={{ 
                background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Powerful</span>
              <span className="text-[#FFE4B5]"> Features</span>
            </h2>
            <p className="text-[#A89070] max-w-2xl mx-auto">
              State-of-the-art technology for underwater object classification
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              delay={0.1}
              icon={<GoldNuggetIcon className="w-7 h-7 text-[#FFD700]" />}
              title="Mine Detection"
              description="Identify underwater mines with precision using 60-feature sonar signal analysis"
            />
            <FeatureCard
              delay={0.2}
              icon={
                <svg className="w-7 h-7 text-[#CD853F]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M30 70 L15 50 L25 25 L50 15 L75 25 L85 50 L70 70 L50 80 Z" />
                </svg>
              }
              title="Rock Classification"
              description="Distinguish harmless rocks from dangerous mines with high confidence"
            />
            <FeatureCard
              delay={0.3}
              icon={<LanternIcon className="w-7 h-7 text-[#FFD700]" />}
              title="Instant Results"
              description="Get real-time predictions with confidence scores in milliseconds"
            />
            <FeatureCard
              delay={0.4}
              icon={
                <svg className="w-7 h-7 text-[#DAA520]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Signal Visualization"
              description="Beautiful charts displaying all 60 frequency bands of sonar data"
            />
            <FeatureCard
              delay={0.5}
              icon={<PickaxeIcon className="w-7 h-7 text-[#B8860B]" />}
              title="ML Powered"
              description="Trained on real sonar dataset with logistic regression algorithm"
            />
            <FeatureCard
              delay={0.6}
              icon={<MineCartIcon className="w-7 h-7 text-[#8B7355]" />}
              title="Sample Data"
              description="Test with real sonar samples from the built-in dataset"
            />
          </div>
        </section>

        <section className="py-24 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden border border-[#8B7355]/30"
            style={{
              background: "linear-gradient(135deg, rgba(90,70,50,0.5) 0%, rgba(40,30,20,0.7) 100%)",
              backdropFilter: "blur(10px)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-[#8B7355]/10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/50 to-transparent" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <LanternIcon className="w-16 h-16 text-[#FFD700] mx-auto mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))" }} />
              </motion.div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                <span className="text-[#FFE4B5]">Ready to </span>
                <span style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>Detect</span>
                <span className="text-[#FFE4B5]">?</span>
              </h2>
              <p className="text-[#A89070] mb-8 max-w-xl mx-auto">
                Enter your sonar data or use our sample dataset to see the AI in action
              </p>
              
              <Link href="/predict">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-xl text-[#1a1510] font-bold text-lg transition-all"
                  style={{ 
                    background: "linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)",
                    boxShadow: "0 8px 40px rgba(255,215,0,0.5)"
                  }}
                >
                  Start Detection Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#8B7355]/30 py-8 px-6 lg:px-12 mb-32" style={{ background: "rgba(26,21,16,0.8)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PickaxeIcon className="w-6 h-6 text-[#FFD700]" />
            <span className="font-semibold text-[#FFE4B5]" style={{ fontFamily: "'Cinzel', serif" }}>MineSense</span>
          </div>
          <p className="text-sm text-[#8B7355]">
            Sonar-based Mine vs Rock Classification System
          </p>
        </div>
      </footer>
    </div>
  );
}
