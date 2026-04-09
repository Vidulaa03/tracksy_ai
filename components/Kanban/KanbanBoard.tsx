'use client';

import { JobApplication } from '@/types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statuses = [
  { value: 'applied' as const, label: 'Applied' },
  { value: 'interviewing' as const, label: 'Interviewing' },
  { value: 'accepted' as const, label: 'Accepted' },
  { value: 'rejected' as const, label: 'Rejected' },
];

export function KanbanBoard({ applications, onEdit, onDelete }: KanbanBoardProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max md:min-w-full">
        {statuses.map((status) => (
          <KanbanColumn
            key={status.value}
            status={status.value}
            title={status.label}
            applications={applications}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
