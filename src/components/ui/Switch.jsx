import React from 'react';
import { useField } from 'formik';
import { cn } from '../../lib/utils';

const Switch = ({ label, helperText, className, ...props }) => {
    const [field, meta, helpers] = useField({ ...props, type: 'checkbox' });
    const isError = meta.touched && meta.error;
    const isChecked = field.value;

    const toggle = () => {
        if (!props.disabled) {
            helpers.setValue(!isChecked);
        }
    };

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <div className="flex items-center justify-between gap-3">
                {label && (
                    <span className="text-sm font-medium text-gray-900" onClick={toggle}>
                        {label}
                    </span>
                )}
                <button
                    type="button"
                    onClick={toggle}
                    disabled={props.disabled}
                    className={cn(
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                        isChecked ? 'bg-indigo-600' : 'bg-gray-200',
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                        )}
                    />
                </button>
            </div>
            {isError && (
                <p className="mt-1 text-xs text-red-600">{meta.error}</p>
            )}
            {helperText && !isError && (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Switch;
