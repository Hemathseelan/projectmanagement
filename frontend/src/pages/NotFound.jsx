import { Link } from 'react-router-dom';
import { Workflow } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFB] px-6 text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <Workflow className="h-5 w-5" />
      </div>
      <h1 className="text-6xl font-semibold text-charcoal-900">404</h1>
      <p className="mt-2 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
