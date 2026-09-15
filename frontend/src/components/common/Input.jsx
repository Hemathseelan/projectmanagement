export default function Input({ label, error, className = '', id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`btn-focus w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-gray-400 ${
          error ? 'border-rose-400' : 'border-gray-200'
        } ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
