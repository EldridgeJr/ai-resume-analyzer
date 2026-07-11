import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { StatusPicker } from "~/components/Status";
import { IconExternal, IconFileText, IconMore, IconTrash } from "~/components/icons";
import { usePuterStore } from "~/lib/puter";
import { companyInitials, timeAgo } from "~/lib/utils";

const ResumeCard = ({
    resume,
    onDelete,
    onStatusChange,
}: {
    resume: Resume;
    onDelete?: (resume: Resume) => void | Promise<void>;
    onStatusChange?: (resume: Resume, status: ApplicationStatus) => void | Promise<void>;
}) => {
    const { id, companyName, jobTitle, feedback, imagePath, createdAt } = resume;
    const { fs } = usePuterStore();
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let url = "";
        const loadPreview = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        };
        loadPreview();
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [imagePath]);

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [menuOpen]);

    const handleDelete = async () => {
        setMenuOpen(false);
        if (!confirm(`Delete the application for ${companyName || "this resume"}?`)) return;
        try {
            await onDelete?.(resume);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Deleting the application failed. Please try again.");
        }
    };

    return (
        <div className="card flex w-full flex-col gap-4 p-5 animate-in fade-in duration-500">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                        {companyInitials(companyName)}
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                        <h3 className="truncate text-lg font-bold text-ink dark:text-white">
                            {companyName || "Resume"}
                        </h3>
                        {jobTitle && (
                            <p className="truncate text-sm text-muted dark:text-slate-400">{jobTitle}</p>
                        )}
                        {onStatusChange && (
                            <div className="mt-1">
                                <StatusPicker
                                    resume={resume}
                                    onChange={(status) => onStatusChange(resume, status)}
                                />
                            </div>
                        )}
                        {createdAt && (
                            <p className="text-xs text-muted dark:text-slate-400">
                                Analyzed {timeAgo(createdAt)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="shrink-0">
                    <ScoreCircle score={feedback?.overallScore ?? 0} />
                </div>
            </div>

            <Link
                to={`/resume/${id}`}
                className="block overflow-hidden rounded-xl border border-black/[0.07] bg-white dark:border-white/10 dark:bg-surface-2"
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`${companyName || "Resume"} preview`}
                        className="h-[300px] w-full object-cover object-top max-sm:h-[200px] transition-transform duration-300 hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-[300px] w-full items-center justify-center max-sm:h-[200px]">
                        <IconFileText className="size-10 text-slate-300 dark:text-slate-600" />
                    </div>
                )}
            </Link>

            <div className="flex items-center justify-between">
                <Link to={`/resume/${id}`} className="ghost-button">
                    <IconFileText className="size-4" />
                    View Details
                </Link>
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        aria-label="More actions"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="ghost-button !px-2.5"
                    >
                        <IconMore className="size-4.5" />
                    </button>
                    {menuOpen && (
                        <div className="card-sm absolute right-0 bottom-full z-20 mb-2 flex w-44 flex-col p-1.5 animate-in fade-in zoom-in-95 duration-150">
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate(`/resume/${id}`);
                                }}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-500/10"
                            >
                                <IconExternal className="size-4" />
                                Open review
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                                <IconTrash className="size-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;
