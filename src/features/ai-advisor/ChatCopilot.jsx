import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  Crown,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { askEconomicCopilot } from '../../services/ai/aiCopilot';
import UpgradeBanner from '../../components/ui/UpgradeBanner';
import { useSubscription } from '../../hooks/useSubscription';

export default function ChatCopilot({
  userProfile,
  productsCatalog,
  recentTickets,
  inflationData,
  initialPrompt = '',
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `¡Hola ${userProfile.name.split(' ')[0]}! 👋 Soy **ECONOM-IA**, tu copiloto económico para Argentina.\n\nTe ayudo a:\n- 🛒 Encontrar dónde comprar más barato\n- 📊 Analizar tus ingresos y gastos\n- 📈 Entender tu inflación de bolsillo\n- 💳 Comparar cuotas y contado\n\n¿En qué te puedo asesorar hoy?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const { plan, isPro, remainingQueries, limitReached, consumeAiQuery, upgradeToPro } = useSubscription();

  const quickPrompts = [
    { label: '¿Estoy gastando demasiado?', query: '¿Estoy gastando demasiado en gastos fijos?' },
    { label: 'Compra mensual más barata', query: '¿Dónde compro la compra mensual más barata cerca de mi zona?' },
    { label: 'Azúcar más barata', query: '¿Dónde consigo azúcar más barata cerca de Monte Chingolo / Lanús?' },
    { label: '¿Cuotas o contado?', query: '¿Con la inflación actual conviene pagar en cuotas o de contado?' },
    { label: 'Chino vs mayorista', query: '¿Qué productos conviene comprar en el chino y cuáles en el mayorista?' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = String(customText ?? inputText).trim();
    if (!textToSend || isLoading) return;

    if (!consumeAiQuery()) {
      setInputText('');
      return;
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const replyText = await askEconomicCopilot({
        prompt: textToSend,
        userProfile,
        productsCatalog,
        recentTickets,
        inflationData,
        chatHistory: messages,
      });

      setMessages((current) => [
        ...current,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Hubo un error al consultar el asistente. Probá nuevamente en unos segundos.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.warn('Unable to copy assistant response.', error);
    }
  };

  const handleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
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
      setIsListening(true);
      window.setTimeout(() => {
        setIsListening(false);
        setInputText('¿Dónde consigo azúcar más barata cerca?');
      }, 1200);
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
      return;
    }

    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      setInputText(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const resetChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: `reset_${Date.now()}`,
        role: 'assistant',
        text: `Historial reiniciado. ¿En qué te ayudo a ahorrar hoy, ${userProfile.name.split(' ')[0]}?`,
        timestamp: new Date(),
      },
    ]);
  };

  const usageLabel = isPro
    ? 'Plan Pro · IA sin límite'
    : `Plan Free · ${remainingQueries} consulta${remainingQueries === 1 ? '' : 's'} restante${remainingQueries === 1 ? '' : 's'}`;

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/20 text-sky-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">ECONOM-IA Copiloto</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-400">
                Contexto activo: {userProfile.ciudad} · {usageLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            title="Reiniciar conversación"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isPro && <UpgradeBanner remainingQueries={remainingQueries} onUpgrade={upgradeToPro} />}

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const formattedLines = msg.text.split('\n');

          return (
            <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isUser ? 'bg-sky-500 text-slate-950' : 'border border-slate-700 bg-slate-800 text-sky-400'}`}>
                {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${isUser ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white' : 'border border-slate-800 bg-slate-950 text-slate-200'}`}>
                <div className="space-y-1.5 whitespace-pre-line">
                  {formattedLines.map((line, index) => {
                    const segments = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={index} className={line.startsWith('-') || line.startsWith('•') ? 'pl-2 text-slate-300' : ''}>
                        {segments.map((segment, segmentIndex) => {
                          if (segment.startsWith('**') && segment.endsWith('**')) {
                            return <strong key={segmentIndex}>{segment.slice(2, -2)}</strong>;
                          }
                          return <React.Fragment key={segmentIndex}>{segment}</React.Fragment>;
                        })}
                      </p>
                    );
                  })}
                </div>

                {!isUser && (
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                    <span className="font-mono">{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => handleSpeak(msg.id, msg.text)} className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-sky-400" title="Escuchar respuesta">
                        {speakingId === msg.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                      <button type="button" onClick={() => handleCopy(msg.id, msg.text)} className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white" title="Copiar respuesta">
                        {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-sky-400">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">
              <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.4s]" />
              <span>La IA está analizando tus datos...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-800/80 bg-slate-950/40 px-4 py-2">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleSendMessage(item.query)}
              disabled={isLoading || limitReached}
              className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition hover:border-sky-500/40 hover:bg-sky-500/20 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 border-t border-slate-800 bg-slate-950 p-3"
      >
        <button
          type="button"
          onClick={toggleMic}
          disabled={limitReached}
          className={`rounded-xl border p-2.5 transition ${isListening ? 'animate-pulse border-rose-500 bg-rose-500/20 text-rose-400' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-40`}
          title={isListening ? 'Escuchando...' : 'Hablar por micrófono'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          disabled={limitReached}
          placeholder={limitReached ? 'Límite Free alcanzado · hacé Upgrade para continuar' : 'Consultá precios, sueldo, cuotas o inflación...'}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || limitReached}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 p-2.5 font-bold text-slate-950 shadow-md shadow-sky-500/20 transition hover:from-sky-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          title={limitReached ? 'Upgrade a Pro para continuar' : 'Enviar consulta'}
        >
          {limitReached ? <Crown className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
