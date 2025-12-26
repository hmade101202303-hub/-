
import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Search, ShoppingBag, Sparkles } from 'lucide-react';
import { MedicineCard } from './MedicineCard';

export const Home: React.FC = () => {
  const { medicines, ads } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAd, setActiveAd] = useState(0);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAd(prev => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="pb-28 bg-gray-50 min-h-screen">
      {/* Header & Search */}
      <div className="bg-white px-4 pt-8 pb-4 sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between mb-4 px-1">
           <div>
              <h1 className="text-2xl font-black text-teal-700 flex items-center gap-2">
                صيدليتي الذكية
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </h1>
              <p className="text-gray-400 text-xs font-medium">أفضل رعاية صحية في جيبك</p>
           </div>
           <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <ShoppingBag size={22} />
           </div>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="ابحث عن دواء، مكمل غذائي..." 
            className="w-full bg-gray-100 border-2 border-transparent rounded-2xl py-3.5 pr-12 pl-4 focus:bg-white focus:border-teal-500 focus:ring-0 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
        </div>
      </div>

      {/* Carousel Ads */}
      {ads.length > 0 && (
        <div className="p-4">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-[21/10] bg-teal-800 shadow-xl shadow-teal-900/10">
            {ads.map((ad, idx) => (
              <div 
                key={ad.id} 
                className={`absolute inset-0 w-full h-full transition-all duration-1000 transform ${idx === activeAd ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
              >
                {ad.url ? (
                   <img src={ad.url} className="absolute inset-0 w-full h-full object-cover" alt="Ad" />
                ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6">
                  {ad.text && (
                    <div className="flex items-start gap-2">
                       <Sparkles className="text-teal-300 shrink-0 mt-1" size={18} />
                       <p className="text-white font-bold text-lg md:text-xl drop-shadow-md leading-snug">
                         {ad.text}
                       </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {ads.length > 1 && (
              <div className="absolute bottom-4 left-6 flex gap-1.5 z-20">
                {ads.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveAd(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeAd ? 'w-8 bg-teal-400' : 'w-2 bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medicines Section */}
      <div className="px-4 mt-2">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-extrabold text-gray-800">الأدوية المتاحة</h2>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-bold">
            {filteredMedicines.length} صنف
          </div>
        </div>
        
        {filteredMedicines.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-gray-300" size={30} />
            </div>
            <p className="text-gray-400 font-medium">عذراً، لم نجد نتائج لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredMedicines.map(med => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
