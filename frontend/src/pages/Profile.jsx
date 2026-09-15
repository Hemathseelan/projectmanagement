import { useState } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../layout/MainLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatDate';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState(user?.fullName || '');

  return (
    <MainLayout title="Profile">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
              {(user?.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">{user?.fullName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email Address" value={user?.email || ''} disabled />
            <div>
              <p className="text-xs text-gray-400">Member since</p>
              <p className="mt-1 text-sm font-medium text-charcoal-800">{formatDate(user?.createdAt)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
            <Button disabled>Save Changes</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
