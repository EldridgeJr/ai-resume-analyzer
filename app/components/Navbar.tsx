import { useState } from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "~/components/ThemeToggle";
import {
    IconBriefcase,
    IconChart,
    IconGrid,
    IconMenu,
    IconUploadCloud,
    IconX,
} from "~/components/icons";
import { cn } from "~/lib/utils";

const tabs = [
    { to: "/", label: "Dashboard", Icon: IconGrid },
    { to: "/applications", label: "Applications", Icon: IconBriefcase },
    { to: "/insights", label: "Insights", Icon: IconChart },
];

const Navbar = ({ minimal = false }: { minimal?: boolean }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar relative">
            <div className="flex items-center gap-2">
                {!minimal && (
                    <button
                        type="button"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-dark-200 hover:bg-indigo-50/70 md:hidden dark:text-slate-300 dark:hover:bg-indigo-500/10"
                    >
                        {menuOpen ? <IconX className="size-5" /> : <IconMenu className="size-5" />}
                    </button>
                )}
                <Link to="/" className="shrink-0">
                    <p className="text-2xl font-extrabold tracking-tight">
                        <span className="text-ink dark:text-white">RESUM</span>
                        <span className="text-gradient">IND</span>
                    </p>
                </Link>
            </div>

            {!minimal && (
                <div className="flex items-center gap-1 max-md:hidden">
                    {tabs.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn("nav-tab", isActive && "nav-tab-active")
                            }
                        >
                            <Icon className="size-4.5" />
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link to="/upload" className="primary-button max-sm:px-4">
                    <IconUploadCloud className="size-4.5" />
                    <span className="max-sm:hidden">Upload Resume</span>
                </Link>
            </div>

            {!minimal && menuOpen && (
                <div className="card-sm absolute left-0 right-0 top-full z-30 mt-2 flex flex-col gap-1 p-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {tabs.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                cn("nav-tab", isActive && "nav-tab-active")
                            }
                        >
                            <Icon className="size-4.5" />
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
