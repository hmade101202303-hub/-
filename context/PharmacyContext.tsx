
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine, MedicineType, AdImage, ChatMessage } from '../types';
import { supabase } from '../services/supabase';

interface PharmacyContextType {
  medicines: Medicine[];
  favorites: Set<string>;
  ads: AdImage[];
  chatHistory: ChatMessage[];
  isLoading: boolean;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  removeMedicine: (id: string) => Promise<void>;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => Promise<void>;
  toggleFavorite: (id: string) => void;
  addAd: (url?: string, text?: string) => Promise<void>;
  removeAd: (id: string) => Promise<void>;
  addToChat: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ads, setAds] = useState<AdImage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: medsData, error: medsError } = await supabase.from('medicines').select('*').order('created_at', { ascending: false });
      const { data: adsData, error: adsError } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      
      if (medsError) throw medsError;
      if (adsError) throw adsError;

      if (medsData) {
        setMedicines(medsData.map(m => ({
          id: m.id,
          name: m.name,
          type: m.type as MedicineType,
          price: m.price,
          isAvailable: m.is_available,
          imageUrl: m.image_url
        })));
      }
      
      if (adsData) setAds(adsData);
    } catch (error) {
      console.error("Database Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedicine = async (med: Omit<Medicine, 'id'>) => {
    const { data, error } = await supabase.from('medicines').insert([{
      name: med.name,
      type: med.type,
      price: med.price,
      is_available: med.isAvailable
    }]).select();

    if (error) {
      console.error("Error adding medicine:", error);
      return;
    }
    
    if (data) {
      const newMed = { 
        id: data[0].id,
        name: data[0].name,
        type: data[0].type as MedicineType,
        price: data[0].price,
        isAvailable: data[0].is_available
      };
      setMedicines(prev => [newMed, ...prev]);
    }
  };

  const removeMedicine = async (id: string) => {
    const { error } = await supabase.from('medicines').delete().eq('id', id);
    if (!error) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateMedicine = async (id: string, updated: Partial<Medicine>) => {
    const dbUpdate: any = {};
    if (updated.name) dbUpdate.name = updated.name;
    if (updated.type) dbUpdate.type = updated.type;
    if (updated.price) dbUpdate.price = updated.price;
    if (updated.isAvailable !== undefined) dbUpdate.is_available = updated.isAvailable;

    const { error } = await supabase.from('medicines').update(dbUpdate).eq('id', id);
    if (!error) {
      setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) newFavs.delete(id);
      else newFavs.add(id);
      return newFavs;
    });
  };

  const addAd = async (url?: string, text?: string) => {
    const { data, error } = await supabase.from('ads').insert([{ url, text }]).select();
    if (!error && data) {
      setAds(prev => [data[0], ...prev]);
    }
  };

  const removeAd = async (id: string) => {
    const { error } = await supabase.from('ads').delete().eq('id', id);
    if (!error) {
      setAds(prev => prev.filter(a => a.id !== id));
    }
  };

  const addToChat = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatHistory(prev => [...prev, { ...msg, id: Date.now().toString(), timestamp: new Date() }]);
  };

  return (
    <PharmacyContext.Provider value={{
      medicines, favorites, ads, chatHistory, isLoading,
      addMedicine, removeMedicine, updateMedicine, toggleFavorite, addAd, removeAd, addToChat
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error("usePharmacy must be used within PharmacyProvider");
  return context;
};
