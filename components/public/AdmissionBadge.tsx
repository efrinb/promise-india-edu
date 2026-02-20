interface AdmissionBadgeProps {
    status: 'open' | 'closing_soon' | 'closed';
    className?: string;
}

export function AdmissionBadge({ status, className = '' }: AdmissionBadgeProps) {
    const configs = {
        open: {
            label: 'Admissions Open',
            bgColor: 'bg-secondary-100 dark:bg-secondary-900',
            textColor: 'text-secondary-800 dark:text-secondary-300',
            dotColor: 'bg-secondary-500',
        },
        closing_soon: {
            label: 'Closing Soon',
            bgColor: 'bg-accent-100 dark:bg-accent-900',
            textColor: 'text-accent-800 dark:text-accent-300',
            dotColor: 'bg-accent-500',
        },
        closed: {
            label: 'Admissions Closed',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            textColor: 'text-gray-800 dark:text-gray-300',
            dotColor: 'bg-gray-500',
        },
    };

    const config = configs[status];

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} ${className}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`}></span>
            {config.label}
        </span>
    );
}