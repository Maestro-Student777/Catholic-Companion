import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Sparkles, X, Plus, Check, ExternalLink, Bookmark, MessageSquare, Tag, ShieldCheck } from 'lucide-react';
import { GlossaryEntry, GlossaryCategory, Note } from '../types';
import { CURATED_CATHOLIC_GLOSSARY } from '../data/catholicGlossary';
import { lookupGlossaryTerm } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  onAddNote: (note: Note) => void;
  onAskCompanion?: (query: string) => void;
}

const CATEGORY_LABELS: Record<GlossaryCategory | 'all', string> = {
  all: 'All Categories',
  dogma: 'Dogma & Creed',
  sacraments: 'Sacraments',
  liturgy: 'Liturgy & Prayer',
  latin_phrases: 'Latin Phrases',
  patristics: 'Patristic & Fathers',
  canon_law: 'Canon Law',
  scripture: 'Scripture & Typology',
  moral: 'Moral Theology',
  general: 'General'
};

export default function GlossaryModal({
  isOpen,
  onClose,
  initialTerm = '',
  onAddNote,
  onAskCompanion
}: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [customEntries, setCustomEntries] = useState<GlossaryEntry[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Set<string>>(new Set());

  // Update search when initialTerm changes
  React.useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
      // Auto-trigger AI lookup if not found in curated
      const foundInCurated = CURATED_CATHOLIC_GLOSSARY.some(
        e => e.term.toLowerCase() === initialTerm.toLowerCase() || e.id === initialTerm.toLowerCase()
      );
      if (!foundInCurated) {
        handleLookupAI(initialTerm);
      }
    }
  }, [initialTerm]);

  // Combine curated + custom AI entries
  const allEntries = useMemo(() => {
    const combined = [...customEntries, ...CURATED_CATHOLIC_GLOSSARY];
    return combined.filter((entry, index, self) => 
      index === self.findIndex(e => e.term.toLowerCase() === entry.term.toLowerCase())
    );
  }, [customEntries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        entry.term.toLowerCase().includes(query) ||
        (entry.latinOrGreek && entry.latinOrGreek.toLowerCase().includes(query)) ||
        entry.definition.toLowerCase().includes(query) ||
        (entry.catechismRef && entry.catechismRef.toLowerCase().includes(query));
      
      return matchesCategory && matchesSearch;
    });
  }, [allEntries, activeCategory, searchTerm]);

  const handleLookupAI = async (termToLookup?: string) => {
    const term = (termToLookup || searchTerm).trim();
    if (!term) return;

    setLoadingAI(true);
    try {
      const entry = await lookupGlossaryTerm(term);
      setCustomEntries(prev => [entry, ...prev]);
    } catch (err) {
      console.error("AI Lookup failed:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveToNote = (entry: GlossaryEntry) => {
    const noteContent = `**Term:** ${entry.term} ${entry.latinOrGreek ? `(${entry.latinOrGreek})` : ''}
**Category:** ${CATEGORY_LABELS[entry.category] || entry.category}
**Definition:** ${entry.definition}
${entry.catechismRef ? `**Magisterial Reference:** ${entry.catechismRef}` : ''}
${entry.scriptureOrPatristicRef ? `**Tradition & Fathers:** ${entry.scriptureOrPatristicRef}` : ''}
${entry.theologicalContext ? `**Theological Context:** ${entry.theologicalContext}` : ''}`;

    onAddNote({
      id: `note-glossary-${Date.now()}`,
      title: `Glossary: ${entry.term}`,
      content: noteContent,
      timestamp: Date.now(),
      category: 'glossary'
    });

    setSavedNotes(prev => new Set(prev).add(entry.id));
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
            className="relative w-full max-w-4xl max-h-[90vh] bg-paper border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">Theological Glossary & Lexicon</h2>
                    <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 uppercase tracking-widest">
                      Magisterial
                    </span>
                  </div>
                  <p className="text-xs text-ink/60 font-serif italic">
                    Accurate definitions of Catholic terminology, Latin phrasing, and doctrinal concepts.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gold/10 rounded-full transition-colors text-ink/60 hover:text-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Action Bar */}
            <div className="p-6 pb-3 border-b border-gold/10 bg-white/40 space-y-4 shrink-0">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookupAI()}
                    placeholder="Search or type any Catholic term, Latin phrase, dogma (e.g. Transubstantiation, Filioque, Theotokos)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/30 font-serif text-sm text-ink placeholder:text-ink/40 shadow-xs"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleLookupAI()}
                  disabled={loadingAI || !searchTerm.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl text-xs font-display font-bold hover:bg-gold-dark transition-all disabled:opacity-50 shadow-sm shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  {loadingAI ? 'Consulting Tradition...' : 'Define with AI'}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {(Object.keys(CATEGORY_LABELS) as (GlossaryCategory | 'all')[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-display font-semibold transition-all ${
                      activeCategory === cat
                        ? 'bg-gold text-white shadow-xs'
                        : 'bg-white/60 text-ink/70 border border-gold/15 hover:bg-gold/10 hover:text-gold'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-paper/30">
              {loadingAI && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white border border-gold/30 rounded-xl shadow-sm flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-ink">Formulating Theological Definition for "{searchTerm}"</h4>
                    <p className="text-xs text-ink/60 font-serif italic">Synthesizing Catechism, Councils, and Patristic sources...</p>
                  </div>
                </motion.div>
              )}

              {filteredEntries.length === 0 && !loadingAI ? (
                <div className="text-center py-12 space-y-4 opacity-70">
                  <BookOpen className="w-12 h-12 text-gold/40 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-serif text-lg text-ink font-semibold">No direct match found for "{searchTerm}"</p>
                    <p className="text-xs text-ink/60 max-w-md mx-auto">
                      Click the <strong>"Define with AI"</strong> button above to have your research companion formulate an authentic, reverent theological definition for this term.
                    </p>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => handleLookupAI()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg text-xs font-display font-bold hover:bg-gold-dark transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Define "{searchTerm}" Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEntries.map((entry) => {
                    const isSaved = savedNotes.has(entry.id);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gold/20 rounded-xl p-5 shadow-xs hover:border-gold/40 transition-all space-y-3"
                      >
                        {/* Term Title & Badges */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif text-xl font-bold text-ink">{entry.term}</h3>
                              <span className="text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 uppercase tracking-wider">
                                {CATEGORY_LABELS[entry.category] || entry.category}
                              </span>
                              {entry.source === 'ai' && (
                                <span className="text-[9px] font-display font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> AI Synthesized
                                </span>
                              )}
                            </div>
                            {entry.latinOrGreek && (
                              <p className="font-serif text-xs text-gold-dark font-medium italic mt-0.5">
                                {entry.latinOrGreek}
                              </p>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleSaveToNote(entry)}
                              title="Save definition to Session Notes"
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
                                  onAskCompanion(`Please explain the theological and historical significance of "${entry.term}" in relation to our study.`);
                                }}
                                title="Discuss term with AI Companion"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper text-ink/70 border border-gold/20 hover:bg-gold/10 hover:text-gold text-xs font-display font-bold transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Discuss</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Definition Text */}
                        <p className="font-serif text-sm text-ink leading-relaxed">
                          {entry.definition}
                        </p>

                        {/* Citations and Context */}
                        <div className="pt-2 border-t border-gold/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {entry.catechismRef && (
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-paper/60 border border-gold/10">
                              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                              <div>
                                <span className="font-display font-bold text-[10px] text-gold uppercase tracking-wider block">
                                  Catechism / Magisterium
                                </span>
                                <span className="font-serif text-ink/80 text-xs">{entry.catechismRef}</span>
                              </div>
                            </div>
                          )}

                          {entry.scriptureOrPatristicRef && (
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-paper/60 border border-gold/10">
                              <Tag className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                              <div>
                                <span className="font-display font-bold text-[10px] text-gold uppercase tracking-wider block">
                                  Scripture & Church Fathers
                                </span>
                                <span className="font-serif text-ink/80 text-xs">{entry.scriptureOrPatristicRef}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {entry.theologicalContext && (
                          <div className="p-2.5 rounded-lg bg-gold/5 border border-gold/15 text-xs font-serif text-ink/75 italic">
                            <span className="font-display not-italic font-bold text-[10px] text-gold uppercase tracking-wider block mb-0.5">
                              Theological & Spiritual Horizon
                            </span>
                            {entry.theologicalContext}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gold/20 bg-white/60 flex items-center justify-between text-xs text-ink/50 font-display">
              <span>{filteredEntries.length} Catholic terms available</span>
              <span className="italic font-serif">In fide et veritate</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
