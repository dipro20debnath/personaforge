'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BookOpen, ExternalLink, Play, Check } from 'lucide-react';

export default function LearningPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const load = () => api.getLearningPaths().then(setPaths).catch(console.error);
  useEffect(() => { load(); }, []);

  const enroll = async (id: string) => { await api.enrollPath(id); load(); };
  const updateProgress = async (id: string, progress: number) => { await api.updateProgress(id, progress); load(); };

  const diffColors: Record<string,string> = { beginner:'bg-green-100 text-green-700', intermediate:'bg-yellow-100 text-yellow-700', advanced:'bg-red-100 text-red-700' };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><BookOpen size={28}/> Learning Paths</h1>
      <p className="text-gray-500 mb-8">Free curated resources to help you grow</p>
      <div className="grid md:grid-cols-2 gap-6">
        {paths.map(p => (
          <div key={p.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <span className={`badge ${diffColors[p.difficulty]||'bg-gray-100'}`}>{p.difficulty}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{p.description}</p>
            {p.enrolled && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-bold">{Math.round(p.progress)}%</span></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full bg-brand-600 rounded-full transition-all" style={{width:`${p.progress}%`}}/></div>
                <input type="range" className="w-full mt-2" min={0} max={100} value={p.progress} onChange={e=>updateProgress(p.id,+e.target.value)}/>
              </div>
            )}
            <div className="space-y-2 mb-4">
              {p.resources.map((r: any, i: number) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                  <ExternalLink size={14} className="text-brand-600"/><span className="flex-1">{r.title}</span><span className="badge bg-gray-100 dark:bg-gray-800 text-xs">{r.type}</span>
                </a>
              ))}
            </div>
            {!p.enrolled ? (
              <button onClick={()=>enroll(p.id)} className="btn-primary w-full flex items-center justify-center gap-2"><Play size={18}/> Enroll</button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium"><Check size={18}/> Enrolled — {p.duration_weeks} weeks</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
