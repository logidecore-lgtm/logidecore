'use client';

import React, { useState } from 'react';

export default function FloatingButtons({ orderId }: { orderId?: string }) {
  const [supportOpen, setSupportOpen] = useState(false);
  const phoneNumber = '919999999999'; // Simulated business WhatsApp number
  
  const mainMessage = encodeURIComponent('Hello,\nI am interested in Acrylic Photo Frames.');
  const orderMessage = encodeURIComponent(`Hello,\nMy Order ID is ${orderId || 'XXXXX'}.\n\nPlease help.`);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${orderId ? orderMessage : mainMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4 items-end">
      {/* Support Chat Box Popover */}
      {supportOpen && (
        <div className="bg-white border border-outline-variant/50 p-6 rounded shadow-xl w-80 animate-in slide-in-from-bottom-5 duration-300 mb-2">
          <h4 className="font-serif text-lg mb-2">Logidecore Studio Support</h4>
          <p className="text-xs text-on-surface-variant mb-4">
            How can we assist you with your personalized art piece today?
          </p>
          <div className="space-y-2">
            <a
              href={`https://wa.me/${phoneNumber}?text=${mainMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined">chat</span>
              General Art Consultation
            </a>
            <a
              href={`https://wa.me/${phoneNumber}?text=${orderMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full p-3 bg-primary/5 hover:bg-primary/10 text-primary rounded transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Order & Tracking Support
            </a>
          </div>
        </div>
      )}

      {/* Main Support Toggle Button */}
      <button
        onClick={() => setSupportOpen(!supportOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <span className="material-symbols-outlined text-[28px]">
          {supportOpen ? 'close' : 'chat_bubble'}
        </span>
      </button>

      {/* Direct WhatsApp Quick Chat FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        title="WhatsApp Support"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.978L2 22l5.177-1.357A9.948 9.948 0 0 0 12.01 22c5.506 0 9.989-4.478 9.99-9.984C22 6.509 17.518 2 12.012 2zm5.727 14.152c-.253.708-1.47 1.298-2.022 1.382-.501.077-1.154.141-3.328-.758-2.779-1.15-4.57-3.988-4.71-4.172-.138-.184-1.127-1.499-1.127-2.862 0-1.363.714-2.032.967-2.308.253-.276.553-.345.736-.345.184 0 .368.002.529.01.168.008.396-.064.621.48.229.553.784 1.91.853 2.048.069.138.115.3.023.483-.092.184-.138.3-.276.46-.138.161-.292.359-.418.482-.138.136-.282.285-.121.56.161.276.717 1.183 1.536 1.91.1.088.196.173.287.25.703.626 1.309.825 1.579.913.27.088.429.04.59-.145.161-.184.69-.805.874-1.081.184-.276.368-.23.621-.138.253.092 1.61.759 1.886.897.276.138.46.207.529.322.069.115.069.667-.184 1.375z" />
        </svg>
      </a>

      {/* Back to top icon */}
      <button
        className="w-14 h-14 bg-primary text-white rounded flex items-center justify-center shadow-lg hover:bg-secondary transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </div>
  );
}
