import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, X, Workflow } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export default function MobileSidebar({ open, onClose }) {
  const { logout } = useAuth();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-charcoal-950/40" onClick={onClose} />
      <div className="relative z-10 flex h-full w-72 flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Workflow className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-semibold text-charcoal-900">TaskFlow</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="btn-focus rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-charcoal-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-600 hover:bg-gray-50"
          >
            <Settings className="h-4.5 w-4.5" />
            Settings
          </NavLink>
          <button
            onClick={logout}
            className="btn-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-600 hover:bg-gray-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
