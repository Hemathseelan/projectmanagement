import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300',
  secondary: 'bg-white text-charcoal-900 border border-gray-200 hover:bg-gray-50',
  ghost: 'bg-transparent text-charcoal-700 hover:bg-gray-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn-focus inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
