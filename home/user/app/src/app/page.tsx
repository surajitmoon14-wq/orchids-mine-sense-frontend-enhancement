"use client";

import { useState, useEffect } from "react";
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

function FloatingParticle({ delay, duration, left }: { delay: number; duration: number; left: string }) {
  const isRock = Math.random() > 0.5;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left }}
      initial={{ y: "100vh", opacity: 0, rotate: 0 }}
      animate={{ y: "-100vh", opacity: [0, 1, 1, 0], rotate: 360 }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {isRock ? (
        <RockIcon className="w-8 h-8 text-[#4fc3f7]/20" />
      ) : (
        <MineIcon className="w-8 h-8 text-[#ff3d3d]/20" />
      )}
    </motion.div>
  );
}

function SonarRing({ delay, size }: { delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-[#ff6b35]/30"
      style={{ width: size, height: size }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

function RadarDisplay() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className="absolute w-full h-full rounded-full border border-[#ff6b35]/20" />
      <div className="absolute w-3/4 h-3/4 rounded-full border border-[#ff6b35]/15" />
      <div className="absolute w-1/2 h-1/2 rounded-full border border-[#ff6b35]/10" />
      <div className="absolute w-1/4 h-1/4 rounded-full border border-[#ff6b35]/5" />
      
      <motion.div
        className="absolute w-full h-0.5 origin-center"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #ff6b35 50%, transparent 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute w-3 h-3 bg-[#ff3d3d] rounded-full"
        style={{ top: "30%", left: "60%" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-2 h-2 bg-[#4fc3f7] rounded-full"
        style={{ top: "60%", left: "25%" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute w-2.5 h-2.5 bg-[#ff3d3d] rounded-full"
        style={{ top: "45%", left: "70%" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
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
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-effect rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center mb-4 group-hover:bg-[#ff6b35]/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-semibold font-orbitron mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 1.5,
    duration: 15 + Math.random() * 10,
    left: `${(i * 8) + Math.random() * 5}%`,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden relative">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 noise-overlay" />
      
      {mounted && particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-50" />

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <MineIcon className="w-10 h-10 text-[#ff6b35]" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#ff6b35] rounded-full" />
            </motion.div>
          </div>
          <span className="text-2xl font-bold font-orbitron text-gradient">MineSense</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/predict"
            className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-black font-semibold font-orbitron text-sm hover:bg-[#ff8555] transition-all hover:shadow-lg hover:shadow-[#ff6b35]/30"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-6">
                <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#ff6b35]">AI-Powered Detection</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold font-orbitron leading-tight mb-6">
                <span className="text-white">Detect </span>
                <span className="text-[#ff3d3d]">Mines</span>
                <br />
                <span className="text-white">& </span>
                <span className="text-[#4fc3f7]">Rocks</span>
                <br />
                <span className="text-gradient">Instantly</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Advanced sonar signal analysis using machine learning to distinguish underwater mines from rocks with high accuracy.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/predict">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8555] text-black font-bold font-orbitron text-lg shadow-lg shadow-[#ff6b35]/30 hover:shadow-xl hover:shadow-[#ff6b35]/40 transition-all"
                  >
                    Launch Detector
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl border-2 border-[#ff6b35]/30 text-white font-semibold font-orbitron hover:bg-[#ff6b35]/10 transition-all"
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
              <RadarDisplay />
              
              {[0, 1, 2].map((i) => (
                <SonarRing key={i} delay={i * 1} size={256} />
              ))}
              
              <motion.div
                className="absolute -top-8 -right-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MineIcon className="w-16 h-16 text-[#ff3d3d] animate-mine-pulse" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-8"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <RockIcon className="w-14 h-14 text-[#4fc3f7] animate-rock-wobble" />
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
            <h2 className="text-4xl font-bold font-orbitron mb-4">
              <span className="text-gradient">Powerful</span> Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art technology for underwater object classification
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              delay={0.1}
              icon={<MineIcon className="w-7 h-7 text-[#ff6b35]" />}
              title="Mine Detection"
              description="Identify underwater mines with precision using 60-feature sonar signal analysis"
            />
            <FeatureCard
              delay={0.2}
              icon={<RockIcon className="w-7 h-7 text-[#4fc3f7]" />}
              title="Rock Classification"
              description="Distinguish harmless rocks from dangerous mines with high confidence"
            />
            <FeatureCard
              delay={0.3}
              icon={
                <svg className="w-7 h-7 text-[#ffd700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Instant Results"
              description="Get real-time predictions with confidence scores in milliseconds"
            />
            <FeatureCard
              delay={0.4}
              icon={
                <svg className="w-7 h-7 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Signal Visualization"
              description="Beautiful charts displaying all 60 frequency bands of sonar data"
            />
            <FeatureCard
              delay={0.5}
              icon={
                <svg className="w-7 h-7 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              title="ML Powered"
              description="Trained on real sonar dataset with logistic regression algorithm"
            />
            <FeatureCard
              delay={0.6}
              icon={
                <svg className="w-7 h-7 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              }
              title="Sample Data"
              description="Test with real sonar samples from the built-in dataset"
            />
          </div>
        </section>

        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-effect rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/10 via-transparent to-[#4fc3f7]/10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold font-orbitron mb-4">
                Ready to <span className="text-[#ff6b35]">Detect</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Enter your sonar data or use our sample dataset to see the AI in action
              </p>
              
              <Link href="/predict">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8555] text-black font-bold font-orbitron text-lg shadow-xl shadow-[#ff6b35]/30 hover:shadow-2xl hover:shadow-[#ff6b35]/40 transition-all"
                >
                  Start Detection Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#2a2a3a] py-8 px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MineIcon className="w-6 h-6 text-[#ff6b35]" />
            <span className="font-orbitron font-semibold">MineSense</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sonar-based Mine vs Rock Classification System
          </p>
        </div>
      </footer>
    </div>
  );
}
