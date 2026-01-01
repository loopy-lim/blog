"use client";

export default function GradientBackground() {
  return (
    <div className="absolute top-0 left-0 z-0 h-full min-h-screen w-full overflow-hidden">
      {/* 간단한 CSS 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* 움직이는 원들 */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-88 h-88 bg-pink-300 rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-cyan-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-76 h-76 bg-violet-300 rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-2/3 left-20 w-84 h-84 bg-teal-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 left-3/4 w-68 h-68 bg-rose-300 rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-92 h-92 bg-amber-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-300 rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: '4.5s' }}></div>
      </div>
    </div>
  );
}
