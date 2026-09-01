import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ExternalLink, FileText, Loader2, Book, Globe, Scissors, 
  BookOpen, Scroll, Sparkles, RefreshCw, Layers 
} from 'lucide-react';
import { Snapshot } from '../types';

interface ReaderProps {
  onSnapshot: (snapshot: Snapshot) => void;
  externalUrl?: string | null;
  onOpenGlossary?: (term: string) => void;
  onOpenCrossReference?: (customSnapshot?: Snapshot) => void;
}

type ViewMode = 'live' | 'text';

export default function Reader({ 
  onSnapshot, 
  externalUrl,
  onOpenGlossary,
  onOpenCrossReference 
}: ReaderProps) {
  const [url, setUrl] = useState('https://www.vatican.va');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionPos, setSelectionPos] = useState<{ x: number, y: number } | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const RECOMMENDED_SITES = [
    { name: 'Vatican.va', url: 'https://www.vatican.va' },
    { name: 'Catechism of the Catholic Church (CCC)', url: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM' },
    { name: 'Code of Canon Law (CIC)', url: 'https://www.vatican.va/archive/cod-iuris-canonici/cic_index_en.html' },
    { name: 'St. Irenaeus — Against Heresies', url: 'https://ia800606.us.archive.org/21/items/SaintIrenaeusAgainstHeresiesComplete/Saint%20Irenaeus%20Against%20Heresies%20Complete.pdf' },
    { name: 'USCCB Bible', url: 'https://bible.usccb.org' },
    { name: 'New Advent (Fathers & Catholic Encyclopedia)', url: 'https://www.newadvent.org' },
    { name: 'Catholic Answers', url: 'https://www.catholic.com' },
    { name: 'Universalis (Liturgy of the Hours)', url: 'https://www.universalis.com' },
    { name: 'Divine Office', url: 'https://divineoffice.org' },
  ];

  // Auto-fetch if externalUrl changes
  useEffect(() => {
    if (externalUrl && externalUrl !== currentUrl) {
      setUrl(externalUrl);
      handleFetch(undefined, externalUrl);
    }
  }, [externalUrl]);

  const handleFetch = async (e?: React.FormEvent, targetUrl?: string) => {
    e?.preventDefault();
    const fetchUrl = targetUrl || url;
    if (!fetchUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(fetchUrl)}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setContent(data.text);
      setCurrentUrl(fetchUrl);
      setUrl(fetchUrl);
      if (!targetUrl) setViewMode('text');
    } catch (error) {
      console.error("Fetch error:", error);
      // If fetching fails via proxy, fallback gracefully
      setContent(`[Notice: Direct text extraction for "${fetchUrl}" was limited. You may switch to LIVE mode to view the page directly in the embedded browser.]`);
      setCurrentUrl(fetchUrl);
    } finally {
      setLoading(false);
    }
  };

  const takeSnapshot = (textToSnapshot?: string) => {
    const finalContent = textToSnapshot || content;
    if (!finalContent || !currentUrl) return;
    
    const snap: Snapshot = {
      url: currentUrl,
      timestamp: new Date().toLocaleString(),
      text: finalContent,
      title: currentUrl.split('/').pop() || 'Catholic Document'
    };
    
    onSnapshot(snap);
    setSelection(null);
  };

  const handleDefineSelection = () => {
    if (selection && onOpenGlossary) {
      onOpenGlossary(selection.trim());
      setSelection(null);
    }
  };

  const handleCrossReferenceSelection = () => {
    if (selection && currentUrl) {
      const snap: Snapshot = {
        url: currentUrl,
        timestamp: new Date().toLocaleString(),
        text: selection.trim(),
        title: `Selected Passage from ${currentUrl}`
      };
      onSnapshot(snap);
      if (onOpenCrossReference) {
        onOpenCrossReference(snap);
      }
      setSelection(null);
    }
  };

  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 0) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelection(selectedText);
        setSelectionPos({ 
          x: Math.max(120, Math.min(window.innerWidth - 180, rect.left + rect.width / 2)), 
          y: Math.max(80, rect.top - 46) 
        });
      }
    } else {
      setSelection(null);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-gold/20 bg-white/50 relative">
      {/* Navigation Bar */}
      <div className="p-4 border-b border-gold/10 bg-white/80 backdrop-blur-sm sticky top-0 z-20 space-y-3">
        <div className="flex gap-2 items-center">
          <select 
            onChange={(e) => {
              const selectedUrl = e.target.value;
              if (!selectedUrl) return;
              setUrl(selectedUrl);
              handleFetch(undefined, selectedUrl);
            }}
            className="px-3 py-2 bg-paper/50 border border-gold/20 rounded-lg font-display text-[11px] font-bold text-gold uppercase tracking-wider focus:outline-none max-w-[240px] truncate"
            value=""
          >
            <option value="" disabled>Recommended Catholic Sources</option>
            {RECOMMENDED_SITES.map(site => (
              <option key={site.url} value={site.url}>{site.name}</option>
            ))}
          </select>

          <div className="flex bg-paper/50 p-1 rounded-lg border border-gold/10 ml-auto">
            <button
              onClick={() => setViewMode('live')}
              className={`px-3 py-1 rounded-md text-[10px] font-display font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'live' ? 'bg-gold text-white shadow-xs' : 'text-gold/60 hover:bg-gold/5'
              }`}
            >
              <Globe className="w-3 h-3" />
              LIVE VIEW
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-3 py-1 rounded-md text-[10px] font-display font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'text' ? 'bg-gold text-white shadow-xs' : 'text-gold/60 hover:bg-gold/5'
              }`}
            >
              <FileText className="w-3 h-3" />
              READER
            </button>
          </div>
        </div>

        <form onSubmit={handleFetch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Catholic website or document URL..."
              className="w-full pl-10 pr-4 py-2 bg-paper/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold/50 font-serif text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 text-xs font-display font-bold shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load"}
          </button>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'live' ? (
          <div className="h-full w-full bg-white relative flex flex-col">
            <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/50 flex items-center justify-between text-xs text-amber-900 font-serif">
              <span className="truncate">Live Page: {url}</span>
              <button
                onClick={() => {
                  takeSnapshot(`Page URL: ${url} (Captured via Live View)`);
                }}
                className="px-2.5 py-1 bg-gold text-white rounded-md text-[10px] font-display font-bold hover:bg-gold-dark shrink-0 ml-2"
              >
                Snapshot URL
              </button>
            </div>
            <iframe 
              src={url} 
              className="w-full flex-1 border-none"
              title="Catholic Live Browser"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        ) : (
          <div 
            ref={textContainerRef}
            className="h-full overflow-y-auto p-6 lg:p-10 select-text"
            onMouseUp={handleMouseUp}
          >
            {!content && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-75">
                <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
                  <Book className="w-8 h-8 text-gold" />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-2xl italic text-ink font-semibold">Begin Your Catholic Study</p>
                  <p className="text-xs text-ink/70 max-w-sm font-serif">
                    Select an authoritative source below or enter a URL. Highlight terms to view instant theological definitions or cross-references.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {RECOMMENDED_SITES.map(site => (
                    <button 
                      key={site.url}
                      onClick={() => {
                        setUrl(site.url);
                        handleFetch(undefined, site.url);
                      }} 
                      className="px-3 py-1.5 rounded-full border border-gold/20 text-xs font-display font-bold text-gold hover:bg-gold hover:text-white transition-all shadow-2xs"
                    >
                      {site.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="font-serif italic text-gold text-sm">Retrieving Catholic source text...</p>
                </div>
              </div>
            )}

            {content && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2">
                  <div className="flex items-center gap-2 text-xs text-gold uppercase tracking-widest font-display font-semibold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[260px]">{currentUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => takeSnapshot()}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper border border-gold/30 text-gold rounded-full text-xs font-display font-bold hover:bg-gold hover:text-white transition-all shadow-xs"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      SNAPSHOT FULL PAGE
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-stone prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-serif text-ink leading-relaxed text-base bg-transparent border-none p-0 selection:bg-gold/20 selection:text-ink">
                    {content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Multi-Action Popover for Text Selection */}
        {selection && selectionPos && viewMode === 'text' && (
          <div 
            className="fixed z-50 flex items-center gap-1.5 p-1 bg-ink/90 backdrop-blur-md rounded-xl shadow-2xl border border-gold/40 text-white animate-in fade-in zoom-in-95 duration-150"
            style={{ 
              left: `${selectionPos.x}px`, 
              top: `${selectionPos.y}px`, 
              transform: 'translate(-50%, -100%)' 
            }}
          >
            <button
              onClick={() => takeSnapshot(selection)}
              title="Send selected passage as AI Snapshot"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-dark text-white text-[11px] font-display font-bold transition-all shadow-xs"
            >
              <Scissors className="w-3 h-3" />
              <span>Snapshot</span>
            </button>

            {onOpenGlossary && (
              <button
                onClick={handleDefineSelection}
                title="Lookup theological definition & Latin meaning"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold text-white text-[11px] font-display font-bold transition-all"
              >
                <BookOpen className="w-3 h-3 text-gold-light" />
                <span>Define</span>
              </button>
            )}

            {onOpenCrossReference && (
              <button
                onClick={handleCrossReferenceSelection}
                title="Cross-reference this passage with Scripture and Tradition"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold text-white text-[11px] font-display font-bold transition-all"
              >
                <Scroll className="w-3 h-3 text-purple-300" />
                <span>Cross-Ref</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
