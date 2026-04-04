'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CheckSquare, Plus, Trash2, Flame, Check } from 'lucide-react';

const icons = ['✅','📖','🏃','🧘','💧','🎯','💪','🎨','📝','🛏️'];

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', icon:'✅' });

  const load = () => api.getHabits().then(setHabits).catch(console.error);
  useEffect(() => { load(); }, []);

  const addHabit = async () => {
    if (!form.title) return;
    await api.addHabit(form);
    setForm({ title:'', description:'', icon:'✅' });
    setShowAdd(false);
    load();
  };

  const checkin = async (id: string) => {
    try { await api.checkinHabit(id); load(); } catch(e: any) { alert(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold flex items-center gap-2"><CheckSquare size={28}/> Habits</h1><p className="text-gray-500 mt-1">Build consistent habits with daily check-ins and streaks</p></div>
        <button onClick={()=>setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2"><Plus size={18}/> New Habit</button>
      </div>
      {showAdd && (
        <div className="card mb-6 max-w-lg">
          <h3 className="font-semibold mb-4">Create New Habit</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Habit name (e.g., Read 20 minutes)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <textarea className="input h-16 resize-none" placeholder="Description (optional)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <div><label className="text-xs text-gray-500 mb-1 block">Icon</label>
              <div className="flex gap-2 flex-wrap">{icons.map(ic => (
                <button key={ic} onClick={()=>setForm({...form,icon:ic})} className={`text-2xl p-2 rounded-xl transition-all ${form.icon===ic?'bg-brand-100 dark:bg-brand-900/30 ring-2 ring-brand-500':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{ic}</button>
              ))}</div>
            </div>
            <button onClick={addHabit} className="btn-primary">Create Habit</button>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map(h => (
          <div key={h.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{h.icon}</span>
                <div>
                  <h3 className="font-semibold">{h.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame size={14} className="text-orange-500"/><span className="text-sm font-bold text-orange-500">{h.streak} day streak</span>
                    <span className="text-xs text-gray-400">Best: {h.best_streak}</span>
                  </div>
                </div>
              </div>
              <button onClick={async()=>{if(confirm('Delete?')){await api.deleteHabit(h.id);load();}}} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
            <div className="flex gap-1 mb-3">{[...Array(7)].map((_,i) => {
              const d = new Date(); d.setDate(d.getDate()-6+i);
              const day = d.toISOString().split('T')[0];
              const checked = h.checkins?.some((c:any) => c.day===day);
              return <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs ${checked?'bg-green-500 text-white':'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>{d.toLocaleDateString('en',{weekday:'narrow'})}</div>;
            })}</div>
            <button onClick={()=>checkin(h.id)} disabled={h.completedToday}
              className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${h.completedToday ? 'bg-green-100 dark:bg-green-900/20 text-green-600 cursor-default' : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'}`}>
              {h.completedToday ? <><Check size={18}/> Done Today</> : <><CheckSquare size={18}/> Check In</>}
            </button>
          </div>
        ))}
      </div>
      {habits.length===0 && <div className="text-center py-16 text-gray-400"><CheckSquare size={48} className="mx-auto mb-4 opacity-50"/><p>No habits yet. Start building good habits!</p></div>}
    </div>
  );
}
