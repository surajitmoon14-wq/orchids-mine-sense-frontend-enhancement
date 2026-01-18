"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    </svg>
  );
}

function RockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 10 L75 25 L85 50 L75 75 L50 90 L25 75 L15 50 L25 25 Z" />
      <path d="M50 20 L65 30 L72 50 L65 70 L50 80 L35 70 L28 50 L35 30 Z" fill="#1a1a25" opacity="0.5" />
    </svg>
  );
}

interface DatasetItem {
  id: number;
  features: number[];
  label: string;
}

interface DatasetResponse {
  items: DatasetItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    total: number;
    rocks: number;
    mines: number;
  };
}

function MiniChart({ features, label }: { features: number[]; label: string }) {
  const maxValue = Math.max(...features, 0.001);
  const color = label === "M" ? "#ff3d3d" : "#4fc3f7";
  
  return (
    <div className="h-12 flex items-end justify-center gap-px">
      {features.slice(0, 30).map((value, index) => (
        <div
          key={index}
          className="w-1 rounded-t-sm transition-all"
          style={{ 
            height: `${(value / maxValue) * 100}%`,
            backgroundColor: color,
            opacity: 0.7
          }}
        />
      ))}
    </div>
  );
}

export default function DatasetPage() {
  const router = useRouter();
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "rock" | "mine">("all");
  const [selectedItem, setSelectedItem] = useState<DatasetItem | null>(null);

  useEffect(() => {
    fetchData();
  }, [page, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dataset?page=${page}&limit=12&filter=${filter}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  const useSampleForPrediction = (item: DatasetItem) => {
    const featuresStr = item.features.map(f => f.toFixed(4)).join(",");
    sessionStorage.setItem("sonarData", featuresStr);
    sessionStorage.setItem("actualLabel", item.label === "R" ? "Rock" : "Mine");
    router.push("/predict");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 noise-overlay" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-50" />

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <MineIcon className="w-10 h-10 text-[#ff6b35]" />
          <span className="text-2xl font-bold font-orbitron text-gradient">MineSense</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            href="/predict"
            className="px-4 py-2 rounded-lg border border-[#2a2a3a] text-sm font-medium hover:bg-[#2a2a3a] transition-colors"
          >
            Detector
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-[#2a2a3a] text-sm font-medium hover:bg-[#2a2a3a] transition-colors"
          >
            Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 lg:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-orbitron mb-4">
              <span className="text-gradient">Sonar</span> Dataset
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore the 208 sonar samples used to train the mine detection model
            </p>
          </div>

          {data && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold font-orbitron text-[#ff6b35]">{data.stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Samples</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold font-orbitron text-[#4fc3f7]">{data.stats.rocks}</div>
                <div className="text-sm text-muted-foreground">Rock Samples</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold font-orbitron text-[#ff3d3d]">{data.stats.mines}</div>
                <div className="text-sm text-muted-foreground">Mine Samples</div>
              </motion.div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(["all", "rock", "mine"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? f === "mine" 
                        ? "bg-[#ff3d3d] text-white"
                        : f === "rock"
                        ? "bg-[#4fc3f7] text-black"
                        : "bg-[#ff6b35] text-black"
                      : "bg-[#2a2a3a] text-white hover:bg-[#3a3a4a]"
                  }`}
                >
                  {f === "all" ? "All" : f === "rock" ? "Rocks" : "Mines"}
                </button>
              ))}
            </div>
            
            {data && (
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, data.pagination.totalItems)} of {data.pagination.totalItems}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#ff6b35]/30 border-t-[#ff6b35] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="wait">
                  {data?.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-effect rounded-xl p-4 cursor-pointer hover:border-[#ff6b35]/50 transition-all group"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-mono text-muted-foreground">#{item.id}</span>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          item.label === "M" 
                            ? "bg-[#ff3d3d]/20 text-[#ff3d3d]" 
                            : "bg-[#4fc3f7]/20 text-[#4fc3f7]"
                        }`}>
                          {item.label === "M" ? "MINE" : "ROCK"}
                        </div>
                      </div>
                      
                      <MiniChart features={item.features} label={item.label} />
                      
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">60 features</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); useSampleForPrediction(item); }}
                          className="px-3 py-1 rounded bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff6b35]/20"
                        >
                          Use for Prediction
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {data && data.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-[#2a2a3a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a4a] transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (data.pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= data.pagination.totalPages - 2) {
                        pageNum = data.pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            page === pageNum
                              ? "bg-[#ff6b35] text-black"
                              : "bg-[#2a2a3a] hover:bg-[#3a3a4a]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPage(Math.min(data.pagination.totalPages, page + 1))}
                    disabled={page === data.pagination.totalPages}
                    className="px-4 py-2 rounded-lg bg-[#2a2a3a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a4a] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {selectedItem.label === "M" ? (
                    <MineIcon className="w-12 h-12 text-[#ff3d3d]" />
                  ) : (
                    <RockIcon className="w-12 h-12 text-[#4fc3f7]" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold font-orbitron">
                      Sample #{selectedItem.id}
                    </h2>
                    <div className={`text-sm font-medium ${
                      selectedItem.label === "M" ? "text-[#ff3d3d]" : "text-[#4fc3f7]"
                    }`}>
                      {selectedItem.label === "M" ? "MINE" : "ROCK"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-lg hover:bg-[#2a2a3a] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-[#0a0a0f] rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Signal Visualization</h3>
                <div className="h-32 flex items-end justify-between gap-0.5">
                  {selectedItem.features.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm transition-all hover:opacity-100"
                      style={{ 
                        height: `${(value / Math.max(...selectedItem.features)) * 100}%`,
                        backgroundColor: selectedItem.label === "M" ? "#ff3d3d" : "#4fc3f7",
                        opacity: 0.8,
                        minWidth: "2px"
                      }}
                      title={`Band ${index + 1}: ${value.toFixed(4)}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Feature Values (60 bands)</h3>
                <div className="bg-[#0a0a0f] rounded-xl p-4 font-mono text-xs break-all max-h-40 overflow-y-auto">
                  {selectedItem.features.map((f, i) => f.toFixed(4)).join(", ")}
                </div>
              </div>

              <button
                onClick={() => useSampleForPrediction(selectedItem)}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8555] text-black font-bold font-orbitron"
              >
                Use This Sample for Prediction
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
