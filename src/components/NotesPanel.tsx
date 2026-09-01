import React, { useState, useMemo } from 'react';
import { 
  StickyNote, Calendar, X, Download, Copy, Check, Trash2, Plus, 
  BookOpen, Scroll, ExternalLink, Filter 
} from 'lucide-react';
import { Note } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NotesPanelProps {
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteNote?: (id: string) => void;
  onAddManualNote?: (note: Note) => void;
}

export default function NotesPanel({ 
  notes, 
  isOpen, 
  onClose,
  onDeleteNote,
  onAddManualNote
}: NotesPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredNotes = useMemo(() => {
    if (activeFilter === 'all') return notes;
    return notes.filter(n => (n.category || 'general') === activeFilter);
  }, [notes, activeFilter]);

  const handleExportMarkdown = () => {
    const markdownContent = `# Catholic Research Companion — Session Notes
Generated on: ${new Date().toLocaleString()}

${notes.map(n => `## ${n.title}
*Recorded: ${new Date(n.timestamp).toLocaleString()}*
${n.sourceUrl ? `*Source: ${n.sourceUrl}*` : ''}

${n.content}

---
`).join('\n')}`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catholic-research-notes-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const text = notes.map(n => `### ${n.title}\n${n.content}\n`).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (onAddManualNote) {
      onAddManualNote({
        id: `manual-note-${Date.now()}`,
        title: newTitle.trim(),
        content: newContent.trim(),
        timestamp: Date.now(),
        category: 'general'
      });
    }

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-paper shadow-2xl z-50 flex flex-col border-l border-gold/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20 flex items-center justify-between bg-white/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-ink">Session Research Notes</h2>
                  <p className="text-[10px] font-display font-bold text-gold/60 uppercase tracking-widest">
                    Cumulative Study Log
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {notes.length > 0 && (
                  <>
                    <button
                      onClick={handleCopyAll}
                      title="Copy all notes to clipboard"
                      className="p-2 hover:bg-gold/10 rounded-lg text-ink/70 hover:text-gold transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      title="Download notes as Markdown file"
                      className="p-2 hover:bg-gold/10 rounded-lg text-ink/70 hover:text-gold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gold/10 rounded-full transition-colors text-ink/70 hover:text-gold ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Filters */}
            <div className="px-6 py-3 border-b border-gold/10 bg-white/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-display font-semibold transition-all ${
                    activeFilter === 'all' ? 'bg-gold text-white shadow-2xs' : 'bg-white/60 text-ink/70 hover:bg-gold/10'
                  }`}
                >
                  All ({notes.length})
                </button>
                <button
                  onClick={() => setActiveFilter('glossary')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-display font-semibold transition-all ${
                    activeFilter === 'glossary' ? 'bg-gold text-white shadow-2xs' : 'bg-white/60 text-ink/70 hover:bg-gold/10'
                  }`}
                >
                  Glossary
                </button>
                <button
                  onClick={() => setActiveFilter('cross_reference')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-display font-semibold transition-all ${
                    activeFilter === 'cross_reference' ? 'bg-gold text-white shadow-2xs' : 'bg-white/60 text-ink/70 hover:bg-gold/10'
                  }`}
                >
                  Cross-Refs
                </button>
              </div>

              <button
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1 px-2.5 py-1 bg-paper border border-gold/20 rounded-lg text-xs font-display font-bold text-gold hover:bg-gold hover:text-white transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </div>

            {/* New Manual Note Form */}
            <AnimatePresence>
              {isAdding && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreateNote}
                  className="p-4 border-b border-gold/15 bg-amber-50/60 space-y-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Note title (e.g., Reflection on St. Thomas)..."
                    className="w-full px-3 py-1.5 bg-white border border-gold/20 rounded-lg text-xs font-serif font-bold text-ink focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Type your notes, quotes, or personal theological reflections..."
                    rows={3}
                    className="w-full px-3 py-1.5 bg-white border border-gold/20 rounded-lg text-xs font-serif text-ink focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1 text-xs text-ink/60 hover:text-ink font-display"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newTitle.trim() || !newContent.trim()}
                      className="px-3 py-1 bg-gold text-white rounded-lg text-xs font-display font-bold hover:bg-gold-dark disabled:opacity-50"
                    >
                      Save Note
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Notes List Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-3 py-12">
                  <StickyNote className="w-12 h-12 text-gold/60" />
                  <div className="space-y-1">
                    <p className="font-serif italic text-base">No notes saved in this category.</p>
                    <p className="text-xs max-w-xs font-serif">
                      Use the companion in Note mode, save terms from the Theological Glossary, or bookmark cross-references.
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-xl shadow-xs border border-gold/20 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-base font-bold text-ink">{note.title}</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-gold/60 font-display mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(note.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          {note.category && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold/10 text-gold font-semibold uppercase text-[9px]">
                              {note.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {onDeleteNote && (
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-ink/30 hover:text-red-600 transition-all rounded"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="prose prose-xs max-w-none font-serif text-ink/85 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.content}
                      </ReactMarkdown>
                    </div>

                    {note.sourceUrl && (
                      <div className="pt-2 border-t border-gold/10 text-[10px] text-ink/50 flex items-center gap-1 truncate font-mono">
                        <ExternalLink className="w-3 h-3 text-gold/60 shrink-0" />
                        <span className="truncate">{note.sourceUrl}</span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gold/10 bg-white/50 flex items-center justify-between text-xs text-ink/60 font-display">
              <span>{notes.length} {notes.length === 1 ? 'Record' : 'Records'} Stored</span>
              <span className="font-serif italic">Scripta Manent</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
