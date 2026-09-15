import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong.', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-charcoal-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
