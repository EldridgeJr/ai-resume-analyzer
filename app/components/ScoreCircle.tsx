const ScoreCircle = ({ score = 75, size = 76 }: { score: number; size?: number }) => {
    const stroke = 7;
    const radius = 50 - stroke / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, score)) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-200/80 dark:stroke-slate-700"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                <defs>
                    <linearGradient id="scoreRingGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#scoreRingGradient)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-xl font-bold text-ink dark:text-white">{score}</span>
                <span className="mt-0.5 text-[10px] font-medium text-muted dark:text-slate-400">/100</span>
            </div>
        </div>
    );
};

export default ScoreCircle;
