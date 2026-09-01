import React, { useState } from 'react';
import Reader from './components/Reader';
import Companion from './components/Companion';
import NotesPanel from './components/NotesPanel';
import GlossaryModal from './components/GlossaryModal';
import CrossReferencePanel from './components/CrossReferencePanel';
import { Snapshot, Note } from './types';
import { Cross, Book, StickyNote, BookOpen, Scroll, Sparkles } from 'lucide-react';

export default function App() {
  const [lastSnapshot, setLastSnapshot] = useState<Snapshot | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryInitialTerm, setGlossaryInitialTerm] = useState('');
  const [isCrossReferenceOpen, setIsCrossReferenceOpen] = useState(false);
  const [activeReaderUrl, setActiveReaderUrl] = useState<string | null>(null);

  const handleSnapshot = (snapshot: Snapshot) => {
    setLastSnapshot(snapshot);
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const openGlossary = (term = '') => {
    setGlossaryInitialTerm(term);
    setIsGlossaryOpen(true);
  };

  const openCrossReference = (customSnapshot?: Snapshot) => {
    if (customSnapshot) {
      setLastSnapshot(customSnapshot);
    }
    setIsCrossReferenceOpen(true);
  };

  const handleLoadInReader = (url: string) => {
    setActiveReaderUrl(url);
  };

  return (
    <div className="flex flex-col h-screen bg-paper overflow-hidden select-none">
      {/* Global Catholic Academic Header */}
      <header className="h-14 border-b border-gold/20 bg-white/80 backdrop-blur-md flex items-center justify-between px-5 shrink-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white shadow-xs">
            <Cross className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-ink">Catholic Research Companion</h1>
            <p className="text-[9px] font-display font-bold text-gold/80 uppercase tracking-[0.2em] -mt-1">
              Ad Majorem Dei Gloriam
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {/* Theological Glossary Button */}
          <button
            onClick={() => openGlossary()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper border border-gold/25 text-gold hover:bg-gold hover:text-white transition-all text-xs font-display font-bold shadow-2xs"
            title="Theological Glossary & Latin Lexicon"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theological Glossary</span>
            <span className="sm:hidden">Glossary</span>
          </button>

          {/* Magisterial Cross-Referencing Tool */}
          <button
            onClick={() => openCrossReference()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-display font-bold transition-all shadow-2xs ${
              lastSnapshot 
                ? 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-700 hover:text-white' 
                : 'bg-paper border-gold/20 text-gold/70 hover:bg-gold/10'
            }`}
            title="Cross-Reference Snapshot with Scripture, Catechism, & Patristics"
          >
            <Scroll className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cross-References</span>
            <span className="sm:hidden">Cross-Ref</span>
            {lastSnapshot && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse hidden sm:inline-block" />
            )}
          </button>

          {/* Session Notes Button */}
          <button 
            onClick={() => setIsNotesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper border border-gold/25 text-gold hover:bg-gold hover:text-white transition-all text-xs font-display font-bold shadow-2xs"
            title="View Cumulative Research Notes"
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>Notes</span>
            {notes.length > 0 && (
              <span className="px-1.5 py-0.2 bg-gold text-white rounded-full text-[10px] font-bold">
                {notes.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Split Screen Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Live Reader / Document Pane */}
        <div className="w-1/2 h-full overflow-hidden">
          <Reader 
            onSnapshot={handleSnapshot}
            externalUrl={activeReaderUrl}
            onOpenGlossary={openGlossary}
            onOpenCrossReference={openCrossReference}
          />
        </div>

        {/* Right Side: AI Catholic Companion Pane */}
        <div className="w-1/2 h-full overflow-hidden">
          <Companion 
            snapshot={lastSnapshot} 
            onAddNote={addNote} 
            onShowNotes={() => setIsNotesOpen(true)}
            onOpenGlossary={openGlossary}
            onOpenCrossReference={openCrossReference}
          />
        </div>
      </main>

      {/* Theological Glossary & Latin Lexicon Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialTerm={glossaryInitialTerm}
        onAddNote={addNote}
        onAskCompanion={(query) => {
          // Send to companion
        }}
      />

      {/* Magisterial Cross-Referencing Exploration Panel */}
      <CrossReferencePanel
        isOpen={isCrossReferenceOpen}
        onClose={() => setIsCrossReferenceOpen(false)}
        snapshot={lastSnapshot}
        onLoadInReader={handleLoadInReader}
        onAddNote={addNote}
      />

      {/* Session Notes Side Drawer */}
      <NotesPanel 
        notes={notes} 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)}
        onDeleteNote={deleteNote}
        onAddManualNote={addNote}
      />

      {/* Subtle Sacred Geometric Watermark Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#c5a059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}
