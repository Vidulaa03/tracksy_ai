import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Zap, LayoutDashboard, Briefcase, FileText, LogOut } from 'lucide-react';

const NAV = [
  { to: '/dashboard',              icon: LayoutDashboard, label: 'Dashboard',    exact: true  },
  { to: '/dashboard/applications', icon: Briefcase,       label: 'Applications', exact: false },
  { to: '/dashboard/resume',       icon: FileText,        label: 'Resume',       exact: false },
];

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: Props) {
  const { pathname } = useLocation();

  return (
    <aside style={{
      width: '224px', minWidth: '224px', height: '100vh', display: 'flex',
      flexDirection: 'column', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={16} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--text)', letterSpacing: '-0.3px' }}>
          Tracksy
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ to, icon: Icon, label, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500, transition: 'all 0.12s',
              background: active ? 'var(--primary-muted)' : 'transparent',
              color:      active ? 'var(--primary)'       : 'var(--text-secondary)',
              border:     active ? '1px solid var(--primary-border)' : '1px solid transparent',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '12px 10px 20px', borderTop: '1px solid var(--border)' }}>
        {user && (
          <div style={{ padding: '8px 12px 10px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500, background: 'transparent', color: 'var(--text-secondary)',
            transition: 'background 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
