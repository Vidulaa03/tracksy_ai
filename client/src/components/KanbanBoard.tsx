import { JobApplication } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: string) => void;
}

export default function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  const navigate = useNavigate();
  const statuses = ['applied', 'interviewing', 'accepted', 'rejected'] as const;

  const statusLabels: Record<string, string> = {
    applied: 'Applied',
    interviewing: 'Interviewing',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-100 border-blue-300',
    interviewing: 'bg-yellow-100 border-yellow-300',
    accepted: 'bg-green-100 border-green-300',
    rejected: 'bg-red-100 border-red-300',
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {statuses.map((status) => {
        const apps = getApplicationsByStatus(status);
        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{statusLabels[status]}</h3>
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                {apps.length}
              </span>
            </div>

            <div className="space-y-3 min-h-64 bg-gray-100 rounded-lg p-3">
              {apps.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">
                  No applications
                </p>
              ) : (
                apps.map((app) => (
                  <Card
                    key={app._id}
                    className={`p-4 cursor-pointer border-2 ${statusColors[status]} hover:shadow-lg transition-shadow`}
                  >
                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                      {app.position}
                    </h4>
                    <p className="text-sm text-gray-700 line-clamp-1">
                      {app.companyName}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/dashboard/applications/${app._id}`)
                        }
                        className="flex-1"
                      >
                        Edit
                      </Button>

                      {status !== 'accepted' && (
                        <select
                          value={status}
                          onChange={(e) => onStatusChange(app._id, e.target.value)}
                          className="flex-1 px-2 py-1 border text-sm rounded"
                        >
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interview</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
