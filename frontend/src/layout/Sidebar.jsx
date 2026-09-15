import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Workflow } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Workflow className="h-4.5 w-4.5" />
        </div>
        <span className="text-base font-semibold text-charcoal-900">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-600' : 'text-charcoal-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}

        <div className="my-3 border-t border-gray-100" />

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-600' : 'text-charcoal-600 hover:bg-gray-50'
            }`
          }
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

      <div className="flex items-center gap-3 border-t border-gray-100 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {(user?.fullName || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-charcoal-900">{user?.fullName || 'User'}</p>
          <p className="truncate text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
}
