import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { IconCheckCircle, IconFileText, IconTrash, IconWarning } from "~/components/icons";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: "Resumind | Wipe Data" },
    { name: "description", content: "Delete all app data" },
]);

const CONFIRM_WORD = "DELETE";

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [confirmText, setConfirmText] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files ?? []);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/wipe");
    }, [isLoading, auth.isAuthenticated]);

    const handleDelete = async () => {
        setBusy(true);
        try {
            await Promise.allSettled(files.map((file) => fs.delete(file.path)));
            await kv.flush();
            await loadFiles();
            setDone(true);
            setConfirmText("");
        } finally {
            setBusy(false);
        }
    };

    return (
        <main>
            <Navbar />

            <section className="page-shell mt-12 flex justify-center">
                <div className="card flex w-full max-w-xl flex-col gap-6 p-8">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400">
                            <IconWarning className="size-6" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-ink dark:text-white">Wipe App Data</p>
                            <p className="text-sm text-muted dark:text-slate-400">
                                Signed in as {auth.user?.username ?? "…"} — this permanently deletes
                                every application and uploaded file.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                            <IconWarning className="mt-0.5 size-5 shrink-0" />
                            <p className="text-sm font-medium break-words">{String(error)}</p>
                        </div>
                    )}

                    {done && (
                        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                            <IconCheckCircle className="size-5 shrink-0" />
                            <p className="text-sm font-medium">All app data has been deleted.</p>
                        </div>
                    )}

                    <div className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/10">
                        <p className="mb-3 text-sm font-semibold text-ink dark:text-slate-200">
                            {files.length} stored file{files.length === 1 ? "" : "s"}
                        </p>
                        {files.length > 0 ? (
                            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
                                {files.map((file) => (
                                    <div key={file.id} className="flex items-center gap-2.5 text-sm text-muted dark:text-slate-400">
                                        <IconFileText className="size-4 shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted dark:text-slate-400">Nothing stored.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-black/[0.05] pt-6 dark:border-white/10">
                        <label htmlFor="confirm-wipe">
                            Type <span className="font-mono text-red-600 dark:text-red-400">{CONFIRM_WORD}</span> to confirm
                        </label>
                        <div className="input-shell">
                            <input
                                id="confirm-wipe"
                                type="text"
                                placeholder={CONFIRM_WORD}
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={confirmText !== CONFIRM_WORD || busy || files.length === 0}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <IconTrash className="size-4.5" />
                            {busy ? "Deleting..." : "Wipe App Data"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default WipeApp;
