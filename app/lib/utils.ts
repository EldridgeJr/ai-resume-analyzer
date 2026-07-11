import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    // Determine the appropriate unit by calculating the log
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Format with 2 decimal places and round
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";

    const units: [number, string][] = [
        [60 * 60 * 24 * 365, "year"],
        [60 * 60 * 24 * 30, "month"],
        [60 * 60 * 24 * 7, "week"],
        [60 * 60 * 24, "day"],
        [60 * 60, "hour"],
        [60, "minute"],
    ];

    for (const [unitSeconds, name] of units) {
        const value = Math.floor(seconds / unitSeconds);
        if (value >= 1) return `${value} ${name}${value === 1 ? "" : "s"} ago`;
    }
    return "just now";
}

export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }) + " • " + new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

const clampScore = (value: unknown): number => {
    const n = Math.round(Number(value));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
};

const normalizeTips = (tips: unknown) =>
    (Array.isArray(tips) ? tips : [])
        .filter((t): t is { type?: unknown; tip: string; explanation?: unknown } =>
            !!t && typeof t.tip === "string" && t.tip.trim() !== "")
        .map((t) => ({
            type: (t.type === "good" ? "good" : "improve") as "good" | "improve",
            tip: t.tip,
            explanation: typeof t.explanation === "string" ? t.explanation : "",
        }));

/**
 * Coerces whatever the AI returned into a complete Feedback object so a
 * missing category or malformed score can never crash the review page.
 */
export function normalizeFeedback(raw: unknown): Feedback {
    const r = (raw ?? {}) as Record<string, any>;
    const category = (c: any) => ({ score: clampScore(c?.score), tips: normalizeTips(c?.tips) });
    return {
        overallScore: clampScore(r.overallScore),
        ATS: category(r.ATS),
        toneAndStyle: category(r.toneAndStyle),
        content: category(r.content),
        structure: category(r.structure),
        skills: category(r.skills),
    };
}

export function companyInitials(name?: string): string {
    if (!name?.trim()) return "R";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    // single word: first letter + first inner capital, e.g. "HealthisWealth" -> "HW"
    const inner = words[0].slice(1).match(/[A-Z]/);
    return (words[0][0] + (inner?.[0] ?? "")).toUpperCase();
}