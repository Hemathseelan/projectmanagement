export default function StatCard({ icon: Icon, label, value, hint, accent = 'text-indigo-600 bg-indigo-50' }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-charcoal-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
