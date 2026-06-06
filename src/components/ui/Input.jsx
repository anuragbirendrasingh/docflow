import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, id, type = 'text', placeholder, value, onChange, icon: Icon, ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
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
            w-full rounded-lg border py-2.5 text-gray-900
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
          `}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
