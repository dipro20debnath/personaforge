'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart3, Plus, Trash2, Save } from 'lucide-react';

const categories = ['technical','communication','leadership','creative','analytical','personal'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', category:'general', self_level:1, target_level:5, world_avg:3.0 });

  const load = () => api.getSkills().then(setSkills).catch(console.error);
  useEffect(() => { load(); }, []);

  const addSkill = async () => {
    if (!form.name) return;
    await api.addSkill(form);
    setForm({ name:'', category:'general', self_level:1, target_level:5, world_avg:3.0 });
    setShowAdd(false);
    load();
  };

  const updateLevel = async (id: string, level: number) => {
    await api.updateSkill(id, { self_level: level });
    load();
  };

  const deleteSkill = async (id: string) => {
    if (confirm('Delete this skill?')) { await api.deleteSkill(id); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><BarChart3 size={28}/> Skills</h1>
          <p className="text-gray-500 mt-1">Track your skills and compare with world benchmarks</p>
        </div>
        <button onClick={()=>setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2"><Plus size={18}/> Add Skill</button>
      </div>

      {showAdd && (
        <div className="card mb-6 max-w-lg">
          <h3 className="font-semibold mb-4">Add New Skill</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Skill name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-gray-500">Your Level (1-10)</label><input type="number" className="input" min={1} max={10} value={form.self_level} onChange={e=>setForm({...form,self_level:+e.target.value})}/></div>
              <div><label className="text-xs text-gray-500">Target Level</label><input type="number" className="input" min={1} max={10} value={form.target_level} onChange={e=>setForm({...form,target_level:+e.target.value})}/></div>
              <div><label className="text-xs text-gray-500">World Avg</label><input type="number" className="input" min={1} max={10} step={0.5} value={form.world_avg} onChange={e=>setForm({...form,world_avg:+e.target.value})}/></div>
            </div>
            <button onClick={addSkill} className="btn-primary flex items-center gap-2"><Save size={16}/> Save Skill</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(s => {
          const pct = (s.self_level / 10) * 100;
          const worldPct = (s.world_avg / 10) * 100;
          const diff = s.self_level - s.world_avg;
          return (
            <div key={s.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 text-xs capitalize">{s.category}</span>
                </div>
                <button onClick={()=>deleteSkill(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1"><span>You: {s.self_level}/10</span><span className={`font-bold ${diff>=0?'text-green-600':'text-red-500'}`}>{diff>=0?'+':''}{diff.toFixed(1)} vs world</span></div>
                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="absolute h-full bg-brand-600 rounded-full transition-all" style={{width:`${pct}%`}}/>
                  <div className="absolute h-full w-0.5 bg-red-500" style={{left:`${worldPct}%`}} title="World Average"/>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {[...Array(10)].map((_,i) => (
                  <button key={i} onClick={()=>updateLevel(s.id,i+1)} className={`flex-1 h-2 rounded-full transition-all ${i<s.self_level?'bg-brand-500':'bg-gray-200 dark:bg-gray-700'} hover:bg-brand-400`}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {skills.length === 0 && <div className="text-center py-16 text-gray-400"><BarChart3 size={48} className="mx-auto mb-4 opacity-50"/><p>No skills tracked yet. Add your first skill!</p></div>}
    </div>
  );
}
