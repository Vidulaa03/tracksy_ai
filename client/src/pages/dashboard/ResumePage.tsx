import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumesAPI } from '@/services/api';
import { Resume } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResumePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumesAPI.getAll();
      setResumes(response.data);
    } catch {
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResume = (resume: Resume) => {
    setSelectedResume(resume);
    setFormData({ title: resume.title, content: resume.content });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      if (selectedResume) {
        await resumesAPI.update(selectedResume._id, formData);
        await loadResumes();
        const updated = resumes.find((r) => r._id === selectedResume._id);
        if (updated) setSelectedResume(updated);
        setIsEditing(false);
      }
    } catch {
      alert('Failed to save resume');
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await resumesAPI.create(formData);
      await loadResumes();
      setFormData({ title: '', content: '' });
      setSelectedResume(null);
      setIsEditing(false);
    } catch {
      alert('Failed to create resume');
    }
  };

  const handleDelete = async () => {
    if (!selectedResume || !confirm('Are you sure?')) return;
    try {
      await resumesAPI.delete(selectedResume._id);
      await loadResumes();
      setSelectedResume(null);
    } catch {
      alert('Failed to delete resume');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Resume Manager</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Resume List */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Your Resumes</h2>
              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <p className="text-gray-600">Loading...</p>
                ) : resumes.length === 0 ? (
                  <p className="text-gray-600 text-sm">No resumes yet</p>
                ) : (
                  resumes.map((resume) => (
                    <button
                      key={resume._id}
                      onClick={() => handleSelectResume(resume)}
                      className={`w-full text-left p-2 rounded ${
                        selectedResume?._id === resume._id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium text-sm">{resume.title}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setSelectedResume(null);
                  setFormData({ title: '', content: '' });
                  setIsEditing(true);
                }}
              >
                + New Resume
              </Button>
            </Card>
          </div>

          {/* Resume Editor */}
          <div className="md:col-span-3">
            {selectedResume || isEditing ? (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedResume ? 'Edit Resume' : 'Create New Resume'}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Senior Engineer Resume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content ({formData.content.length} characters)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-64 font-mono text-sm"
                      placeholder="Paste your resume content here..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={selectedResume ? handleSave : handleCreate}
                    >
                      {selectedResume ? 'Save Changes' : 'Create Resume'}
                    </Button>
                    {selectedResume && (
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedResume(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Select a resume to view or edit, or create a new one
                </p>
                <Button
                  onClick={() => {
                    setFormData({ title: '', content: '' });
                    setIsEditing(true);
                  }}
                >
                  Create First Resume
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
