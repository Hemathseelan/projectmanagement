import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="btn-focus w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-charcoal-900 placeholder:text-gray-400"
      />
    </div>
  );
}
