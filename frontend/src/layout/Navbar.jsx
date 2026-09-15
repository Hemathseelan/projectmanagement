import { useEffect, useMemo, useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  X,
  FolderKanban,
  CheckSquare,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // DATA
  // ==========================================

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ==========================================
  // SEARCH STATE
  // ==========================================

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // ==========================================
  // NOTIFICATION STATE
  // ==========================================

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('taskflow_read_notifications') || '[]'
      );
    } catch {
      return [];
    }
  });

  // ==========================================
  // LOAD PROJECTS + TASKS
  // ==========================================

  useEffect(() => {
    let mounted = true;

    async function loadNavbarData() {
      try {
        const [projectResponse, taskResponse] = await Promise.all([
          projectService.list({
            page: 1,
            limit: 100,
            sortBy: 'createdAt',
            order: 'desc',
          }),
          taskService.list({
            page: 1,
            limit: 100,
            sortBy: 'dueDate',
            order: 'asc',
          }),
        ]);

        if (!mounted) return;

        setProjects(projectResponse?.data || []);
        setTasks(taskResponse?.data || []);
      } catch (error) {
        console.error('Navbar data error:', error);
      }
    }

    loadNavbarData();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return {
        projects: [],
        tasks: [],
      };
    }

    const matchedProjects = projects
      .filter((project) =>
        project.name?.toLowerCase().includes(value)
      )
      .slice(0, 5);

    const matchedTasks = tasks
      .filter((task) =>
        task.name?.toLowerCase().includes(value)
      )
      .slice(0, 5);

    return {
      projects: matchedProjects,
      tasks: matchedTasks,
    };
  }, [query, projects, tasks]);

  const hasSearchResults =
    searchResults.projects.length > 0 ||
    searchResults.tasks.length > 0;

  // ==========================================
  // SEARCH HANDLER
  // ==========================================

  function handleSearch(event) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      return;
    }

    setSearchOpen(false);

    // Search page
    navigate(
      `/projects?search=${encodeURIComponent(value)}`
    );
  }

  // ==========================================
  // OPEN PROJECT
  // ==========================================

  function openProject(projectId) {
    setSearchOpen(false);
    setQuery('');

    navigate(`/projects/${projectId}`);
  }

  // ==========================================
  // OPEN TASK
  // ==========================================

  function openTask(task) {
    setSearchOpen(false);
    setQuery('');

    // Open the project details page
    // because tasks belong to projects.
    navigate(`/projects/${task.projectId}`);
  }

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  function clearSearch() {
    setQuery('');
    setSearchOpen(false);
  }

  // ==========================================
  // DATE HELPERS
  // ==========================================

  function getDateOnly(value) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  function getDaysRemaining(dateValue) {
    const targetDate = getDateOnly(dateValue);

    if (!targetDate) {
      return null;
    }

    const today = new Date();

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const difference =
      targetDate.getTime() - todayDate.getTime();

    return Math.round(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const notifications = useMemo(() => {
    const result = [];

    // ------------------------------------------
    // PROJECT NOTIFICATIONS
    // ------------------------------------------

    projects.forEach((project) => {
      // Completed projects should not notify
      if (project.status === 'Completed') {
        return;
      }

      if (!project.endDate) {
        return;
      }

      const daysLeft = getDaysRemaining(project.endDate);

      if (daysLeft === null) {
        return;
      }

      // 3 days, 2 days, 1 day
      if (daysLeft >= 1 && daysLeft <= 3) {
        result.push({
          id: `project-${project.id}-${daysLeft}`,
          type: 'project',
          itemId: project.id,
          name: project.name,
          daysLeft,
          title: project.name,
          message:
            daysLeft === 1
              ? 'You have 1 day left'
              : `You have ${daysLeft} days left`,
          icon: FolderKanban,
          iconClass:
            daysLeft === 1
              ? 'bg-red-50 text-red-600'
              : 'bg-indigo-50 text-indigo-600',
          priority: daysLeft,
        });
      }

      // Due today
      if (daysLeft === 0) {
        result.push({
          id: `project-${project.id}-today`,
          type: 'project',
          itemId: project.id,
          name: project.name,
          daysLeft: 0,
          title: project.name,
          message: 'Your project is due today',
          icon: Clock,
          iconClass: 'bg-amber-50 text-amber-600',
          priority: 0,
        });
      }

      // Overdue
      if (daysLeft < 0) {
        result.push({
          id: `project-${project.id}-overdue`,
          type: 'project',
          itemId: project.id,
          name: project.name,
          daysLeft,
          title: project.name,
          message: 'This project is overdue',
          icon: AlertCircle,
          iconClass: 'bg-red-50 text-red-600',
          priority: -1,
        });
      }
    });

    // ------------------------------------------
    // TASK NOTIFICATIONS
    // ------------------------------------------

    tasks.forEach((task) => {
      // Completed tasks should not notify
      if (task.status === 'Completed') {
        return;
      }

      if (!task.dueDate) {
        return;
      }

      const daysLeft = getDaysRemaining(task.dueDate);

      if (daysLeft === null) {
        return;
      }

      // 3 days, 2 days, 1 day
      if (daysLeft >= 1 && daysLeft <= 3) {
        result.push({
          id: `task-${task.id}-${daysLeft}`,
          type: 'task',
          itemId: task.id,
          projectId: task.projectId,
          name: task.name,
          daysLeft,
          title: task.name,
          message:
            daysLeft === 1
              ? 'You have 1 day left'
              : `You have ${daysLeft} days left`,
          icon: CheckSquare,
          iconClass:
            daysLeft === 1
              ? 'bg-red-50 text-red-600'
              : 'bg-blue-50 text-blue-600',
          priority: daysLeft,
        });
      }

      // Due today
      if (daysLeft === 0) {
        result.push({
          id: `task-${task.id}-today`,
          type: 'task',
          itemId: task.id,
          projectId: task.projectId,
          name: task.name,
          daysLeft: 0,
          title: task.name,
          message: 'This task is due today',
          icon: Clock,
          iconClass: 'bg-amber-50 text-amber-600',
          priority: 0,
        });
      }

      // Overdue
      if (daysLeft < 0) {
        result.push({
          id: `task-${task.id}-overdue`,
          type: 'task',
          itemId: task.id,
          projectId: task.projectId,
          name: task.name,
          daysLeft,
          title: task.name,
          message: 'This task is overdue',
          icon: AlertCircle,
          iconClass: 'bg-red-50 text-red-600',
          priority: -1,
        });
      }
    });

    // ------------------------------------------
    // SORT
    // ------------------------------------------

    return result
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10);
  }, [projects, tasks]);

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  ).length;

  // ==========================================
  // TOGGLE NOTIFICATIONS
  // ==========================================

  function toggleNotifications() {
    setNotificationsOpen(
      (previous) => !previous
    );

    setSearchOpen(false);
  }

  // ==========================================
  // CLOSE NOTIFICATIONS
  // ==========================================

  function closeNotifications() {
    setNotificationsOpen(false);
  }

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  function markAsRead(notificationId) {
    setReadNotifications((previous) => {
      if (previous.includes(notificationId)) {
        return previous;
      }

      const updated = [
        ...previous,
        notificationId,
      ];

      localStorage.setItem(
        'taskflow_read_notifications',
        JSON.stringify(updated)
      );

      return updated;
    });
  }

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  function markAllAsRead() {
    const ids = notifications.map(
      (notification) => notification.id
    );

    setReadNotifications((previous) => {
      const updated = Array.from(
        new Set([...previous, ...ids])
      );

      localStorage.setItem(
        'taskflow_read_notifications',
        JSON.stringify(updated)
      );

      return updated;
    });
  }

  // ==========================================
  // OPEN NOTIFICATION
  // ==========================================

  function handleNotificationClick(notification) {
    markAsRead(notification.id);
    setNotificationsOpen(false);

    if (notification.type === 'project') {
      navigate(`/projects/${notification.itemId}`);
      return;
    }

    if (notification.type === 'task') {
      navigate(`/projects/${notification.projectId}`);
    }
  }

  // ==========================================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // ==========================================

  function handleSearchBlur() {
    setTimeout(() => {
      setSearchOpen(false);
    }, 150);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-gray-100
        bg-white/80
        px-4
        py-4
        backdrop-blur
        sm:px-6
      "
    >
      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}

        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="
            btn-focus
            rounded-lg
            p-1.5
            text-gray-500
            hover:bg-gray-100
            lg:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* PAGE TITLE */}

        <h1
          className="
            text-lg
            font-semibold
            text-charcoal-900
          "
        >
          {title}
        </h1>

      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="flex items-center gap-3">

        {/* ====================================
            GLOBAL SEARCH
        ==================================== */}

        <div className="relative hidden sm:block">

          <form
            onSubmit={handleSearch}
            className="relative"
          >

            {/* SEARCH ICON */}

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

            {/* SEARCH INPUT */}

            <input
              type="text"
              value={query}
              onFocus={() => {
                setSearchOpen(true);
                setNotificationsOpen(false);
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onBlur={handleSearchBlur}
              placeholder="Search projects or tasks..."
              aria-label="Search projects or tasks"
              className="
                btn-focus
                w-64
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                py-2
                pl-9
                pr-9
                text-sm
                outline-none
                placeholder:text-gray-400
                focus:border-indigo-400
                focus:bg-white
              "
            />

            {/* CLEAR */}

            {query && (
              <button
                type="button"
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={clearSearch}
                aria-label="Clear search"
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  rounded-md
                  p-1
                  text-gray-400
                  hover:bg-gray-200
                  hover:text-gray-600
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </form>

          {/* ==================================
              SEARCH DROPDOWN
          ================================== */}

          {searchOpen && query.trim() && (
            <div
              className="
                absolute
                right-0
                top-11
                z-50
                w-80
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-xl
              "
            >

              {/* PROJECT RESULTS */}

              {searchResults.projects.length > 0 && (
                <div className="border-b border-gray-100">

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    <FolderKanban className="h-3.5 w-3.5" />
                    Projects
                  </div>

                  {searchResults.projects.map(
                    (project) => (
                      <button
                        key={project.id}
                        type="button"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          openProject(project.id)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          px-4
                          py-2.5
                          text-left
                          transition
                          hover:bg-gray-50
                        "
                      >
                        <div
                          className="
                            grid
                            h-8
                            w-8
                            shrink-0
                            place-items-center
                            rounded-lg
                            bg-indigo-50
                            text-indigo-600
                          "
                        >
                          <FolderKanban className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-charcoal-900
                            "
                          >
                            {project.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Project
                          </p>
                        </div>
                      </button>
                    )
                  )}

                </div>
              )}

              {/* TASK RESULTS */}

              {searchResults.tasks.length > 0 && (
                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    Tasks
                  </div>

                  {searchResults.tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        openTask(task)
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-2.5
                        text-left
                        transition
                        hover:bg-gray-50
                      "
                    >
                      <div
                        className="
                          grid
                          h-8
                          w-8
                          shrink-0
                          place-items-center
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                        "
                      >
                        <CheckSquare className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                            text-charcoal-900
                          "
                        >
                          {task.name}
                        </p>

                        <p className="truncate text-xs text-gray-400">
                          {task.projectName
                            ? `Task · ${task.projectName}`
                            : 'Task'}
                        </p>
                      </div>
                    </button>
                  ))}

                </div>
              )}

              {/* NO RESULTS */}

              {!hasSearchResults && (
                <div className="px-4 py-8 text-center">

                  <Search
                    className="
                      mx-auto
                      mb-2
                      h-5
                      w-5
                      text-gray-300
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-500
                    "
                  >
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try another project or task name.
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ====================================
            NOTIFICATIONS
        ==================================== */}

        <div className="relative">

          {/* NOTIFICATION BUTTON */}

          <button
            type="button"
            onClick={toggleNotifications}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="
              btn-focus
              relative
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
            "
          >

            <Bell className="h-5 w-5" />

            {/* UNREAD BADGE */}

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  min-h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[9px]
                  font-bold
                  text-white
                "
              >
                {unreadCount > 9
                  ? '9+'
                  : unreadCount}
              </span>
            )}

          </button>

          {/* ==================================
              NOTIFICATION DROPDOWN
          ================================== */}

          {notificationsOpen && (
            <div
              className="
                absolute
                right-0
                top-11
                z-50
                w-80
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-xl
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  px-4
                  py-3
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-charcoal-900
                    "
                  >
                    Notifications
                  </p>

                  <p className="text-xs text-gray-400">
                    Project and task deadlines
                  </p>

                </div>

                <div className="flex items-center gap-1">

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="
                        rounded-lg
                        px-2
                        py-1
                        text-xs
                        font-medium
                        text-indigo-600
                        hover:bg-indigo-50
                      "
                    >
                      Mark all read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeNotifications}
                    aria-label="Close notifications"
                    className="
                      rounded-lg
                      p-1.5
                      text-gray-400
                      hover:bg-gray-100
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

              </div>

              {/* NOTIFICATIONS */}

              {notifications.length > 0 ? (
                <div className="max-h-[360px] overflow-y-auto">

                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    const isRead =
                      readNotifications.includes(
                        notification.id
                      );

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-start
                          gap-3
                          border-b
                          border-gray-50
                          px-4
                          py-3
                          text-left
                          transition
                          hover:bg-gray-50
                          ${
                            isRead
                              ? 'bg-white'
                              : 'bg-indigo-50/40'
                          }
                        `}
                      >

                        {/* ICON */}

                        <div
                          className={`
                            grid
                            h-9
                            w-9
                            shrink-0
                            place-items-center
                            rounded-xl
                            ${notification.iconClass}
                          `}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <p
                              className={`
                                truncate
                                text-sm
                                ${
                                  isRead
                                    ? 'font-medium text-charcoal-700'
                                    : 'font-semibold text-charcoal-900'
                                }
                              `}
                            >
                              {notification.title}
                            </p>

                            {!isRead && (
                              <span
                                className="
                                  mt-1
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full
                                  bg-indigo-600
                                "
                              />
                            )}

                          </div>

                          <p
                            className={`
                              mt-0.5
                              text-xs
                              ${
                                notification.daysLeft <= 1
                                  ? 'font-medium text-red-600'
                                  : 'text-gray-500'
                              }
                            `}
                          >
                            {notification.message}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                            {notification.type === 'project'
                              ? 'Project'
                              : 'Task'}
                          </p>

                        </div>

                      </button>
                    );
                  })}

                </div>
              ) : (
                /* EMPTY STATE */

                <div className="px-4 py-8 text-center">

                  <div
                    className="
                      mx-auto
                      mb-3
                      grid
                      h-11
                      w-11
                      place-items-center
                      rounded-full
                      bg-indigo-50
                      text-indigo-600
                    "
                  >
                    <Bell className="h-5 w-5" />
                  </div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-charcoal-800
                    "
                  >
                    You're all caught up
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    No upcoming deadlines right now.
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ====================================
            USER AVATAR
        ==================================== */}


      </div>
    </header>
  );
}