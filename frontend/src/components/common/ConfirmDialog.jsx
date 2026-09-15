import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, confirmLabel = 'Delete' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{description}</p>
      <p className="mt-2 text-sm font-medium text-rose-600">This action cannot be undone.</p>
    </Modal>
  );
}
