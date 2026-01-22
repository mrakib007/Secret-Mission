import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={cn('bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden', className)}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ title, subtitle, action, className, ...props }) => {
    return (
        <div className={cn('px-6 py-4 border-b border-gray-100 flex items-center justify-between', className)} {...props}>
            <div>
                {title && <h3 className="text-lg font-semibold text-gray-900 leading-none">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};

const CardBody = ({ children, className, ...props }) => {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
};

const CardFooter = ({ children, className, ...props }) => {
    return (
        <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)} {...props}>
            {children}
        </div>
    );
};

export { Card, CardHeader, CardBody, CardFooter };
