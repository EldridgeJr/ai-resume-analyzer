import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "~/components/icons";
import { cn } from "~/lib/utils";

const ThemeToggle = () => {
    // Reflects the class already set on <html> by the inline head script.
    // Starts false on both server and client to avoid a hydration mismatch,
    // then syncs to the real value after mount.
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const setTheme = (dark: boolean) => {
        document.documentElement.classList.toggle("dark", dark);
        try {
            localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {
            // localStorage may be unavailable (private mode) — ignore
        }
        setIsDark(dark);
    };

    const options = [
        { dark: false, label: "Light mode", Icon: IconSun },
        { dark: true, label: "Dark mode", Icon: IconMoon },
    ];

    return (
        <div className="flex items-center gap-1 rounded-full border border-black/[0.08] bg-white p-1 dark:border-white/10 dark:bg-surface-2">
            {options.map(({ dark, label, Icon }) => (
                <button
                    key={label}
                    type="button"
                    onClick={() => setTheme(dark)}
                    aria-label={label}
                    title={label}
                    className={cn(
                        "flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors",
                        isDark === dark
                            ? "bg-indigo-50 text-accent dark:bg-indigo-500/20 dark:text-indigo-300"
                            : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    )}
                >
                    <Icon className="size-4.5" />
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
