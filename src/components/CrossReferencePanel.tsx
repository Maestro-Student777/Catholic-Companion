import React, { useState, useEffect } from 'react';
import { 
  Cross, Book, Scroll, Shield, ExternalLink, Bookmark, Check, 
  MessageSquare, Loader2, Sparkles, Filter, RefreshCw, X, ArrowRight,
  BookOpen, Landmark, ChevronRight, Layers, FileText
} from 'lucide-react';
import { CrossReference, CrossReferenceAnalysis, CrossReferenceType, Note, Snapshot } from '../types';
import { analyzeCrossReferences } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface CrossReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: Snapshot | null;
  onLoadInReader: (url: string) => void;
  onAddNote: (note: Note) => void;
  onAskCompanion?: (query: string) => void;
}

const TYPE_CONFIG: Record<CrossReferenceType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badgeBg: string }> = {
  scripture: { 
    label: 'Sacred Scripture', 
    icon: BookOpen, 
    color: 'text-amber-700', 
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800' 
  },
  catechism: { 
    label: 'Catechism (CCC)', 
    icon: Shield, 
    color: 'text-blue-700', 
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-800' 
  },
  encyclical: { 
    label: 'Papal Encyclical', 
    icon: Landmark, 
    color: 'text-purple-700', 
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-800' 
  },
  patristic: { 
    label: 'Church Fathers / Doctors', 
    icon: Scroll, 
    color: 'text-emerald-700', 
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800' 
  },
  canon_law: { 
    label: 'Canon Law (CIC)', 
    icon: Book, 
    color: 'text-slate-700', 
    badgeBg: 'bg-slate-50 border-slate-200 text-slate-800' 
  },
  council: { 
    label: 'Ecumenical Council', 
    icon: Layers, 
    color: 'text-rose-700', 
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-800' 
  }
};

