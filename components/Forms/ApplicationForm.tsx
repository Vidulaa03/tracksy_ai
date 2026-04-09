'use client';

import { useState, useEffect, FormEvent } from 'react';
import { JobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { JOB_APPLICATION_STATUSES } from '@/lib/utils/constants';

interface ApplicationFormProps {
  application?: JobApplication;
  onSubmit: (data: Partial<JobApplication>) => Promise<void>;
  isLoading?: boolean;
}

export function ApplicationForm({
  application,
  onSubmit,
  isLoading = false,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    description: '',
    status: 'applied' as const,
    notes: '',
  });

  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        description: application.description,
        status: application.status,
        notes: application.notes || '',
      });
    }
  }, [application]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
        <Input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          placeholder="Senior React Developer"
          required
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
        <Input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Acme Inc"
          required
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Paste the job description here..."
          required
          rows={4}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {JOB_APPLICATION_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this application..."
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          application ? 'Update Application' : 'Add Application'
        )}
      </Button>
    </form>
  );
}
