const variantStyles = {
  owner: 'bg-green-100 text-green-700',
  shared: 'bg-blue-100 text-blue-700',
};

export default function Badge({ variant = 'owner', children }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant] || variantStyles.owner}
      `}
    >
      {children}
    </span>
  );
}
