import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import {
    IconCheck,
    IconDownload,
    IconExternal,
    IconFileText,
    IconShare,
    IconShield,
    IconSparkles,
} from "~/components/icons";
import { formatDate, formatSize, normalizeFeedback } from "~/lib/utils";

export const meta = () => ([
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [copied, setCopied] = useState(false);
    const detailsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if (!resume) return;

            const data = JSON.parse(resume) as Resume;
            setResumeData(data);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            setResumeUrl(URL.createObjectURL(pdfBlob));

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            setImageUrl(URL.createObjectURL(imageBlob));

            // normalize on read too — old entries may predate the normalizer
            setFeedback(data.feedback ? normalizeFeedback(data.feedback) : null);
        }

        loadResume();
    }, [id]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard may be unavailable — ignore
        }
    };

    const pdfName = resumeData?.fileName
        ?? resumeData?.resumePath?.split("/").pop()
        ?? "resume.pdf";

    return (
        <main>
            <Navbar />

            <div className="page-shell mt-8 grid items-start gap-6 lg:grid-cols-[420px_1fr]">
                <section className="flex flex-col gap-4 lg:sticky lg:top-6">
                    <div className="card flex flex-col gap-4 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="icon-tile">
                                    <IconFileText className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-bold text-ink dark:text-white">Resume Preview</p>
                                    <p className="truncate text-xs text-muted dark:text-slate-400">
                                        {resumeData?.createdAt
                                            ? `Uploaded on ${formatDate(resumeData.createdAt)}`
                                            : "Your uploaded resume"}
                                    </p>
                                </div>
                            </div>
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ghost-button shrink-0"
                                >
                                    <IconExternal className="size-4" />
                                    Open
                                </a>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white dark:border-white/10 dark:bg-surface-2">
                            {imageUrl ? (
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={imageUrl}
                                        className="w-full object-contain animate-in fade-in duration-500"
                                        title="resume"
                                        alt="Resume preview"
                                    />
                                </a>
                            ) : (
                                <div className="flex h-[480px] animate-pulse items-center justify-center">
                                    <IconFileText className="size-10 text-slate-300 dark:text-slate-600" />
                                </div>
                            )}
                        </div>

                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                download={pdfName}
                                className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] px-4 py-3 transition-colors hover:border-indigo-200 dark:border-white/10 dark:hover:border-indigo-400/30"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="icon-tile size-9 rounded-lg">
                                        <IconFileText className="size-4.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-ink dark:text-slate-200">{pdfName}</p>
                                        <p className="text-xs text-muted dark:text-slate-400">
                                            PDF{resumeData?.fileSize ? ` • ${formatSize(resumeData.fileSize)}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <IconDownload className="size-4.5 shrink-0 text-muted dark:text-slate-400" />
                            </a>
                        )}
                    </div>

                    <div className="flex items-start gap-2.5 px-2 text-sm text-muted dark:text-slate-400">
                        <IconShield className="mt-0.5 size-4.5 shrink-0 text-accent dark:text-indigo-300" />
                        <p>
                            Your data is secure and confidential.
                            <br />
                            We never share your information.
                        </p>
                    </div>
                </section>

                <section className="flex min-w-0 flex-col gap-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <IconSparkles className="mt-1.5 size-6 text-accent dark:text-indigo-300" />
                            <div>
                                <h2 className="text-3xl font-bold text-ink dark:text-white">Resume Review</h2>
                                <p className="mt-1 text-muted dark:text-slate-400">
                                    Here's your comprehensive analysis and personalized improvement tips.
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={handleShare} className="ghost-button">
                            {copied ? <IconCheck className="size-4 text-green-500" /> : <IconShare className="size-4" />}
                            {copied ? "Link copied!" : "Share Report"}
                        </button>
                    </div>

                    {feedback ? (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback.ATS.score || 0}
                                suggestions={feedback.ATS.tips || []}
                                onViewDetails={() =>
                                    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                                }
                            />
                            <div ref={detailsRef} className="scroll-mt-6">
                                <Details feedback={feedback} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {[0, 1].map((i) => (
                                <div key={i} className="card h-56 animate-pulse p-8">
                                    <div className="flex items-center gap-6">
                                        <div className="size-32 rounded-full bg-slate-200 dark:bg-surface-2" />
                                        <div className="flex flex-col gap-3">
                                            <div className="h-5 w-48 rounded bg-slate-200 dark:bg-surface-2" />
                                            <div className="h-4 w-72 rounded bg-slate-100 dark:bg-surface-2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
