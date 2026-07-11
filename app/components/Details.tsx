import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordion";
import {
    IconCheckCircle,
    IconCode,
    IconFileText,
    IconGrid,
    IconMessage,
    IconThumbsUp,
    IconTrendingUp,
    IconWarning,
} from "~/components/icons";

type Tip = { type: "good" | "improve"; tip: string; explanation: string };

const ScoreChip = ({ score }: { score: number }) => (
    <span
        className={cn(
            "score-badge",
            score > 69
                ? "bg-badge-green text-badge-green-text dark:bg-green-500/15 dark:text-green-300"
                : score > 49
                    ? "bg-badge-yellow text-badge-yellow-text dark:bg-amber-500/15 dark:text-amber-300"
                    : "bg-badge-red text-badge-red-text dark:bg-red-500/15 dark:text-red-300"
        )}
    >
        {score}/100
    </span>
);

const CategoryHeader = ({
    title,
    categoryScore,
    Icon,
}: {
    title: string;
    categoryScore: number;
    Icon: typeof IconMessage;
}) => {
    return (
        <div className="flex flex-row items-center gap-3 py-1">
            <div className="icon-tile size-9 rounded-lg">
                <Icon className="size-4.5" />
            </div>
            <p className="text-lg font-bold text-ink dark:text-white">{title}</p>
            <ScoreChip score={categoryScore} />
        </div>
    );
};

const CategoryContent = ({ tips }: { tips: Tip[] }) => {
    const strengths = tips.filter((t) => t.type === "good");
    const improvements = tips.filter((t) => t.type === "improve");

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex flex-wrap gap-2.5">
                {tips.map((tip, index) => (
                    <span
                        key={index}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
                            tip.type === "good"
                                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
                                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                        )}
                    >
                        {tip.type === "good" ? (
                            <IconCheckCircle className="size-4" />
                        ) : (
                            <IconTrendingUp className="size-4" />
                        )}
                        {tip.tip}
                    </span>
                ))}
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-2">
                {strengths.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-green-200/70 bg-green-50/60 p-5 dark:border-green-500/20 dark:bg-green-500/5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white">
                                <IconThumbsUp className="size-5" />
                            </div>
                            <p className="text-lg font-bold text-ink dark:text-white">Strengths</p>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {strengths.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 pl-1 text-[15px] text-dark-200 dark:text-slate-300">
                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-green-500" />
                                    <span className="line-clamp-2" title={tip.explanation || tip.tip}>
                                        {tip.explanation || tip.tip}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {improvements.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                                <IconTrendingUp className="size-5" />
                            </div>
                            <p className="text-lg font-bold text-ink dark:text-white">Improvements</p>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {improvements.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 pl-1 text-[15px] text-dark-200 dark:text-slate-300">
                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                                    <span className="line-clamp-2" title={tip.explanation || tip.tip}>
                                        {tip.explanation || tip.tip}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {strengths.length === 0 && improvements.length === 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted dark:text-slate-400">
                        <IconWarning className="size-4" />
                        No detailed tips available for this category.
                    </div>
                )}
            </div>
        </div>
    );
};

const SECTIONS = [
    { id: "tone-style", key: "toneAndStyle", title: "Tone & Style", Icon: IconMessage },
    { id: "content", key: "content", title: "Content", Icon: IconFileText },
    { id: "structure", key: "structure", title: "Structure", Icon: IconGrid },
    { id: "skills", key: "skills", title: "Skills", Icon: IconCode },
] as const;

const Details = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="flex w-full flex-col gap-4">
            <Accordion defaultOpen="tone-style" allowMultiple>
                {SECTIONS.map(({ id, key, title, Icon }) => (
                    <AccordionItem key={id} id={id} className="card !rounded-2xl">
                        <AccordionHeader itemId={id}>
                            <CategoryHeader
                                title={title}
                                categoryScore={feedback[key].score}
                                Icon={Icon}
                            />
                        </AccordionHeader>
                        <AccordionContent itemId={id}>
                            <CategoryContent tips={feedback[key].tips} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
