import React, { useEffect } from 'react'
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { IconShield, IconSparkles } from "~/components/icons";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get('next') || '/';
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="orb right-[10%] top-24 size-72 bg-violet-400/30" />
            <div className="orb left-[8%] bottom-24 size-72 bg-pink-300/30" />

            <section className="card flex w-full max-w-md flex-col items-center gap-8 p-10 text-center animate-in fade-in duration-500">
                <p className="text-3xl font-extrabold tracking-tight">
                    <span className="text-ink dark:text-white">RESUM</span>
                    <span className="text-gradient">IND</span>
                </p>

                <div className="flex flex-col items-center gap-3">
                    <span className="chip !text-accent text-xs font-bold uppercase tracking-wide dark:!text-indigo-300">
                        <IconSparkles className="size-4" />
                        AI-Powered Resume Review
                    </span>
                    <h2 className="!text-2xl font-bold !text-ink dark:!text-white">Welcome back</h2>
                    <p className="text-muted dark:text-slate-400">
                        Log in to continue your job journey.
                    </p>
                </div>

                {isLoading ? (
                    <button className="primary-button w-full animate-pulse py-3.5 text-lg" disabled>
                        Signing you in...
                    </button>
                ) : auth.isAuthenticated ? (
                    <button className="primary-button w-full py-3.5 text-lg" onClick={auth.signOut}>
                        Log Out
                    </button>
                ) : (
                    <button className="primary-button w-full py-3.5 text-lg" onClick={auth.signIn}>
                        Log In
                    </button>
                )}

                <div className="flex items-center gap-2 text-sm text-muted dark:text-slate-400">
                    <IconShield className="size-4 shrink-0 text-accent dark:text-indigo-300" />
                    Your data is secure and confidential.
                </div>
            </section>
        </main>
    )
}

export default Auth
