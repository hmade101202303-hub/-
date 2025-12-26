
import React, { useState } from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Home } from './components/Home';
import { AIChat } from './components/AIChat';
import { Admin } from './components/Admin';
import { Heart, Home as HomeIcon, MessageCircle, Settings, Shield } from 'lucide-react';
import { MedicineCard } from './components/MedicineCard';

const FavoritesView = () => {
  const { medicines, favorites } = usePharmacy();
  const favMeds = medicines.filter(m => favorites.has(m.id));

  return (
    <div className="p-4 pb-28 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-8 pt-4">
        <h2 className="text-3xl font-black text-gray-800">المفضلة</h2>
        <div className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-bold">
          {favMeds.length} عنصر
        </div>
      </div>
      
      {favMeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
            <Heart size={48} className="text-gray-200" />
          </div>
          <p className="text-lg font-medium">لا توجد أدوية في المفضلة بعد</p>
          <p className="text-sm opacity-60">اضغط على القلب لحفظ أدويتك الهامة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favMeds.map(med => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      )}
    </div>
  );
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'fav' | 'chat' | 'admin'>('home');

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-gray-50 flex flex-col shadow-2xl shadow-teal-900/20 overflow-hidden">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {activeTab === 'home' && <Home />}
        {activeTab === 'fav' && <FavoritesView />}
        {activeTab === 'chat' && <AIChat />}
        {activeTab === 'admin' && <Admin />}
      </div>

      {/* Bottom Navigation - Elevated Style */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around py-4 px-6 z-[100] rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'home' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <HomeIcon size={24} className={activeTab === 'home' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold">الرئيسية</span>
          {activeTab === 'home' && <div className="absolute -bottom-2 w-1 h-1 bg-teal-600 rounded-full"></div>}
        </button>
        
        <button 
          onClick={() => setActiveTab('fav')}
          className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'fav' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Heart size={24} className={activeTab === 'fav' ? 'scale-110 fill-teal-600' : ''} />
          <span className="text-[10px] font-bold">المفضلة</span>
          {activeTab === 'fav' && <div className="absolute -bottom-2 w-1 h-1 bg-teal-600 rounded-full"></div>}
        </button>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'chat' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <div className="p-3 bg-teal-600 rounded-2xl -mt-10 shadow-lg shadow-teal-500/40 text-white transform hover:rotate-12 transition-transform">
             <MessageCircle size={28} />
          </div>
          <span className="text-[10px] font-extrabold text-teal-700 mt-1">الذكاء الاصطناعي</span>
        </button>

        <button 
          onClick={() => setActiveTab('admin')}
          className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'admin' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Shield size={24} className={activeTab === 'admin' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold">الإدارة</span>
          {activeTab === 'admin' && <div className="absolute -bottom-2 w-1 h-1 bg-teal-600 rounded-full"></div>}
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PharmacyProvider>
      <MainContent />
    </PharmacyProvider>
  );
};

export default App;
