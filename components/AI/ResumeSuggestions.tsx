'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Brain, Loader2, CheckCircle, Lightbulb } from 'lucide-react';

interface ResumeSuggestionsData {
  keySkills: string[];
  recommendedChanges: string[];
  strengthAreas: string[];
}

interface ResumeSuggestionsProps {
  resumeContent: string;
  jobDescription: string;
}

export function ResumeSuggestions({ resumeContent, jobDescription }: ResumeSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ResumeSuggestionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generateSuggestions() {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/resume-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate suggestions');

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-blue-400" size={24} />
        <h3 className="text-lg font-semibold text-white">Resume Optimization Suggestions</h3>
      </div>

      {!suggestions && (
        <>
          <p className="text-slate-400 text-sm mb-4">
            Get AI-powered suggestions to improve your resume for this specific job
          </p>
          <Button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              'Generate Suggestions'
            )}
          </Button>
        </>
      )}

      {error && (
        <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {/* Key Skills */}
          {suggestions.keySkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span className="text-green-400">✓</span> Key Skills to Highlight
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.keySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Changes */}
          {suggestions.recommendedChanges.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" /> Recommended Changes
              </h4>
              <ul className="space-y-2">
                {suggestions.recommendedChanges.map((change, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex gap-3">
                    <span className="text-yellow-400 flex-shrink-0 mt-1">→</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strength Areas */}
          {suggestions.strengthAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Your Strengths
              </h4>
              <ul className="space-y-2">
                {suggestions.strengthAreas.map((strength, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex gap-3">
                    <span className="text-green-400 flex-shrink-0">★</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={generateSuggestions}
            disabled={isLoading}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              'Regenerate Suggestions'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
