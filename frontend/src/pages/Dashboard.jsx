import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
} from 'lucide-react';

import MainLayout from '../layout/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import ProjectOverview from '../components/dashboard/ProjectOverview';
import RecentProjects from '../components/dashboard/RecentProjects';

import { StatCardSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';

import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { fetchProjects } from '../store/slices/projectSlice';


import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    statistics,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const {
    items: projects,
  } = useSelector((state) => state.projects);


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  function loadAll() {
    dispatch(fetchDashboardStats());

    dispatch(
      fetchProjects({
        limit: 5,
        sortBy: 'createdAt',
        order: 'desc',
      })
    );

  
  }

  useEffect(() => {
    loadAll();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // NEW PROJECT
  // ==========================================

  function handleNewProject() {
    // Go to Projects page
    // ?create=1 tells Projects page to
    // automatically open Create Project modal
    navigate('/projects?create=1');
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout title="Dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-semibold text-charcoal-900">
            Good morning,{' '}
            {user?.fullName?.split(' ')[0] || 'there'} 👋
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your projects today.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={handleNewProject}
        >
          New Project
        </Button>

      </div>

      {/* ======================================
          ERROR STATE
      ====================================== */}

      {error ? (

        <ErrorState
          description={error}
          onRetry={loadAll}
        />

      ) : (

        <>

          {/* ==================================
              STATISTICS
          ================================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {loading || !statistics ? (

              Array.from({ length: 5 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))

            ) : (

              <>

                {/* TOTAL PROJECTS */}

                <StatCard
                  icon={FolderKanban}
                  label="Total Projects"
                  value={statistics.totalProjects}
                  accent="text-indigo-600 bg-indigo-50"
                />

                {/* TOTAL TASKS */}

                <StatCard
                  icon={CheckSquare}
                  label="Total Tasks"
                  value={statistics.totalTasks}
                  accent="text-blue-600 bg-blue-50"
                />

                {/* COMPLETED TASKS */}

                <StatCard
                  icon={CheckCircle2}
                  label="Completed Tasks"
                  value={statistics.completedTasks}
                  accent="text-emerald-600 bg-emerald-50"
                />

                {/* PENDING TASKS */}

                <StatCard
                  icon={Clock}
                  label="Pending Tasks"
                  value={statistics.pendingTasks}
                  accent="text-amber-600 bg-amber-50"
                />

                {/* IN PROGRESS TASKS */}

                <StatCard
                  icon={TrendingUp}
                  label="In Progress"
                  value={statistics.inProgressTasks}
                  accent="text-purple-600 bg-purple-50"
                />

              </>

            )}

          </div>

          {/* ==================================
              PROJECT SECTION
          ================================== */}

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* RECENT PROJECTS */}

            <div className="lg:col-span-2">

              <RecentProjects
                projects={projects}
              />

            </div>

            {/* PROJECT STATUS OVERVIEW */}

            <ProjectOverview
              projects={projects}
            />

          </div>


        </>

      )}

    </MainLayout>
  );
}