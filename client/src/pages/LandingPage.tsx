import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">Tracksy AI- Job Application Tracker</h1>
        <div className="flex gap-4">
          <Link to="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Track Your Job Applications with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Organize all your job applications in one place. Get AI-powered insights
          about job postings and personalized resume suggestions to land your dream job.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Track Applications</h3>
            <p className="text-gray-600">
              Keep track of all your job applications with a beautiful Kanban board interface.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
            <p className="text-gray-600">
              Get AI-powered analysis of job descriptions to understand requirements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-3">Resume Manager</h3>
            <p className="text-gray-600">
              Manage multiple resumes and get suggestions to tailor them for each role.
            </p>
          </div>
        </div>

        <Link to="/auth/signup" className="block mt-12">
          <Button size="lg">Start Tracking Today</Button>
        </Link>
      </div>
    </main>
  );
}
