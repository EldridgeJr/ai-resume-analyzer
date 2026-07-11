import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreBadge from "~/components/ScoreBadge";
import { StatusPicker } from "~/components/Status";
import {
    IconChevronRight,
    IconSearch,
    IconTrash,
    IconUploadCloud,
} from "~/components/icons";
import { usePuterStore } from "~/lib/puter";
import { useResumes } from "~/lib/useResumes";
import { STATUS_META, STATUS_ORDER, statusOf } from "~/lib/status";
import { cn, companyInitials, timeAgo } from "~/lib/utils";

export const meta = () => ([
    { title: "Resumind | Applications" },
    { name: "description", content: "Track every role from analysis to application" },
]);

const scoreColor = (score: number) =>
    score > 69
        ? "text-green-600 dark:text-green-400"
        : score > 49
            ? "text-amber-600 dark:text-amber-400"
            : "text-red-600 dark:text-red-400";

const Applications = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const { resumes, loading, deleteResume, setStatus } = useResumes();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/applications");
    }, [isLoading, auth.isAuthenticated]);

    const counts = useMemo(() => {
        const byStatus = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<ApplicationStatus, number>;
        for (const resume of resumes) byStatus[statusOf(resume)]++;
        return byStatus;
    }, [resumes]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return [...resumes]
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
            .filter((r) => statusFilter === "all" || statusOf(r) === statusFilter)
            .filter(
                (r) =>
                    !q ||
                    r.companyName?.toLowerCase().includes(q) ||
                    r.jobTitle?.toLowerCase().includes(q)
            );
    }, [resumes, query, statusFilter]);

    const handleDelete = async (resume: Resume) => {
        if (!confirm(`Delete the entry for ${resume.companyName || "this resume"}?`)) return;
        try {
            await deleteResume(resume);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Deleting the entry failed. Please try again.");
        }
    };

    return (
        <main>
            <Navbar />

            <div className="orb right-[-4%] top-28 size-72 bg-violet-400/25" />
            <div className="orb left-[-6%] bottom-32 size-72 bg-pink-300/20" />

            <section className="page-shell mt-12 flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="!text-4xl">Applications</h1>
                        <h2 className="mt-2 !text-base">
                            Track every role — from CV analysis to application.
                        </h2>
                    </div>
                    <div className="input-shell w-full max-w-xs !rounded-full">
                        <IconSearch className="size-4.5 shrink-0 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search company or role..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="!py-2.5"
                        />
                    </div>
                </div>

                {resumes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setStatusFilter("all")}
                            className={cn(
                                "chip cursor-pointer !py-1.5 text-sm transition-colors",
                                statusFilter === "all"
                                    ? "!border-indigo-200 !bg-indigo-50 !text-accent dark:!border-indigo-400/30 dark:!bg-indigo-500/15 dark:!text-indigo-300"
                                    : "hover:border-indigo-200"
                            )}
                        >
                            All
                            <span className="text-xs text-muted dark:text-slate-400">{resumes.length}</span>
                        </button>
                        {STATUS_ORDER.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "chip cursor-pointer !py-1.5 text-sm transition-colors",
                                    statusFilter === status
                                        ? "!border-indigo-200 !bg-indigo-50 !text-accent dark:!border-indigo-400/30 dark:!bg-indigo-500/15 dark:!text-indigo-300"
                                        : "hover:border-indigo-200"
                                )}
                            >
                                <span className={cn("size-1.5 rounded-full", STATUS_META[status].dot)} />
                                {STATUS_META[status].label}
                                <span className="text-xs text-muted dark:text-slate-400">{counts[status]}</span>
                            </button>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="card flex flex-col divide-y divide-black/[0.05] dark:divide-white/10">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="flex animate-pulse items-center gap-4 p-5">
                                <div className="size-11 rounded-xl bg-slate-200 dark:bg-surface-2" />
                                <div className="flex flex-1 flex-col gap-2">
                                    <div className="h-4 w-44 rounded bg-slate-200 dark:bg-surface-2" />
                                    <div className="h-3 w-28 rounded bg-slate-100 dark:bg-surface-2" />
                                </div>
                                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-surface-2" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && visible.length > 0 && (
                    <div className="card flex flex-col divide-y divide-black/[0.05] dark:divide-white/10">
                        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted max-md:hidden dark:text-slate-400">
                            <span>Company & Role</span>
                            <span className="w-24 text-center">Analyzed</span>
                            <span className="w-28 text-center">Score</span>
                            <span className="w-36">Status</span>
                            <span className="w-20 text-right">Actions</span>
                        </div>
                        {visible.map((resume) => {
                            const score = resume.feedback?.overallScore ?? 0;
                            return (
                                <div
                                    key={resume.id}
                                    className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-indigo-50/40 max-md:grid-cols-[1fr_auto_auto] dark:hover:bg-indigo-500/5"
                                >
                                    <Link to={`/resume/${resume.id}`} className="flex min-w-0 items-center gap-3.5">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                                            {companyInitials(resume.companyName)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-ink dark:text-white">
                                                {resume.companyName || "Resume"}
                                            </p>
                                            <p className="truncate text-sm text-muted dark:text-slate-400">
                                                {resume.jobTitle || "—"}
                                            </p>
                                        </div>
                                    </Link>
                                    <span className="w-24 text-center text-sm text-muted max-md:hidden dark:text-slate-400">
                                        {resume.createdAt ? timeAgo(resume.createdAt) : "—"}
                                    </span>
                                    <div className="flex w-28 items-center justify-center gap-2 max-md:hidden">
                                        <span className={cn("font-bold", scoreColor(score))}>{score}</span>
                                        <ScoreBadge score={score} />
                                    </div>
                                    <div className="w-36 max-md:w-auto">
                                        <StatusPicker
                                            resume={resume}
                                            onChange={(status) => setStatus(resume, status)}
                                        />
                                    </div>
                                    <div className="flex w-20 items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            aria-label="Delete entry"
                                            onClick={() => handleDelete(resume)}
                                            className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                        >
                                            <IconTrash className="size-4.5" />
                                        </button>
                                        <Link
                                            to={`/resume/${resume.id}`}
                                            aria-label="Open review"
                                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-accent max-md:hidden dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                                        >
                                            <IconChevronRight className="size-4.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && resumes.length > 0 && visible.length === 0 && (
                    <div className="card flex flex-col items-center gap-3 p-10 text-center">
                        <p className="text-lg font-semibold">
                            {query ? `No entries match "${query}".` : "Nothing with this status yet."}
                        </p>
                        <button
                            type="button"
                            className="ghost-button"
                            onClick={() => {
                                setQuery("");
                                setStatusFilter("all");
                            }}
                        >
                            Show everything
                        </button>
                    </div>
                )}

                {!loading && resumes.length === 0 && (
                    <div className="card mx-auto flex w-full max-w-xl flex-col items-center gap-4 p-10 text-center">
                        <div className="icon-tile size-14">
                            <IconUploadCloud className="size-7" />
                        </div>
                        <p className="text-xl font-bold text-ink dark:text-white">Nothing tracked yet</p>
                        <p className="text-muted dark:text-slate-400">
                            Analyze your resume against a job — then track your application here.
                        </p>
                        <Link to="/upload" className="primary-button mt-2">
                            <IconUploadCloud className="size-4.5" />
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Applications;
