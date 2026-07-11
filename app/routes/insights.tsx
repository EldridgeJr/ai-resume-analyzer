import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { StatusBadge } from "~/components/Status";
import {
    IconBriefcase,
    IconChart,
    IconCheckCircle,
    IconChevronRight,
    IconCode,
    IconFileText,
    IconGrid,
    IconMessage,
    IconShieldCheck,
    IconTrendingUp,
    IconUploadCloud,
    IconWarning,
} from "~/components/icons";
import { usePuterStore } from "~/lib/puter";
import { useResumes } from "~/lib/useResumes";
import { cn, companyInitials, timeAgo } from "~/lib/utils";

export const meta = () => ([
    { title: "Resumind | Insights" },
    { name: "description", content: "Trends and statistics across your applications" },
]);

const CATEGORIES = [
    { key: "toneAndStyle", label: "Tone & Style", Icon: IconMessage },
    { key: "content", label: "Content", Icon: IconFileText },
    { key: "structure", label: "Structure", Icon: IconGrid },
    { key: "skills", label: "Skills", Icon: IconCode },
] as const;

const average = (values: number[]) =>
    values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

const StatTile = ({
    Icon,
    label,
    value,
    suffix,
}: {
    Icon: typeof IconChart;
    label: string;
    value: number;
    suffix?: string;
}) => (
    <div className="card flex items-center gap-4 p-6">
        <div className="icon-tile size-12 rounded-2xl">
            <Icon className="size-6" />
        </div>
        <div className="min-w-0">
            <p className="text-3xl font-bold leading-none text-ink dark:text-white">
                {value}
                {suffix && <span className="ml-0.5 text-base font-medium text-muted dark:text-slate-400">{suffix}</span>}
            </p>
            <p className="mt-1.5 truncate text-sm text-muted dark:text-slate-400">{label}</p>
        </div>
    </div>
);

const Meter = ({ value }: { value: number }) => (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-surface-2">
        <div
            className="h-full rounded-full bg-accent dark:bg-indigo-400"
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
    </div>
);

