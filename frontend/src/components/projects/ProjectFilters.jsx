import { Search, ChevronDown, X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created date' },
  { value: 'name', label: 'Project name' },
  { value: 'startDate', label: 'Start date' },
  { value: 'endDate', label: 'End date' },
];

export default function ProjectFilters({
  search = '',
  onSearchChange,
  status = '',
  onStatusChange,
  sortBy = 'createdAt',
  onSortByChange,
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(260px,1fr)_190px_190px]">

        {/* ================================
            SEARCH
        ================================= */}

        <div className="relative w-full">
          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search projects..."
            aria-label="Search projects"
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              pl-10
              pr-10
              text-sm
              text-charcoal-900
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-md
                p-1
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-600
              "
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ================================
            STATUS
        ================================= */}

        <div className="relative w-full">
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
            aria-label="Filter by status"
            className="
              h-11
              w-full
              appearance-none
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              pr-10
              text-sm
              text-charcoal-900
              outline-none
              transition
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          />
        </div>

        {/* ================================
            SORT
        ================================= */}

        <div className="relative w-full">
          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value)
            }
            aria-label="Sort projects"
            className="
              h-11
              w-full
              appearance-none
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              pr-10
              text-sm
              text-charcoal-900
              outline-none
              transition
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          />
        </div>

      </div>
    </div>
  );
}