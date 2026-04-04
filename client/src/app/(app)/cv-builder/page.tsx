'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, Trash2, Download } from 'lucide-react';

export default function CVBuilderPage() {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [cv, setCv] = useState({ summary:'', experience:[] as any[], education:[] as any[], certifications:'' });

  useEffect(() => {
    api.getProfile().then(setProfile);
    api.getSkills().then(setSkills);
  }, []);

  const addExp = () => setCv({...cv, experience:[...cv.experience,{title:'',company:'',duration:'',description:''}]});
  const addEdu = () => setCv({...cv, education:[...cv.education,{degree:'',institution:'',year:''}]});

  const exportPDF = () => {
    const w = window.open('','_blank');
    if (!w) return;
    const topSkills = skills.sort((a:any,b:any)=>b.self_level-a.self_level).slice(0,8);
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${profile?.display_name}</title>
    <style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a}
    h1{color:#2563eb;margin-bottom:4px}h2{color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:4px;margin-top:24px}
    .skills{display:flex;flex-wrap:wrap;gap:6px}.skill{background:#eff6ff;color:#1d4ed8;padding:4px 10px;border-radius:12px;font-size:13px}
    .exp-item{margin:12px 0}.meta{color:#6b7280;font-size:13px}p{line-height:1.6}</style></head><body>
    <h1>${profile?.display_name||'Your Name'}</h1><p class="meta">${profile?.email||''} · ${profile?.country||''}</p>
    ${cv.summary?`<h2>Summary</h2><p>${cv.summary}</p>`:''}
    <h2>Skills</h2><div class="skills">${topSkills.map((s:any)=>`<span class="skill">${s.name} (Lv.${s.self_level})</span>`).join('')}</div>
    ${cv.experience.length?`<h2>Experience</h2>${cv.experience.map((e:any)=>`<div class="exp-item"><strong>${e.title}</strong> at ${e.company}<br><span class="meta">${e.duration}</span><p>${e.description}</p></div>`).join('')}`:''}
    ${cv.education.length?`<h2>Education</h2>${cv.education.map((e:any)=>`<div class="exp-item"><strong>${e.degree}</strong> — ${e.institution} (${e.year})</div>`).join('')}`:''}
    ${cv.certifications?`<h2>Certifications</h2><p>${cv.certifications}</p>`:''}
    </body></html>`);
    w.document.close();
    setTimeout(()=>w.print(),500);
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"/></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold flex items-center gap-2"><FileText size={28}/> CV Builder</h1><p className="text-gray-500 mt-1">Build your CV with auto-filled skills from your profile</p></div>
        <button onClick={exportPDF} className="btn-primary flex items-center gap-2"><Download size={18}/> Export PDF</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-3">Professional Summary</h3>
            <textarea className="input h-24 resize-none" placeholder="Brief professional summary..." value={cv.summary} onChange={e=>setCv({...cv,summary:e.target.value})}/>
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Experience</h3><button onClick={addExp} className="btn-secondary text-sm flex items-center gap-1"><Plus size={14}/> Add</button></div>
            {cv.experience.map((exp, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <div className="flex justify-between"><input className="input" placeholder="Job Title" value={exp.title} onChange={e=>{const x=[...cv.experience];x[i].title=e.target.value;setCv({...cv,experience:x});}}/><button onClick={()=>setCv({...cv,experience:cv.experience.filter((_:any,j:number)=>j!==i)})} className="ml-2 text-red-500"><Trash2 size={16}/></button></div>
                <input className="input" placeholder="Company" value={exp.company} onChange={e=>{const x=[...cv.experience];x[i].company=e.target.value;setCv({...cv,experience:x});}}/>
                <input className="input" placeholder="Duration (e.g. 2022-Present)" value={exp.duration} onChange={e=>{const x=[...cv.experience];x[i].duration=e.target.value;setCv({...cv,experience:x});}}/>
                <textarea className="input h-16 resize-none" placeholder="Description" value={exp.description} onChange={e=>{const x=[...cv.experience];x[i].description=e.target.value;setCv({...cv,experience:x});}}/>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Education</h3><button onClick={addEdu} className="btn-secondary text-sm flex items-center gap-1"><Plus size={14}/> Add</button></div>
            {cv.education.map((edu, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <div className="flex justify-between"><input className="input" placeholder="Degree" value={edu.degree} onChange={e=>{const x=[...cv.education];x[i].degree=e.target.value;setCv({...cv,education:x});}}/><button onClick={()=>setCv({...cv,education:cv.education.filter((_:any,j:number)=>j!==i)})} className="ml-2 text-red-500"><Trash2 size={16}/></button></div>
                <input className="input" placeholder="Institution" value={edu.institution} onChange={e=>{const x=[...cv.education];x[i].institution=e.target.value;setCv({...cv,education:x});}}/>
                <input className="input" placeholder="Year" value={edu.year} onChange={e=>{const x=[...cv.education];x[i].year=e.target.value;setCv({...cv,education:x});}}/>
              </div>
            ))}
          </div>
        </div>
        {/* Live Preview */}
        <div className="card sticky top-4">
          <h3 className="font-semibold mb-4">📄 Live Preview</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <h2 className="text-2xl font-bold text-brand-600">{profile.display_name || 'Your Name'}</h2>
            <p className="text-sm text-gray-500">{profile.email} · {profile.country}</p>
            {cv.summary && <><h4 className="font-semibold mt-4 mb-1 text-sm">SUMMARY</h4><p className="text-sm text-gray-600 dark:text-gray-400">{cv.summary}</p></>}
            <h4 className="font-semibold mt-4 mb-2 text-sm">SKILLS</h4>
            <div className="flex flex-wrap gap-1">{skills.slice(0,8).map((s:any)=>(<span key={s.id} className="badge bg-brand-50 dark:bg-brand-900/20 text-brand-700 text-xs">{s.name}</span>))}</div>
            {cv.experience.length > 0 && <><h4 className="font-semibold mt-4 mb-2 text-sm">EXPERIENCE</h4>{cv.experience.map((e:any,i:number)=>(<div key={i} className="mb-2"><p className="text-sm font-medium">{e.title} at {e.company}</p><p className="text-xs text-gray-500">{e.duration}</p><p className="text-xs text-gray-600 dark:text-gray-400">{e.description}</p></div>))}</>}
            {cv.education.length > 0 && <><h4 className="font-semibold mt-4 mb-2 text-sm">EDUCATION</h4>{cv.education.map((e:any,i:number)=>(<div key={i} className="mb-1"><p className="text-sm font-medium">{e.degree} — {e.institution} ({e.year})</p></div>))}</>}
          </div>
        </div>
      </div>
    </div>
  );
}
