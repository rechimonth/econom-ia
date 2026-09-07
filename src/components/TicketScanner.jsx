import React, { useState } from 'react';
import { 
  Receipt, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Store, 
  TrendingUp, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { RECENT_SCANNED_TICKETS } from '../data/mockData';
import confetti from 'canvas-confetti';

export default function TicketScanner({ onAddTicket, onAskCopilot, setActiveTab }) {
  const [tickets, setTickets] = useState(RECENT_SCANNED_TICKETS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResult, setScannedResult] = useState(null);

  // Pre-configured realistic Argentine supermarket tickets
  const sampleTickets = [
    {
      label: "Ticket Chino de Barrio (Lynch)",
      comercio: "Supermercado Luna (Autoservicio Chino)",
      tipoComercio: "Autoservicio Chino",
      fecha: new Date().toISOString().split('T')[0],
      total: 14750,
      ahorroDetectado: 2600,
      confianzaOCR: 98,
      items: [
        { descripcion: "Yerba Playadito 1kg", cantidad: 1, precioUnitario: 4200, total: 4200 },
        { descripcion: "Aceite Natura Girasol 1.5L", cantidad: 1, precioUnitario: 2650, total: 2650 },
        { descripcion: "Azúcar Ledesma 1kg", cantidad: 2, precioUnitario: 1100, total: 2200 },
        { descripcion: "Fideos Matarazzo 500g", cantidad: 3, precioUnitario: 1450, total: 4350 },
        { descripcion: "Leche sachet 1L", cantidad: 1, precioUnitario: 1350, total: 1350 }
      ]
    },
    {
      label: "Ticket Hipermercado Coto",
      comercio: "Coto C.I.C.S.A. Lanús",
      tipoComercio: "Supermercado Grande",
      fecha: new Date().toISOString().split('T')[0],
      total: 28400,
      ahorroDetectado: 950,
      confianzaOCR: 99,
      items: [
        { descripcion: "Jabón Líquido Skip 3L", cantidad: 1, precioUnitario: 12900, total: 12900 },
        { descripcion: "Detergente Ala Limón", cantidad: 2, precioUnitario: 2550, total: 5100 },
        { descripcion: "Coca-Cola 2.25L", cantidad: 2, precioUnitario: 3950, total: 7900 },
        { descripcion: "Desodorante Rexona", cantidad: 1, precioUnitario: 2500, total: 2500 }
      ]
    }
  ];

  const handleStartScan = (presetTicket = null) => {
    setIsScanning(true);
    setScanProgress(10);
    setScannedResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          finishScan(presetTicket || sampleTickets[0]);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const finishScan = (ticketData) => {
    setTimeout(() => {
      setIsScanning(false);
      const newTicket = {
        ...ticketData,
        id: `ticket_${Date.now()}`
      };
      setScannedResult(newTicket);
      setTickets(prev => [newTicket, ...prev]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 border border-sky-500/20 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Motor OCR de Reconocimiento</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Escaneo Inteligente de Tickets
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Sacá foto a tu ticket de papel (chino o supermercado). La IA extrae automáticamente
          comercio, precios individuales, calcula si pagaste de más y actualiza tu inflación de bolsillo.
        </p>
      </div>

      {/* Upload & Scanner Box */}
      <div className="rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-sky-500/60 transition p-6 text-center">
        {!isScanning && !scannedResult ? (
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Subí o fotografiá tu ticket
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Formatos JPG, PNG, recibos térmicos o tickets manuscritos de autoservicios chinos.
              </p>
            </div>

            {/* Direct Presets to try immediately */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => handleStartScan(sampleTickets[0])}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Simular Ticket Chino ($14.750)</span>
              </button>

              <button
                onClick={() => handleStartScan(sampleTickets[1])}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Simular Ticket Coto ($28.400)</span>
              </button>
            </div>
          </div>
        ) : isScanning ? (
          <div className="max-w-md mx-auto py-6 space-y-4">
            {/* Visual Laser Scanner Line */}
            <div className="relative w-48 h-40 mx-auto rounded-xl bg-slate-950 border border-sky-500/40 overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" 
                style={{ top: `${scanProgress}%`, transition: 'top 0.3s ease' }} 
              />
              <FileText className="w-16 h-16 text-slate-700" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-white">
                Procesando ticket con OCR ({scanProgress}%)...
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Detectando líneas de producto, códigos de barras y total en pesos
              </p>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Scanned Result Banner */
          <div className="max-w-xl mx-auto text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">¡Ticket Procesado con Éxito!</span>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Confiabilidad OCR: {scannedResult.confianzaOCR}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Comercio detectado</span>
                <span className="font-bold text-white text-sm">{scannedResult.comercio}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{scannedResult.tipoComercio}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total pagado</span>
                <span className="font-mono font-extrabold text-white text-lg">
                  $ {scannedResult.total.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">
                  Ahorro estimado: $ {scannedResult.ahorroDetectado.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Extracted Items */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                Ítems reconocidos ({scannedResult.items.length}):
              </span>
              <div className="space-y-1.5 text-xs max-h-44 overflow-y-auto pr-1">
                {scannedResult.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-200">
                      {item.cantidad}x {item.descripcion}
                    </span>
                    <span className="font-mono font-bold text-white">
                      $ {item.total.toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setScannedResult(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Escanear otro ticket
              </button>

              <button
                onClick={() => {
                  onAskCopilot(`Analizá este ticket que acabo de escanear de ${scannedResult.comercio} por $ ${scannedResult.total.toLocaleString('es-AR')}. ¿Qué productos pagué más caros y dónde debería comprarlos la próxima vez?`);
                  setActiveTab('chat');
                }}
                className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-sky-500/20"
              >
                <span>Analizar con IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History of Scanned Tickets */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-sky-400" />
          Historial de Tickets Guardados Automáticamente
        </h3>

        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{t.comercio}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {t.tipoComercio}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {t.fecha}
                  </span>
                  <span>•</span>
                  <span>{t.items.length} productos</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    Ahorro: $ {t.ahorroDetectado.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="font-mono font-extrabold text-base text-white">
                  $ {t.total.toLocaleString('es-AR')}
                </span>
                <button
                  onClick={() => {
                    onAskCopilot(`Revisá el ticket histórico de ${t.comercio} por $ ${t.total.toLocaleString('es-AR')}.`);
                    setActiveTab('chat');
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
