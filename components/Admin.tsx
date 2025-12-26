
import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { MedicineType, Medicine } from '../types';
import { PlusCircle, Trash2, Edit3, Image as ImageIcon, Check, X, ShieldCheck, Lock, Save, LayoutIcon } from 'lucide-react';

export const Admin: React.FC = () => {
  const { medicines, addMedicine, removeMedicine, updateMedicine, ads, addAd, removeAd } = usePharmacy();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Medicine Form states
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<MedicineType>(MedicineType.TABLET);
  const [newPrice, setNewPrice] = useState('');
  const [newIsAvailable, setNewIsAvailable] = useState(true);
  
  // Ad Form states
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newAdText, setNewAdText] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '011') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleSaveMed = () => {
    if (!newName || !newPrice) return;
    
    if (editingId) {
      updateMedicine(editingId, {
        name: newName,
        type: newType,
        price: parseFloat(newPrice),
        isAvailable: newIsAvailable
      });
      setEditingId(null);
    } else {
      addMedicine({
        name: newName,
        type: newType,
        price: parseFloat(newPrice),
        isAvailable: newIsAvailable
      });
    }
    
    // Clear form
    setNewName('');
    setNewType(MedicineType.TABLET);
    setNewPrice('');
    setNewIsAvailable(true);
  };

  const startEdit = (med: Medicine) => {
    setEditingId(med.id);
    setNewName(med.name);
    setNewType(med.type);
    setNewPrice(med.price.toString());
    setNewIsAvailable(med.isAvailable);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewName('');
    setNewPrice('');
    setNewIsAvailable(true);
  };

  const handleAddAd = () => {
    if (!newAdUrl && !newAdText) return;
    addAd(newAdUrl || undefined, newAdText || undefined);
    setNewAdUrl('');
    setNewAdText('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="text-teal-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">منطقة المطور</h2>
        <p className="text-gray-500 mb-8">يرجى إدخال كلمة المرور للمتابعة</p>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-500 text-center"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-3 bg-teal-600 p-4 rounded-3xl text-white shadow-lg">
        <ShieldCheck size={28} />
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
      </div>

      {/* Add/Edit Medicine Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ring-2 ring-teal-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-teal-600" size={20} />
            <h3 className="font-bold text-gray-800">{editingId ? 'تعديل بيانات الدواء' : 'إضافة دواء جديد'}</h3>
          </div>
          {editingId && (
            <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="اسم الدواء" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-teal-500"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <select 
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
              value={newType}
              onChange={e => setNewType(e.target.value as MedicineType)}
            >
              {Object.values(MedicineType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="السعر (ج.م)" 
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-teal-500"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
             <span className="text-sm font-bold text-gray-700">حالة التوفر</span>
             <div 
               onClick={() => setNewIsAvailable(!newIsAvailable)}
               className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${newIsAvailable ? 'bg-teal-600' : 'bg-gray-300'}`}
             >
               <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${newIsAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
             </div>
          </div>

          <button 
            onClick={handleSaveMed}
            className={`w-full ${editingId ? 'bg-blue-600' : 'bg-teal-600'} text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors`}
          >
            {editingId ? <Save size={18} /> : <PlusCircle size={18} />}
            {editingId ? 'تحديث البيانات' : 'حفظ الدواء'}
          </button>
        </div>
      </div>

      {/* Manage Ads Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="text-teal-600" size={20} />
          <h3 className="font-bold text-gray-800">إدارة الإعلانات</h3>
        </div>
        <div className="space-y-3 mb-4">
          <input 
            type="text" 
            placeholder="نص الإعلان (اختياري)" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-teal-500"
            value={newAdText}
            onChange={e => setNewAdText(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="رابط الصورة (اختياري)" 
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-teal-500"
              value={newAdUrl}
              onChange={e => setNewAdUrl(e.target.value)}
            />
            <button onClick={handleAddAd} className="bg-teal-600 text-white p-2.5 rounded-xl hover:bg-teal-700 transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {ads.map(ad => (
            <div key={ad.id} className="relative shrink-0 group w-32">
              <div className="aspect-[4/3] bg-teal-50 rounded-xl border overflow-hidden flex items-center justify-center text-[10px] text-teal-800 text-center p-2 leading-tight">
                {ad.url ? (
                   <img src={ad.url} className="absolute inset-0 w-full h-full object-cover" alt="Ad" />
                ) : (
                   <div className="flex flex-col items-center gap-1">
                      <LayoutIcon size={16} />
                      <span>إعلان نصي</span>
                   </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                   <p className="text-white line-clamp-2">{ad.text}</p>
                </div>
              </div>
              <button 
                onClick={() => removeAd(ad.id)}
                className="absolute -top-1 -left-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg z-10"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* List & Edit Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">قائمة الأدوية ({medicines.length})</h3>
        <div className="space-y-3">
          {medicines.map(med => (
            <div key={med.id} className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${editingId === med.id ? 'bg-teal-50 ring-1 ring-teal-200' : 'bg-gray-50'}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{med.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">{med.type}</span>
                  <span className="text-xs font-bold text-teal-700">{med.price} ج.م</span>
                  <span className={`text-[10px] font-bold ${med.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                    {med.isAvailable ? 'متوفر' : 'غير متوفر'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(med)}
                  className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  title="تعديل"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => removeMedicine(med.id)} 
                  className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
