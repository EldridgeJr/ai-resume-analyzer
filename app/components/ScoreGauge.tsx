const ScoreGauge = ({ score = 75, size = 160 }: { score: number; size?: number }) => {
    const stroke = 9;
    const radius = 50 - stroke / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, score)) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <defs>
                    <linearGradient id="overallGaugeGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="55%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-200/80 dark:stroke-slate-700"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#overallGaugeGradient)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className={`font-bold text-ink dark:text-white ${size < 150 ? "text-4xl" : "text-5xl"}`}>{score}</span>
                <span className="mt-1.5 text-sm font-medium text-muted dark:text-slate-400">/100</span>
            </div>
        </div>
    );
};

export default ScoreGauge;
