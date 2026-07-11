import { useCallback, useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

/**
 * Loads every stored application (resume:* KV entries) and exposes a
 * refresh + delete API. Shared by the Dashboard, Applications and
 * Insights pages.
 */
export const useResumes = () => {
    const { kv, fs } = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const items = (await kv.list("resume:*", true)) as KVItem[];
            const parsed = (items ?? [])
                .map((item) => {
                    try {
                        return JSON.parse(item.value) as Resume;
                    } catch {
                        return null;
                    }
                })
                .filter((r): r is Resume => !!r);
            setResumes(parsed);
        } finally {
            setLoading(false);
        }
    }, [kv]);

    useEffect(() => {
        load();
    }, [load]);

    const setStatus = useCallback(
        async (resume: Resume, status: ApplicationStatus) => {
            const updated: Resume = {
                ...resume,
                status,
                // appliedAt = when it first left "not applied"; cleared on reset
                appliedAt: status === "not_applied" ? undefined : resume.appliedAt ?? Date.now(),
            };
            await kv.set(`resume:${resume.id}`, JSON.stringify(updated));
            setResumes((prev) => prev.map((r) => (r.id === resume.id ? updated : r)));
        },
        [kv]
    );

    const deleteResume = useCallback(
        async (resume: Resume) => {
            // KV entry first — it's the source of truth for the list. If a
            // file deletion fails afterwards, the leftover is invisible.
            await kv.delete(`resume:${resume.id}`);
            await Promise.allSettled([
                fs.delete(resume.resumePath),
                fs.delete(resume.imagePath),
            ]);
            setResumes((prev) => prev.filter((r) => r.id !== resume.id));
        },
        [fs, kv]
    );

    return { resumes, loading, refresh: load, deleteResume, setStatus };
};
