const variantStyles = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700',
  owner: 'bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 ring-primary-500/30',
  shared: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 ring-indigo-500/30',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
