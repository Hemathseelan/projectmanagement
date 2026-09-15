import { CheckSquare } from 'lucide-react';
import TaskStatusBadge from '../tasks/TaskStatusBadge';
import TaskPriorityBadge from '../tasks/TaskPriorityBadge';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../common/EmptyState';

export default function RecentTasks({ tasks = [] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-card">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-charcoal-900">Recent Tasks</h3>
      </div>
      {tasks.length === 0 ? (
        <div className="p-5">
          <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks you create will show up here." />
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {tasks.slice(0, 6).map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
              <input type="checkbox" checked={t.status === 'Completed'} readOnly className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${t.status === 'Completed' ? 'text-gray-400 line-through' : 'text-charcoal-900'}`}>
                  {t.name}
                </p>
                <p className="truncate text-xs text-gray-400">{t.projectName}</p>
              </div>
              <TaskPriorityBadge priority={t.priority} />
              <TaskStatusBadge status={t.status} />
              <span className="hidden text-xs text-gray-400 sm:block">{formatDate(t.dueDate)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
