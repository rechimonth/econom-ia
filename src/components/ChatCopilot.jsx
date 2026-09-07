import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  User, 
  Check, 
  Copy, 
  CornerDownLeft,
  DollarSign,
  TrendingDown,
  Store
} from 'lucide-react';
import { askEconomicCopilot } from '../services/aiCopilot';

export default function ChatCopilot({ 
  userProfile, 
  productsCatalog, 
  recentTickets,
  inflationData,
  initialPrompt = "" 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `¡Hola ${userProfile.name.split(' ')[0]}! 👋 Soy **ECONOM-IA**, tu copiloto económico para Argentina.\n\nTe ayudo a:\n- 🛒 Encontrar dónde comprar más barato (chinos, mayoristas, grandes cadenas)\n- 📊 Analizar si estás gastando de más según tus ingresos ($ ${userProfile.sueldoNeto.toLocaleString('es-AR')})\n- 📈 Calcular tu inflación real de bolsillo vs. la oficial\n- 💳 Decidir si conviene cuotas o contado\n\n¿En qué te puedo asesorar hoy?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "Gano $ 1.300.000, ¿estoy gastando demasiado?", query: "Gano 1.300.000 pesos. ¿Estoy gastando demasiado en gastos fijos?" },
    { label: "¿Dónde compro la compra mensual más barata?", query: "¿Dónde compro la compra mensual más barata cerca de mi zona?" },
    { label: "¿Dónde consigo azúcar más barata cerca?", query: "¿Dónde consigo azúcar más barata cerca de Monte Chingolo / Lanús?" },
    { label: "¿Conviene pagar en cuotas o contado?", query: "¿Con la inflación actual conviene pagar en 3 cuotas con interés o de contado con descuento?" },
    { label: "Chino vs Mayorista: ¿cómo repartir?", query: "¿Qué productos conviene comprar en el chino de barrio y cuáles en el mayorista?" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If initialPrompt was passed from widget
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const replyText = await askEconomicCopilot({
        prompt: textToSend,
        userProfile,
        productsCatalog,
        recentTickets,
        inflationData,
        chatHistory: messages
      });

      const assistantMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: "Hubo un pequeño error de conexión al consultar el asistente. Probá nuevamente en unos segundos.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown bold and emojis for cleaner speech
    const cleanText = text.replace(/[*_#`]/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulation for unsupported browsers
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText("¿Dónde consigo azúcar más barata cerca?");
      }, 1500);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">ECONOM-IA Copiloto</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">
              Contexto activo: {userProfile.ciudad} (${userProfile.sueldoNeto.toLocaleString('es-AR')}/mes)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            setMessages([
              {
                id: 'reset',
                role: 'assistant',
                text: `Historial reiniciado. ¿En qué te ayudo a ahorrar hoy, ${userProfile.name.split(' ')[0]}?`,
                timestamp: new Date()
              }
            ]);
          }}
          className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          title="Reiniciar conversación"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser 
                  ? 'bg-sky-500 text-slate-950 font-bold text-xs' 
                  : 'bg-slate-800 border border-slate-700 text-sky-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-950 border border-slate-800/90 text-slate-200'
              }`}>
                {/* Text with simple markdown formatting */}
                <div className="whitespace-pre-line space-y-1.5">
                  {msg.text.split('\n').map((line, idx) => {
                    // Render bold highlights cleanly
                    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p 
                        key={idx} 
                        dangerouslySetInnerHTML={{ __html: formatted }} 
                        className={line.startsWith('-') || line.startsWith('•') ? 'pl-2 text-slate-300' : ''}
                      />
                    );
                  })}
                </div>

                {/* Assistant message action buttons (copy & TTS) */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span className="font-mono">
                      {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`p-1 rounded hover:bg-slate-800 transition ${
                          speakingId === msg.id ? 'text-sky-400' : 'text-slate-400'
                        }`}
                        title="Escuchar respuesta"
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-300">Analizando góndolas y presupuesto...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 w-max">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">
            Sugerencias:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:border-sky-500/40 border border-slate-700 text-slate-300 hover:text-sky-200 whitespace-nowrap transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form with Voice Support */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl border transition ${
            isListening 
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={isListening ? "Escuchando... click para parar" : "Hablar por micrófono (Modo Voz)"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Escuchando tu voz..." : "Consultá precios, sueldo, cuotas o inflación..."}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition shadow-md shadow-sky-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
