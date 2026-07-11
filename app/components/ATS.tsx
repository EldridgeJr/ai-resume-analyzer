import { IconCheckCircle, IconChevronRight, IconShieldCheck, IconWarning } from "~/components/icons";
import { cn } from "~/lib/utils";

const atsRating = (score: number) => {
    if (score > 69)
        return {
            tile: "bg-gradient-to-br from-emerald-400 to-green-500",
            scoreColor: "text-green-600 dark:text-green-400",
            headline: "Great! Your resume is ATS-friendly.",
            text: "It meets most applicant tracking system requirements.",
        };
    if (score > 49)
        return {
            tile: "bg-gradient-to-br from-amber-400 to-orange-500",
            scoreColor: "text-amber-600 dark:text-amber-400",
            headline: "Almost there — a few ATS issues to fix.",
            text: "Some applicant tracking systems may struggle with parts of your resume.",
        };
    return {
        tile: "bg-gradient-to-br from-rose-400 to-red-500",
        scoreColor: "text-red-600 dark:text-red-400",
        headline: "Your resume may not pass ATS scans.",
        text: "Several applicant tracking system requirements are not met yet.",
    };
};

const ATS = ({
    score,
    suggestions,
    onViewDetails,
}: {
    score: number;
    suggestions: { type: "good" | "improve"; tip: string }[];
    onViewDetails?: () => void;
}) => {
    const rating = atsRating(score);

    return (
        <div className="card flex flex-wrap items-center gap-8 p-8 max-sm:p-5">
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg",
                        rating.tile
                    )}
                >
                    <IconShieldCheck className="size-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted dark:text-slate-400">ATS Score</p>
                    <p className="leading-none">
                        <span className={cn("text-4xl font-bold", rating.scoreColor)}>{score}</span>
                        <span className="ml-1 text-lg font-medium text-muted dark:text-slate-400">/100</span>
                    </p>
                </div>
            </div>

            <div className="min-w-52 flex-1">
                <p className="font-bold text-ink dark:text-white">{rating.headline}</p>
                <p className="mt-1 text-sm text-muted dark:text-slate-400">{rating.text}</p>
            </div>

            <div className="flex min-w-64 flex-1 flex-col gap-2.5 max-lg:min-w-full">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                    <div className="flex items-start gap-2.5" key={index}>
                        {suggestion.type === "good" ? (
                            <IconCheckCircle className="mt-0.5 size-4.5 shrink-0 text-green-500" />
                        ) : (
                            <IconWarning className="mt-0.5 size-4.5 shrink-0 text-amber-500" />
                        )}
                        <p className="line-clamp-2 text-sm text-dark-200 dark:text-slate-300" title={suggestion.tip}>
                            {suggestion.tip}
                        </p>
                    </div>
                ))}
            </div>

            {onViewDetails && (
                <button type="button" onClick={onViewDetails} className="ghost-button shrink-0">
                    View ATS Details
                    <IconChevronRight className="size-4" />
                </button>
            )}
        </div>
    );
};

export default ATS;
