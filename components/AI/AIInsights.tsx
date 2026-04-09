'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Brain, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ParsedJobData {
  keyRequirements: string[];
  skills: string[];
  experience: string;
  salaryRange: string;
}

interface AIInsightsProps {
  jobDescription: string;
  onInsightsFetched?: (data: ParsedJobData) => void;
}

export function AIInsights({ jobDescription, onInsightsFetched }: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<ParsedJobData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  async function generateInsights() {
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) throw new Error('Failed to parse job description');

      const data = await response.json();
      setInsights(data.parsedData);
      onInsightsFetched?.(data.parsedData);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-400" size={20} />
          <h4 className="font-semibold text-white">AI Job Insights</h4>
        </div>
        {insights && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      {!insights ? (
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Job Description'
          )}
        </Button>
      ) : null}

      {error && (
        <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {insights && isExpanded && (
        <div className="space-y-4">
          {insights.keyRequirements.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Key Requirements</h5>
              <ul className="space-y-1">
                {insights.keyRequirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-blue-400 flex-shrink-0">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.skills.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Required Skills</h5>
              <div className="flex flex-wrap gap-2">
                {insights.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insights.experience && (
            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Experience</h5>
              <p className="text-sm text-slate-400">{insights.experience}</p>
            </div>
          )}

          {insights.salaryRange && (
            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Salary Range</h5>
              <p className="text-sm text-slate-400">{insights.salaryRange}</p>
            </div>
          )}

          {insights && (
            <Button
              onClick={generateInsights}
              disabled={isLoading}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Re-analyzing...
                </>
              ) : (
                'Re-analyze'
              )}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
