import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CopilotWidget from './components/CopilotWidget';
import ChatCopilot from './components/ChatCopilot';
import InflationCalculator from './components/InflationCalculator';
import PriceComparator from './components/PriceComparator';
import TicketScanner from './components/TicketScanner';
import CommunityWaze from './components/CommunityWaze';
import EconomicMap from './components/EconomicMap';
import UserProfileModal from './components/UserProfileModal';
import EconomicTwin from './components/EconomicTwin';
import ExecutiveDossier from './components/ExecutiveDossier';
import SmartShoppingList from './components/SmartShoppingList';
import NeighborhoodIndex from './components/NeighborhoodIndex';
import RetireeModeView from './components/RetireeModeView';

import { 
  INITIAL_USER_PROFILE, 
  PRODUCTS_CATALOG, 
  RECENT_SCANNED_TICKETS, 
  INFLATION_BENCHMARK 
} from './data/mockData';
import { Bot, Sparkles, MessageCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('lista');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isRetireeMode, setIsRetireeMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [showFloatingBubble, setShowFloatingBubble] = useState(false);

  // Local storage state with initial fallbacks
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('economia_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [recentTickets, setRecentTickets] = useState(() => {
    const saved = localStorage.getItem('economia_tickets');
    return saved ? JSON.parse(saved) : RECENT_SCANNED_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('economia_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('economia_tickets', JSON.stringify(recentTickets));
  }, [recentTickets]);

  const handleAskCopilot = (promptText) => {
    setChatPrompt(promptText);
    setActiveTab('chat');
  };

  const handleAddScannedTicket = (ticket) => {
    setRecentTickets(prev => [ticket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        isRetireeMode={isRetireeMode}
        setIsRetireeMode={setIsRetireeMode}
      />

      {/* Main Content Area: Responsive Container or Mobile Android Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-start">
        {isMobileFrame ? (
          /* Mobile Android Frame Simulator */
          <div className="mx-auto w-full max-w-[420px] rounded-[36px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700 shadow-2xl shadow-sky-950/40 relative overflow-hidden my-2">
            {/* Speaker & camera pill */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-8 h-1 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="rounded-[26px] bg-slate-950 min-h-[640px] max-h-[750px] overflow-y-auto no-scrollbar p-3.5 border border-slate-850">
              {renderTabContent()}
            </div>

            {/* Android Navigation Bar gesture pill */}
            <div className="flex justify-center mt-2 py-1">
              <div className="w-28 h-1 rounded-full bg-slate-600/70" />
            </div>
          </div>
        ) : (
          /* Full Wide Responsive View */
          <div className="w-full">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-300">ECONOM-IA</span>
            <span>🇦🇷 El copiloto económico inteligente para Argentina</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Monte Chingolo • Lanús • Conurbano • CABA</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="text-sky-400 hover:text-sky-300 underline"
            >
              Configurar perfil
            </button>
          </div>
        </div>
      </footer>

      {/* Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />

      {/* Modo Burbuja Floating Trigger (From Prompt Specification) */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => {
              setChatPrompt('');
              setActiveTab('chat');
            }}
            className="group flex items-center gap-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-sky-500/30 active:scale-95 transition-all"
            title="Abrir Chat Copiloto IA"
          >
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Copiloto IA</span>
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          </button>
        </div>
      )}
    </div>
  );

  function renderTabContent() {
    switch (activeTab) {
      case 'lista':
        return <SmartShoppingList isRetireeMode={isRetireeMode} />;
      case 'radar_ieb':
        return <NeighborhoodIndex isRetireeMode={isRetireeMode} />;
      case 'jubilado':
        return <RetireeModeView />;
      case 'copiloto':
        return (
          <CopilotWidget
            userProfile={userProfile}
            setActiveTab={setActiveTab}
            onAskCopilot={handleAskCopilot}
            recentTickets={recentTickets}
          />
        );
      case 'gemelo':
        return (
          <EconomicTwin
            userProfile={userProfile}
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'chat':
        return (
          <ChatCopilot
            userProfile={userProfile}
            productsCatalog={PRODUCTS_CATALOG}
            recentTickets={recentTickets}
            inflationData={INFLATION_BENCHMARK}
            initialPrompt={chatPrompt}
          />
        );
      case 'inflacion':
        return (
          <InflationCalculator
            userProfile={userProfile}
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'precios':
        return (
          <PriceComparator
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'tickets':
        return (
          <TicketScanner
            onAddTicket={handleAddScannedTicket}
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'comunidad':
        return (
          <CommunityWaze
            userProfile={userProfile}
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'mapa':
        return (
          <EconomicMap
            userProfile={userProfile}
            onAskCopilot={handleAskCopilot}
            setActiveTab={setActiveTab}
          />
        );
      case 'dossier':
        return <ExecutiveDossier />;
      default:
        return null;
    }
  }
}
