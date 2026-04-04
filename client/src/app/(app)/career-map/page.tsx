'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Map, ChevronRight } from 'lucide-react';

const careerPaths = [
  { id:'tech', title:'Technology & Engineering', roles:['Junior Developer','Mid-Level Developer','Senior Developer','Tech Lead','CTO'], skills:['JavaScript','Python','System Design','Leadership','Cloud'], icon:'💻' },
  { id:'business', title:'Business & Management', roles:['Analyst','Manager','Senior Manager','Director','VP'], skills:['Communication','Analytics','Strategy','Leadership','Finance'], icon:'📊' },
  { id:'creative', title:'Creative & Design', roles:['Junior Designer','Designer','Senior Designer','Design Lead','Creative Director'], skills:['UI/UX','Typography','Prototyping','Brand Strategy','Leadership'], icon:'🎨' },
  { id:'data', title:'Data & AI', roles:['Data Analyst','Data Scientist','Senior Data Scientist','ML Lead','Chief Data Officer'], skills:['Python','Statistics','Machine Learning','Deep Learning','Strategy'], icon:'🤖' },
];

export default function CareerMapPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [selected, setSelected] = useState<string|null>(null);

  useEffect(() => { api.getSkills().then(setSkills); }, []);

  const getMatchPct = (requiredSkills: string[]) => {
    const matched = requiredSkills.filter(rs => skills.some(s => s.name.toLowerCase().includes(rs.toLowerCase())));
    return Math.round((matched.length / requiredSkills.length) * 100);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Map size={28}/> Career Map</h1>
      <p className="text-gray-500 mb-8">Explore career paths and see how your skills match</p>
      <div className="grid md:grid-cols-2 gap-6">
        {careerPaths.map(cp => {
          const match = getMatchPct(cp.skills);
          const isSelected = selected === cp.id;
          return (
            <div key={cp.id} className={`card cursor-pointer transition-all ${isSelected?'ring-2 ring-brand-500':''}`} onClick={()=>setSelected(isSelected?null:cp.id)}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cp.icon}</span>
                <div className="flex-1"><h3 className="text-lg font-semibold">{cp.title}</h3><p className="text-sm text-gray-500">Skill Match: <span className={`font-bold ${match>=60?'text-green-600':match>=30?'text-yellow-600':'text-red-500'}`}>{match}%</span></p></div>
                <ChevronRight size={20} className={`transition-transform ${isSelected?'rotate-90':''}`}/>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"><div className={`h-full rounded-full ${match>=60?'bg-green-500':match>=30?'bg-yellow-500':'bg-red-500'}`} style={{width:`${match}%`}}/></div>
              {isSelected && (
                <div className="pt-4 border-t dark:border-gray-800">
                  <h4 className="text-sm font-semibold mb-3">Career Progression</h4>
                  <div className="space-y-2">{cp.roles.map((r,i) => (
                    <div key={r} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-brand-600 text-white':'bg-gray-200 dark:bg-gray-700'}`}>{i+1}</div>
                      <span className="text-sm">{r}</span>
                    </div>
                  ))}</div>
                  <h4 className="text-sm font-semibold mt-4 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">{cp.skills.map(s => {
                    const has = skills.some(sk => sk.name.toLowerCase().includes(s.toLowerCase()));
                    return <span key={s} className={`badge ${has?'bg-green-100 text-green-700':'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{has?'✓':''} {s}</span>;
                  })}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
