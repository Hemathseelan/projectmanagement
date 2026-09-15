import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Workflow } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import { isValidEmail, passwordStrength } from '../../utils/validators';

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const strength = passwordStrength(form.password);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;
    const result = await dispatch(
      registerUser({ fullName: form.fullName, email: form.email, password: form.password })
    );
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFB] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Workflow className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-charcoal-900">TaskFlow</span>
        </div>

        <h2 className="text-2xl font-semibold text-charcoal-900">Create your account</h2>
        <p className="mt-1.5 text-sm text-gray-500">Start planning and delivering with TaskFlow.</p>

        {error && (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} placeholder="Jane Doe" />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" />
          <div>
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} placeholder="At least 8 characters" />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? STRENGTH_COLORS[strength - 1] : 'bg-gray-100'}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">{STRENGTH_LABELS[Math.max(strength - 1, 0)]}</p>
              </div>
            )}
          </div>
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
