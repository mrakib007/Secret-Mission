import React from 'react';
import { cn } from '../../lib/utils';

const TableSkeleton = ({ columns = 5, rows = 5, className }) => {
    return (
        <div className={cn('w-full flex flex-col gap-4', className)}>
            <div className="overflow-x-auto border border-[var(--border-main)] rounded-lg">
                <table className="min-w-full divide-y divide-[var(--border-main)]">
                    {/* Header Skeleton */}
                    <thead className="bg-[var(--bg-app)]">
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="px-6 py-3">
                                    <div className="h-4 bg-[var(--bg-skeleton)] rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body Skeleton */}
                    <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-main)]">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[var(--bg-app)]/50 transition-colors">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {colIndex === 0 && (
                                                <div className="h-10 w-10 bg-[var(--bg-skeleton)] rounded-full animate-pulse"></div>
                                            )}
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-[var(--bg-skeleton)] rounded animate-pulse w-3/4"></div>
                                                {colIndex === 0 && (
                                                    <div className="h-3 bg-[var(--bg-skeleton-muted)] rounded animate-pulse w-1/2"></div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between px-2">
                <div className="h-4 bg-[var(--bg-skeleton)] rounded animate-pulse w-32"></div>
                <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-8 w-8 bg-[var(--bg-skeleton)] rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TableSkeleton;