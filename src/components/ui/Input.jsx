import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, id, type = 'text', placeholder, value, onChange, icon: Icon, className = '', ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3
            text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm
            transition-all duration-300
            focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
            disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400
            ${Icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20 hover:border-slate-300 dark:hover:border-slate-600'
            }
            ${className}
          `}
          {...rest}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
});

export default Input;
