import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
      {children}
    </div>
  );
}

export default Card;