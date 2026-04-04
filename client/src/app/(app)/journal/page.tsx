'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PenLine, Plus, Trash2, Search, Sparkles } from 'lucide-react';

const moods = ['😊 Great','😐 Okay','😔 Low','😤 Frustrated','🤔 Reflective','😴 Tired'];
const tagOptions = ['gratitude','growth','challenge','idea','work','health','relationships','finance','learning','mindfulness'];

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title:'', content:'', mood:'neutral', tags:[] as string[] });

  const load = (params?: any) => api.getJournal(params).then(setEntries).catch(console.error);
  useEffect(() => { load(); }, []);

  const getPrompt = async () => { const p = await api.getPrompt(); setPrompt(p.prompt); setForm({...form, content: p.prompt + '\n\n'}); };

  const addEntry = async () => {
    if (!form.content) return;
    await api.addJournalEntry(form);
    setForm({ title:'', content:'', mood:'neutral', tags:[] });
    setShowAdd(false);
    setPrompt('');
    load();
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t=>t!==tag) : [...f.tags, tag] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold flex items-center gap-2"><PenLine size={28}/> Journal</h1><p className="text-gray-500 mt-1">Reflect, write, and grow every day</p></div>
        <button onClick={()=>{setShowAdd(!showAdd);if(!showAdd)getPrompt();}} className="btn-primary flex items-center gap-2"><Plus size={18}/> New Entry</button>
      </div>
      {showAdd && (
        <div className="card mb-6 max-w-2xl">
          {prompt && <div className="mb-4 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-sm flex items-center gap-2"><Sparkles size={16} className="text-brand-600"/><span>Prompt: {prompt}</span></div>}
          <div className="space-y-3">
            <input className="input" placeholder="Title (optional)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <textarea className="input h-32 resize-none" placeholder="Write your thoughts..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
            <div><label className="text-xs text-gray-500 mb-1 block">Mood</label>
              <div className="flex gap-2 flex-wrap">{moods.map(m => {
                const val = m.split(' ')[1].toLowerCase();
                return <button key={m} onClick={()=>setForm({...form,mood:val})} className={`px-3 py-1.5 rounded-xl text-sm transition-all ${form.mood===val?'bg-brand-600 text-white':'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'}`}>{m}</button>;
              })}</div>
            </div>
            <div><label className="text-xs text-gray-500 mb-1 block">Tags</label>
              <div className="flex gap-2 flex-wrap">{tagOptions.map(t => (
                <button key={t} onClick={()=>toggleTag(t)} className={`px-3 py-1 rounded-full text-xs transition-all ${form.tags.includes(t)?'bg-brand-600 text-white':'bg-gray-100 dark:bg-gray-800'}`}>{t}</button>
              ))}</div>
            </div>
            <button onClick={addEntry} className="btn-primary">Save Entry (+10 XP)</button>
          </div>
        </div>
      )}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1"><Search size={18} className="absolute left-3 top-3 text-gray-400"/><input className="input pl-10" placeholder="Search journal..." value={search} onChange={e=>{setSearch(e.target.value);load(e.target.value?{search:e.target.value}:undefined);}}/></div>
      </div>
      <div className="space-y-4">
        {entries.map(e => (
          <div key={e.id} className="card">
            <div className="flex justify-between items-start">
              <div><h3 className="font-semibold">{e.title || 'Untitled Entry'}</h3><p className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString()}</p></div>
              <div className="flex items-center gap-2">
                <span className="badge bg-gray-100 dark:bg-gray-800">{e.mood}</span>
                <button onClick={async()=>{await api.deleteJournalEntry(e.id);load();}} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{e.content}</p>
            {e.tags.length > 0 && <div className="flex gap-1 mt-3 flex-wrap">{e.tags.map((t:string) => <span key={t} className="badge bg-brand-100 dark:bg-brand-900/30 text-brand-700 text-xs">{t}</span>)}</div>}
          </div>
        ))}
      </div>
      {entries.length===0 && <div className="text-center py-16 text-gray-400"><PenLine size={48} className="mx-auto mb-4 opacity-50"/><p>Your journal is empty. Start writing!</p></div>}
    </div>
  );
}
