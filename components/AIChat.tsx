
import React, { useState, useRef, useEffect } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Send, Bot, User, ShieldAlert, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const { chatHistory, addToChat } = usePharmacy();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    addToChat({ text: userMsg, sender: 'user' });
    
    setIsTyping(true);
    const response = await getGeminiResponse(userMsg);
    setIsTyping(false);
    
    addToChat({ text: response, sender: 'ai' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 overflow-hidden w-full absolute inset-0 z-[40]">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 pt-8 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-xl flex items-center gap-2">
              الصيدلي الذكي
              <Sparkles size={16} className="text-teal-200 animate-pulse" />
            </h2>
            <p className="text-teal-50 text-xs opacity-80">متصل الآن لمساعدتك</p>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 border-b border-amber-100 shrink-0">
        <ShieldAlert size={14} className="text-amber-600 shrink-0" />
        <p className="text-[10px] text-amber-800 font-medium">تنبيه: المعلومات المقدمة استرشادية ولا تغني عن كشف الطبيب.</p>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
        dir="rtl"
      >
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mb-4 animate-bounce">
              <Bot className="text-teal-600" size={40} />
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-2">أهلاً بك في صيدليتك الذكية!</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              يمكنك سؤالي عن الأدوية، بدائلها، أو حتى كيف تقوم بتثبيت هذا التطبيق على هاتفك.
            </p>
          </div>
        )}
        
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} items-end gap-2`}
          >
            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <User size={16} className="text-white" />
              </div>
            )}
            
            <div 
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-white text-gray-800 rounded-tr-none border border-gray-100' 
                  : 'bg-teal-600 text-white rounded-tl-none font-medium'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            {msg.sender === 'ai' && (
              <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-end gap-2 items-end">
            <div className="bg-teal-600/90 px-4 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 pb-10 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            dir="rtl"
            className="w-full bg-gray-100 border-none rounded-2xl pr-4 pl-12 py-4 outline-none focus:ring-2 focus:ring-teal-500/20 text-gray-800 transition-all"
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-teal-600 text-white p-4 rounded-2xl hover:bg-teal-700 disabled:opacity-40 transition-all shadow-lg active:scale-95"
        >
          <Send size={20} className="transform rotate-0" />
        </button>
      </div>
    </div>
  );
};
