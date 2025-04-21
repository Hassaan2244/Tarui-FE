import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="h-16 w-16 border-[6px] border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#22d3ee]"></div>
    </div>
  );
}
