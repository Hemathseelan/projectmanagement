import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';

import MainLayout from '../layout/MainLayout';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import ProjectForm from '../components/projects/ProjectForm';
import TaskForm from '../components/tasks/TaskForm';
import TaskTable from '../components/tasks/TaskTable';
import TaskFilters from '../components/tasks/TaskFilters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

import { formatDate } from '../utils/formatDate';

import {
  fetchProjectById,
  updateProject,
  deleteProject,
  clearSelectedProject,
} from '../store/slices/projectSlice';

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../store/slices/taskSlice';

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================================
  // PROJECT STATE
  // ================================
  const {
    selected: project,
    loading: projectLoading,
    error: projectError,
  } = useSelector((state) => state.projects);

  // ================================
  // TASK STATE
  // ================================
  const {
    items: tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useSelector((state) => state.tasks);

  // ================================
  // TASK FILTERS
  // ================================
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // ================================
  // PROJECT MODAL STATES
  // ================================
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

  const [savingProject, setSavingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  // ================================
  // TASK MODAL STATES
  // ================================
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [savingTask, setSavingTask] = useState(false);
  const [removingTask, setRemovingTask] = useState(false);

  // ================================
  // LOAD TASKS
  // ================================
  const loadTasks = useCallback(() => {
    dispatch(
      fetchTasks({
        projectId: id,
        search,
        status,
        priority,
        sortBy,
        order: 'desc',
        limit: 20,
      })
    );
  }, [
    dispatch,
    id,
    search,
    status,
    priority,
    sortBy,
  ]);

  // ================================
  // LOAD PROJECT
  // ================================
  useEffect(() => {
    dispatch(fetchProjectById(id));

    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);

  // ================================
  // LOAD TASKS WITH SMALL DEBOUNCE
  // ================================
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadTasks]);

  // ================================
  // PROJECT SAVE
  // ================================
  async function handleProjectSave(form) {
    setSavingProject(true);

    try {
      await dispatch(
        updateProject({
          id,
          payload: form,
        })
      ).unwrap();

      setEditProjectOpen(false);

      // Refresh project
      dispatch(fetchProjectById(id));
    } finally {
      setSavingProject(false);
    }
  }

  // ================================
  // PROJECT DELETE
  // ================================
  async function handleProjectDelete() {
    setDeletingProject(true);

    try {
      await dispatch(deleteProject(id)).unwrap();

      navigate('/projects');
    } finally {
      setDeletingProject(false);
    }
  }

  // ================================
  // TASK CREATE / UPDATE
  // ================================
  async function handleTaskSubmit(form) {
    setSavingTask(true);

    try {
      const payload = {
        ...form,
        projectId: Number(id),
      };

      if (editingTask) {
        await dispatch(
          updateTask({
            id: editingTask.id,
            payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          createTask(payload)
        ).unwrap();
      }

      // Close modal
      setTaskFormOpen(false);
      setEditingTask(null);

      // Refresh tasks
      loadTasks();

      // Refresh project statistics
      dispatch(fetchProjectById(id));
    } finally {
      setSavingTask(false);
    }
  }

  // ================================
  // TASK COMPLETE / INCOMPLETE
  // ================================
  async function handleToggleComplete(task) {
    const nextStatus =
      task.status === 'Completed'
        ? 'Pending'
        : 'Completed';

    await dispatch(
      updateTask({
        id: task.id,
        payload: {
          ...task,
          projectId: Number(id),
          status: nextStatus,
        },
      })
    ).unwrap();

    // Refresh tasks
    loadTasks();

    // Refresh project progress
    dispatch(fetchProjectById(id));
  }

  // ================================
  // TASK DELETE
  // ================================
  async function handleTaskDelete() {
    if (!deletingTask) return;

    setRemovingTask(true);

    try {
      await dispatch(
        deleteTask(deletingTask.id)
      ).unwrap();

      setDeletingTask(null);

      // Refresh tasks
      loadTasks();

      // Refresh project statistics
      dispatch(fetchProjectById(id));
    } finally {
      setRemovingTask(false);
    }
  }

  // ================================
  // PROJECT LOADING
  // ================================
  if (projectLoading && !project) {
    return (
      <MainLayout title="Project Details">
        <Loader label="Loading project..." />
      </MainLayout>
    );
  }

  // ================================
  // PROJECT ERROR
  // ================================
  if (projectError) {
    return (
      <MainLayout title="Project Details">
        <ErrorState
          description={projectError}
          onRetry={() =>
            dispatch(fetchProjectById(id))
          }
        />
      </MainLayout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <MainLayout title="Project Details">

      {/* ================================
          BACK TO PROJECTS
      ================================= */}
      <Link
        to="/projects"
        className="
          mb-4
          inline-flex
          items-center
          gap-1.5
          text-sm
          font-medium
          text-gray-500
          transition
          hover:text-charcoal-700
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* ================================
          PROJECT DETAILS CARD
      ================================= */}
      <div
        className="
          mb-6
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-card
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-start
          "
        >

          {/* Project Info */}
          <div className="min-w-0">
            <div
              className="
                mb-2
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <h2 className="text-xl font-semibold text-charcoal-900">
                {project.name}
              </h2>

              <ProjectStatusBadge
                status={project.status}
              />
            </div>

            <p className="max-w-xl text-sm text-gray-500">
              {project.description}
            </p>
          </div>

          {/* Project Actions */}
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="secondary"
              icon={Pencil}
              onClick={() =>
                setEditProjectOpen(true)
              }
              className="flex-1 sm:flex-none"
            >
              Edit
            </Button>

            <Button
              variant="danger"
              icon={Trash2}
              onClick={() =>
                setDeleteProjectOpen(true)
              }
              className="flex-1 sm:flex-none"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* ================================
            PROJECT META
        ================================= */}
        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-4
            border-t
            border-gray-100
            pt-5
            sm:grid-cols-4
          "
        >
          <div>
            <p className="text-xs text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-charcoal-800">
              {project.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Start Date
            </p>

            <p className="mt-1 text-sm font-medium text-charcoal-800">
              {formatDate(project.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              End Date
            </p>

            <p className="mt-1 text-sm font-medium text-charcoal-800">
              {formatDate(project.endDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-charcoal-800">
              {formatDate(project.createdAt)}
            </p>
          </div>
        </div>

        {/* ================================
            PROJECT PROGRESS
        ================================= */}
        <div className="mt-5 border-t border-gray-100 pt-5">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-charcoal-800">
              Project Progress
            </span>

            <span className="text-gray-500">
              {project.progress ?? 0}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="
                h-full
                rounded-full
                bg-indigo-500
                transition-all
                duration-300
              "
              style={{
                width: `${project.progress ?? 0}%`,
              }}
            />
          </div>

          <p className="mt-1.5 text-xs text-gray-400">
            {project.completedTaskCount ?? 0} of{' '}
            {project.taskCount ?? 0} tasks completed
          </p>
        </div>
      </div>

      {/* ================================
          TASK HEADER
      ================================= */}
      <div
        className="
          mb-5
          flex
          flex-col
          justify-between
          gap-4
          sm:flex-row
          sm:items-center
        "
      >
        <h3 className="text-lg font-semibold text-charcoal-900">
          Tasks
        </h3>

        <Button
          icon={Plus}
          onClick={() => {
            setEditingTask(null);
            setTaskFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Task
        </Button>
      </div>

      {/* ================================
          TASK FILTERS
      ================================= */}
      <div className="mb-4 w-full">
        <TaskFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value);
          }}
          priority={priority}
          onPriorityChange={(value) => {
            setPriority(value);
          }}
          sortBy={sortBy}
          onSortByChange={(value) => {
            setSortBy(value);
          }}
        />
      </div>

      {/* ================================
          TASK TABLE
      ================================= */}
      <TaskTable
        tasks={tasks}
        loading={tasksLoading}
        error={tasksError}
        onRetry={loadTasks}
        onToggleComplete={handleToggleComplete}
        onEdit={(task) => {
          setEditingTask(task);
          setTaskFormOpen(true);
        }}
        onDelete={(task) => {
          setDeletingTask(task);
        }}
      />

      {/* ================================
          EDIT PROJECT MODAL
      ================================= */}
      <ProjectForm
        open={editProjectOpen}
        onClose={() =>
          setEditProjectOpen(false)
        }
        onSubmit={handleProjectSave}
        initialData={project}
        loading={savingProject}
      />

      {/* ================================
          DELETE PROJECT MODAL
      ================================= */}
      <ConfirmDialog
        open={deleteProjectOpen}
        onClose={() =>
          setDeleteProjectOpen(false)
        }
        onConfirm={handleProjectDelete}
        loading={deletingProject}
        title="Delete Project?"
        description={`Are you sure you want to delete "${project.name}"? All of its tasks will be removed too.`}
        confirmLabel="Delete Project"
      />

      {/* ================================
          CREATE / EDIT TASK MODAL
      ================================= */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        loading={savingTask}
        projects={project ? [project] : []}
        defaultProjectId={id}
      />

      {/* ================================
          DELETE TASK MODAL
      ================================= */}
      <ConfirmDialog
        open={!!deletingTask}
        onClose={() =>
          setDeletingTask(null)
        }
        onConfirm={handleTaskDelete}
        loading={removingTask}
        title="Delete Task?"
        description={`Are you sure you want to delete "${deletingTask?.name}"?`}
        confirmLabel="Delete Task"
      />
    </MainLayout>
  );
}