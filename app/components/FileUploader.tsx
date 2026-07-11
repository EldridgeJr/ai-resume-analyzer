import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconFileText, IconUploadCloud, IconX } from "~/components/icons";
import { cn, formatSize } from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const MAX_SIZE = 20 * 1024 * 1024;

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFileSelect?.(acceptedFiles[0] || null);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: MAX_SIZE,
    });

    const file = acceptedFiles[0] || null;

    return (
        <div
            {...getRootProps()}
            className={cn(
                "w-full cursor-pointer rounded-2xl border-2 border-dashed bg-indigo-50/30 p-8 text-center transition-colors dark:bg-indigo-500/5",
                isDragActive
                    ? "border-accent bg-indigo-50/70 dark:bg-indigo-500/10"
                    : "border-indigo-200 hover:border-indigo-300 dark:border-indigo-400/30 dark:hover:border-indigo-400/50"
            )}
        >
            <input {...getInputProps()} />

            {file ? (
                <div
                    className="card-sm flex items-center justify-between gap-3 p-3 text-left"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="icon-tile">
                            <IconFileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink dark:text-slate-200">
                                {file.name}
                            </p>
                            <p className="text-xs text-muted dark:text-slate-400">
                                PDF • {formatSize(file.size)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Remove file"
                        className="shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-2"
                        onClick={() => onFileSelect?.(null)}
                    >
                        <IconX className="size-4" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-accent shadow-sm dark:border-indigo-400/20 dark:bg-surface-2 dark:text-indigo-300">
                        <IconUploadCloud className="size-6" />
                    </div>
                    <p className="text-[15px] text-muted dark:text-slate-400">
                        <span className="font-semibold text-ink dark:text-slate-200">Click to upload</span>{" "}
                        or drag and drop
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">PDF • Max 20 MB</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
