'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2, Mail, Award, X, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@proofchain/ui';
import { studentService, issuerService } from '@proofchain/shared';
import type { Student } from '@proofchain/shared';

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [institutionId, setInstitutionId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', studentNumber: '', program: '', fieldOfStudy: '',
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const instResult = await issuerService.getMyInstitution();
            if (instResult.success && instResult.data) {
                setInstitutionId(instResult.data.id);
                const studentsResult = await studentService.getByInstitution(instResult.data.id);
                if (studentsResult.success && studentsResult.data) {
                    setStudents(studentsResult.data);
                }
            } else {
                setError('Veuillez d\'abord créer votre institution.');
            }
        } catch { setError('Erreur lors du chargement.'); }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!institutionId) return;
        setSaving(true);
        const result = await studentService.create(institutionId, {
            fullName: formData.fullName, email: formData.email || undefined,
            phone: formData.phone || undefined, studentNumber: formData.studentNumber,
            program: formData.program || undefined, fieldOfStudy: formData.fieldOfStudy || undefined,
        });
        if (result.success && result.data) {
            setStudents([result.data, ...students]);
            setShowModal(false);
            setFormData({ fullName: '', email: '', phone: '', studentNumber: '', program: '', fieldOfStudy: '' });
        } else { alert(result.error || 'Erreur lors de l\'ajout'); }
        setSaving(false);
    };

    const handleDelete = async (studentId: string) => {
        if (!confirm('Supprimer cet étudiant ?')) return;
        const result = await studentService.delete(studentId);
        if (result.success) { setStudents(students.filter(s => s.id !== studentId)); }
        else { alert(result.error || 'Erreur lors de la suppression'); }
    };

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'graduated': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'graduated': return 'Diplômé';
            case 'suspended': return 'Suspendu';
            default: return 'Actif';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Users className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                        Gestion des étudiants
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {students.length} étudiant{students.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    <span className="sm:inline">Ajouter</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un étudiant..." className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{student.full_name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.student_number}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                {getStatusLabel(student.status)}
                            </span>
                        </div>
                        <div className="space-y-2 mb-4">
                            {student.email && (<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Mail className="w-4 h-4" /><span>{student.email}</span></div>)}
                            {student.program && (<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Award className="w-4 h-4" /><span>{student.program}</span></div>)}
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Diplômes émis</span>
                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{student.documents_issued || 0}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(student.id)} className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && !loading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun étudiant</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez votre premier étudiant pour commencer</p>
                    <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium">
                        <Plus className="w-5 h-5" />
                        Ajouter un étudiant
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajouter un étudiant</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet *</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Jean Dupont" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule *</label>
                                <input type="text" name="studentNumber" value={formData.studentNumber} onChange={handleInputChange} required placeholder="STU-2024-001" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jean@example.com" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programme</label>
                                <input type="text" name="program" value={formData.program} onChange={handleInputChange} placeholder="Licence Informatique" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Annuler</button>
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl font-medium">
                                    {saving ? (<><Loader2 className="w-5 h-5 animate-spin" />Ajout...</>) : (<><Plus className="w-5 h-5" />Ajouter</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
