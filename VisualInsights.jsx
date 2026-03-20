@import "tailwindcss";

@layer base {
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
  .dark ::-webkit-scrollbar-thumb { background: #475569; }
}

@layer utilities {
  .gradient-text {
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  }
  .dark .card-hover:hover {
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  }

  .glass {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .dark .glass {
    background: rgba(15,23,42,0.75);
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .dark .shimmer {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }

  @keyframes typing-blink {
    50% { opacity: 0; }
  }
  .typing-cursor::after {
    content: '▋';
    animation: typing-blink 1s step-end infinite;
    margin-left: 2px;
  }

  @keyframes float-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .float-up { animation: float-up 0.4s ease forwards; }

  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  .spin-slow { animation: spin-slow 3s linear infinite; }
}
