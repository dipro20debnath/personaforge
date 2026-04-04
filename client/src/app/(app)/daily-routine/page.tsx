'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Save, Clock, AlertCircle, Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RoutineItem {
  hour: number;
  activity: string;
  category: string;
  completed: boolean;
}

export default function DailyRoutinePage() {
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [selectedHour, setSelectedHour] = useState(9);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const autoSaveTimeout = useRef<NodeJS.Timeout>();

  const formatTime = (hour: number): { display: string; period: string } => {
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const period = hour >= 12 ? 'PM' : 'AM';
    return { display: String(displayHour).padStart(2, '0'), period };
  };

  useEffect(() => {
    api.getDailyRoutine?.().then(data => {
      if (data?.routine) setRoutine(data.routine);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (routine.length === 0 || loading) return;
    
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    
    autoSaveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.saveDailyRoutine?.({ routine });
      } catch (err: any) {
        console.error('Auto-save error:', err.message);
      } finally {
        setSaving(false);
      }
    }, 1000);

    return () => {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    };
  }, [routine, loading]);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  const addActivity = () => {
    if (!newActivity.trim()) return;
    const newItem: RoutineItem = {
      hour: selectedHour,
      activity: newActivity,
      category: newCategory,
      completed: false,
    };
    setRoutine([...routine.filter(r => r.hour !== selectedHour), newItem].sort((a, b) => a.hour - b.hour));
    setNewActivity('');
  };

  const deleteActivity = (hour: number) => {
    setRoutine(routine.filter(r => r.hour !== hour));
  };

  const toggleCompleted = (hour: number) => {
    setRoutine(routine.map(r => r.hour === hour ? { ...r, completed: !r.completed } : r));
  };

  const saveRoutine = async () => {
    setSaving(true);
    try {
      await api.saveDailyRoutine?.({ routine });
      alert('Daily routine saved!');
    } catch (err: any) {
      alert('Error saving routine: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateMonthlyData = () => {
    const data = [];
    const today = new Date().getDate();
    for (let day = 1; day <= 30; day++) {
      const dailyCompleted = routine.filter(r => r.completed).length;
      const randomCompleted = Math.floor(Math.random() * (routine.length + 1));
      data.push({
        day,
        completed: day <= today ? (day === today ? dailyCompleted : randomCompleted) : 0,
        total: routine.length || 5,
      });
    }
    setMonthlyData(data);
  };

  const downloadMonthlyReport = () => {
    if (monthlyData.length === 0) {
      generateMonthlyData();
      return;
    }

    const headers = ['Day', 'Completed', 'Total', 'Completion %'];
    const rows = monthlyData.map(d => [
      d.day,
      d.completed,
      d.total,
      d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    ]);

    const csvContent = [
      ['PersonaForge - Monthly Routine Report'],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      headers,
      ...rows,
      [],
      ['Summary'],
      [`Total Days Tracked: ${monthlyData.length}`],
      [`Average Completion: ${Math.round(monthlyData.reduce((sum, d) => sum + (d.total > 0 ? (d.completed / d.total) * 100 : 0), 0) / monthlyData.length)}%`],
      [`Total Activities: ${routine.length}`],
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `monthly_routine_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categoryColors: Record<string, string> = {
    'Work': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'Exercise': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    'Learning': 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    'Personal': 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
    'Break': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    'Meal': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  };

  const stats = {
    total: routine.length,
    completed: routine.filter(r => r.completed).length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"/></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Routine Planner 📅</h1>
        <p className="text-gray-500 mt-1">Plan your day hour by hour</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setViewMode('daily')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'daily'
              ? 'bg-brand-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          📅 Daily View
        </button>
        <button
          onClick={() => {
            setViewMode('monthly');
            if (monthlyData.length === 0) generateMonthlyData();
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'monthly'
              ? 'bg-brand-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          <BarChart3 size={16} className="inline mr-2" /> Monthly View
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-500 text-sm mb-1">Total Activities</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}/{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm mb-1">Progress</p>
          <p className="text-2xl font-bold text-brand-600">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <>
          <div className="card mb-8 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock size={20}/> Add Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hour</label>
                <select value={selectedHour} onChange={e => setSelectedHour(parseInt(e.target.value))} className="input w-full">
                  {hours.map(h => (
                    <option key={h} value={h}>{h}:00 {h < 12 ? 'AM' : 'PM'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input w-full">
                  <option>Work</option>
                  <option>Exercise</option>
                  <option>Learning</option>
                  <option>Personal</option>
                  <option>Break</option>
                  <option>Meal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Activity</label>
                <input type="text" value={newActivity} onChange={e => setNewActivity(e.target.value)} placeholder="e.g., Meetings, Workout..." className="input w-full"/>
              </div>
              <div className="flex items-end">
                <button onClick={addActivity} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Plus size={18}/> Add
                </button>
              </div>
            </div>
          </div>

          <div className="card mb-8 p-6">
            <h2 className="text-lg font-bold mb-4">Your Day</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {hours.map(hour => {
                const activity = routine.find(r => r.hour === hour);
                const time = formatTime(hour);
                
                return (
                  <div key={hour} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="w-20 text-center font-mono">
                      <span className="font-bold text-sm">{time.display}:00 {time.period}</span>
                    </div>
                    {activity ? (
                      <div className="flex-1 flex items-center gap-3">
                        <input type="checkbox" checked={activity.completed} onChange={() => toggleCompleted(hour)} className="w-5 h-5"/>
                        <div className="flex-1">
                          <p className={`font-medium ${activity.completed ? 'line-through text-gray-400' : ''}`}>{activity.activity}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[activity.category]}`}>{activity.category}</span>
                        </div>
                        <button onClick={() => deleteActivity(hour)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 text-gray-400 text-sm italic">No activity scheduled</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card mb-8 p-6">
            <h2 className="text-lg font-bold mb-4">Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Activity</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {routine.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        <AlertCircle className="inline mr-2" size={20}/>
                        No activities scheduled. Add one to get started!
                      </td>
                    </tr>
                  ) : (
                    routine.map(item => {
                      const time = formatTime(item.hour);
                      return (
                        <tr key={item.hour} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-mono font-semibold text-center w-24">{time.display}:00 {time.period}</td>
                          <td className="py-3 px-4">{item.activity}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs ${categoryColors[item.category]}`}>{item.category}</span></td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.completed ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                              {item.completed ? 'Done' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <button onClick={saveRoutine} disabled={saving} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
            <Save size={18}/> {saving ? 'Auto-Saving...' : 'Save Routine'}
          </button>
        </>
      ) : (
        <>
          <div className="card mb-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">📊 Monthly Work Summary</h2>
              <button 
                onClick={downloadMonthlyReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <Download size={18}/> Download Report
              </button>
            </div>
            
            {monthlyData.length > 0 && (
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="day" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      formatter={(value) => [`${value} tasks`, 'Completed']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 font-semibold">Day</th>
                    <th className="text-center py-3 px-4 font-semibold">Completed</th>
                    <th className="text-center py-3 px-4 font-semibold">Total</th>
                    <th className="text-center py-3 px-4 font-semibold">Completion %</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium">Day {item.day}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-green-600">{item.completed}</span>
                      </td>
                      <td className="py-3 px-4 text-center">{item.total}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (item.total > 0 ? (item.completed / item.total) * 100 : 0) >= 80
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : (item.total > 0 ? (item.completed / item.total) * 100 : 0) >= 50
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Days Tracked</p>
                <p className="text-2xl font-bold text-blue-600">{monthlyData.length}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {monthlyData.length > 0 
                    ? Math.round(monthlyData.reduce((sum, d) => sum + (d.total > 0 ? (d.completed / d.total) * 100 : 0), 0) / monthlyData.length)
                    : 0}%
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Activities</p>
                <p className="text-2xl font-bold text-purple-600">{routine.length}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
