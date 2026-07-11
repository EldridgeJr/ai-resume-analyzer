import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";
import { IconCode, IconFileText, IconGrid, IconMessage } from "~/components/icons";
import { cn } from "~/lib/utils";

const overallRating = (score: number) => {
    if (score > 79) return { label: "Excellent", className: "bg-badge-green text-badge-green-text dark:bg-green-500/15 dark:text-green-300", text: "Impressive resume! Review the remaining suggestions below to make it even stronger." };
    if (score > 64) return { label: "Good", className: "bg-indigo-50 text-accent dark:bg-indigo-500/15 dark:text-indigo-300", text: "Solid resume with room for improvement. Focus on the suggestions below to strengthen your impact." };
    if (score > 49) return { label: "Fair", className: "bg-badge-yellow text-badge-yellow-text dark:bg-amber-500/15 dark:text-amber-300", text: "A decent starting point. Work through the suggestions below to lift your score." };
    return { label: "Needs Work", className: "bg-badge-red text-badge-red-text dark:bg-red-500/15 dark:text-red-300", text: "This resume needs attention. The suggestions below will guide you through the biggest wins." };
};

const CATEGORY_META = [
    { key: "toneAndStyle", title: "Tone & Style", Icon: IconMessage },
    { key: "structure", title: "Structure", Icon: IconGrid },
    { key: "content", title: "Content", Icon: IconFileText },
    { key: "skills", title: "Skills", Icon: IconCode },
] as const;

const Category = ({
    title,
    score,
    Icon,
}: {
    title: string;
    score: number;
    Icon: typeof IconMessage;
}) => {
    return (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.06] bg-white px-3.5 py-3 dark:border-white/10 dark:bg-surface-2">
            <div className="flex min-w-0 items-center gap-2">
                <div className="icon-tile size-8 rounded-lg">
                    <Icon className="size-4" />
                </div>
                <p className="truncate text-sm font-semibold text-ink dark:text-slate-200">{title}</p>
                <ScoreBadge score={score} />
            </div>
            <p className="shrink-0 text-sm font-bold text-ink dark:text-slate-200">
                {score}
                <span className="font-medium text-muted dark:text-slate-400">/100</span>
            </p>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const rating = overallRating(feedback.overallScore);

    return (
        <div className="card flex flex-wrap items-center gap-x-8 gap-y-6 p-8 max-sm:p-5">
            <ScoreGauge score={feedback.overallScore} size={148} />
            <div className="flex min-w-48 max-w-60 flex-1 flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                    <p className="whitespace-nowrap text-xl font-bold text-ink dark:text-white">Overall Score</p>
                    <span className={cn("score-badge", rating.className)}>{rating.label}</span>
                </div>
                <p className="text-sm text-muted dark:text-slate-400">{rating.text}</p>
            </div>
            <div className="grid min-w-0 flex-[1.8] basis-[26rem] gap-3 sm:grid-cols-2">
                {CATEGORY_META.map(({ key, title, Icon }) => (
                    <Category key={key} title={title} score={feedback[key].score} Icon={Icon} />
                ))}
            </div>
        </div>
    );
};

export default Summary;
