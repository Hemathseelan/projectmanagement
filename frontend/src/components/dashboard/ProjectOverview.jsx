const ROWS = [
  { key: 'Not Started', color: 'bg-gray-300' },
  { key: 'In Progress', color: 'bg-indigo-500' },
  { key: 'Completed', color: 'bg-emerald-500' },
];

export default function ProjectOverview({ projects = [] }) {
  const counts = ROWS.map((row) => ({
    ...row,
    count: projects.filter((project) => project.status === row.key).length,
  }));

  const totalProjects = projects.length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-charcoal-900">
            Project Status Overview
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            {totalProjects} {totalProjects === 1 ? 'project' : 'projects'} total
          </p>
        </div>
      </div>

      {/* Status Rows */}
      <div className="space-y-5">
        {counts.map((row) => {
          const percentage =
            totalProjects > 0
              ? Math.round((row.count / totalProjects) * 100)
              : 0;

          return (
            <div key={row.key}>
              {/* Label + Count */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${row.color}`}
                  />

                  <span className="text-sm font-medium text-charcoal-700">
                    {row.key}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal-900">
                    {row.count}
                  </span>

                  <span className="text-xs text-gray-400">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${row.color} transition-all duration-500 ease-out`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalProjects === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">
          <p className="text-sm font-medium text-gray-500">
            No projects yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Create your first project to see its status here.
          </p>
        </div>
      )}
    </div>
  );
}