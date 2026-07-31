import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center font-sans space-y-4 animate-in fade-in duration-300">
      {/* Golden loader spinner ring */}
      <div className="w-12 h-12 border-2 border-outline-variant/30 border-t-2 border-t-secondary rounded-full animate-spin" />
      <div className="text-center space-y-1">
        <h4 className="font-serif text-lg font-bold text-primary tracking-tight">Logidecore</h4>
        <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-[0.25em] font-bold">
          Loading Studio...
        </p>
      </div>
    </div>
  );
}
