import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, FolderKanban } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import MainLayout from '../layout/MainLayout';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectForm from '../components/projects/ProjectForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/Skeleton';

import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../store/slices/projectSlice';

export default function Projects() {
  const dispatch = useDispatch();

  const { items, loading, error, pagination } = useSelector(
    (state) => state.projects
  );

  // ==========================================
  // URL SEARCH PARAMS
  // ==========================================

  const [searchParams, setSearchParams] = useSearchParams();

  // ==========================================
  // FILTER STATES
  // ==========================================

  const [search, setSearch] = useState(
    () => searchParams.get('search') || ''
  );

  const [status, setStatus] = useState('');

  const [sortBy, setSortBy] = useState('createdAt');

  const [page, setPage] = useState(1);

  // ==========================================
  // MODAL STATES
  // ==========================================

  const [formOpen, setFormOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [deletingProject, setDeletingProject] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const load = useCallback(() => {
    dispatch(
      fetchProjects({
        search,
        status,
        sortBy,
        order: 'desc',
        page,
        limit: 9,
      })
    );
  }, [
    dispatch,
    search,
    status,
    sortBy,
    page,
  ]);

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      load();
    }, 250);

    return () => clearTimeout(timeout);
  }, [load]);

  // ==========================================
  // AUTO OPEN CREATE PROJECT MODAL
  // FROM DASHBOARD
  //
  // /projects?create=1
  // ==========================================

useEffect(() => {
  const createParam = searchParams.get('create');
  const editParam = searchParams.get('edit');

  // ==============================
  // CREATE PROJECT
  // ==============================

  if (createParam === '1') {
    setEditingProject(null);
    setFormOpen(true);

    const params = new URLSearchParams(searchParams);
    params.delete('create');

    setSearchParams(params, { replace: true });

    return;
  }

  // ==============================
  // EDIT PROJECT
  // ==============================

  if (editParam) {
    const projectId = Number(editParam);

    const project = items.find(
      (item) => Number(item.id) === projectId
    );

    if (project) {
      setEditingProject(project);
      setFormOpen(true);

      const params = new URLSearchParams(searchParams);
      params.delete('edit');

      setSearchParams(params, { replace: true });
    }
  }
}, [
  searchParams,
  setSearchParams,
  items,
]);

  // ==========================================
  // HANDLE PROJECT CREATE / UPDATE
  // ==========================================

  async function handleSubmit(form) {
    setSaving(true);

    try {
      if (editingProject) {
        // UPDATE PROJECT

        await dispatch(
          updateProject({
            id: editingProject.id,
            payload: form,
          })
        ).unwrap();
      } else {
        // CREATE PROJECT

        await dispatch(
          createProject(form)
        ).unwrap();
      }

      // Close modal
      setFormOpen(false);

      // Clear editing project
      setEditingProject(null);

      // Reload projects
      load();
    } catch (e) {
      console.error(
        'Project save failed:',
        e
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // HANDLE DELETE
  // ==========================================

  async function handleDelete() {
    if (!deletingProject) return;

    setDeleting(true);

    try {
      await dispatch(
        deleteProject(deletingProject.id)
      ).unwrap();

      // Close delete dialog
      setDeletingProject(null);

      // Reload current page
      load();
    } catch (e) {
      console.error(
        'Project delete failed:',
        e
      );
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  function openCreateModal() {
    setEditingProject(null);

    setFormOpen(true);
  }

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  function openEditModal(project) {
    setEditingProject(project);

    setFormOpen(true);
  }

  // ==========================================
  // CLOSE PROJECT MODAL
  // ==========================================

  function closeProjectModal() {
    setFormOpen(false);

    setEditingProject(null);
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout title="Projects">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
         

          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your projects.
          </p>
        </div>

        {/* NEW PROJECT */}

        <Button
          icon={Plus}
          onClick={openCreateModal}
        >
          New Project
        </Button>

      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="mb-5">

        <ProjectFilters
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

          sortBy={sortBy}

          onSortByChange={(value) => {
            setSortBy(value);

            setPage(1);
          }}
        />

      </div>

      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <CardSkeleton
                key={index}
              />
            )
          )}

        </div>

      ) : error ? (

        /* ====================================
           ERROR
        ==================================== */

        <ErrorState
          description={error}
          onRetry={load}
        />

      ) : items.length === 0 ? (

        /* ====================================
           EMPTY STATE
        ==================================== */

        <EmptyState
          icon={FolderKanban}
          title={
            search || status
              ? 'No projects found'
              : 'No projects yet'
          }
          description={
            search || status
              ? 'Try changing your search or filter.'
              : 'Create your first project and start organizing your work.'
          }
          action={
            <Button
              icon={Plus}
              onClick={openCreateModal}
            >
              Create Project
            </Button>
          }
        />

      ) : (

        /* ====================================
           PROJECT LIST
        ==================================== */

        <>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((project) => (

              <ProjectCard
                key={project.id}
                project={project}

                onEdit={openEditModal}

                onDelete={(project) => {
                  setDeletingProject(project);
                }}
              />

            ))}

          </div>

          {/* ==================================
              PAGINATION
          ================================== */}

          {pagination?.totalPages > 1 && (

            <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-card">

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />

            </div>

          )}

        </>

      )}

      {/* ======================================
          CREATE / EDIT PROJECT MODAL
      ====================================== */}

      <ProjectForm
        open={formOpen}

        onClose={closeProjectModal}

        onSubmit={handleSubmit}

        initialData={editingProject}

        loading={saving}
      />

      {/* ======================================
          DELETE CONFIRMATION
      ====================================== */}

      <ConfirmDialog
        open={!!deletingProject}

        onClose={() => {
          if (!deleting) {
            setDeletingProject(null);
          }
        }}

        onConfirm={handleDelete}

        loading={deleting}

        title="Delete Project?"

        description={
          `Are you sure you want to delete "${deletingProject?.name}"?`
        }

        confirmLabel="Delete Project"
      />

    </MainLayout>
  );
}