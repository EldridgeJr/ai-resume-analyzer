import React, { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import AnalyzingScreen from "~/components/AnalyzingScreen";
import {
    IconBriefcase,
    IconBuilding,
    IconFileText,
    IconShield,
    IconSparkles,
    IconTrendingUp,
    IconUser,
    IconWarning,
    IconZap,
} from "~/components/icons";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID, normalizeFeedback } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

// The model is told to return raw JSON, but Claude often wraps it in ```json
// fences or adds a sentence before/after. Strip that and pull out the object.
const parseFeedback = (raw: string): Feedback => {
    let text = (raw ?? '').trim();
    // remove a leading/trailing markdown code fence if present
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) text = fenceMatch[1].trim();
    try {
        return normalizeFeedback(JSON.parse(text));
    } catch {
        // fall back to the first { ... last } slice
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            return normalizeFeedback(JSON.parse(text.slice(start, end + 1)));
        }
        throw new Error(`AI returned non-JSON output: ${text.slice(0, 200)}`);
    }
}

const JOB_DESCRIPTION_LIMIT = 5000;

const HIGHLIGHTS = [
    {
        Icon: IconZap,
        title: "ATS score generated instantly",
        text: "See your score and match breakdown in seconds.",
    },
    {
        Icon: IconShield,
        title: "Private & secure",
        text: "Your data is encrypted and never shared.",
    },
    {
        Icon: IconTrendingUp,
        title: "Actionable improvement tips",
        text: "Get clear, practical suggestions to improve your resume.",
    },
];

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [phase, setPhase] = useState<"extracting" | "analyzing">("extracting");
    const [errorText, setErrorText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const fail = (message: string) => {
        setErrorText(message);
        setIsProcessing(false);
    };

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setErrorText("");
        setIsProcessing(true);
        setPhase("extracting");

        let uploadedFile: FSItem | undefined;
        let uploadedImage: FSItem | undefined;

        try {
            uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error("Failed to upload file");

            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) throw new Error(`Failed to convert PDF to image${imageFile.error ? ` (${imageFile.error})` : ""}`);

            uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error("Failed to upload image");

            setPhase("analyzing");

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            )
            if (!feedback) throw new Error("Failed to analyze resume (no response from AI)");

            const content = feedback.message.content;
            const rawText = typeof content === 'string'
                ? content
                : content?.[0]?.text ?? '';

            // Persist only once the analysis succeeded, so a failed run
            // doesn't leave a broken application card behind.
            const uuid = generateUUID();
            const data: Resume & { jobDescription: string } = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                createdAt: Date.now(),
                fileName: file.name,
                fileSize: file.size,
                status: "not_applied",
                feedback: parseFeedback(rawText),
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            navigate(`/resume/${uuid}`);
        } catch (err) {
            console.error('Analyze failed:', err);
            // best-effort cleanup of uploads that would otherwise be orphaned
            if (uploadedFile) fs.delete(uploadedFile.path).catch(() => {});
            if (uploadedImage) fs.delete(uploadedImage.path).catch(() => {});
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            fail(msg);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main>
            <Navbar minimal={isProcessing} />

            {isProcessing ? (
                <AnalyzingScreen phase={phase} />
            ) : (
                <>
                    <div className="orb right-[-5%] top-32 size-80 bg-violet-400/30" />
                    <div className="orb left-[-6%] bottom-24 size-72 bg-pink-300/25" />
                    <div className="dot-grid right-[4%] top-[380px] max-lg:hidden" />
                    <div className="dot-grid left-[3%] bottom-40 max-lg:hidden" />

                    <section className="page-shell mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
                        <div className="flex flex-col gap-6 lg:sticky lg:top-10 max-lg:items-center max-lg:text-center">
                            <span className="chip w-fit !text-accent text-xs font-bold uppercase tracking-wide dark:!text-indigo-300">
                                <IconSparkles className="size-4" />
                                AI-Powered Resume Review
                            </span>
                            <h1>Smart feedback for your dream job</h1>
                            <h2 className="max-w-md">
                                Enter the job details and upload your resume to get an ATS
                                score and personalized improvement tips.
                            </h2>

                            <div className="relative mt-4 flex items-start gap-4 max-sm:hidden">
                                <div className="card flex flex-col items-center gap-2 p-6 rotate-[-3deg]">
                                    <p className="text-xs font-semibold text-muted dark:text-slate-400">ATS Score</p>
                                    <div className="relative size-28">
                                        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                                            <circle cx="50" cy="50" r="42" className="stroke-slate-200/80 dark:stroke-slate-700" strokeWidth="9" fill="transparent" />
                                            <defs>
                                                <linearGradient id="illustrationRing" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#60a5fa" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="50" cy="50" r="42" stroke="url(#illustrationRing)" strokeWidth="9" fill="transparent" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * 0.15} strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                                            <span className="text-3xl font-bold">85</span>
                                            <span className="mt-1 text-[10px] font-medium text-muted dark:text-slate-400">/100</span>
                                        </div>
                                    </div>
                                    <IconSparkles className="absolute -right-2 -top-2 size-5 text-violet-400" />
                                </div>
                                <div className="card-sm mt-6 flex flex-col divide-y divide-black/[0.05] dark:divide-white/10">
                                    {[
                                        { label: "Match Quality", value: "Excellent", color: "text-green-600 dark:text-green-400" },
                                        { label: "Keyword Match", value: "92%", color: "text-accent dark:text-indigo-300" },
                                        { label: "Formatting", value: "Good", color: "text-green-600 dark:text-green-400" },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="flex items-center justify-between gap-8 px-5 py-3.5">
                                            <span className="text-sm text-muted dark:text-slate-400">{label}</span>
                                            <span className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
                                                <span className="size-1.5 rounded-full bg-current" />
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-5 max-lg:items-start max-lg:text-left">
                                {HIGHLIGHTS.map(({ Icon, title, text }) => (
                                    <div key={title} className="flex items-center gap-4">
                                        <div className="icon-tile size-11 rounded-2xl bg-white shadow-sm border border-black/[0.05] dark:bg-surface-2 dark:border-white/10">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-ink dark:text-white">{title}</p>
                                            <p className="text-sm text-muted dark:text-slate-400">{text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-8 max-sm:p-5">
                            <div className="flex items-center gap-4 border-b border-black/[0.05] pb-6 dark:border-white/10">
                                <div className="icon-tile size-11">
                                    <IconUser className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-ink dark:text-white">Job & Company Details</p>
                                    <p className="text-sm text-muted dark:text-slate-400">
                                        Provide the role and company information for accurate analysis.
                                    </p>
                                </div>
                            </div>

                            {errorText && (
                                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                                    <IconWarning className="mt-0.5 size-5 shrink-0" />
                                    <p className="text-sm font-medium break-words">{errorText}</p>
                                </div>
                            )}

                            <form id="upload-form" onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-6">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <div className="input-shell">
                                        <IconBuilding className="size-5 shrink-0 text-slate-400" />
                                        <input type="text" name="company-name" placeholder="Enter company name" id="company-name" />
                                    </div>
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <div className="input-shell">
                                        <IconBriefcase className="size-5 shrink-0 text-slate-400" />
                                        <input type="text" name="job-title" placeholder="Enter job title" id="job-title" />
                                    </div>
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <div className="input-shell !items-start">
                                        <IconFileText className="mt-3.5 size-5 shrink-0 text-slate-400" />
                                        <textarea
                                            rows={6}
                                            name="job-description"
                                            placeholder="Paste the job description here..."
                                            id="job-description"
                                            maxLength={JOB_DESCRIPTION_LIMIT}
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="resize-none"
                                        />
                                    </div>
                                    <p className="self-end text-xs text-slate-400">
                                        {jobDescription.length}/{JOB_DESCRIPTION_LIMIT}
                                    </p>
                                </div>

                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <p className="-mt-1 text-sm text-muted dark:text-slate-400">
                                        Upload your latest resume for ATS analysis.
                                    </p>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.05] pt-6 dark:border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-muted dark:text-slate-400">
                                        <IconShield className="size-4 shrink-0" />
                                        <span>We use encryption to keep your data safe and secure.</span>
                                    </div>
                                    <button className="primary-button px-7 py-3" type="submit" disabled={!file}>
                                        <IconSparkles className="size-4.5" />
                                        Analyze Resume
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default Upload;
