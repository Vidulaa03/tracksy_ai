import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          Tracksy AI- Job Application Tracker
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/applications"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Applications
          </a>
          <a
            href="/dashboard/resume"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Resume
          </a>

          <div className="flex items-center gap-4 border-l pl-6">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button onClick={onLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
