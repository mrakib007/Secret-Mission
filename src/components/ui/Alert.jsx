import React from 'react';
import { cn } from '../../lib/utils';
import {
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

const Alert = ({
    title,
    children,
    variant = 'info',
    onClose,
    className
}) => {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-400" />,
        error: <AlertCircle className="h-5 w-5 text-red-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
        info: <Info className="h-5 w-5 text-blue-400" />,
    };

    const variants = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
        <div className={cn('rounded-lg border p-4 transition-all', variants[variant], className)} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">{icons[variant]}</div>
                <div className="ml-3 flex-1">
                    {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
                    <div className="text-sm opacity-90">{children}</div>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black/5"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;
