
import React from 'react';
import { Medicine, MedicineType } from '../types';
import { Pill, Droplets, Syringe, CircleDot, Package, Heart, Plus } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

interface Props {
  medicine: Medicine;
}

const getIcon = (type: MedicineType) => {
  switch (type) {
    case MedicineType.TABLET: return <Pill className="text-teal-600" size={24} />;
    case MedicineType.SYRUP: return <Droplets className="text-blue-500" size={24} />;
    case MedicineType.INJECTION: return <Syringe className="text-red-500" size={24} />;
    case MedicineType.SUPPOSITORY: return <CircleDot className="text-purple-500" size={24} />;
    case MedicineType.SUPPLIES: return <Package className="text-amber-500" size={24} />;
  }
};

export const MedicineCard: React.FC<Props> = ({ medicine }) => {
  const { toggleFavorite, favorites } = usePharmacy();
  const isFav = favorites.has(medicine.id);

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden flex flex-col relative group active:scale-95 transition-transform duration-300">
      {/* Favorite Button */}
      <button 
        onClick={() => toggleFavorite(medicine.id)}
        className="absolute top-3 left-3 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl z-20 shadow-sm border border-gray-100 hover:scale-110 transition-transform"
      >
        <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : "text-gray-300"} />
      </button>

      {/* Image / Icon Area */}
      <div className="h-28 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <div className="transform group-hover:scale-125 transition-transform duration-500">
          {getIcon(medicine.type)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
          <span className="text-[10px] text-teal-700 font-black tracking-wider uppercase">{medicine.type}</span>
        </div>
        
        <h3 className="text-gray-800 font-black text-sm leading-tight mb-4 line-clamp-2">{medicine.name}</h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="text-teal-800 font-black text-lg">{medicine.price}</span>
              <span className="text-[10px] text-gray-400 font-bold">ج.م</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${medicine.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></div>
              <span className={`text-[9px] font-bold ${medicine.isAvailable ? 'text-green-700' : 'text-red-500'}`}>
                {medicine.isAvailable ? 'متاح فوري' : 'غير متوفر'}
              </span>
            </div>
          </div>

          <button 
            disabled={!medicine.isAvailable}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              medicine.isAvailable 
                ? 'bg-teal-600 text-white shadow-teal-500/20 hover:bg-teal-700 active:bg-teal-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
