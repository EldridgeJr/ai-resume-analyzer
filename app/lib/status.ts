export const STATUS_ORDER: ApplicationStatus[] = [
    "not_applied",
    "applied",
    "interview",
    "offer",
    "rejected",
];

export const STATUS_META: Record<
    ApplicationStatus,
    { label: string; badge: string; dot: string }
> = {
    not_applied: {
        label: "Not applied",
        badge: "bg-slate-100 text-slate-600 dark:bg-surface-2 dark:text-slate-400",
        dot: "bg-slate-400",
    },
    applied: {
        label: "Applied",
        badge: "bg-badge-green text-badge-green-text dark:bg-green-500/15 dark:text-green-300",
        dot: "bg-green-500",
    },
    interview: {
        label: "Interview",
        badge: "bg-indigo-50 text-accent dark:bg-indigo-500/15 dark:text-indigo-300",
        dot: "bg-indigo-500",
    },
    offer: {
        label: "Offer",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
        dot: "bg-emerald-500",
    },
    rejected: {
        label: "Rejected",
        badge: "bg-badge-red text-badge-red-text dark:bg-red-500/15 dark:text-red-300",
        dot: "bg-red-500",
    },
};

export const statusOf = (resume: Resume): ApplicationStatus =>
    resume.status ?? "not_applied";
