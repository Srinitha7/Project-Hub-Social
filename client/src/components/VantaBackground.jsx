import React from 'react';

export const VantaBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#0b0e1b] overflow-hidden">
      
      {/* 1. Subtle Cyber Digital Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" 
      />

      {/* 2. Soft Ambient Neon Orbs (Matching Sample Image Glows) */}
      <div 
        className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-[160px] animate-pulse-slow"
      />
      <div 
        className="absolute top-1/4 -right-40 w-[750px] h-[750px] rounded-full bg-purple-600/25 blur-[180px]"
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] rounded-full bg-indigo-600/20 blur-[160px]"
      />
      <div 
        className="absolute top-1/2 left-10 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[150px]"
      />

      {/* 3. Cyber Tech Circular HUD Vector Rings (Matching Sample Image Background Corners) */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full border border-indigo-500/10 opacity-30 animate-float-slow">
        <div className="absolute inset-8 rounded-full border border-purple-500/15 border-dashed" />
        <div className="absolute inset-20 rounded-full border border-cyan-500/10" />
      </div>

      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full border border-purple-500/15 opacity-35 animate-float-reverse">
        <div className="absolute inset-12 rounded-full border border-blue-500/15 border-dashed" />
        <div className="absolute inset-28 rounded-full border border-indigo-500/10" />
      </div>

      <div className="absolute -bottom-40 -left-20 w-[700px] h-[700px] rounded-full border border-cyan-500/10 opacity-25 animate-float-slow">
        <div className="absolute inset-16 rounded-full border border-purple-500/10 border-dashed" />
      </div>

      {/* 4. Circuit Line Patterns & SVG Trace Network */}
      <svg className="absolute inset-0 w-full h-full opacity-15 stroke-indigo-400/30" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit-pattern" width="240" height="240" patternUnits="userSpaceOnUse">
          <path d="M20 20 h60 v60 h60 M120 20 v80 h60 M160 120 h60 v60 M20 160 h80 v60" fill="none" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="20" cy="20" r="3" className="fill-purple-400" />
          <circle cx="120" cy="20" r="3" className="fill-cyan-400" />
          <circle cx="160" cy="120" r="3" className="fill-indigo-400" />
          <circle cx="20" cy="160" r="3" className="fill-purple-400" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>

      {/* 5. Subtle Floating Glowing Particles */}
      <div className="absolute top-1/5 left-1/6 w-2 h-2 rounded-full bg-cyan-400/60 shadow-[0_0_12px_#22d3ee] animate-ping-slow" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-400/60 shadow-[0_0_12px_#c084fc] animate-ping-slow" />
      <div className="absolute bottom-1/3 left-2/3 w-2 h-2 rounded-full bg-indigo-400/60 shadow-[0_0_12px_#818cf8] animate-ping-slow" />
      <div className="absolute top-1/3 right-12 w-1.5 h-1.5 rounded-full bg-cyan-300/60 shadow-[0_0_10px_#22d3ee]" />
      <div className="absolute bottom-16 left-1/5 w-2 h-2 rounded-full bg-purple-300/60 shadow-[0_0_10px_#d8b4fe]" />
    </div>
  );
};

export default VantaBackground;
