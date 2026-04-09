import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { applicationsAPI } from '@/services/api';
import { JobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import AddApplicationDialog from '@/components/AddApplicationDialog';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
      setApplications(response.data);
    } catch (err: any) {
      if (err.response?.status === 503) {
        setError('Database not configured. Please set MONGODB_URI in .env.local');
      } else {
        setError('Failed to load applications');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApplication = async (data: any) => {
    try {
      await applicationsAPI.create(data);
      await loadApplications();
      setIsAddDialogOpen(false);
    } catch (err) {
      setError('Failed to create application');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await applicationsAPI.update(id, { status: newStatus as any });
      await loadApplications();
    } catch (err) {
      setError('Failed to update application');
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications Dashboard</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            + Add Application
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading applications...</p>
          </Card>
        ) : applications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">No applications yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Create your first application
            </Button>
          </Card>
        ) : (
          <KanbanBoard
            applications={applications}
            onStatusChange={handleStatusChange}
          />
        )}

        <AddApplicationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddApplication}
        />
      </main>
    </div>
  );
}
