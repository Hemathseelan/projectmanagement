import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Workflow } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-charcoal-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
            <Workflow className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">TaskFlow</span>
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-semibold leading-tight">Manage your work with clarity.</h1>
          <p className="mt-4 max-w-sm text-charcoal-400">
            Plan projects, organize tasks, and keep your team moving forward.
          </p>
        </div>
        <p className="text-xs text-charcoal-500">Plan. Organize. Deliver.</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Workflow className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-charcoal-900">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-semibold text-charcoal-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to your workspace.</p>

          {error && (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="btn-focus absolute right-3 top-[2.35rem] text-gray-400 hover:text-charcoal-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-charcoal-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                Remember me
              </label>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
