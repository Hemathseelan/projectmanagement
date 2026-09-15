import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-charcoal-800">{page}</span> of{' '}
        <span className="font-medium text-charcoal-800">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-focus inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-charcoal-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-focus inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-charcoal-700 disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
