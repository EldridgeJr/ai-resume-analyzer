import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {
    IconChevronDown,
    IconFilter,
    IconShield,
    IconSort,
    IconSparkles,
    IconTrendingUp,
    IconUploadCloud,
} from "~/components/icons";
import { usePuterStore } from "~/lib/puter";
import { useResumes } from "~/lib/useResumes";
import { cn } from "~/lib/utils";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

const FILTERS = [
    { key: "all", label: "All Analyses", test: () => true },
    { key: "applied", label: "Applied", test: (r: Resume) => (r.status ?? "not_applied") !== "not_applied" },
    { key: "not_applied", label: "Not applied yet", test: (r: Resume) => (r.status ?? "not_applied") === "not_applied" },
    { key: "strong", label: "Strong (70+)", test: (r: Resume) => (r.feedback?.overallScore ?? 0) > 70 },
    { key: "good", label: "Good (50–70)", test: (r: Resume) => { const s = r.feedback?.overallScore ?? 0; return s > 49 && s <= 70; } },
    { key: "weak", label: "Needs Work (<50)", test: (r: Resume) => (r.feedback?.overallScore ?? 0) <= 49 },
];

const SORTS = [
    { key: "recent", label: "Recent", compare: (a: Resume, b: Resume) => (b.createdAt ?? 0) - (a.createdAt ?? 0) },
    { key: "highest", label: "Highest Score", compare: (a: Resume, b: Resume) => (b.feedback?.overallScore ?? 0) - (a.feedback?.overallScore ?? 0) },
    { key: "lowest", label: "Lowest Score", compare: (a: Resume, b: Resume) => (a.feedback?.overallScore ?? 0) - (b.feedback?.overallScore ?? 0) },
    { key: "company", label: "Company A–Z", compare: (a: Resume, b: Resume) => (a.companyName ?? "").localeCompare(b.companyName ?? "") },
];

const Dropdown = ({
    icon,
    prefix,
    value,
    options,
    onSelect,
}: {
    icon: ReactNode;
    prefix?: string;
    value: string;
    options: { key: string; label: string }[];
    onSelect: (key: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const active = options.find((o) => o.key === value);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="chip cursor-pointer !py-2.5 hover:border-indigo-200 transition-colors"
            >
                {icon}
                <span className="text-sm font-medium">
                    {prefix && <span className="text-muted dark:text-slate-400">{prefix} </span>}
                    {active?.label}
                </span>
                <IconChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="card-sm absolute left-0 top-full z-20 mt-2 flex w-52 flex-col p-1.5 animate-in fade-in zoom-in-95 duration-150">
                    {options.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => {
                                onSelect(option.key);
                                setOpen(false);
                            }}
                            className={cn(
                                "cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
                                option.key === value
                                    ? "text-accent dark:text-indigo-300"
                                    : "text-ink dark:text-slate-200"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Home() {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const { resumes, loading, deleteResume, setStatus } = useResumes();
    const [filterKey, setFilterKey] = useState("all");
    const [sortKey, setSortKey] = useState("recent");

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/");
    }, [isLoading, auth.isAuthenticated]);

    const visibleResumes = useMemo(() => {
        const filter = FILTERS.find((f) => f.key === filterKey) ?? FILTERS[0];
        const sort = SORTS.find((s) => s.key === sortKey) ?? SORTS[0];
        return [...resumes].filter(filter.test).sort(sort.compare);
    }, [resumes, filterKey, sortKey]);

    return (
        <main>
            <Navbar />

            <div className="dot-grid left-[6%] top-64 max-lg:hidden" />
            <div className="dot-grid right-[5%] top-40 max-lg:hidden" />
            <div className="orb right-[-4%] top-24 size-72 bg-violet-400/25" />
            <div className="orb left-[-6%] top-[420px] size-80 bg-pink-300/25" />

            <section className="page-shell flex flex-col items-center gap-8 pt-16 pb-4">
                <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
                    <h1>Track Your Applications & Resume Rating</h1>
                    <h2 className="max-w-2xl">
                        Upload your resume, track each application, and get AI-powered
                        feedback to help you improve and land more interviews.
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                        <span className="chip">
                            <IconSparkles className="size-4 text-accent" />
                            AI-Powered Feedback
                        </span>
                        <span className="chip">
                            <IconShield className="size-4 text-accent" />
                            Private & Secure
                        </span>
                        <span className="chip">
                            <IconTrendingUp className="size-4 text-accent" />
                            Track Progress
                        </span>
                    </div>
                </div>
            </section>

            {!loading && resumes.length > 0 && (
                <section className="page-shell mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Dropdown
                        icon={<IconFilter className="size-4 text-muted dark:text-slate-400" />}
                        value={filterKey}
                        options={FILTERS}
                        onSelect={setFilterKey}
                    />
                    <Dropdown
                        icon={<IconSort className="size-4 text-muted dark:text-slate-400" />}
                        prefix="Sort by:"
                        value={sortKey}
                        options={SORTS}
                        onSelect={setSortKey}
                    />
                </section>
            )}

            {loading && (
                <section className="page-shell mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="card h-[460px] animate-pulse p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="size-11 rounded-xl bg-slate-200 dark:bg-surface-2" />
                                    <div className="flex flex-col gap-2 pt-1">
                                        <div className="h-4 w-36 rounded bg-slate-200 dark:bg-surface-2" />
                                        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-surface-2" />
                                    </div>
                                </div>
                                <div className="size-16 rounded-full bg-slate-200 dark:bg-surface-2" />
                            </div>
                            <div className="mt-5 h-[300px] rounded-xl bg-slate-100 dark:bg-surface-2" />
                        </div>
                    ))}
                </section>
            )}

            {!loading && visibleResumes.length > 0 && (
                <section className="page-shell mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {visibleResumes.map((resume) => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            onDelete={deleteResume}
                            onStatusChange={setStatus}
                        />
                    ))}
                </section>
            )}

            {!loading && resumes.length > 0 && visibleResumes.length === 0 && (
                <section className="page-shell mt-10 flex flex-col items-center gap-3 text-center">
                    <p className="text-lg font-semibold">No applications match this filter.</p>
                    <button type="button" className="ghost-button" onClick={() => setFilterKey("all")}>
                        Show all applications
                    </button>
                </section>
            )}

            {!loading && resumes.length === 0 && (
                <section className="card page-shell mt-6 flex max-w-xl flex-col items-center gap-4 p-10 text-center">
                    <div className="icon-tile size-14">
                        <IconUploadCloud className="size-7" />
                    </div>
                    <p className="text-xl font-bold text-ink dark:text-white">No applications yet</p>
                    <p className="text-muted dark:text-slate-400">
                        Upload your first resume to get an ATS score and AI-powered feedback.
                    </p>
                    <Link to="/upload" className="primary-button mt-2">
                        <IconUploadCloud className="size-4.5" />
                        Upload Resume
                    </Link>
                </section>
            )}
        </main>
    );
}