const Insights = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const { resumes, loading } = useResumes();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/insights");
    }, [isLoading, auth.isAuthenticated]);

    const stats = useMemo(() => {
        const scored = resumes.filter((r) => r.feedback?.overallScore != null);
        const overall = scored.map((r) => r.feedback.overallScore);
        return {
            total: resumes.length,
            appliedCount: resumes.filter((r) => (r.status ?? "not_applied") !== "not_applied").length,
            avgScore: average(overall),
            avgAts: average(scored.map((r) => r.feedback.ATS?.score ?? 0)),
            categories: CATEGORIES.map(({ key, label, Icon }) => ({
                label,
                Icon,
                value: average(scored.map((r) => r.feedback[key]?.score ?? 0)),
            })),
            distribution: [
                {
                    label: "Strong (70+)",
                    Icon: IconCheckCircle,
                    count: overall.filter((s) => s > 70).length,
                    bar: "bg-green-500 dark:bg-green-400",
                    text: "text-green-600 dark:text-green-400",
                },
                {
                    label: "Good (50–70)",
                    Icon: IconTrendingUp,
                    count: overall.filter((s) => s > 49 && s <= 70).length,
                    bar: "bg-amber-500 dark:bg-amber-400",
                    text: "text-amber-600 dark:text-amber-400",
                },
                {
                    label: "Needs Work (<50)",
                    Icon: IconWarning,
                    count: overall.filter((s) => s <= 49).length,
                    bar: "bg-red-500 dark:bg-red-400",
                    text: "text-red-600 dark:text-red-400",
                },
            ],
            recent: [...resumes]
                .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
                .slice(0, 5),
        };
    }, [resumes]);

    return (
        <main>
            <Navbar />

            <div className="orb right-[-4%] top-28 size-72 bg-violet-400/25" />
            <div className="orb left-[-6%] bottom-32 size-72 bg-pink-300/20" />

            <section className="page-shell mt-12 flex flex-col gap-8">
                <div>
                    <h1 className="!text-4xl">Insights</h1>
                    <h2 className="mt-2 !text-base">
                        How your resumes are performing across all analyses.
                    </h2>
                </div>

                {loading && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="card h-24 animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && resumes.length === 0 && (
                    <div className="card mx-auto flex w-full max-w-xl flex-col items-center gap-4 p-10 text-center">
                        <div className="icon-tile size-14">
                            <IconChart className="size-7" />
                        </div>
                        <p className="text-xl font-bold text-ink dark:text-white">No insights yet</p>
                        <p className="text-muted dark:text-slate-400">
                            Once you upload resumes, your scores and trends will show up here.
                        </p>
                        <Link to="/upload" className="primary-button mt-2">
                            <IconUploadCloud className="size-4.5" />
                            Upload Resume
                        </Link>
                    </div>
                )}

                {!loading && resumes.length > 0 && (
                    <>
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            <StatTile Icon={IconFileText} label="Total Analyses" value={stats.total} />
                            <StatTile Icon={IconBriefcase} label="Applications Sent" value={stats.appliedCount} />
                            <StatTile Icon={IconChart} label="Average Resume Score" value={stats.avgScore} suffix="/100" />
                            <StatTile Icon={IconShieldCheck} label="Average ATS Score" value={stats.avgAts} suffix="/100" />
                        </div>

                        <div className="grid items-start gap-6 lg:grid-cols-2">
                            <div className="card flex flex-col gap-5 p-7">
                                <p className="text-lg font-bold text-ink dark:text-white">Category Averages</p>
                                <div className="flex flex-col gap-4">
                                    {stats.categories.map(({ label, Icon, value }) => (
                                        <div key={label} className="flex items-center gap-4">
                                            <div className="flex w-40 shrink-0 items-center gap-2.5">
                                                <div className="icon-tile size-8 rounded-lg">
                                                    <Icon className="size-4" />
                                                </div>
                                                <span className="text-sm font-semibold text-ink dark:text-slate-200">{label}</span>
                                            </div>
                                            <Meter value={value} />
                                            <span className="w-14 shrink-0 text-right text-sm font-bold text-ink dark:text-slate-200">
                                                {value}
                                                <span className="font-medium text-muted dark:text-slate-400">/100</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card flex flex-col gap-5 p-7">
                                <p className="text-lg font-bold text-ink dark:text-white">Score Distribution</p>
                                <div className="flex flex-col gap-4">
                                    {stats.distribution.map(({ label, Icon, count, bar, text }) => (
                                        <div key={label} className="flex items-center gap-4">
                                            <div className="flex w-44 shrink-0 items-center gap-2">
                                                <Icon className={cn("size-4.5", text)} />
                                                <span className="text-sm font-semibold text-ink dark:text-slate-200">{label}</span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-surface-2">
                                                <div
                                                    className={cn("h-full rounded-full", bar)}
                                                    style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                            <span className="w-8 shrink-0 text-right text-sm font-bold text-ink dark:text-slate-200">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-col p-7">
                            <p className="mb-4 text-lg font-bold text-ink dark:text-white">Recent Analyses</p>
                            <div className="flex flex-col divide-y divide-black/[0.05] dark:divide-white/10">
                                {stats.recent.map((resume) => (
                                    <Link
                                        key={resume.id}
                                        to={`/resume/${resume.id}`}
                                        className="flex items-center gap-4 py-3.5 transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                                            {companyInitials(resume.companyName)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold text-ink dark:text-white">
                                                {resume.companyName || "Resume"}
                                                {resume.jobTitle && (
                                                    <span className="font-normal text-muted dark:text-slate-400"> — {resume.jobTitle}</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted dark:text-slate-400">
                                                {resume.createdAt ? `Analyzed ${timeAgo(resume.createdAt)}` : "Analyzed earlier"}
                                            </p>
                                        </div>
                                        <span className="shrink-0 max-sm:hidden">
                                            <StatusBadge resume={resume} />
                                        </span>
                                        <span className="shrink-0 text-sm font-bold text-ink dark:text-slate-200">
                                            {resume.feedback?.overallScore ?? 0}
                                            <span className="font-medium text-muted dark:text-slate-400">/100</span>
                                        </span>
                                        <IconChevronRight className="size-4 shrink-0 text-slate-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Insights;
