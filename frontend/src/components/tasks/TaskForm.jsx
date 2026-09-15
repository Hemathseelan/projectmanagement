import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Modal from '../common/Modal';
import {
  TASK_STATUS,
  TASK_PRIORITY,
} from '../../utils/constants';

const emptyForm = {
  projectId: '',
  name: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  projects = [],
  defaultProjectId = '',
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ==========================================
  // INITIALIZE FORM
  // ==========================================

  useEffect(() => {
    if (!open) return;

    setForm(
      initialData
        ? {
            projectId: String(
              initialData.projectId ||
                defaultProjectId ||
                ''
            ),
            name: initialData.name || '',
            description: initialData.description || '',
            priority: initialData.priority || 'Medium',
            status: initialData.status || 'Pending',
            dueDate: initialData.dueDate || '',
          }
        : {
            ...emptyForm,
            projectId: String(defaultProjectId || ''),
          }
    );

    setErrors({});
  }, [open, initialData, defaultProjectId]);

  // ==========================================
  // CHANGE HANDLER
  // ==========================================

  function handleChange(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    // Clear field error
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: '',
      }));
    }
  }

  // ==========================================
  // VALIDATION
  // ==========================================

  function validate() {
    const next = {};

    if (!form.projectId) {
      next.projectId = 'Please select a project';
    }

    if (!form.name.trim()) {
      next.name = 'Task name is required';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...form,
      projectId: Number(form.projectId),
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        initialData
          ? 'Edit Task'
          : 'Create New Task'
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* ====================================
            PROJECT
        ==================================== */}

        <Select
          label="Project"
          value={form.projectId}
          onChange={(e) =>
            handleChange(
              'projectId',
              e.target.value
            )
          }
          options={projects.map((project) => ({
            value: String(project.id),
            label: project.name,
          }))}
          placeholder="Select a project"
          error={errors.projectId}
          disabled={
            Boolean(defaultProjectId) ||
            Boolean(initialData?.projectId)
          }
        />

        {/* ====================================
            TASK NAME
        ==================================== */}

        <Input
          label="Task Name"
          value={form.name}
          onChange={(e) =>
            handleChange(
              'name',
              e.target.value
            )
          }
          error={errors.name}
          placeholder="e.g. Design login page"
        />

        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              handleChange(
                'description',
                e.target.value
              )
            }
            rows={3}
            className="
              btn-focus
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              outline-none
              placeholder:text-gray-400
              focus:border-indigo-400
            "
            placeholder="Add more detail (optional)"
          />
        </div>

        {/* ====================================
            PRIORITY + STATUS
        ==================================== */}

        <div className="grid grid-cols-2 gap-4">

          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) =>
              handleChange(
                'priority',
                e.target.value
              )
            }
            options={TASK_PRIORITY}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              handleChange(
                'status',
                e.target.value
              )
            }
            options={TASK_STATUS}
          />

        </div>

        {/* ====================================
            DUE DATE
        ==================================== */}

        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            handleChange(
              'dueDate',
              e.target.value
            )
          }
        />

        {/* ====================================
            ACTIONS
        ==================================== */}

        <div className="flex justify-end gap-3 pt-2">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
          >
            {initialData
              ? 'Save Changes'
              : 'Create Task'}
          </Button>

        </div>

      </form>
    </Modal>
  );
}