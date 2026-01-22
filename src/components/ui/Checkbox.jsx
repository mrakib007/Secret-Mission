import React from 'react';
import { useField } from 'formik';
import { cn } from '../../lib/utils';

const Checkbox = ({ label, helperText, className, ...props }) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    const isError = meta.touched && meta.error;

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <div className="flex items-center gap-3">
                <input
                    {...field}
                    {...props}
                    type="checkbox"
                    className={cn(
                        'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer',
                        isError && 'border-red-500 focus:ring-red-500',
                        props.disabled && 'bg-gray-50 cursor-not-allowed'
                    )}
                />
                {label && (
                    <label htmlFor={props.id || props.name} className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                        {label}
                    </label>
                )}
            </div>
            {isError && (
                <p className="mt-1 text-xs text-red-600">{meta.error}</p>
            )}
            {helperText && !isError && (
                <p className="mt-1 text-xs text-gray-500 ml-7">{helperText}</p>
            )}
        </div>
    );
};

export default Checkbox;
