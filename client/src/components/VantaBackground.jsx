import React from 'react';

export const VantaBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#070b14] overflow-hidden">
      
      {/* 1. Subtle Digital Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" 
      />

      {/* 2. Soft Glowing Neon Orbs (Cyan, Blue, Purple Accent Glows) */}
      <div 
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-cyan-600/15 blur-[140px] animate-pulse-slow"
      />
      <div 
        className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-indigo-600/18 blur-[150px]"
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-[160px]"
      />

      {/* 3. Blurred Geometric Shapes (Cyber Diamonds / Hexagons) */}
      <div className="absolute top-20 right-1/4 w-72 h-72 border border-cyan-500/15 rounded-3xl transform rotate-45 blur-[2px] opacity-40 animate-float-slow" />
      <div className="absolute bottom-32 left-10 w-96 h-96 border border-purple-500/15 rounded-full transform -rotate-12 blur-[2px] opacity-30 animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-indigo-500/10 rounded-2xl transform rotate-12 blur-[1px] opacity-25" />

      {/* 4. Circuit-Line Patterns & SVG Trace Network */}
      <svg className="absolute inset-0 w-full h-full opacity-20 stroke-cyan-500/30" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M20 20 h40 v40 h40 M100 20 v60 h40 M140 100 h40 v40 M20 120 h60 v40" fill="none" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="20" cy="20" r="3" className="fill-cyan-400" />
          <circle cx="100" cy="20" r="3" className="fill-indigo-400" />
          <circle cx="140" cy="100" r="3" className="fill-purple-400" />
          <circle cx="20" cy="120" r="3" className="fill-cyan-400" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>

      {/* 5. Very Subtle Futuristic Floating Particles */}
      <div className="absolute top-1/6 left-1/5 w-2 h-2 rounded-full bg-cyan-400/50 shadow-[0_0_10px_#06b6d4] animate-ping-slow" />
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-indigo-400/50 shadow-[0_0_10px_#6366f1] animate-ping-slow" />
      <div className="absolute bottom-1/4 left-2/3 w-2 h-2 rounded-full bg-purple-400/50 shadow-[0_0_10px_#a855f7] animate-ping-slow" />
      <div className="absolute top-1/3 right-10 w-1.5 h-1.5 rounded-full bg-cyan-300/60 shadow-[0_0_8px_#22d3ee]" />
      <div className="absolute bottom-12 left-1/4 w-2 h-2 rounded-full bg-indigo-300/60 shadow-[0_0_8px_#818cf8]" />
    </div>
  );
};

export default VantaBackground;
