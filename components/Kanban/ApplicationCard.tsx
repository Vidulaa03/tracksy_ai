'use client';

import { JobApplication } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  return (
    <Card className="bg-slate-700 border-slate-600 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-move p-3">
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-white text-sm break-words">{application.jobTitle}</h4>
          <p className="text-slate-300 text-xs">{application.companyName}</p>
        </div>

        {application.notes && (
          <p className="text-slate-400 text-xs line-clamp-2">{application.notes}</p>
        )}

        <div className="text-xs text-slate-500">
          {formatDate(application.applicationDate)}
        </div>

        <div className="flex gap-1 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(application)}
            className="flex-1 h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <Edit2 size={12} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(application.id)}
            className="flex-1 h-7 text-xs border-red-900/20 text-red-400 hover:bg-red-900/20"
          >
            <Trash2 size={12} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
