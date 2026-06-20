import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ChevronRight, 
  Languages, 
  Volume2, 
  VolumeX,
  Award, 
  Info, 
  Eye, 
  EyeOff,
  BookOpen, 
  Shuffle, 
  Coins,
  Ticket as TicketIcon
} from 'lucide-react';
import { questions, Question } from './questions';

// Web Audio API tactile mechanical audio chimes
const playSound = (type: 'draw' | 'flip' | 'correct' | 'incorrect' | 'complete' | 'click' | 'shuffle', soundEnabled: boolean) => {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'shuffle') {
      for (let i = 0; i < 6; i++) {
        const timeOffset = i * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + (i * 30), ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + timeOffset + 0.05);
        gain.gain.setValueAtTime(0.03, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.06);
      }
    } else if (type === 'draw') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'correct') {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.07, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.22);
      });
    } else if (type === 'incorrect') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'complete') {
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.32);
      });
    }
  } catch (error) {
    console.warn("Synthesizer blocked or not active yet.", error);
  }
};

export default function App() {
  // Game session states
  const [playedIds, setPlayedIds] = useState<number[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  
  // Translation reveal state (upon clicking question)
  const [showArmenianTranslation, setShowArmenianTranslation] = useState<boolean>(false);
  
  // Results map to keep track of score
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [drawingAnimation, setDrawingAnimation] = useState<boolean>(false);

  // Filter mode failed only state
  const [reviewFailedOnly, setReviewFailedOnly] = useState<boolean>(false);

  // Active question derived variable
  const activeQuestion = useMemo(() => {
    return questions.find(q => q.id === currentQuestionId) || null;
  }, [currentQuestionId]);

  // Handle active dataset according to mode selection
  const eligibleQuestions = useMemo(() => {
    if (reviewFailedOnly) {
      const failedIds = Object.entries(results)
        .filter(([_, isCorrect]) => !isCorrect)
        .map(([idStr]) => parseInt(idStr));
      return questions.filter(q => failedIds.includes(q.id));
    }
    return questions;
  }, [reviewFailedOnly, results]);

  // Compute stats
  const stats = useMemo(() => {
    const totalInGroup = eligibleQuestions.length;
    const playedInGroup = eligibleQuestions.filter(q => playedIds.includes(q.id)).length;
    const correctInGroup = eligibleQuestions.filter(q => playedIds.includes(q.id) && results[q.id] === true).length;
    
    return {
      totalInGroup,
      playedInGroup,
      correctInGroup,
      incorrectInGroup: playedInGroup - correctInGroup,
      percentCorrect: playedInGroup > 0 ? Math.round((correctInGroup / playedInGroup) * 100) : 0,
      isFinished: playedInGroup === totalInGroup && totalInGroup > 0
    };
  }, [eligibleQuestions, playedIds, results]);

  // Trigger random draw ticket
  const handleDrawTicket = () => {
    if (drawingAnimation) return;
    
    // Check remaining unplayed questions in current eligible group
    const unplayed = eligibleQuestions.filter(q => !playedIds.includes(q.id));
    
    if (unplayed.length === 0) {
      if (stats.isFinished) {
        playSound('complete', soundEnabled);
      }
      return;
    }

    setDrawingAnimation(true);
    playSound('draw', soundEnabled);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * unplayed.length);
      const nextQuestion = unplayed[randomIndex];
      
      setCurrentQuestionId(nextQuestion.id);
      setSelectedAnswer(null);
      setShowArmenianTranslation(false);
      setDrawingAnimation(false);
    }, 500);
  };

  // Jump straight to a ticket
  const handleJumpToTicket = (id: number) => {
    if (drawingAnimation) return;
    playSound('click', soundEnabled);
    setCurrentQuestionId(id);
    setSelectedAnswer(null);
    setShowArmenianTranslation(false);

    // If already played, retrieve selection
    // Note: To let them re-answer, we clear answer if not committed or kept in state.
    // For a cleaner quiz, let's allow re-answering if they want, but let's keep the existing logged result.
    // To make it fully interactive, let's allow them to set the answer or see their previous committed state.
    // We'll let them play tickets one by one.
  };

  // Select Option and log results
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!activeQuestion || selectedAnswer) return;
    
    setSelectedAnswer(key);
    const isCorrect = key === activeQuestion.correctAnswer;
    
    // Log state
    setResults(prev => ({ ...prev, [activeQuestion.id]: isCorrect }));
    setPlayedIds(prev => {
      if (prev.includes(activeQuestion.id)) return prev;
      return [...prev, activeQuestion.id];
    });

    if (isCorrect) {
      playSound('correct', soundEnabled);
    } else {
      playSound('incorrect', soundEnabled);
    }
  };

  // Go to next randomized ticket or trigger completion
  const handleNextTicket = () => {
    playSound('click', soundEnabled);
    const unplayed = eligibleQuestions.filter(q => !playedIds.includes(q.id));
    
    if (unplayed.length > 0) {
      // Auto draw next one
      handleDrawTicket();
    } else {
      // Completed last ticket
      setCurrentQuestionId(null);
      setSelectedAnswer(null);
      playSound('complete', soundEnabled);
    }
  };

  // Reset or re-roll game state
  const handleReset = () => {
    playSound('shuffle', soundEnabled);
    setPlayedIds([]);
    setCurrentQuestionId(null);
    setSelectedAnswer(null);
    setShowArmenianTranslation(false);
    setResults({});
    setReviewFailedOnly(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans text-slate-800 overflow-x-hidden selection:bg-amber-400 selection:text-indigo-950">
      
      {/* HEADER SECTION - Beautiful Geometrically Balanced Indigo Topbar */}
      <header className="h-20 bg-indigo-900 text-white flex items-center justify-between px-4 sm:px-10 shadow-lg shrink-0 border-b-4 border-indigo-700 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-black text-indigo-900 text-xl shadow-inner select-none">
            ES
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-black tracking-tight uppercase flex items-center gap-2">
              20 Preguntas <span className="opacity-40">|</span> 20 Հարց
            </h1>
            <p className="text-[10px] sm:text-xs text-indigo-200 uppercase tracking-widest font-semibold font-mono">
              Vocabulario Español-Armenio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-8">
          
          {/* Sound switch */}
          <button
            onClick={() => { setSoundEnabled(!soundEnabled); playSound('click', soundEnabled); }}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-amber-400 text-indigo-900 border-amber-300' 
                : 'bg-indigo-800 text-indigo-300 border-indigo-700 opacity-60'
            }`}
            title={soundEnabled ? "Անջատել ձայնը / Desactivar Sonido" : "Միացնել ձայնը / Activar Sonido"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="text-right hidden sm:block">
            <div className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Aciertos / Միավոր</div>
            <div className="text-xl md:text-2xl font-mono leading-none font-bold text-amber-300">
              {stats.correctInGroup} <span className="text-xs opacity-60 font-normal">/ {stats.totalInGroup}</span>
            </div>
          </div>

          <button 
            onClick={handleDrawTicket}
            disabled={drawingAnimation || stats.isFinished}
            className={`font-black px-4 sm:px-6 py-2 rounded-md shadow-[0_4px_0_rgb(180,120,0)] transition-all active:translate-y-1 active:shadow-none uppercase tracking-wide text-xs sm:text-sm cursor-pointer ${
              stats.isFinished
                ? 'bg-slate-300 text-slate-500 shadow-none border-gray-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-indigo-900'
            }`}
          >
            {drawingAnimation ? "DRAWING..." : "TIRAR / ՔԱՇԵԼ ՏՈՄՍ"}
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CONTENT GRID */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden p-4 sm:p-6 gap-6 max-w-7xl w-full mx-auto">
        
        {/* SIDEBAR: PROGRESS TRACKER BOX */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 flex-1 flex flex-col">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Progreso de la sesión
              </h2>
              <span className="text-xs text-indigo-600 font-bold font-mono">
                {stats.playedInGroup} / {stats.totalInGroup} Billetes
              </span>
            </div>

            {/* 20 Indicators Grid */}
            <div className="grid grid-cols-5 gap-2.5 my-2">
              {questions.map((q) => {
                const hasBeenPlayed = playedIds.includes(q.id);
                const isCorrect = results[q.id] === true;
                const isActive = currentQuestionId === q.id;

                let indicatorStyle = "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200 hover:text-slate-700";
                
                if (hasBeenPlayed) {
                  indicatorStyle = isCorrect
                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : "bg-rose-600 text-white shadow-sm hover:bg-rose-700";
                }
                
                if (isActive) {
                  indicatorStyle = "bg-indigo-600 text-white font-extrabold shadow-md transform scale-105 outline outline-2 outline-amber-400 outline-offset-1";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToTicket(q.id)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${indicatorStyle}`}
                    title={`Ticket N° ${q.id}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Micro Stats panel inside progression */}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Correctos / Ճիշտ:</span>
                <span className="font-mono font-bold text-emerald-600">{stats.correctInGroup}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Erróneos / Սխալ:</span>
                <span className="font-mono font-bold text-rose-600">{stats.incorrectInGroup}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Tasa de aciertos / Տոկոս:</span>
                <span className="font-mono font-bold text-indigo-600">{stats.percentCorrect}%</span>
              </div>

              {/* Miniature horizontal bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${stats.percentCorrect}%` }}
                />
              </div>
            </div>

          </div>

          {/* Prompt instruction box */}
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-xs text-indigo-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              Հրահանգ / Instrucciones:
            </p>
            <p className="leading-relaxed opacity-90">
              Կտտացրեք հարցի վրա՝ հայերեն թարգմանությունը բացելու համար: Ընտրեք պատասխանը և անցեք հաջորդին:
            </p>
            {Object.keys(results).some(id => !results[parseInt(id)]) && (
              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  setReviewFailedOnly(!reviewFailedOnly);
                  setPlayedIds([]); // reload indices
                  setCurrentQuestionId(null);
                }}
                className="mt-2 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2.5 rounded font-mono uppercase tracking-wide transition-all font-bold block text-center w-full cursor-pointer"
              >
                {reviewFailedOnly ? "Ցույց տալ բոլորը" : "Կրկնել միայն սխալները"}
              </button>
            )}
          </div>
        </aside>

        {/* ACTIVE EXAM TICKET AREA */}
        <section className="flex-1 flex flex-col items-center justify-center py-4 lg:py-0">
          
          <AnimatePresence mode="wait">
            {!activeQuestion ? (
              
              /* No ticket drawn state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl bg-white shadow-xl rounded-sm border-t-[12px] border-indigo-600 p-8 md:p-12 text-center relative overflow-hidden"
              >
                {/* Tickets background stack watermark */}
                <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none select-none">
                  <TicketIcon className="w-64 h-64 text-indigo-900" />
                </div>
                
                <div className="relative z-10 py-10 space-y-6">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
                    <Bookmark className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-indigo-990 uppercase tracking-tight">Ոչ մի տոմս քաշված չէ</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                      Սեղմեք վերևի <strong className="text-indigo-900 uppercase">«Քաշել տոմս» (Tirar)</strong> կոճակը պատահական քննություն սկսելու համար կամ ընտրեք ձախ կողմից:
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleDrawTicket}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black px-6 py-3 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    Քաշել Պատահական Տոմս / Tirar
                  </button>
                </div>
              </motion.div>

            ) : (

              /* Active Question Ticket with elegant perforated design styling and translation modal built in */
              <motion.div
                key={activeQuestion.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm border-t-[12px] border-amber-400 relative p-6 sm:p-12 overflow-hidden"
              >
                
                {/* Vintage Perforated Ticket punches */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full shadow-inner border border-slate-200"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full shadow-inner border border-slate-200"></div>
                
                {/* Question index tag watermark */}
                <div className="absolute top-2 right-4 font-mono text-slate-200 text-5xl font-black opacity-30 pointer-events-none select-none">
                  #{activeQuestion.id.toString().padStart(2, '0')}
                </div>

                <div className="space-y-6 sm:space-y-8 relative z-10">
                  
                  {/* QUESTION HEADER BLOCK - Clickable to reveal translation */}
                  <div 
                    onClick={() => {
                      playSound('flip', soundEnabled);
                      setShowArmenianTranslation(!showArmenianTranslation);
                    }}
                    className="text-center space-y-4 cursor-help group select-none block p-2 rounded-xl transition-all hover:bg-slate-50"
                  >
                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>BOLETO ACADÉMICO N° {activeQuestion.id}</span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-slate-800 leading-tight">
                      {activeQuestion.spanishQuestion.split(' ').map((word, i) => {
                        // Highlight targeted word if it matches antonym markers
                        const clearWord = word.replace(/[¿?“”,.]/g, '');
                        const highlightable = ["caro", "fácil", "bonito", "alto", "viaje", "comida", "triste", "ropa", "viejo", "abierto", "casa", "habitación", "transporte", "dentro", "antes", "familia", "pobre", "ciudad", "rápido", "estudios"];
                        if (highlightable.includes(clearWord.toLowerCase())) {
                          return <span key={i} className="text-indigo-600 font-extrabold">{word} </span>;
                        }
                        return word + " ";
                      })}
                    </h3>

                    <div className="p-4 bg-slate-50 border-x-4 border-slate-200 rounded-md transition-all group-hover:bg-indigo-50 relative">
                      <AnimatePresence mode="wait">
                        {showArmenianTranslation ? (
                          <motion.div
                            key="translation-view"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <p className="text-lg sm:text-xl font-medium text-indigo-900 font-sans leading-relaxed">
                              {activeQuestion.armenianTranslation}
                            </p>
                            <span className="text-[9px] text-indigo-500 uppercase font-mono font-bold mt-2.5 block tracking-widest">
                              Թարգմանությունը Բացված է / Clic para cerrar
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="click-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-1"
                          >
                            <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide">
                              👇 Կտտացրեք այստեղ՝ թարգմանությունը տեսնելու համար
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 opacity-80">
                              (Clic para revelar la traducción al armenio)
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* OPTIONS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeQuestion.options.map((option) => {
                      const isCorrectChoice = option.key === activeQuestion.correctAnswer;
                      const isSelectedByUser = option.key === selectedAnswer;
                      
                      let btnClasses = "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50";
                      let badgeClasses = "bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white";

                      if (selectedAnswer) {
                        if (isCorrectChoice) {
                          // Correct option status
                          btnClasses = "border-emerald-500 bg-emerald-50/70 text-emerald-900";
                          badgeClasses = "bg-emerald-600 text-white";
                        } else if (isSelectedByUser) {
                          // Wrong selected user status
                          btnClasses = "border-rose-500 bg-rose-50/70 text-rose-900";
                          badgeClasses = "bg-rose-600 text-white";
                        } else {
                          // Unselected passives
                          btnClasses = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                          badgeClasses = "bg-slate-200 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={option.key}
                          disabled={!!selectedAnswer}
                          onClick={() => handleSelectOption(option.key)}
                          className={`flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 group transition-all text-left shadow-sm cursor-pointer ${btnClasses}`}
                        >
                          <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-sm sm:text-base shrink-0 transition-colors ${badgeClasses}`}>
                            {option.key}
                          </span>
                          <span className="text-base sm:text-lg font-bold">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* POST ANSWER ACTION & CORRECT CHOICE CLARIFICATION */}
                  {selectedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="text-xs text-indigo-900 space-y-1 text-center sm:text-left">
                        <p className="font-bold uppercase tracking-wider text-amber-600 flex items-center justify-center sm:justify-start gap-1">
                          {selectedAnswer === activeQuestion.correctAnswer ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ՃԻՇՏ Է / ¡CORRECTO!
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600" />
                              ՍԽԱԼ Է / ¡INCORRECTO!
                            </>
                          )}
                        </p>
                        <p className="opacity-90">
                          Ճիշտ պատասխանն էր՝ <strong>{activeQuestion.correctAnswer}) {activeQuestion.options.find(o => o.key === activeQuestion.correctAnswer)?.text}</strong>
                        </p>
                      </div>

                      <button
                        onClick={handleNextTicket}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm"
                      >
                        {stats.isFinished ? "Տեսնել Արդյունքները" : "Հաջորդ տոմսը"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                </div>

                {/* Rubber stamp ink marks on ticket paper layer */}
                {selectedAnswer && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-30 scale-150 rotate-12 opacity-90">
                    {selectedAnswer === activeQuestion.correctAnswer ? (
                      <div className="rubber-stamp text-emerald-600 border-emerald-600 p-2 font-black">
                        CORRECTO
                      </div>
                    ) : (
                      <div className="rubber-stamp text-rose-600 border-rose-600 p-2 font-black">
                        INCORRECTO
                      </div>
                    )}
                  </div>
                )}

              </motion.div>

            )}
          </AnimatePresence>

          {/* FOOTER STATUS META DATA AREA */}
          <div className="mt-8 flex gap-4 sm:gap-12 text-center text-slate-400 font-semibold uppercase tracking-tighter justify-center text-xs">
            <div className="flex flex-col">
              <span className="text-[9px] tracking-wider text-slate-400 uppercase">Tema</span>
              <span className="text-sm sm:text-lg text-slate-700">Vocabulario</span>
            </div>
            <div className="w-px bg-slate-300 h-8 self-center"></div>
            <div className="flex flex-col">
              <span className="text-[9px] tracking-wider text-slate-400 uppercase">Modo</span>
              <span className="text-sm sm:text-lg text-slate-700">{reviewFailedOnly ? "Errores" : "Estándar"}</span>
            </div>
            <div className="w-px bg-slate-300 h-8 self-center"></div>
            <div className="flex flex-col">
              <span className="text-[9px] tracking-wider text-slate-400 uppercase">Dificultad</span>
              <span className="text-sm sm:text-lg text-slate-700">A1-A2</span>
            </div>
          </div>

        </section>

      </main>

      {/* FULL COMPLETION SCORE MODAL OVERLAY */}
      {stats.isFinished && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border-t-[16px] border-amber-400 p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden"
          >
            {/* Trophy icon */}
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-12 h-12 text-amber-500" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-bold">
                Examen Completado / Լրացված է
              </span>
              <h3 className="text-2xl font-black text-slate-800">Շնորհավորո՜ւմ ենք</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Դուք ավարտեցիք բոլոր {stats.totalInGroup} տոմսերը իսպաներենի բառապաշարի քննության մեջ։
              </p>
            </div>

            {/* Score box */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-2 gap-4">
              <div className="border-r border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Mención / Գնահատական</div>
                <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                  {stats.correctInGroup} / {stats.totalInGroup}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Precisión / Տոկոս</div>
                <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                  {stats.percentCorrect}%
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {stats.percentCorrect >= 90 ? (
                <p className="text-indigo-900 font-bold">🌟 Իսպաներենի Վարպետ (Excelente maestro de español)</p>
              ) : stats.percentCorrect >= 70 ? (
                <p className="text-indigo-900 font-bold">👍 Շատ Լավ (Buen rendimiento, sigue así)</p>
              ) : (
                <p className="text-indigo-900 font-bold">📖 Շարունակիր սովորել (Sigue practicando para mejorar)</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full bg-indigo-950 text-white font-black py-3 px-6 rounded-lg uppercase tracking-wider text-xs transition-transform active:translate-y-0.5 shadow-md cursor-pointer hover:bg-indigo-900"
              >
                🚀 Սկսել Նորից (Reiniciar)
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER BRANDING LINE */}
      <footer className="h-12 bg-slate-800 text-slate-400 flex flex-col sm:flex-row items-center justify-center px-4 sm:px-10 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shrink-0 gap-1 text-center font-mono">
         <span>Sistema de aprendizaje de idiomas © 2026</span>
         <span className="hidden sm:inline">•</span>
         <span>Լեզվի ուսուցման համակարգ</span>
      </footer>

    </div>
  );
}
