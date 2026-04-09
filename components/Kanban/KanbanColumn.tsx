'use client';

import { JobApplication } from '@/types';
import { ApplicationCard } from './ApplicationCard';
import { STATUS_COLORS } from '@/lib/utils/constants';

interface KanbanColumnProps {
  status: 'applied' | 'interviewing' | 'accepted' | 'rejected';
  title: string;
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusEmojis = {
  applied: '📮',
  interviewing: '💬',
  accepted: '✅',
  rejected: '❌',
};

export function KanbanColumn({
  status,
  title,
  applications,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const columnApplications = applications.filter((app) => app.status === status);

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>{statusEmojis[status]}</span>
              {title}
            </h3>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
              {columnApplications.length}
            </span>
          </div>
        </div>

        {/* Cards Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {columnApplications.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-500 text-sm text-center px-2">
              No applications yet
            </div>
          ) : (
            columnApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
