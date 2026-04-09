'use client';

import { Resume } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

interface ResumeListProps {
  resumes: Resume[];
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ResumeList({
  resumes,
  onEdit,
  onDelete,
  isLoading = false,
}: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <FileText className="text-slate-500 mx-auto mb-3" size={40} />
        <p className="text-slate-400 mb-2">No resumes yet</p>
        <p className="text-slate-500 text-sm">Create your first resume to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <Card
          key={resume.id}
          className="bg-slate-800 border-slate-700 p-4 hover:border-blue-500/50 transition-colors"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-blue-400" size={20} />
                <div>
                  <p className="text-slate-500 text-sm">Created {formatDate(resume.createdAt)}</p>
                  <p className="text-white text-sm">
                    {resume.content.split('\n').length} lines · {resume.content.length} characters
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2">
                {resume.content.substring(0, 200)}...
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => onEdit(resume)}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this resume?')) {
                    onDelete(resume.id);
                  }
                }}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="border-red-900/20 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
