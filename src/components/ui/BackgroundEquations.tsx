import React from 'react';

const equations = [
  "θ_{t+1} = θ_t - η ∇J(θ_t)",
  "L = - ∑ y_i log(ŷ_i)",
  "f(x) = 1 / (1 + e^{-x})",
  "P(y|X) = P(X|y)P(y) / P(X)",
  "MSE = 1/n ∑ (y_i - ŷ_i)²",
  "σ(z)_i = e^{z_i} / ∑ e^{z_j}",
  "w^T x + b = 0",
  "K(x_i, x_j) = exp(-γ ||x_i - x_j||²)",
  "Q(s,a) ← Q(s,a) + α[R + γ max Q(s',a') - Q(s,a)]"
];

export function BackgroundEquations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Scattered patches of equations */}
      <div className="absolute top-[15%] left-[5%] opacity-30 rotate-[-12deg] font-serif italic text-2xl md:text-4xl text-text-secondary select-none hidden md:block">
        {equations[0]}
      </div>
      <div className="absolute top-[35%] right-[10%] opacity-[0.25] rotate-[15deg] font-serif italic text-3xl md:text-5xl text-electric-blue-500 select-none">
        {equations[1]}
      </div>
      <div className="absolute top-[60%] left-[15%] opacity-20 rotate-[-5deg] font-serif italic text-xl md:text-3xl text-text-secondary select-none">
        {equations[2]}
      </div>
      <div className="absolute bottom-[20%] right-[20%] opacity-25 rotate-[8deg] font-serif italic text-2xl md:text-4xl text-cyan-400 select-none hidden md:block">
        {equations[3]}
      </div>
      <div className="absolute top-[80%] left-[8%] opacity-30 rotate-[-20deg] font-serif italic text-2xl md:text-4xl text-text-secondary select-none hidden lg:block">
        {equations[4]}
      </div>
      <div className="absolute top-[10%] right-[30%] opacity-20 rotate-[10deg] font-serif italic text-xl md:text-3xl text-indigo-500 select-none">
        {equations[5]}
      </div>
      <div className="absolute top-[45%] left-[35%] opacity-15 rotate-[-15deg] font-serif italic text-3xl md:text-5xl text-text-secondary select-none hidden lg:block">
        {equations[7]}
      </div>
    </div>
  );
}
