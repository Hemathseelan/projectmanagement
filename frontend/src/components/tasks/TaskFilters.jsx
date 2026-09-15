import SearchInput from '../common/SearchInput';
import Select from '../common/Select';
import {
  TASK_STATUS,
  TASK_PRIORITY,
} from '../../utils/constants';

export default function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className="w-full">
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:flex
          lg:items-center
        "
      >
        {/* ================================
            SEARCH
        ================================= */}
        <div className="min-w-0 w-full lg:flex-1">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search tasks..."
            className="w-full"
          />
        </div>

        {/* ================================
            STATUS
        ================================= */}
        <div className="w-full lg:w-[170px] lg:shrink-0">
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            options={TASK_STATUS}
            placeholder="All statuses"
            className="w-full"
          />
        </div>

        {/* ================================
            PRIORITY
        ================================= */}
        <div className="w-full lg:w-[170px] lg:shrink-0">
          <Select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            options={TASK_PRIORITY}
            placeholder="All priorities"
            className="w-full"
          />
        </div>

        {/* ================================
            SORT
        ================================= */}
        <div className="w-full lg:w-[170px] lg:shrink-0">
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            options={[
              'createdAt',
              'name',
              'dueDate',
              'priority',
              'status',
            ]}
            placeholder="Sort by"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}