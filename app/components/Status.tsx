import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown } from "~/components/icons";
import { STATUS_META, STATUS_ORDER, statusOf } from "~/lib/status";
import { cn, timeAgo } from "~/lib/utils";

export const StatusBadge = ({ resume }: { resume: Resume }) => {
    const status = statusOf(resume);
    const meta = STATUS_META[status];
    const label =
        status === "applied" && resume.appliedAt
            ? `Applied ${timeAgo(resume.appliedAt)}`
            : meta.label;

    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", meta.badge)}>
            <span className={cn("size-1.5 rounded-full", meta.dot)} />
            {label}
        </span>
    );
};

export const StatusPicker = ({
    resume,
    onChange,
    align = "left",
}: {
    resume: Resume;
    onChange: (status: ApplicationStatus) => void | Promise<void>;
    align?: "left" | "right";
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = statusOf(resume);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const handleSelect = async (status: ApplicationStatus) => {
        setOpen(false);
        if (status === current) return;
        try {
            await onChange(status);
        } catch (err) {
            console.error("Status update failed:", err);
            alert("Updating the status failed. Please try again.");
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-label="Change application status"
                onClick={() => setOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-1 rounded-full transition-opacity hover:opacity-80"
            >
                <StatusBadge resume={resume} />
                <IconChevronDown className={cn("size-3.5 text-slate-400 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div
                    className={cn(
                        "card-sm absolute top-full z-30 mt-1.5 flex w-44 flex-col p-1.5 animate-in fade-in zoom-in-95 duration-150",
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {STATUS_ORDER.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => handleSelect(status)}
                            className={cn(
                                "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
                                status === current
                                    ? "text-accent dark:text-indigo-300"
                                    : "text-ink dark:text-slate-200"
                            )}
                        >
                            <span className={cn("size-2 shrink-0 rounded-full", STATUS_META[status].dot)} />
                            <span className="flex-1 text-left">{STATUS_META[status].label}</span>
                            {status === current && <IconCheck className="size-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
