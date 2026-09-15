import { Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit } from 'lucide-react';
import ProjectStatusBadge from '../projects/ProjectStatusBadge';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../common/EmptyState';
import { FolderKanban } from 'lucide-react';
import { useState } from 'react';

export default function RecentProjects({ projects = [] }) {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);

  function handleEdit(project) {
    setOpenMenu(null);

    navigate(`/projects?edit=${project.id}`);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-card">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-charcoal-900">
          Recent Projects
        </h3>

        <Link
          to="/projects"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all
        </Link>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to see it here."
          />
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-sm">
            {/* TABLE HEADER */}
            <thead>
              <tr className="text-xs uppercase text-gray-400">
                <th className="px-5 py-3 font-medium">
                  Project
                </th>

                <th className="px-5 py-3 font-medium">
                  Status
                </th>

                <th className="px-5 py-3 font-medium">
                  Progress
                </th>

                <th className="px-5 py-3 font-medium">
                  End Date
                </th>

                <th className="w-14 px-5 py-3" />
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-gray-50">
              {projects.slice(0, 5).map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/60"
                >
                  {/* PROJECT */}
                  <td className="px-5 py-3.5 font-medium text-charcoal-900">
                    <Link
                      to={`/projects/${p.id}`}
                      className="hover:text-indigo-600"
                    >
                      {p.name}
                    </Link>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-3.5">
                    <ProjectStatusBadge status={p.status} />
                  </td>

                  {/* PROGRESS */}
                  <td className="px-5 py-3.5 text-gray-500">
                    {p.progress ?? 0}%
                  </td>

                  {/* END DATE */}
                  <td className="px-5 py-3.5 text-gray-500">
                    {formatDate(p.endDate)}
                  </td>

                  {/* ACTION */}
                  <td className="relative px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === p.id ? null : p.id
                        )
                      }
                      aria-label={`Actions for ${p.name}`}
                      className="
                        btn-focus
                        rounded-lg
                        p-1.5
                        text-gray-400
                        transition
                        hover:bg-gray-100
                        hover:text-gray-600
                      "
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* ACTION MENU */}
                    {openMenu === p.id && (
                      <div
                        className="
                          absolute
                          right-4
                          top-12
                          z-20
                          w-36
                          overflow-hidden
                          rounded-xl
                          border
                          border-gray-100
                          bg-white
                          py-1
                          text-left
                          shadow-lg
                        "
                      >
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="
                            flex
                            w-full
                            items-center
                            gap-2
                            px-3
                            py-2
                            text-sm
                            text-gray-700
                            transition
                            hover:bg-gray-50
                          "
                        >
                          <Edit className="h-4 w-4 text-gray-400" />

                          <span>Edit Project</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}