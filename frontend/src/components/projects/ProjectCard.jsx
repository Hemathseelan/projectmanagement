import { Link } from 'react-router-dom';
import { MoreHorizontal, Calendar, ListChecks } from 'lucide-react';
import { useState } from 'react';
import ProjectStatusBadge from './ProjectStatusBadge';
import { formatDate } from '../../utils/formatDate';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <ProjectStatusBadge status={project.status} />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            className="btn-focus rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
              <button
                onClick={() => { setMenuOpen(false); onEdit(project); }}
                className="block w-full px-3 py-1.5 text-left text-sm text-charcoal-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(project); }}
                className="block w-full px-3 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-1 text-base font-semibold text-charcoal-900">{project.name}</h3>
      <p className="mb-4 line-clamp-2 text-sm text-gray-500">{project.description || 'No description provided.'}</p>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ListChecks className="h-3.5 w-3.5" /> {project.completedTaskCount}/{project.taskCount} tasks
          </span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(project.startDate)} — {formatDate(project.endDate)}
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="btn-focus block w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-charcoal-700 hover:bg-gray-50"
      >
        View Project
      </Link>
    </div>
  );
}
