'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Resume } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ResumeEditorProps {
  resume?: Resume;
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function ResumeEditor({
  resume,
  onSubmit,
  isLoading = false,
}: ResumeEditorProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (resume) {
      setContent(resume.content);
    }
  }, [resume]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(content);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Resume Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your resume content here..."
          required
          rows={16}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
        <p className="text-slate-500 text-xs mt-2">
          {content.length} characters
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          resume ? 'Update Resume' : 'Create Resume'
        )}
      </Button>
    </form>
  );
}
