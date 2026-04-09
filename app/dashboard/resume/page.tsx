'use client';

import { useEffect, useState } from 'react';
import { Resume } from '@/types';
import { ResumeEditor } from '@/components/ResumeEditor/ResumeEditor';
import { ResumeList } from '@/components/ResumeList/ResumeList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Fetch resumes
  async function fetchResumes() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/resumes');

      if (!response.ok) throw new Error('Failed to fetch resumes');

      const data = await response.json();
      setResumes(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  // Save resume
  async function handleSaveResume(content: string) {
    setIsSaving(true);
    setError(null);

    try {
      if (selectedResume) {
        // Update existing
        const response = await fetch(`/api/resumes/${selectedResume.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) throw new Error('Failed to update resume');

        const data = await response.json();
        setResumes(resumes.map((r) => (r.id === selectedResume.id ? data.data : r)));
      } else {
        // Create new
        const response = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) throw new Error('Failed to create resume');

        const data = await response.json();
        setResumes([data.data, ...resumes]);
      }

      setSelectedResume(null);
      setShowEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  }

  // Delete resume
  async function handleDeleteResume(id: string) {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete resume');

      setResumes(resumes.filter((r) => r.id !== id));
      if (selectedResume?.id === id) {
        setSelectedResume(null);
        setShowEditor(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resume Management</h1>
        <p className="text-slate-400">Create and manage your resumes for different job applications</p>
      </div>

      {error && (
        <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {showEditor 
                  ? (selectedResume ? 'Edit Resume' : 'Create New Resume')
                  : 'Editor'
                }
              </h2>
              {showEditor && (
                <Button
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedResume(null);
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              )}
            </div>

            {showEditor ? (
              <ResumeEditor
                resume={selectedResume || undefined}
                onSubmit={handleSaveResume}
                isLoading={isSaving}
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 mb-4">Select a resume to edit or create a new one</p>
                <Button
                  onClick={() => {
                    setSelectedResume(null);
                    setShowEditor(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  Create Resume
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Resume List */}
        <div>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Your Resumes</h2>
              {!showEditor && (
                <Button
                  onClick={() => {
                    setSelectedResume(null);
                    setShowEditor(true);
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} />
                </Button>
              )}
            </div>

            <ResumeList
              resumes={resumes}
              onEdit={(resume) => {
                setSelectedResume(resume);
                setShowEditor(true);
              }}
              onDelete={handleDeleteResume}
              isLoading={isSaving}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
