import React from "react";
import { cn } from "~/lib/utils";

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    const badge =
        score > 70
            ? { className: "bg-badge-green text-badge-green-text dark:bg-green-500/15 dark:text-green-300", text: "Strong" }
            : score > 49
                ? { className: "bg-badge-yellow text-badge-yellow-text dark:bg-amber-500/15 dark:text-amber-300", text: "Good Start" }
                : { className: "bg-badge-red text-badge-red-text dark:bg-red-500/15 dark:text-red-300", text: "Needs Work" };

    return (
        <div className={cn("score-badge", badge.className)}>
            <p className="text-xs font-semibold">{badge.text}</p>
        </div>
    );
};

export default ScoreBadge;
