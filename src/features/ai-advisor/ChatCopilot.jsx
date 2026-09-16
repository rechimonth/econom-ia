import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, Copy, Crown, Mic, MicOff, RefreshCw, Send, Sparkles, User, Volume2, VolumeX } from 'lucide-react';
import { askEconomicCopilot, AiApiError } from '../../services/ai/aiCopilot';
import UpgradeBanner from '../../components/ui/UpgradeBanner';
import { useSubscription } from '../../hooks/useSubscription';

export default function ChatCopilot({ userProfile, recentTickets, initialPrompt = '', onPromptConsumed }) {
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', text: `¡Hola ${userProfile.name.split(' ')[0]}! 👋 Soy **ECONOM-IA**, tu copiloto económico para Argentina.\n\nTe ayudo a:\n- 🛒 Encontrar dónde comprar más barato\n- 📊 Analizar tus ingresos y gastos\n- 📈 Entender tu inflación de bolsillo\n- 💳 Comparar cuotas y contado\n\n¿En qué te puedo asesorar hoy?`, timestamp: new Date() }]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const consumedPromptRef = useRef('');
  const { isPro, remainingQueries, limitReached, refresh } = useSubscription();

  const quickPrompts = [
    { label: '¿Estoy gastando demasiado?', query: '¿Estoy gastando demasiado en gastos fijos?' },
    { label: 'Compra mensual más barata', query: '¿Dónde compro la compra mensual más barata cerca de mi zona?' },
    { label: 'Azúcar más barata', query: '¿Dónde consigo azúcar más barata cerca de Monte Chingolo / Lanús?' },
    { label: '¿Cuotas o contado?', query: '¿Con la inflación actual conviene pagar en cuotas o de contado?' },
    { label: 'Chino vs mayorista', query: '¿Qué productos conviene comprar en el chino y cuáles en el mayorista?' },
  ];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  useEffect(() => {
    const prompt = initialPrompt?.trim();
    if (!prompt || consumedPromptRef.current === prompt) return;
    consumedPromptRef.current = prompt;
    void handleSendMessage(prompt);
    onPromptConsumed?.();
  }, [initialPrompt, onPromptConsumed]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = String(customText ?? inputText).trim();
    if (!textToSend || isLoading || requestInFlightRef.current || limitReached) return;
    requestInFlightRef.current = true;
    setInputText('');
    setIsLoading(true);
    setMessages((current) => [...current, { id: `user_${Date.now()}`, role: 'user', text: textToSend, timestamp: new Date() }]);
    try {
      const replyText = await askEconomicCopilot({ prompt: textToSend, userProfile, recentTickets, chatHistory: messages });
      setMessages((current) => [...current, { id: `ai_${Date.now()}`, role: 'assistant', text: replyText, timestamp: new Date() }]);
      await refresh();
    } catch (error) {
      console.error(error);
      if (error instanceof AiApiError && ['AI_QUOTA_EXCEEDED', 'AUTH_REQUIRED', 'AUTH_INVALID'].includes(error.code)) await refresh();
      const text = error instanceof AiApiError && ['AUTH_REQUIRED', 'AUTH_INVALID'].includes(error.code)
        ? 'Tu sesión expiró. Iniciá sesión nuevamente para continuar.'
        : error instanceof AiApiError && error.code === 'AI_QUOTA_EXCEEDED'
          ? 'Alcanzaste el límite mensual disponible para tu plan. Revisá los planes Pro para continuar.'
          : error instanceof AiApiError && error.code === 'AI_RATE_LIMITED'
            ? 'Se alcanzó el límite temporal de solicitudes. Esperá unos segundos y probá nuevamente.'
            : 'Hubo un error al consultar el asistente. Probá nuevamente en unos segundos.';
      setMessages((current) => [...current, { id: `err_${Date.now()}`, role: 'assistant', text, timestamp: new Date() }]);
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleCopy = async (id, text) => {
    try { await navigator.clipboard.writeText(text); setCopiedId(id); window.setTimeout(() => setCopiedId(null), 2000); }
    catch (error) { console.warn('Unable to copy assistant response.', error); }
  };

  const handleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, ''));
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (limitReached || isLoading) return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsListening(true); window.setTimeout(() => { setIsListening(false); setInputText('¿Dónde consigo azúcar más barata cerca?'); }, 1200); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR'; recognition.continuous = false; recognition.interimResults = false;
    if (isListening) { recognition.stop(); setIsListening(false); return; }
    setIsListening(true); recognition.start();
    recognition.onresult = (event) => { setInputText(event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const resetChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([{ id: `reset_${Date.now()}`, role: 'assistant', text: `Historial reiniciado. ¿En qué te ayudo a ahorrar hoy, ${userProfile.name.split(' ')[0]}?`, timestamp: new Date() }]);
  };

  const usageLabel = isPro ? `Plan Pro · ${remainingQueries} consultas disponibles este mes` : `Plan Free · ${remainingQueries} consulta${remainingQueries === 1 ? '' : 's'} restante${remainingQueries === 1 ? '' : 's'}`;

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/20 text-sky-400"><Bot className="h-5 w-5" /></div><div><div className="flex items-center gap-1.5"><span className="text-sm font-bold text-white">ECONOM-IA Copiloto</span><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /></div><p className="text-[10px] text-slate-400">Contexto activo: {userProfile.ciudad} · {usageLabel}</p></div></div><button type="button" onClick={resetChat} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200" title="Reiniciar conversación"><RefreshCw className="h-4 w-4" /></button></div></div>
      <UpgradeBanner remainingQueries={remainingQueries} isPro={isPro} />
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => { const isUser = msg.role === 'user'; return <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isUser ? 'bg-sky-500 text-slate-950' : 'border border-slate-700 bg-slate-800 text-sky-400'}`}>{isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}</div><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${isUser ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white' : 'border border-slate-800 bg-slate-950 text-slate-200'}`}><div className="space-y-1.5 whitespace-pre-line">{msg.text.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>{!isUser && <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400"><span className="font-mono">{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => handleSpeak(msg.id, msg.text)}>{speakingId === msg.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}</button><button type="button" onClick={() => handleCopy(msg.id, msg.text)}>{copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}</button></div></div>}</div></div>; })}
        {isLoading && <div className="flex items-start gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-sky-400"><Bot className="h-4 w-4 animate-spin" /></div><div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300">La IA está analizando tus datos...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-slate-800/80 bg-slate-950/40 px-4 py-2"><div className="flex gap-1.5 overflow-x-auto no-scrollbar">{quickPrompts.map((item) => <button key={item.query} type="button" onClick={() => handleSendMessage(item.query)} disabled={isLoading || limitReached} className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 disabled:cursor-not-allowed disabled:opacity-40">{item.label}</button>)}</div></div>
      <form onSubmit={(event) => { event.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 border-t border-slate-800 bg-slate-950 p-3"><button type="button" onClick={toggleMic} disabled={limitReached || isLoading} className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 disabled:opacity-40">{isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</button><input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} disabled={limitReached || isLoading} placeholder={limitReached ? 'Límite mensual alcanzado · revisá los planes Pro' : 'Consultá precios, sueldo, cuotas o inflación...'} className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-sky-500 disabled:opacity-50 sm:text-sm" /><button type="submit" disabled={!inputText.trim() || isLoading || limitReached} className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 p-2.5 font-bold text-slate-950 disabled:opacity-40">{limitReached ? <Crown className="h-4 w-4" /> : <Send className="h-4 w-4" />}</button></form>
    </div>
  );
}
