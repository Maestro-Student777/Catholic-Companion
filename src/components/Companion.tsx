import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, BookOpen, HelpCircle, StickyNote, Loader2, User, Sparkles, 
  FileText, Scroll, Bookmark, Landmark, Layers, ArrowRight, Check, Scissors
} from 'lucide-react';
import { Mode, Message, Snapshot, Note } from '../types';
import { generateResponseStream } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

interface CompanionProps {
  snapshot: Snapshot | null;
  onAddNote: (note: Note) => void;
  onShowNotes: () => void;
  onOpenGlossary: (term?: string) => void;
  onOpenCrossReference: () => void;
}

export default function Companion({ 
  snapshot, 
  onAddNote, 
  onShowNotes,
  onOpenGlossary,
  onOpenCrossReference
}: CompanionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('study');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle incoming snapshot
  useEffect(() => {
    if (snapshot) {
      const snapshotText = `[SNAPSHOT]
Source: ${snapshot.url}
Time: ${snapshot.timestamp}
---
${snapshot.text}
[END SNAPSHOT]`;
      
      handleSend(snapshotText, true);
    }
  }, [snapshot]);

  const handleSend = async (text: string, isSnapshot = false) => {
    if (!text.trim() && !isSnapshot) return;

    const userMessage: Message = {
      role: 'user',
      content: isSnapshot ? `System: Snapshot received from ${snapshot?.url || 'source'}.` : text,
      timestamp: Date.now(),
    };

    if (!isSnapshot) {
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }

    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const stream = await generateResponseStream(text, history, mode);
      
      let fullResponse = '';
      const modelMessage: Message = {
        role: 'model',
        content: '',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: fullResponse }];
        });
      }

      // Final processing for notes and "show my notes"
      if (fullResponse.toLowerCase().includes('show my notes')) {
        onShowNotes();
      }

      const noteMatch = fullResponse.match(/\[NOTE — (.*?)\]: (.*)/s);
      if (noteMatch) {
        onAddNote({
          id: `note-${Date.now()}`,
          title: noteMatch[1].trim(),
          content: noteMatch[2].trim(),
          timestamp: Date.now(),
          sourceUrl: snapshot?.url
        });
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I apologize, but I encountered an error in my theological analysis. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-paper/30">
      {/* Mode Selector Header */}
      <div className="p-4 border-b border-gold/10 flex flex-wrap gap-2 items-center justify-between bg-white/70 backdrop-blur-md shrink-0">
        <div className="flex gap-1 p-1 bg-paper/60 rounded-xl border border-gold/15 overflow-x-auto no-scrollbar">
          <ModeButton 
            active={mode === 'study'} 
            onClick={() => setMode('study')} 
            icon={<BookOpen className="w-3.5 h-3.5" />} 
            label="Study" 
          />
          <ModeButton 
            active={mode === 'question'} 
            onClick={() => setMode('question')} 
            icon={<HelpCircle className="w-3.5 h-3.5" />} 
            label="Question" 
          />
          <ModeButton 
            active={mode === 'history'} 
            onClick={() => setMode('history')} 
            icon={<Landmark className="w-3.5 h-3.5" />} 
            label="History" 
          />
          <ModeButton 
            active={mode === 'crossref'} 
            onClick={() => setMode('crossref')} 
            icon={<Scroll className="w-3.5 h-3.5" />} 
            label="Cross-Ref" 
          />
          <ModeButton 
            active={mode === 'glossary'} 
            onClick={() => setMode('glossary')} 
            icon={<FileText className="w-3.5 h-3.5" />} 
            label="Glossary" 
          />
          <ModeButton 
            active={mode === 'note'} 
            onClick={() => setMode('note')} 
            icon={<StickyNote className="w-3.5 h-3.5" />} 
            label="Note" 
          />
        </div>

        {/* Quick Tools Banner */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenGlossary()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-paper/70 border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all text-xs font-display font-bold shadow-2xs"
            title="Open Theological Glossary & Lexicon"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Glossary</span>
          </button>

          {snapshot && (
            <button
              onClick={onOpenCrossReference}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-600 hover:text-white transition-all text-xs font-display font-bold shadow-2xs"
              title="Open Magisterial Cross-Referencing Tool"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cross-Ref</span>
            </button>
          )}
        </div>
      </div>

      {/* Snapshot Context Pill (if active) */}
      {snapshot && (
        <div className="px-4 py-2 bg-gold/5 border-b border-gold/10 flex items-center justify-between text-xs font-serif text-ink/70">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="font-display font-bold text-[10px] text-gold uppercase tracking-wider">Active Snapshot:</span>
            <span className="truncate max-w-[220px] italic">{snapshot.url}</span>
          </div>
          <button
            onClick={onOpenCrossReference}
            className="flex items-center gap-1 text-[11px] font-display font-bold text-purple-700 hover:text-purple-900 shrink-0 ml-2"
          >
            <span>Explore Tradition</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-75">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <div className="space-y-1.5">
              <p className="font-serif text-2xl italic text-ink font-semibold">Laudetur Iesus Christus</p>
              <p className="text-xs max-w-sm mx-auto font-serif text-ink/70 leading-relaxed">
                I am your Catholic research companion. Load a page on the left, take a snapshot, or ask any theological or historical question.
              </p>
            </div>

            {/* Quick Action Suggestion Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 w-full max-w-md">
              <button
                onClick={() => {
                  setMode('glossary');
                  handleSend("What is the difference between Sanctifying Grace and Actual Grace?");
                }}
                className="p-3 bg-white/70 border border-gold/15 rounded-xl text-left text-xs hover:border-gold/40 transition-all space-y-1 shadow-2xs"
              >
                <div className="font-display font-bold text-gold flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Glossary Query
                </div>
                <div className="font-serif text-ink/80 text-[11px]">Define "Sanctifying Grace" vs "Actual Grace"</div>
              </button>

              <button
                onClick={() => {
                  setMode('history');
                  handleSend("Explain the historical significance of the Council of Trent (1545-1563) regarding the Sacraments.");
                }}
                className="p-3 bg-white/70 border border-gold/15 rounded-xl text-left text-xs hover:border-gold/40 transition-all space-y-1 shadow-2xs"
              >
                <div className="font-display font-bold text-gold flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Historical Context
                </div>
                <div className="font-serif text-ink/80 text-[11px]">The Council of Trent and the Sacraments</div>
              </button>
            </div>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.timestamp + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[88%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-gold text-white shadow-xs' : 'bg-paper border border-gold/20 text-gold shadow-xs'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-xs space-y-2 ${
                  m.role === 'user' 
                    ? 'bg-gold text-white rounded-tr-none' 
                    : 'bg-white border border-gold/15 rounded-tl-none'
                }`}>
                  <div className={`prose prose-sm max-w-none font-serif leading-relaxed ${m.role === 'user' ? 'prose-invert' : 'prose-stone'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>

                  {/* AI Response Footer Actions */}
                  {m.role === 'model' && m.content && !loading && (
                    <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-[11px] font-display text-ink/40">
                      <span>Catholic Research Companion</span>
                      <button
                        onClick={() => {
                          onAddNote({
                            id: `note-${Date.now()}`,
                            title: `Companion Insight (${new Date().toLocaleTimeString()})`,
                            content: m.content,
                            timestamp: Date.now(),
                            sourceUrl: snapshot?.url
                          });
                        }}
                        className="flex items-center gap-1 text-gold hover:text-gold-dark font-semibold transition-colors"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save to Notes</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && messages[messages.length - 1]?.role !== 'model' && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-paper border border-gold/20 flex items-center justify-center text-gold">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-gold/10 rounded-2xl rounded-tl-none shadow-xs">
                <div className="flex gap-1.5 items-center">
                  <span className="font-serif italic text-xs text-gold mr-2">Contemplating Tradition...</span>
                  <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gold/10 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask in ${mode} mode (e.g. explain Latin phrase, trace Scripture, unpack dogma)...`}
            className="w-full pl-4 pr-12 py-3 bg-paper/50 border border-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold/50 font-serif text-sm text-ink placeholder:text-ink/40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gold text-white rounded-lg flex items-center justify-center hover:bg-gold-dark transition-colors disabled:opacity-50 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gold/60 font-display uppercase tracking-widest px-1">
          <span>Mode: {mode.toUpperCase()}</span>
          <span>Ad Majorem Dei Gloriam</span>
        </div>
      </div>
    </div>
  );
}

function ModeButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all whitespace-nowrap ${
        active 
          ? 'bg-gold text-white shadow-xs' 
          : 'text-gold/70 hover:bg-gold/10 hover:text-gold'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
