import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../layout/MainLayout';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskTable from '../components/tasks/TaskTable';
import TaskForm from '../components/tasks/TaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import { Plus, ChevronDown } from 'lucide-react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';

export default function Tasks() {
  const dispatch = useDispatch();

  const {
    items: tasks,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.tasks);

  const { items: projects } = useSelector((state) => state.projects);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [projectId, setProjectId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const load = useCallback(() => {
    dispatch(
      fetchTasks({
        search,
        status,
        priority,
        projectId,
        sortBy,
        order: 'desc',
        page,
        limit: 10,
      })
    );
  }, [
    dispatch,
    search,
    status,
    priority,
    projectId,
    sortBy,
    page,
  ]);

  // Load projects
  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
  }, [dispatch]);

  // Load tasks
  useEffect(() => {
    const timer = setTimeout(load, 250);

    return () => clearTimeout(timer);
  }, [load]);

  async function handleSubmit(form) {
    setSaving(true);

    try {
      if (editingTask) {
        await dispatch(
          updateTask({
            id: editingTask.id,
            payload: form,
          })
        ).unwrap();
      } else {
        await dispatch(createTask(form)).unwrap();
      }

      setFormOpen(false);
      setEditingTask(null);

      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleComplete(task) {
    const nextStatus =
      task.status === 'Completed' ? 'Pending' : 'Completed';

    await dispatch(
      updateTask({
        id: task.id,
        payload: {
          ...task,
          status: nextStatus,
        },
      })
    ).unwrap();

    load();
  }

  async function handleDelete() {
    setRemoving(true);

    try {
      await dispatch(deleteTask(deletingTask.id)).unwrap();

      setDeletingTask(null);

      load();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <MainLayout title="Tasks">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mt-1 text-sm text-gray-500">
            All tasks across your projects.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setFormOpen(true);
            }}
            disabled={!projects.length}
            className="w-full sm:w-auto"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mb-5 w-full">
        <div className="w-full">
          <TaskFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            priority={priority}
            onPriorityChange={(value) => {
              setPriority(value);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
          />
        </div>

        {/* All Projects */}
        <div className="mt-3 w-full sm:w-44">
          <div className="relative w-full">
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setPage(1);
              }}
              className="
                btn-focus
                h-11
                w-full
                appearance-none
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3.5
                pr-10
                text-sm
                text-charcoal-900
                outline-none
              "
            >
              <option value="">All projects</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
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

      {/* ================= TASK TABLE ================= */}
      <div className="w-full overflow-hidden">
        <TaskTable
          tasks={tasks}
          loading={loading}
          error={error}
          onRetry={load}
          onToggleComplete={handleToggleComplete}
          onEdit={(task) => {
            setEditingTask(task);
            setFormOpen(true);
          }}
          onDelete={(task) => setDeletingTask(task)}
        />
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-3 w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
        <div className="min-w-max">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* ================= TASK FORM ================= */}
      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTask}
        loading={saving}
        projects={projects}
      />

      {/* ================= DELETE CONFIRM ================= */}
      <ConfirmDialog
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        loading={removing}
        title="Delete Task?"
        description={`Are you sure you want to delete "${deletingTask?.name}"?`}
        confirmLabel="Delete Task"
      />
    </MainLayout>
  );
}