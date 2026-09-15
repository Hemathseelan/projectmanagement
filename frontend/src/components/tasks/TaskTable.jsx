import { Pencil, Trash2, CheckSquare } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { formatDate } from '../../utils/formatDate';
import { TableSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

export default function TaskTable({
  tasks,
  loading,
  error,
  onRetry,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <div className="min-w-[720px]">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (!tasks.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description="Try changing your filters or create a new task."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card scrollbar-thin">
      <table className="w-full min-w-[680px] text-left text-sm">
        {/* ================================
            TABLE HEADER
        ================================= */}
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
            <th className="w-12 px-4 py-3 font-medium sm:px-5">
              <span className="sr-only">Complete</span>
            </th>

            <th className="min-w-[220px] px-4 py-3 font-medium sm:px-5">
              Task
            </th>

            <th className="w-[130px] px-4 py-3 font-medium sm:px-5">
              Priority
            </th>

            <th className="w-[140px] px-4 py-3 font-medium sm:px-5">
              Status
            </th>

            <th className="w-[130px] px-4 py-3 font-medium sm:px-5">
              Due Date
            </th>

            <th className="w-[100px] px-4 py-3 text-right font-medium sm:px-5">
              Actions
            </th>
          </tr>
        </thead>

        {/* ================================
            TABLE BODY
        ================================= */}
        <tbody className="divide-y divide-gray-50">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="transition-colors hover:bg-gray-50/60"
            >
              {/* Checkbox */}
              <td className="px-4 py-3.5 sm:px-5">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => onToggleComplete(task)}
                  aria-label={`Mark ${task.name} as ${
                    task.status === 'Completed'
                      ? 'incomplete'
                      : 'completed'
                  }`}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>

              {/* Task Name */}
              <td
                className={`
                  max-w-[280px]
                  truncate
                  px-4
                  py-3.5
                  font-medium
                  sm:px-5
                  ${
                    task.status === 'Completed'
                      ? 'text-gray-400 line-through'
                      : 'text-charcoal-900'
                  }
                `}
                title={task.name}
              >
                {task.name}
              </td>

              {/* Priority */}
              <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                <TaskPriorityBadge priority={task.priority} />
              </td>

              {/* Status */}
              <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                <TaskStatusBadge status={task.status} />
              </td>

              {/* Due Date */}
              <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 sm:px-5">
                {formatDate(task.dueDate)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5 sm:px-5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                    className="
                      btn-focus
                      rounded-lg
                      p-1.5
                      text-gray-400
                      transition
                      hover:bg-gray-100
                      hover:text-charcoal-700
                    "
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(task)}
                    aria-label="Delete task"
                    className="
                      btn-focus
                      rounded-lg
                      p-1.5
                      text-gray-400
                      transition
                      hover:bg-rose-50
                      hover:text-rose-600
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}