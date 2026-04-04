'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Globe, FileText, Target, BookOpen, Calendar, DollarSign, MessageSquare, TrendingUp, ChevronLeft, Edit2, Save, X, Plus, Check, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AbroadGoalDetailPage({ params }: { params: { goalId: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProgress, setEditingProgress] = useState(false);
  const [progressInput, setProgressInput] = useState(0);
  const [editingVisa, setEditingVisa] = useState(false);
  const [visaInput, setVisaInput] = useState('planning');

  // Requirements state
  const [requirements, setRequirements] = useState<any[]>([]);
  const [newRequirement, setNewRequirement] = useState({ requirement: '', priority: 'medium', deadline: '' });
  const [showAddRequirement, setShowAddRequirement] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocument, setNewDocument] = useState({ documentType: '', expiryDate: '' });
  const [showAddDocument, setShowAddDocument] = useState(false);

  // Skills state
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ skillName: '', category: 'general', progressLevel: 1 });
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Timeline state
  const [timeline, setTimeline] = useState<any[]>([]);
  const [newMilestone, setNewMilestone] = useState({ milestoneType: '', milestoneDate: '' });
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  // Expenses state
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: 0, paidStatus: 'planned' });
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState({ category: 'general', note: '' });
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    if (token) {
      fetchGoalDetail();
    }
  }, [token, params.goalId]);

  const fetchGoalDetail = async () => {
    try {
      const data = await api.getAbroadGoalDetail(params.goalId);
      setGoal(data);
      setProgressInput(data.progress || 0);
      setVisaInput(data.visa_status || 'planning');
      setRequirements(data.requirements || []);
      setDocuments(data.documents || []);
      setSkills(data.skills || []);
      setTimeline(data.timeline || []);
      setExpenses(data.expenses || []);
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to fetch goal details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await api.updateAbroadGoal(params.goalId, { progress: progressInput });
      setEditingProgress(false);
      setGoal({ ...goal, progress: progressInput });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleUpdateVisaStatus = async () => {
    try {
      await api.updateAbroadGoal(params.goalId, { visa_status: visaInput });
      setEditingVisa(false);
      setGoal({ ...goal, visa_status: visaInput });
    } catch (err) {
      console.error('Failed to update visa status:', err);
    }
  };

  // Requirements handlers
  const handleAddRequirement = async () => {
    if (!newRequirement.requirement) return;
    try {
      const result = await api.createAbroadRequirement(params.goalId, newRequirement);
      setRequirements([...requirements, { id: result.id, ...newRequirement }]);
      setNewRequirement({ requirement: '', priority: 'medium', deadline: '' });
      setShowAddRequirement(false);
    } catch (err) {
      console.error('Error adding requirement:', err);
    }
  };

  const handleCompleteRequirement = async (reqId: string) => {
    try {
      await api.updateAbroadRequirement(reqId, 'completed');
      setRequirements(requirements.map(r => r.id === reqId ? { ...r, status: 'completed' } : r));
    } catch (err) {
      console.error('Error updating requirement:', err);
    }
  };

  const handleDeleteRequirement = (reqId: string) => {
    setRequirements(requirements.filter(r => r.id !== reqId));
  };

  // Documents handlers
  const handleAddDocument = async () => {
    if (!newDocument.documentType) return;
    try {
      const result = await api.createAbroadDocument(params.goalId, newDocument);
      setDocuments([...documents, { id: result.id, status: 'pending', ...newDocument }]);
      setNewDocument({ documentType: '', expiryDate: '' });
      setShowAddDocument(false);
    } catch (err) {
      console.error('Error adding document:', err);
    }
  };

  const handleUpdateDocumentStatus = async (docId: string, status: string) => {
    try {
      await api.updateAbroadDocumentStatus(docId, status);
      setDocuments(documents.map(d => d.id === docId ? { ...d, status } : d));
    } catch (err) {
      console.error('Error updating document:', err);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
  };

  // Skills handlers
  const handleAddSkill = async () => {
    if (!newSkill.skillName) return;
    try {
      const result = await api.createAbroadSkill(params.goalId, newSkill);
      setSkills([...skills, { id: result.id, ...newSkill }]);
      setNewSkill({ skillName: '', category: 'general', progressLevel: 1 });
      setShowAddSkill(false);
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleUpdateSkillProgress = async (skillId: string, progressLevel: number) => {
    try {
      await api.updateAbroadSkillProgress(skillId, progressLevel);
      setSkills(skills.map(s => s.id === skillId ? { ...s, progressLevel } : s));
    } catch (err) {
      console.error('Error updating skill:', err);
    }
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId));
  };

  // Timeline handlers
  const handleAddMilestone = async () => {
    if (!newMilestone.milestoneType) return;
    try {
      const result = await api.createAbroadMilestone(params.goalId, newMilestone);
      setTimeline([...timeline, { id: result.id, completed: 0, ...newMilestone }]);
      setNewMilestone({ milestoneType: '', milestoneDate: '' });
      setShowAddMilestone(false);
    } catch (err) {
      console.error('Error adding milestone:', err);
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await api.completeMilestone(milestoneId);
      setTimeline(timeline.map(t => t.id === milestoneId ? { ...t, completed: 1 } : t));
    } catch (err) {
      console.error('Error completing milestone:', err);
    }
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setTimeline(timeline.filter(t => t.id !== milestoneId));
  };

  // Expenses handlers
  const handleAddExpense = async () => {
    if (!newExpense.category || newExpense.amount <= 0) return;
    try {
      const result = await api.createAbroadExpense(params.goalId, newExpense);
      setExpenses([...expenses, { id: result.id, ...newExpense }]);
      setNewExpense({ category: '', amount: 0, paidStatus: 'planned' });
      setShowAddExpense(false);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  // Notes handlers
  const handleAddNote = async () => {
    if (!newNote.note) return;
    try {
      const result = await api.createAbroadNote(params.goalId, newNote);
      setNotes([...notes, { id: result.id, ...newNote }]);
      setNewNote({ category: 'general', note: '' });
      setShowAddNote(false);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Goal Not Found</h2>
          <button onClick={() => router.back()} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const requirementsCompleted = requirements.filter(r => r.status === 'completed').length;
  const documentsCompleted = documents.filter(d => d.status === 'completed').length;
  const milestonesCompleted = timeline.filter(t => t.completed === 1).length;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const paidExpenses = expenses.filter(e => e.paidStatus === 'paid').reduce((sum, e) => sum + e.amount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'requirements', label: 'Requirements', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'notes', label: 'Notes', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{goal.destination_country}</h1>
            <p className="text-gray-600 dark:text-gray-400">{goal.education_level} • {goal.study_field}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Overall Progress</h3>
                <button onClick={() => setEditingProgress(!editingProgress)} className="text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 p-2 rounded">
                  <Edit2 size={16} />
                </button>
              </div>
              {editingProgress ? (
                <div className="flex gap-2">
                  <input type="number" min="0" max="100" value={progressInput} onChange={(e) => setProgressInput(parseInt(e.target.value))} className="input flex-1" />
                  <button onClick={handleUpdateProgress} className="btn-primary px-3"><Save size={16} /></button>
                  <button onClick={() => setEditingProgress(false)} className="btn-secondary px-3"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-brand-600 mb-3">{goal.progress}%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-brand-500 to-purple-600 h-3 rounded-full transition-all" style={{width: `${goal.progress}%`}}></div>
                  </div>
                </>
              )}
            </div>

            {/* Visa Status */}
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                Visa Status
                <button onClick={() => setEditingVisa(!editingVisa)} className="text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 p-2 rounded">
                  <Edit2 size={16} />
                </button>
              </h3>
              {editingVisa ? (
                <div className="flex gap-2">
                  <select value={visaInput} onChange={(e) => setVisaInput(e.target.value)} className="input flex-1 text-sm">
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready">Ready to Submit</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                  </select>
                  <button onClick={handleUpdateVisaStatus} className="btn-primary px-3"><Save size={16} /></button>
                  <button onClick={() => setEditingVisa(false)} className="btn-secondary px-3"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-semibold mb-3">
                    {goal.visa_status || 'Planning'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current status</p>
                </>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Intake Date</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{goal.intake_month} {goal.intake_year}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{goal.days_until_intake} days until start</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Requirements</p>
                  <p className="text-2xl font-bold">{requirementsCompleted}/{requirements.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documents</p>
                  <p className="text-2xl font-bold">{documentsCompleted}/{documents.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Skills</p>
                  <p className="text-2xl font-bold">{skills.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Milestones</p>
                  <p className="text-2xl font-bold">{milestonesCompleted}/{timeline.length}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="font-semibold text-lg mb-4">Journey Summary</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Destination:</span> {goal.destination_country}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Field of Study:</span> {goal.study_field}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Education Level:</span> {goal.education_level}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Target Intake:</span> {goal.intake_month} {goal.intake_year}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Used</p>
                  <p className="text-2xl font-bold text-emerald-600">${(paidExpenses || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-amber-600">${(totalExpenses || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Entrance Requirements</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track all academic and visa requirements</p>
                </div>
                <button onClick={() => setShowAddRequirement(!showAddRequirement)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Requirement
                </button>
              </div>

              {showAddRequirement && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Requirement name (e.g., IELTS Score 7.0)"
                    value={newRequirement.requirement}
                    onChange={(e) => setNewRequirement({...newRequirement, requirement: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={newRequirement.priority} onChange={(e) => setNewRequirement({...newRequirement, priority: e.target.value})} className="input">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input type="date" value={newRequirement.deadline} onChange={(e) => setNewRequirement({...newRequirement, deadline: e.target.value})} className="input" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddRequirement} className="btn-primary flex-1">Save Requirement</button>
                    <button onClick={() => setShowAddRequirement(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {requirements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No requirements added yet</div>
                ) : (
                  requirements.map(req => (
                    <div key={req.id} className={`p-4 border rounded-lg flex items-center justify-between ${req.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => handleCompleteRequirement(req.id)} className={`p-2 rounded ${req.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}>
                          <Check size={18} />
                        </button>
                        <div>
                          <p className={`font-semibold ${req.status === 'completed' ? 'line-through' : ''}`}>{req.requirement}</p>
                          {req.deadline && <p className="text-sm text-gray-600 dark:text-gray-400">Due: {req.deadline}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteRequirement(req.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Required Documents</h3>
                  <p className="text-gray-600 dark:text-gray-400">Manage and track all required documents</p>
                </div>
                <button onClick={() => setShowAddDocument(!showAddDocument)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Document
                </button>
              </div>

              {showAddDocument && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Document type (e.g., Passport, Degree Certificate)"
                    value={newDocument.documentType}
                    onChange={(e) => setNewDocument({...newDocument, documentType: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={newDocument.expiryDate}
                    onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddDocument} className="btn-primary flex-1">Add Document</button>
                    <button onClick={() => setShowAddDocument(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No documents tracked yet</div>
                ) : (
                  documents.map(doc => (
                    <div key={doc.id} className={`p-4 border rounded-lg flex items-center justify-between ${doc.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <div className="inline-block px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">{doc.documentType}</div>
                        </div>
                        <div className="flex-1">
                          {doc.expiryDate && <p className="text-sm text-gray-600 dark:text-gray-400">Expires: {doc.expiryDate}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select value={doc.status} onChange={(e) => handleUpdateDocumentStatus(doc.id, e.target.value)} className="input text-sm">
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Skill Development</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track IELTS, GRE, and other required skills</p>
                </div>
                <button onClick={() => setShowAddSkill(!showAddSkill)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Skill
                </button>
              </div>

              {showAddSkill && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., IELTS, GRE, GMAT)"
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={newSkill.category} onChange={(e) => setNewSkill({...newSkill, category: e.target.value})} className="input">
                      <option value="language">Language</option>
                      <option value="test">Test Prep</option>
                      <option value="technical">Technical</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="number" min="1" max="10" value={newSkill.progressLevel} onChange={(e) => setNewSkill({...newSkill, progressLevel: parseInt(e.target.value)})} placeholder="Progress Level (1-10)" className="input" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddSkill} className="btn-primary flex-1">Add Skill</button>
                    <button onClick={() => setShowAddSkill(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">No skills tracked yet</div>
                ) : (
                  skills.map(skill => (
                    <div key={skill.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{skill.skillName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</p>
                        </div>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">Level {skill.progressLevel}/10</p>
                        <input type="range" min="1" max="10" value={skill.progressLevel} onChange={(e) => handleUpdateSkillProgress(skill.id, parseInt(e.target.value))} className="flex-1 mx-3" />
                      </div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: `${(skill.progressLevel/10)*100}%`}}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Milestones & Timeline</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track important dates and deadlines</p>
                </div>
                <button onClick={() => setShowAddMilestone(!showAddMilestone)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Milestone
                </button>
              </div>

              {showAddMilestone && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Milestone (e.g., Submit Application)"
                    value={newMilestone.milestoneType}
                    onChange={(e) => setNewMilestone({...newMilestone, milestoneType: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <input
                    type="date"
                    value={newMilestone.milestoneDate}
                    onChange={(e) => setNewMilestone({...newMilestone, milestoneDate: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddMilestone} className="btn-primary flex-1">Add Milestone</button>
                    <button onClick={() => setShowAddMilestone(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {timeline.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No milestones added yet</div>
                ) : (
                  timeline
                    .sort((a, b) => new Date(a.milestone_date || '').getTime() - new Date(b.milestone_date || '').getTime())
                    .map(item => (
                    <div key={item.id} className={`p-4 border-l-4 rounded-lg flex items-center justify-between ${item.completed ? 'bg-green-50 dark:bg-green-900/20 border-l-green-500' : 'bg-orange-50 dark:bg-orange-900/20 border-l-orange-500'}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => handleCompleteMilestone(item.id)} className={`p-2 rounded-full ${item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}>
                          <Check size={18} />
                        </button>
                        <div>
                          <p className={`font-semibold ${item.completed ? 'line-through' : ''}`}>{item.milestone_type}</p>
                          {item.milestone_date && <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(item.milestone_date).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteMilestone(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Budget Planning</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track expenses and plan your budget</p>
                </div>
                <button onClick={() => setShowAddExpense(!showAddExpense)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Expense
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid</p>
                  <p className="text-2xl font-bold text-green-600">${(paidExpenses || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Planned</p>
                  <p className="text-2xl font-bold text-amber-600">${((totalExpenses || 0) - (paidExpenses || 0)).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-600">${(totalExpenses || 0).toLocaleString()}</p>
                </div>
              </div>

              {showAddExpense && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Category (e.g., Application Fee, Travel)"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="input w-full mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="number"
                      placeholder="Amount (USD)"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                      className="input"
                    />
                    <select value={newExpense.paidStatus} onChange={(e) => setNewExpense({...newExpense, paidStatus: e.target.value})} className="input">
                      <option value="planned">Planned</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddExpense} className="btn-primary flex-1">Add Expense</button>
                    <button onClick={() => setShowAddExpense(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No expenses tracked yet</div>
                ) : (
                  expenses.map(exp => (
                    <div key={exp.id} className={`p-4 border rounded-lg flex items-center justify-between ${exp.paidStatus === 'paid' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{exp.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.paidStatus === 'paid' ? 'Paid' : 'Planned'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">${(exp.amount || 0).toLocaleString()}</p>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Mentor Notes & Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-400">Personalized guidance and recommendations</p>
                </div>
                <button onClick={() => setShowAddNote(!showAddNote)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add Note
                </button>
              </div>

              {showAddNote && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-4">
                  <select value={newNote.category} onChange={(e) => setNewNote({...newNote, category: e.target.value})} className="input w-full mb-3">
                    <option value="general">General</option>
                    <option value="application">Application Tips</option>
                    <option value="essay">Essay Help</option>
                    <option value="interview">Interview Prep</option>
                    <option value="funding">Funding</option>
                  </select>
                  <textarea
                    placeholder="Write your note here..."
                    value={newNote.note}
                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                    className="input w-full mb-3 h-24"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddNote} className="btn-primary flex-1">Save Note</button>
                    <button onClick={() => setShowAddNote(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No notes added yet</div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-block px-3 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-semibold">{note.category}</span>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
