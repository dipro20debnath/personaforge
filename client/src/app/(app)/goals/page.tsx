'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Target, Plus, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [form, setForm] = useState({ title:'', description:'', metric:'', target_value:100, due_at:'', category:'personal' });

  const load = () => api.getGoals().then(setGoals).catch(console.error);
  useEffect(() => { load(); }, []);

  const addGoal = async () => {
    if (!form.title) return;
    await api.addGoal(form);
    setForm({ title:'', description:'', metric:'', target_value:100, due_at:'', category:'personal' });
    setShowAdd(false);
    load();
  };

  const updateProgress = async (id: string, current_value: number) => {
    await api.updateGoal(id, { current_value });
    load();
  };

  const complete = async (id: string, title: string) => {
    await api.updateGoal(id, { status: 'completed', title });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold flex items-center gap-2"><Target size={28}/> Goals</h1><p className="text-gray-500 mt-1">Set SMART goals and track your progress</p></div>
        <button onClick={()=>setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2"><Plus size={18}/> New Goal</button>
      </div>
      {showAdd && (
        <div className="card mb-6 max-w-lg">
          <h3 className="font-semibold mb-4">Create New Goal</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Goal title (e.g., Learn React in 30 days)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <textarea className="input h-20 resize-none" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Metric (e.g., %)" value={form.metric} onChange={e=>setForm({...form,metric:e.target.value})}/>
              <input type="number" className="input" placeholder="Target value" value={form.target_value} onChange={e=>setForm({...form,target_value:+e.target.value})}/>
            </div>
            <input type="date" className="input" value={form.due_at} onChange={e=>setForm({...form,due_at:e.target.value})}/>
            <button onClick={addGoal} className="btn-primary">Create Goal</button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {goals.map(g => {
          const pct = Math.round((g.current_value / g.target_value) * 100);
          const isExpanded = expanded === g.id;
          return (
            <div key={g.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={()=>setExpanded(isExpanded?null:g.id)}>{isExpanded?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{g.title}</h3>
                      <span className={`badge ${g.status==='completed'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{g.status}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className={`h-full rounded-full transition-all ${pct>=100?'bg-green-500':'bg-brand-600'}`} style={{width:`${Math.min(100,pct)}%`}}/>
                      </div>
                      <span className="text-sm font-bold">{pct}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {g.status!=='completed' && <button onClick={()=>complete(g.id,g.title)} className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded-lg"><Check size={18}/></button>}
                  <button onClick={async()=>{await api.deleteGoal(g.id);load();}} className="text-gray-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18}/></button>
                </div>
              </div>
              {isExpanded && g.status!=='completed' && (
                <div className="mt-4 pt-4 border-t dark:border-gray-800">
                  <label className="text-sm text-gray-500">Update Progress ({g.current_value}/{g.target_value})</label>
                  <input type="range" className="w-full mt-2" min={0} max={g.target_value} value={g.current_value} onChange={e=>updateProgress(g.id,+e.target.value)}/>
                  {g.description && <p className="text-sm text-gray-500 mt-2">{g.description}</p>}
                  {g.due_at && <p className="text-xs text-gray-400 mt-1">Due: {new Date(g.due_at).toLocaleDateString()}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {goals.length===0 && <div className="text-center py-16 text-gray-400"><Target size={48} className="mx-auto mb-4 opacity-50"/><p>No goals yet. Set your first goal!</p></div>}
    </div>
  );
}
