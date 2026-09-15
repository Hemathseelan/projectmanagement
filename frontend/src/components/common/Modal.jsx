import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-950/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-lg animate-[modalIn_.15s_ease-out] rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-charcoal-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="btn-focus rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-charcoal-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
      <style>{`@keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}
