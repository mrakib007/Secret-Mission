import React from 'react';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';

const DateTime = ({
    date,
    variant = 'full',
    className
}) => {
    if (!date) return <span className={cn('text-gray-400', className)}>N/A</span>;

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
        return <span className={cn('text-red-500', className)}>Invalid Date</span>;
    }

    const formats = {
        full: 'MMM d, yyyy h:mm a',
        dateOnly: 'MMM d, yyyy',
        timeOnly: 'h:mm a',
        short: 'MM/dd/yy',
        relative: null, // special case
    };

    let formatted = '';
    if (variant === 'relative') {
        formatted = formatDistanceToNow(dateObj, { addSuffix: true });
    } else {
        formatted = format(dateObj, formats[variant] || formats.full);
    }

    return (
        <span className={cn('text-sm text-gray-700 font-medium', className)} title={format(dateObj, 'PPPP p')}>
            {formatted}
        </span>
    );
};

export default DateTime;
