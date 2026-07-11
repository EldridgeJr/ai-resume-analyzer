import { useEffect, useState } from "react";
import {
    IconBars,
    IconCheck,
    IconChevronRight,
    IconFileText,
    IconShield,
    IconSparkles,
    IconTarget,
    IconType,
} from "~/components/icons";
import { cn } from "~/lib/utils";

const STEPS = [
    { title: "Extracting Content", subtitle: "Reading your resume", Icon: IconFileText },
    { title: "Analyzing Skills", subtitle: "Evaluating experience", Icon: IconBars },
    { title: "Matching Role", subtitle: "Comparing to job", Icon: IconTarget },
    { title: "Generating Feedback", subtitle: "Creating suggestions", Icon: IconSparkles },
];

const CHECKLIST = [
    { title: "Extracting text & structure", subtitle: "Reading and organizing your information", Icon: IconType },
    { title: "Evaluating skills & experience", subtitle: "Identifying key strengths and achievements", Icon: IconBars },
    { title: "Matching job requirements", subtitle: "Comparing with the target role", Icon: IconTarget },
    { title: "Generating feedback", subtitle: "Preparing your ATS score and tips", Icon: IconSparkles },
];

/**
 * phase 'extracting': file upload + PDF-to-image conversion (real progress).
 * phase 'analyzing': single opaque AI call — steps 2-4 advance on a timer so
 * the screen keeps moving while we wait; navigation happens when it resolves.
 */
const AnalyzingScreen = ({ phase }: { phase: "extracting" | "analyzing" }) => {
    const [timedStep, setTimedStep] = useState(1);

    useEffect(() => {
        if (phase !== "analyzing") return;
        setTimedStep(1);
        const timer = setInterval(
            () => setTimedStep((s) => Math.min(s + 1, STEPS.length - 1)),
            7000
        );
        return () => clearInterval(timer);
    }, [phase]);

    const activeStep = phase === "extracting" ? 0 : timedStep;
    const [progress, setProgress] = useState(4);

    // Creep toward the current step's ceiling so the bar never stalls visibly.
    useEffect(() => {
        const ceiling = [22, 48, 72, 94][activeStep];
        const timer = setInterval(() => {
            setProgress((p) => (p < ceiling ? p + 1 : p));
        }, 250);
        return () => clearInterval(timer);
    }, [activeStep]);

    return (
        <section className="page-shell flex flex-col items-center gap-10 pt-14 animate-in fade-in duration-500">
            <div className="flex max-w-3xl flex-col items-center gap-5 text-center">
                <h1>
                    <span className="text-gradient">Analyzing</span> your resume
                </h1>
                <h2 className="max-w-xl">
                    Our AI is reviewing your resume and generating insights. This
                    usually takes a few seconds.
                </h2>
            </div>

            <div className="flex w-full max-w-5xl items-stretch justify-between gap-2 rounded-3xl bg-white/60 p-3 backdrop-blur max-lg:hidden dark:bg-surface/60">
                {STEPS.map(({ title, subtitle, Icon }, i) => (
                    <div key={title} className="flex flex-1 items-center gap-2">
                        <div
                            className={cn(
                                "flex flex-1 items-center gap-3 rounded-2xl px-4 py-3",
                                i === activeStep && "bg-white shadow-sm dark:bg-surface-2"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                    i < activeStep
                                        ? "bg-indigo-100 text-accent dark:bg-indigo-500/20 dark:text-indigo-300"
                                        : i === activeStep
                                            ? "primary-gradient text-white"
                                            : "bg-slate-100 text-slate-400 dark:bg-surface-2 dark:text-slate-500"
                                )}
                            >
                                {i < activeStep ? <IconCheck className="size-5" /> : <Icon className="size-5" />}
                            </div>
                            <div className="min-w-0">
                                <p
                                    className={cn(
                                        "truncate text-sm font-semibold",
                                        i === activeStep ? "text-accent dark:text-indigo-300" : "text-ink dark:text-slate-200"
                                    )}
                                >
                                    {title}
                                </p>
                                <p className="truncate text-xs text-muted dark:text-slate-400">{subtitle}</p>
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <IconChevronRight className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
                        )}
                    </div>
                ))}
            </div>

            <div className="card w-full max-w-5xl p-8 max-sm:p-5">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="absolute -left-4 top-6 h-[90%] w-full rounded-2xl bg-indigo-100/70 dark:bg-indigo-500/10" />
                        <div className="card-sm relative flex flex-col gap-4 p-6">
                            <div>
                                <div className="h-4 w-40 rounded bg-slate-800/85 dark:bg-slate-200" />
                                <div className="mt-2 h-3 w-28 rounded bg-indigo-300 dark:bg-indigo-400/60" />
                            </div>
                            {["Experience", "Education", "Skills"].map((section) => (
                                <div key={section} className="flex flex-col gap-2">
                                    <p className="text-xs font-bold text-ink dark:text-slate-200">{section}</p>
                                    <div className="h-2.5 w-full rounded-full bg-indigo-100 dark:bg-surface-2" />
                                    <div className="h-2.5 w-4/5 rounded-full bg-indigo-100 dark:bg-surface-2" />
                                    {section !== "Skills" && (
                                        <div className="h-2.5 w-3/5 rounded-full bg-slate-100 dark:bg-surface-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="mb-1 text-xl font-bold text-ink dark:text-white">
                            What we're analyzing
                        </p>
                        {CHECKLIST.map(({ title, subtitle, Icon }, i) => {
                            const state = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
                            return (
                                <div
                                    key={title}
                                    className={cn(
                                        "flex items-center gap-4 rounded-2xl border px-4 py-3",
                                        state === "active"
                                            ? "border-indigo-100 bg-indigo-50/60 dark:border-indigo-400/20 dark:bg-indigo-500/10"
                                            : "border-transparent"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                            state === "active"
                                                ? "primary-gradient text-white"
                                                : "bg-slate-100 text-slate-500 dark:bg-surface-2 dark:text-slate-400"
                                        )}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[15px] font-semibold text-ink dark:text-slate-200">{title}</p>
                                        <p className="text-sm text-muted dark:text-slate-400">{subtitle}</p>
                                    </div>
                                    {state === "done" && (
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                                            <IconCheck className="size-3.5" />
                                        </div>
                                    )}
                                    {state === "active" && (
                                        <div className="size-6 shrink-0 animate-spin rounded-full border-2 border-indigo-200 border-t-accent" />
                                    )}
                                    {state === "pending" && (
                                        <div className="size-6 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/80 dark:bg-surface-2">
                        <div
                            className="primary-gradient h-full rounded-full transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold text-accent dark:text-indigo-300">{progress}%</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted dark:text-slate-400">
                <IconShield className="size-4" />
                <span>Your data is secure and confidential. We never share your information.</span>
            </div>
        </section>
    );
};

export default AnalyzingScreen;
