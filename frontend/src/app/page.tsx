'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2, Music2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  async function converterVideo() {
    if (!url) {
      setStatus('error');
      setMessage('Por favor, cole um link do YouTube!');
      return;
    }

    setStatus('loading');
    setMessage('Processando áudio...');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });

      if (!response.ok) throw new Error('Erro ao processar no servidor');

      const header = response.headers.get('Content-Disposition');
      let filename = 'musica_somtube.mp3';
      if (header && header.includes('filename=')) {
        filename = header.split('filename=')[1].replace(/['"]/g, '');
      }

      setStatus('loading');
      setMessage('Baixando para seu dispositivo...');

      const blob = await response.blob();
      const linkDownload = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = linkDownload;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(linkDownload);

      setStatus('success');
      setMessage('Download concluído!');
      setUrl('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (erro) {
      console.error(erro);
      setStatus('error');
      setMessage('Falha na conversão. Verifique o link.');
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-red-500/30 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-xl space-y-8 text-center backdrop-blur-3xl p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 transform rotate-3 hover:rotate-6 transition-all duration-300">
            <Music2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            Som<span className="text-red-500">Tube</span>
          </h1>
          <p className="text-zinc-500 text-lg">Cole o link. Baixe o MP3. Sem complicação.</p>
        </div>

        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-600 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-zinc-900 rounded-xl p-2 border border-zinc-800">
            <input 
              type="text" 
              placeholder="https://www.youtube.com/watch?..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 outline-none text-zinc-200 placeholder:text-zinc-600 w-full"
            />
          </div>
        </div>

        <button 
          onClick={converterVideo}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 ${status === 'loading' ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}
        >
          {status === 'loading' ? <><Loader2 className="w-6 h-6 animate-spin" />{message}</> : <><Download className="w-6 h-6" />Converter Agora</>}
        </button>

        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" /><span>{message}</span>
          </div>
        )}
        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" /><span>{message}</span>
          </div>
        )}
      </div>
      <p className="mt-8 text-zinc-600 text-sm">&copy; 2026 SomTube. Downloads seguros e rápidos.</p>
    </main>
  );
}