
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Slide } from '../types';

interface AISearchProps {
  currentSlide: Slide;
}

const AISearch: React.FC<AISearchProps> = ({ currentSlide }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [links, setLinks] = useState<{ web: { uri: string; title: string } }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResponse('');
    setLinks([]);
    setIsOpen(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Context: The user is looking at a slide titled "${currentSlide.title}" which is described as "${currentSlide.description}". 
      User Query: ${query}
      Please provide an insightful and detailed response using Google Search grounding.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      setResponse(result.text || "I couldn't find specific information for that query.");
      
      const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        setLinks(groundingChunks.filter((chunk: any) => chunk.web).map((chunk: any) => chunk));
      }
    } catch (error) {
      console.error("AI Search Error:", error);
      setResponse("An error occurred while fetching information. Please check your API key and network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-4 left-4 md:left-auto md:right-10 md:bottom-10 z-50 transition-all duration-500 flex flex-col items-end ${isOpen ? 'md:w-[450px]' : 'w-auto'}`}>
      
      {/* Response Panel */}
      {isOpen && (
        <div className="w-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl mb-4 overflow-hidden flex flex-col max-h-[60vh] md:max-h-[70vh] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-primary/10">
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary animate-pulse text-sm">auto_awesome</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-white">AI Insights</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          
          <div ref={scrollRef} className="p-5 md:p-6 overflow-y-auto no-scrollbar font-sans">
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-primary/10 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-orange/10 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gold/10 dark:bg-gray-800 rounded w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {response}
                </div>
                {links.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Sources & Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] md:text-[11px] bg-primary/20 hover:bg-sunset/40 text-primary dark:text-hotpink px-3 py-1.5 rounded-full transition-all border border-primary/20 hover:scale-105 active:scale-95"
                        >
                          {link.web.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 md:gap-3 w-full">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about ${currentSlide.title}...`}
            className="w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-full py-3 md:py-4 px-5 md:px-6 pr-12 md:pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-800 dark:text-white placeholder:text-gray-400 transition-all shadow-lg hover:shadow-neon group-focus-within:shadow-neon-strong"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-sunset text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-icons text-base md:text-xl">{isLoading ? 'hourglass_empty' : 'search'}</span>
          </button>
        </div>
        
        {/* Quick Action Toggle */}
        {!isOpen && (
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 md:w-14 md:h-14 bg-white/20 dark:bg-surface-dark/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full flex items-center justify-center text-primary shadow-lg hover:shadow-neon hover:bg-primary hover:text-white transition-all duration-300"
            >
                <span className="material-icons text-xl md:text-2xl">auto_awesome</span>
            </button>
        )}
      </form>
    </div>
  );
};

export default AISearch;