export default function CrossReferencePanel({
  isOpen,
  onClose,
  snapshot,
  onLoadInReader,
  onAddNote,
  onAskCompanion
}: CrossReferencePanelProps) {
  const [analysis, setAnalysis] = useState<CrossReferenceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CrossReferenceType | 'all'>('all');
  const [savedNotes, setSavedNotes] = useState<Set<string>>(new Set());

  // Auto-analyze when snapshot updates or panel opens with a snapshot
  useEffect(() => {
    if (snapshot && (!analysis || analysis.snapshotSummary === '')) {
      handleAnalyze();
    }
  }, [snapshot?.timestamp]);

  const handleAnalyze = async () => {
    if (!snapshot?.text) return;
    setLoading(true);
    try {
      const result = await analyzeCrossReferences(snapshot.text, snapshot.url);
      setAnalysis(result);
    } catch (err) {
      console.error("Cross-reference analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReferences = (analysis?.crossReferences || []).filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleSaveToNote = (item: CrossReference) => {
    const noteContent = `**Title:** ${item.title} (${item.citation})
**Source / Author:** ${item.authorOrSource} ${item.yearOrEra ? `• ${item.yearOrEra}` : ''}
**Theological Summary:** ${item.summary}
**Connection to Snapshot:** ${item.connectionToSnapshot}
${item.directQuote ? `**Key Quote:** "${item.directQuote}"` : ''}
${item.url ? `**Official Source Link:** ${item.url}` : ''}
${snapshot?.url ? `**Original Snapshot Source:** ${snapshot.url}` : ''}`;

    onAddNote({
      id: `note-crossref-${Date.now()}`,
      title: `Cross-Ref: ${item.citation || item.title}`,
      content: noteContent,
      timestamp: Date.now(),
      category: 'cross_reference',
      sourceUrl: item.url || snapshot?.url
    });

    setSavedNotes(prev => new Set(prev).add(item.id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-5xl max-h-[92vh] bg-paper border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Scroll className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">Magisterial Cross-Referencing Tool</h2>
                    <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 uppercase tracking-widest">
                      Scripture & Tradition
                    </span>
                  </div>
                  <p className="text-xs text-ink/60 font-serif italic">
                    Mapping snapshot concepts to Sacred Scripture, the Catechism, Papal Encyclicals, and Church Fathers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {snapshot && (
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all text-xs font-display font-bold shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Re-Analyze</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gold/10 rounded-full transition-colors text-ink/60 hover:text-gold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subheader: Snapshot Status & Epistemic Demarcation */}
            <div className="px-6 py-4 border-b border-gold/10 bg-white/50 space-y-3 shrink-0">
              {snapshot ? (
                <div>
                  {/* Two Epistemic Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Left Pillar: Snapshot Evidence */}
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-900 font-display font-bold tracking-wider text-[10px] uppercase">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>1. What the Snapshot Says (Given Text)</span>
                      </div>
                      <p className="font-serif text-ink/80 text-xs leading-relaxed italic">
                        {analysis?.snapshotSummary || "Analyzing the working document snapshot..."}
                      </p>
                      <div className="text-[10px] text-amber-800/70 truncate">
                        Source: <span className="font-mono">{snapshot.url}</span>
                      </div>
                    </div>

                    {/* Right Pillar: Tradition & Magisterium Cross-References */}
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/70 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-purple-900 font-display font-bold tracking-wider text-[10px] uppercase">
                        <Shield className="w-3.5 h-3.5 text-purple-700" />
                        <span>2. Cross-Referenced Tradition (Added Context)</span>
                      </div>
                      <p className="font-serif text-ink/80 text-xs leading-relaxed">
                        Identified Themes: {analysis?.identifiedThemes?.length ? (
                          <span className="font-semibold text-purple-950">
                            {analysis.identifiedThemes.join(' • ')}
                          </span>
                        ) : 'Scripture, Catechism, Patristics'}
                      </p>
                      <div className="text-[10px] text-purple-800/70">
                        Total Cross-References: <span className="font-bold">{analysis?.crossReferences?.length || 0} citations</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block font-display">No Snapshot Active Yet</span>
                    <p className="font-serif text-xs">Load a Catholic page on the left pane and press "Snapshot" or highlight text to cross-reference with Church Tradition.</p>
                  </div>
                </div>
              )}

              {/* Filter Pills */}
              {snapshot && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs">
                  <span className="text-[10px] font-display font-bold uppercase text-ink/40 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-display font-semibold transition-all ${
                      activeFilter === 'all'
                        ? 'bg-gold text-white shadow-xs'
                        : 'bg-white/70 text-ink/70 border border-gold/15 hover:bg-gold/10'
                    }`}
                  >
                    All Types ({analysis?.crossReferences?.length || 0})
                  </button>

                  {(Object.keys(TYPE_CONFIG) as CrossReferenceType[]).map((type) => {
                    const count = (analysis?.crossReferences || []).filter(c => c.type === type).length;
                    const config = TYPE_CONFIG[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-display font-semibold transition-all flex items-center gap-1.5 ${
                          activeFilter === type
                            ? 'bg-gold text-white shadow-xs'
                            : 'bg-white/70 text-ink/70 border border-gold/15 hover:bg-gold/10'
                        }`}
                      >
                        <span>{config.label}</span>
                        {count > 0 && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${activeFilter === type ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold font-bold'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cross-Reference Cards Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-paper/30">
              {loading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold animate-spin">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-ink">Searching Sacred Scripture & Tradition</h3>
                    <p className="text-xs text-ink/60 font-serif italic max-w-sm">
                      Identifying Catechism paragraphs, Papal Encyclicals, Patristic Fathers, and Conciliar decrees...
                    </p>
                  </div>
                </div>
              )}

              {!loading && !snapshot && (
                <div className="py-16 text-center space-y-3 opacity-60">
                  <Scroll className="w-12 h-12 text-gold/40 mx-auto" />
                  <p className="font-serif text-lg italic text-ink">Take a snapshot on the left to activate cross-referencing.</p>
                </div>
              )}

              {!loading && snapshot && filteredReferences.length === 0 && (
                <div className="py-12 text-center space-y-3 opacity-70">
                  <Book className="w-10 h-10 text-gold/40 mx-auto" />
                  <p className="font-serif text-base text-ink">No cross-references found for this filter category.</p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="px-3 py-1.5 bg-gold text-white rounded-lg text-xs font-display font-bold"
                  >
                    View All Cross-References
                  </button>
                </div>
              )}

              {!loading && snapshot && filteredReferences.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {filteredReferences.map((ref) => {
                    const isSaved = savedNotes.has(ref.id);
                    const config = TYPE_CONFIG[ref.type] || TYPE_CONFIG.catechism;
                    const IconComponent = config.icon;

                    return (
                      <motion.div
                        key={ref.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gold/20 rounded-xl p-5 shadow-xs hover:border-gold/40 transition-all space-y-3.5"
                      >
                        {/* Top Bar */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 uppercase tracking-wider ${config.badgeBg}`}>
                                <IconComponent className="w-3 h-3" />
                                {config.label}
                              </span>
                              <span className="font-mono text-xs font-bold text-gold px-2 py-0.5 rounded bg-gold/5 border border-gold/15">
                                {ref.citation}
                              </span>
                              {ref.yearOrEra && (
                                <span className="text-[10px] text-ink/40 font-display font-medium">
                                  {ref.yearOrEra}
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif text-lg font-bold text-ink">
                              {ref.title}
                            </h3>
                            <p className="text-xs text-ink/60 font-serif italic">
                              Author/Source: <span className="font-semibold text-ink/80">{ref.authorOrSource}</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {ref.url && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onLoadInReader(ref.url!);
                                }}
                                title="Open this source in the Left Reader pane"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper border border-gold/20 text-gold hover:bg-gold hover:text-white text-xs font-display font-bold transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Load in Reader</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleSaveToNote(ref)}
                              title="Save cross-reference to Session Notes"
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                                isSaved
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-paper text-gold border border-gold/20 hover:bg-gold hover:text-white'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span>Save Note</span>
                                </>
                              )}
                            </button>

                            {onAskCompanion && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onAskCompanion(`In light of our snapshot, please unpack the connection to ${ref.citation} (${ref.title}) by ${ref.authorOrSource}.`);
                                }}
                                title="Ask AI Companion about this specific reference"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper text-ink/70 border border-gold/20 hover:bg-gold/10 hover:text-gold text-xs font-display font-bold transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Discuss</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="p-3 rounded-lg bg-paper/50 border border-gold/10 space-y-1">
                          <span className="font-display font-bold text-[10px] text-gold uppercase tracking-wider block">
                            Magisterial / Scriptural Teaching:
                          </span>
                          <p className="font-serif text-sm text-ink leading-relaxed">
                            {ref.summary}
                          </p>
                        </div>

                        {/* Direct Quote if available */}
                        {ref.directQuote && (
                          <div className="p-3 rounded-lg bg-gold/5 border-l-2 border-gold font-serif italic text-xs text-ink/80 leading-relaxed">
                            "{ref.directQuote}"
                          </div>
                        )}

                        {/* Connection to Snapshot Box */}
                        <div className="p-3 rounded-lg bg-white border border-purple-200/80 shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-purple-900 font-display font-bold text-[10px] uppercase tracking-wider">
                            <ArrowRight className="w-3 h-3 text-purple-600" />
                            <span>Connection to Snapshot Passage:</span>
                          </div>
                          <p className="font-serif text-xs text-ink/80 leading-relaxed">
                            {ref.connectionToSnapshot}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gold/20 bg-white/70 flex items-center justify-between text-xs text-ink/50 font-display">
              <span>{filteredReferences.length} authoritative references grounded in Tradition</span>
              <span className="italic font-serif">Depositum Fidei</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
