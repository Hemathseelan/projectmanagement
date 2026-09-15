import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  className = '',
  disabled = false,
}) {
  return (
    <div className="w-full">
      {/* LABEL */}
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}

      {/* SELECT WRAPPER */}
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className={`
            btn-focus
            h-11
            w-full
            appearance-none
            rounded-lg
            border
            bg-white
            px-3.5
            pr-10
            text-sm
            text-charcoal-900
            outline-none
            transition
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-400
            ${
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
            }
            ${className}
          `}
        >
          {/* PLACEHOLDER */}
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {/* OPTIONS */}
          {options.map((option, index) => {
            // Support both:
            // "Completed"
            //
            // and:
            // { value: "1", label: "Church Website" }

            const isObject =
              typeof option === 'object' &&
              option !== null;

            const optionValue = isObject
              ? option.value
              : option;

            const optionLabel = isObject
              ? option.label
              : option;

            return (
              <option
                key={`${optionValue}-${index}`}
                value={optionValue}
              >
                {optionLabel}
              </option>
            );
          })}
        </select>

        {/* ARROW */}
        <ChevronDown
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-gray-400
          "
        />
      </div>

      {/* ERROR */}
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}