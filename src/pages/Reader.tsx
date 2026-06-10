import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Maximize2, Minimize2, BookOpen, List, 
  Loader2, RefreshCw
} from 'lucide-react';
import { fetchBookById, type Book } from '../data/books';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type Theme = 'light' | 'dark' | 'sepia' | 'cream';

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = parseInt(id || '0');

  // Book data state
  const [book, setBook] = useState<Book | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);

  // PDF state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [twoPageMode, setTwoPageMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('sepia');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load book data
  useEffect(() => {
    async function loadBook() {
      setIsLoadingBook(true);
      const found = await fetchBookById(bookId);
      if (found) {
        setBook(found);
        // Load saved progress
        const savedPage = localStorage.getItem(`solibu_progress_${bookId}`);
        if (savedPage) {
          setCurrentPage(parseInt(savedPage));
        }
      }
      setIsLoadingBook(false);
    }
    loadBook();
  }, [bookId]);

  // Handle responsive two-page mode based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setTwoPageMode(false);
      } else {
        setTwoPageMode(true);
      }
    };
    
    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save progress on page change
  const handlePageChange = (page: number) => {
    if (!numPages) return;
    const validatedPage = Math.max(1, Math.min(page, numPages));
    setCurrentPage(validatedPage);
    localStorage.setItem(`solibu_progress_${bookId}`, validatedPage.toString());
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error enabling full-screen:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen to escape key for exiting fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePageChange(currentPage + (twoPageMode ? 2 : 1));
      } else if (e.key === 'ArrowLeft') {
        handlePageChange(currentPage - (twoPageMode ? 2 : 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, twoPageMode, numPages]);

  // Color mapping based on theme selection
  const themeClasses = {
    light: {
      bg: 'bg-[#FAF8F5]',
      text: 'text-[#2D2D2D]',
      headerBg: 'bg-[#FFFFFF]/90 border-[#E5E0D8]',
      pageBg: 'bg-[#FFFFFF]',
      sidebarBg: 'bg-[#F3EFE9] border-[#E5E0D8]',
      activeThumb: 'border-[#1EAE98]'
    },
    dark: {
      bg: 'bg-[#0F0D13]',
      text: 'text-[#E0DDEC]',
      headerBg: 'bg-[#17141F]/90 border-[#2C2738]',
      pageBg: 'bg-[#17141F]',
      sidebarBg: 'bg-[#1C1826] border-[#2C2738]',
      activeThumb: 'border-[#1EAE98]'
    },
    sepia: {
      bg: 'bg-[#F4ECD8]',
      text: 'text-[#4A3C31]',
      headerBg: 'bg-[#EADFCA]/90 border-[#DFD1B7]',
      pageBg: 'bg-[#FAF3E3]',
      sidebarBg: 'bg-[#E5D7BE] border-[#DFD1B7]',
      activeThumb: 'border-[#C89B5A]'
    },
    cream: {
      bg: 'bg-[#FFFDF6]',
      text: 'text-[#3E3D32]',
      headerBg: 'bg-[#F9F5E8]/90 border-[#ECE4D0]',
      pageBg: 'bg-[#FCFAF2]',
      sidebarBg: 'bg-[#F2ECD8] border-[#ECE4D0]',
      activeThumb: 'border-[#C89B5A]'
    }
  }[theme];

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF Load Error:', err);
    setPdfError('Failed to load PDF file. Please verify the URL or file format.');
  };

  if (isLoadingBook) {
    return (
      <div className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#C89B5A] animate-spin" />
        <p className="text-[#D7C5A3] font-medium text-sm">Opening Book Vault...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#0A0705] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-[#140E0A] p-8 rounded-2xl border border-[#C89B5A]/30">
          <h2 className="font-display text-2xl text-white mb-3">Novel Not Found</h2>
          <p className="text-[#D7C5A3] mb-6 text-sm">The book you are looking for does not exist in our library.</p>
          <button onClick={() => navigate('/library')} className="btn-primary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300 flex flex-col overflow-hidden relative select-none`}
    >
      {/* Header Bar */}
      <header className={`h-16 px-4 md:px-8 border-b ${themeClasses.headerBg} backdrop-blur-md flex items-center justify-between z-30 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/book/${book.id}`)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-display font-medium text-sm md:text-base leading-none truncate max-w-[200px] md:max-w-[400px]">
              {book.title}
            </h1>
            <p className="text-xs opacity-60 mt-0.5">by {book.author}</p>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg transition-colors ${showSidebar ? 'bg-[#1EAE98]/10 text-[#1EAE98]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            title="Pages Sidebar"
          >
            <List className="w-5 h-5" />
          </button>
          
          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
            {(['light', 'dark', 'sepia', 'cream'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                  theme === t 
                    ? 'bg-white dark:bg-black/45 shadow-sm scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: t === 'light' ? '#FFFFFF' : t === 'dark' ? '#17141F' : t === 'sepia' ? '#FAF3E3' : '#FCFAF2',
                  border: theme === t ? '1.5px solid #1EAE98' : '1px solid rgba(0,0,0,0.1)'
                }}
                title={`${t.toUpperCase()} theme`}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={() => setScale(prev => Math.max(0.6, prev - 0.1))}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold w-10 text-center select-none hidden md:inline">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(prev => Math.min(2.0, prev + 0.1))}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden md:block" />

          {/* Spread setting */}
          <button 
            onClick={() => setTwoPageMode(!twoPageMode)}
            className={`hidden md:flex p-2 rounded-lg transition-colors ${twoPageMode ? 'bg-[#1EAE98]/10 text-[#1EAE98]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            title={twoPageMode ? "Switch to Single Page" : "Switch to Double Page"}
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Collapsible Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`w-64 border-r ${themeClasses.sidebarBg} overflow-y-auto flex flex-col z-20 absolute lg:relative h-full transition-colors duration-300`}
            >
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <h3 className="font-display font-medium text-sm">Table of Contents</h3>
                <span className="text-xs opacity-60 font-medium">{numPages || 0} Pages</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {numPages && Array.from({ length: numPages }).map((_, i) => {
                  const pageIndex = i + 1;
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => handlePageChange(pageIndex)}
                      className={`aspect-[2/3] rounded-lg p-1.5 flex flex-col items-center justify-center text-xs border transition-all ${
                        currentPage === pageIndex || (twoPageMode && currentPage + 1 === pageIndex && pageIndex % 2 === 0)
                          ? `${themeClasses.activeThumb} bg-[#1EAE98]/10 border-2`
                          : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex-1 flex items-center justify-center opacity-40">
                        <FileTextIcon className="w-6 h-6" />
                      </div>
                      <span className="font-medium mt-1 select-none">Page {pageIndex}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book Viewport Container */}
        <div className="flex-1 flex flex-col justify-between p-4 md:p-8 overflow-y-auto relative min-w-0">
          
          {/* Main Book Area */}
          <div className="flex-1 flex items-center justify-center my-auto">
            {pdfError ? (
              <div className="text-center max-w-md p-6 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-xl">
                <p className="text-red-500 font-medium mb-3">{pdfError}</p>
                <div className="flex justify-center gap-3">
                  <a 
                    href={book.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1EAE98] text-white rounded-lg text-xs font-semibold hover:bg-[#1a9a86] transition-colors"
                  >
                    Open PDF Direct
                  </a>
                  <button 
                    onClick={() => {
                      setPdfError(null);
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-black/10 dark:bg-white/10 rounded-lg text-xs font-semibold hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              </div>
            ) : !book.pdf_url ? (
              <div className="text-center max-w-md p-8 bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-black/15 dark:border-white/15">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1EAE98]" />
                <h3 className="font-display font-medium text-lg mb-1">Interactive Reader Mode</h3>
                <p className="text-xs opacity-60 leading-relaxed mb-4">
                  No PDF has been uploaded for this novel yet. Please check back later or upload a PDF inside the Admin Panel.
                </p>
                <button onClick={() => navigate(-1)} className="btn-primary text-xs">
                  Go Back
                </button>
              </div>
            ) : (
              <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}>
                <Document
                  file={book.pdf_url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex flex-col items-center gap-3 py-16">
                      <Loader2 className="w-8 h-8 text-[#1EAE98] animate-spin" />
                      <p className="text-xs opacity-60">Rendering pages...</p>
                    </div>
                  }
                >
                  <div className={`flex justify-center ${twoPageMode ? 'gap-1.5' : 'gap-0'} relative`}>
                    
                    {/* Page 1 (Always Left in Two-Page, or Center in Single-Page) */}
                    <motion.div 
                      key={`p-${currentPage}`}
                      initial={{ opacity: 0.8, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`shadow-lg rounded-md overflow-hidden border border-black/5 dark:border-white/5 ${themeClasses.pageBg} relative transition-colors duration-300`}
                    >
                      <Page 
                        pageNumber={currentPage} 
                        width={twoPageMode ? 420 : 560}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={
                          <div className="w-[420px] aspect-[2/3] flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-[#1EAE98] animate-spin" />
                          </div>
                        }
                      />
                    </motion.div>

                    {/* Page 2 (Right Page in Two-Page Mode) */}
                    {twoPageMode && numPages && currentPage + 1 <= numPages && (
                      <motion.div 
                        key={`p-${currentPage + 1}`}
                        initial={{ opacity: 0.8, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`shadow-lg rounded-md overflow-hidden border border-black/5 dark:border-white/5 ${themeClasses.pageBg} relative transition-colors duration-300`}
                      >
                        {/* Book Spine Center Gutter Shadow Effect */}
                        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-10 pointer-events-none" />
                        
                        <Page 
                          pageNumber={currentPage + 1} 
                          width={420}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="w-[420px] aspect-[2/3] flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-[#1EAE98] animate-spin" />
                            </div>
                          }
                        />
                      </motion.div>
                    )}
                  </div>
                </Document>
              </div>
            )}
          </div>

          {/* Left/Right Click zones for quick turning */}
          {numPages && !pdfError && book.pdf_url && (
            <>
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - (twoPageMode ? 2 : 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 hover:bg-black/20 text-white hover:text-white dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all hover:scale-110 z-10 hidden sm:flex items-center justify-center shadow"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-6 h-6 text-current" />
                </button>
              )}
              {numPages && currentPage + (twoPageMode ? 2 : 1) <= numPages && (
                <button
                  onClick={() => handlePageChange(currentPage + (twoPageMode ? 2 : 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 hover:bg-black/20 text-white hover:text-white dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all hover:scale-110 z-10 hidden sm:flex items-center justify-center shadow"
                  title="Next Page"
                >
                  <ChevronRight className="w-6 h-6 text-current" />
                </button>
              )}
            </>
          )}

          {/* Bottom Control Bar */}
          {numPages && !pdfError && book.pdf_url && (
            <div className="max-w-xl w-full mx-auto mt-6 z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs opacity-60 font-semibold px-1">
                <span>Page {currentPage} of {numPages}</span>
                <span>{Math.round((currentPage / numPages) * 100)}% read</span>
              </div>
              
              {/* Scrub Bar */}
              <input
                type="range"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value))}
                className="w-full accent-[#1EAE98] h-1.5 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple helper components to make compile clean
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
