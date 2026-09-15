import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { PROJECT_STATUS } from '../../utils/constants';

const emptyForm = { name: '', description: '', status: 'Not Started', startDate: '', endDate: '' };

export default function ProjectForm({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name || '',
              description: initialData.description || '',
              status: initialData.status || 'Not Started',
              startDate: initialData.startDate || '',
              endDate: initialData.endDate || '',
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Project name is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      next.endDate = 'End date cannot be before start date';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Project' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          placeholder="e.g. Website Redesign"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-800">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className={`btn-focus w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm ${errors.description ? 'border-rose-400' : 'border-gray-200'}`}
            placeholder="What is this project about?"
          />
          {errors.description && <p className="mt-1.5 text-xs text-rose-600">{errors.description}</p>}
        </div>
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={PROJECT_STATUS}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} error={errors.endDate} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
