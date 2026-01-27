import { useMemo } from 'react';
import { GanttChart } from 'lucide-react';
import { useGetApiWithIdQuery } from '../../../store/api/commonApi';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isWeekend } from 'date-fns';
import DateTime from '../../../components/ui/DateTime';

const ProjectGanttCustom = ({
    projectId,
    projectStart,
    projectEnd,
    items: itemsProp,
    className = '',
    minHeight = 420,
}) => {
    const { data: planningRes } = useGetApiWithIdQuery(
        { url: '/project-planning-list', id: projectId },
        { skip: !projectId || itemsProp !== undefined }
    );

    const items = itemsProp ?? planningRes?.data?.data ?? planningRes?.data ?? [];

    // Calculate date range for calendar
    const dateRange = useMemo(() => {
        if (!items.length) {
            const start = projectStart ? new Date(projectStart) : new Date();
            const end = projectEnd ? new Date(projectEnd) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            return { start, end };
        }

        const dates = items
            .map((item) => [
                item.start_date ? new Date(item.start_date) : null,
                item.end_date ? new Date(item.end_date) : null,
            ])
            .flat()
            .filter(Boolean);

        if (!dates.length) {
            const start = projectStart ? new Date(projectStart) : new Date();
            const end = projectEnd ? new Date(projectEnd) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            return { start, end };
        }

        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));
        
        // Extend range a bit for better visibility
        const paddingDays = 7;
        start.setDate(start.getDate() - paddingDays);
        end.setDate(end.getDate() + paddingDays);

        return { start, end };
    }, [items, projectStart, projectEnd]);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
        return days;
    }, [dateRange]);

    // Calculate bar positions for each item
    const itemBars = useMemo(() => {
        return items.map((item) => {
            const start = item.start_date ? new Date(item.start_date) : null;
            const end = item.end_date ? new Date(item.end_date) : null;
            if (!start || !end) return null;

            const totalDays = calendarDays.length;
            const startIndex = calendarDays.findIndex((d) => format(d, 'yyyy-MM-dd') === format(start, 'yyyy-MM-dd'));
            const endIndex = calendarDays.findIndex((d) => format(d, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd'));

            if (startIndex === -1 || endIndex === -1) return null;

            const leftPercent = (startIndex / totalDays) * 100;
            const widthPercent = ((endIndex - startIndex + 1) / totalDays) * 100;
            const progress = item.progress != null ? Number(item.progress) : 0;

            return {
                id: item.id,
                name: item.description || item.title || item.name || 'Untitled',
                left: leftPercent,
                width: widthPercent,
                progress: Math.min(100, Math.max(0, progress)),
                start,
                end,
                status: item.status || 'pending',
                planningType: item.planning_type?.name || '',
            };
        }).filter(Boolean);
    }, [items, calendarDays]);

    // Group days by month for header
    const monthGroups = useMemo(() => {
        const groups = [];
        let currentMonth = null;
        let currentGroup = null;

        calendarDays.forEach((day, index) => {
            const monthKey = format(day, 'MMM yyyy');
            if (monthKey !== currentMonth) {
                if (currentGroup) groups.push(currentGroup);
                currentMonth = monthKey;
                currentGroup = { month: day, startIndex: index, days: [] }; // Store date object instead of string
            }
            currentGroup.days.push(day);
        });
        if (currentGroup) groups.push(currentGroup);

        return groups;
    }, [calendarDays]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-500';
            case 'in_progress':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'on_hold':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    if (!items.length) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 border border-primary-500/25">
                        <GanttChart className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white">Timeline (Gantt)</h3>
                        <p className="text-xs text-slate-400">Project schedule at a glance</p>
                    </div>
                </div>
                <div
                    className="flex flex-col items-center justify-center rounded-xl border border-dark-700 bg-dark-900/50 py-14"
                    style={{ minHeight }}
                >
                    <div className="rounded-full bg-dark-800 p-4 mb-3 ring-1 ring-dark-600">
                        <GanttChart className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-300 font-medium">No planning items yet</p>
                    <p className="text-slate-500 text-sm mt-1">Add planning items above to see the Gantt chart here.</p>
                </div>
            </div>
        );
    }

    const rowHeight = 48;
    const headerHeight = 100;
    const minRows = Math.ceil((minHeight - headerHeight) / rowHeight);
    const totalRows = Math.max(minRows, itemBars.length);
    const totalHeight = totalRows * rowHeight + headerHeight;

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 border border-primary-500/25">
                    <GanttChart className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Timeline (Gantt)</h3>
                    <p className="text-xs text-slate-400">Project schedule at a glance</p>
                </div>
            </div>

            <div
                className="rounded-xl border border-dark-700 bg-dark-900/50 overflow-hidden"
                style={{ minHeight: totalHeight }}
            >
                {/* Calendar Header */}
                <div className="border-b border-dark-700 bg-dark-800/50">
                    {/* Month headers */}
                    <div className="flex border-b border-dark-700">
                        <div className="w-48 border-r border-dark-700 px-4 py-2 bg-dark-800/70"></div>
                        {monthGroups.map((group, idx) => {
                            // Format month header as "MMM yyyy" (e.g., "Jan 2026")
                            const monthText = format(group.month, 'MMM yyyy');
                            return (
                                <div
                                    key={idx}
                                    className="flex-1 px-2 py-2 text-xs font-semibold text-slate-300 text-center border-r border-dark-700 last:border-r-0"
                                    style={{
                                        flex: `${group.days.length} 0 0`,
                                    }}
                                >
                                    {monthText}
                                </div>
                            );
                        })}
                    </div>

                    {/* Day headers */}
                    <div className="flex overflow-x-auto custom-scrollbar-thin-gantt">
                        <div className="w-48 border-r border-dark-700 px-4 py-2 bg-dark-800/70 flex-shrink-0"></div>
                        <div className="flex flex-1 min-w-0">
                            {calendarDays.map((day, idx) => {
                                const isWeekendDay = isWeekend(day);
                                const isTodayDay = isToday(day);
                                return (
                                    <div
                                        key={idx}
                                        className={`flex-shrink-0 px-1 py-2 text-center border-r border-dark-700 last:border-r-0 ${
                                            isWeekendDay ? 'bg-dark-800/30' : 'bg-dark-800/50'
                                        } ${isTodayDay ? 'ring-1 ring-primary-500/50' : ''}`}
                                        style={{ minWidth: '32px' }}
                                    >
                                        <div className={`text-xs font-medium ${isTodayDay ? 'text-primary-400' : 'text-slate-400'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            {format(day, 'EEE')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Gantt Rows */}
                <div className="overflow-y-auto custom-scrollbar-thin-gantt" style={{ maxHeight: totalHeight - headerHeight }}>
                    {Array.from({ length: totalRows }).map((_, rowIdx) => {
                        const bar = itemBars[rowIdx];
                        // Empty row (no task)
                        if (!bar) {
                            return (
                                <div
                                    key={`empty-${rowIdx}`}
                                    className="flex items-center border-b border-dark-700"
                                    style={{ height: rowHeight }}
                                >
                                    {/* Empty task name area */}
                                    <div className="w-48 border-r border-dark-700 px-4 py-2 flex-shrink-0 bg-dark-800/30"></div>

                                    {/* Timeline area with grid lines */}
                                    <div className="flex-1 relative h-full overflow-hidden">
                                        {/* Grid lines - always show */}
                                        <div className="absolute inset-0 flex">
                                            {calendarDays.map((day, dayIdx) => {
                                                const isWeekendDay = isWeekend(day);
                                                return (
                                                    <div
                                                        key={dayIdx}
                                                        className={`flex-1 border-r border-dark-700 last:border-r-0 ${
                                                            isWeekendDay ? 'bg-dark-800/10' : ''
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Row with task
                        return (
                            <div
                                key={bar.id}
                                className="flex items-center border-b border-dark-700 hover:bg-dark-800/30 transition-colors"
                                style={{ height: rowHeight }}
                            >
                                {/* Task name */}
                                <div className="w-48 border-r border-dark-700 px-4 py-2 flex-shrink-0 bg-dark-800/30">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(bar.status)}`}></div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-white truncate">{bar.name}</p>
                                            {bar.planningType && (
                                                <p className="text-xs text-slate-400 truncate">{bar.planningType}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline area */}
                                <div className="flex-1 relative h-full overflow-hidden">
                                    {/* Grid lines - always show */}
                                    <div className="absolute inset-0 flex">
                                        {calendarDays.map((day, dayIdx) => {
                                            const isWeekendDay = isWeekend(day);
                                            return (
                                                <div
                                                    key={dayIdx}
                                                    className={`flex-1 border-r border-dark-700 last:border-r-0 ${
                                                        isWeekendDay ? 'bg-dark-800/10' : ''
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Gantt bar */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md overflow-hidden shadow-sm border border-dark-600"
                                        style={{
                                            left: `${bar.left}%`,
                                            width: `${bar.width}%`,
                                        }}
                                    >
                                        {/* Progress bar */}
                                        <div className={`h-full ${getStatusColor(bar.status)} relative`}>
                                            {/* Completed portion */}
                                            {bar.progress > 0 && (
                                                <div
                                                    className="h-full bg-green-500/80 transition-all"
                                                    style={{ width: `${bar.progress}%` }}
                                                />
                                            )}
                                            {/* Task label overlay */}
                                            <div className="absolute inset-0 flex items-center px-2">
                                                <span className="text-xs font-medium text-white truncate">
                                                    {bar.progress > 0 ? `${bar.progress}%` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectGanttCustom;
