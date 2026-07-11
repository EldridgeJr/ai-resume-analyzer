import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
);

export const IconGrid = (p: IconProps) => (
    <Icon {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
);

export const IconBriefcase = (p: IconProps) => (
    <Icon {...p}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Icon>
);

export const IconChart = (p: IconProps) => (
    <Icon {...p}>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
    </Icon>
);

export const IconSun = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Icon>
);

export const IconMoon = (p: IconProps) => (
    <Icon {...p}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Icon>
);

export const IconUploadCloud = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m8 16 4-4 4 4" />
    </Icon>
);

export const IconBuilding = (p: IconProps) => (
    <Icon {...p}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </Icon>
);

export const IconFileText = (p: IconProps) => (
    <Icon {...p}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8M16 17H8M10 9H8" />
    </Icon>
);

export const IconShield = (p: IconProps) => (
    <Icon {...p}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Icon>
);

export const IconShieldCheck = (p: IconProps) => (
    <Icon {...p}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
    </Icon>
);

export const IconSparkles = (p: IconProps) => (
    <Icon {...p}>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
    </Icon>
);

export const IconZap = (p: IconProps) => (
    <Icon {...p}>
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </Icon>
);

export const IconTrendingUp = (p: IconProps) => (
    <Icon {...p}>
        <path d="m22 7-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
    </Icon>
);

export const IconCheck = (p: IconProps) => (
    <Icon {...p}>
        <path d="M20 6 9 17l-5-5" />
    </Icon>
);

export const IconCheckCircle = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </Icon>
);

export const IconWarning = (p: IconProps) => (
    <Icon {...p}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </Icon>
);

export const IconChevronDown = (p: IconProps) => (
    <Icon {...p}>
        <path d="m6 9 6 6 6-6" />
    </Icon>
);

export const IconChevronRight = (p: IconProps) => (
    <Icon {...p}>
        <path d="m9 18 6-6-6-6" />
    </Icon>
);

export const IconFilter = (p: IconProps) => (
    <Icon {...p}>
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </Icon>
);

export const IconSort = (p: IconProps) => (
    <Icon {...p}>
        <path d="M3 6h13M3 12h9M3 18h5" />
        <path d="m17 14 3 3 3-3" />
        <path d="M20 8v9" />
    </Icon>
);

export const IconMore = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
    </Icon>
);

export const IconDownload = (p: IconProps) => (
    <Icon {...p}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
    </Icon>
);

export const IconExternal = (p: IconProps) => (
    <Icon {...p}>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Icon>
);

export const IconShare = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </Icon>
);

export const IconTarget = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </Icon>
);

export const IconBars = (p: IconProps) => (
    <Icon {...p}>
        <path d="M12 20V10M18 20V4M6 20v-4" />
    </Icon>
);

export const IconMessage = (p: IconProps) => (
    <Icon {...p}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
);

export const IconCode = (p: IconProps) => (
    <Icon {...p}>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
    </Icon>
);

export const IconType = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 7V5h16v2" />
        <path d="M9 20h6" />
        <path d="M12 5v15" />
    </Icon>
);

export const IconX = (p: IconProps) => (
    <Icon {...p}>
        <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
);

export const IconThumbsUp = (p: IconProps) => (
    <Icon {...p}>
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </Icon>
);

export const IconTrash = (p: IconProps) => (
    <Icon {...p}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Icon>
);

export const IconSearch = (p: IconProps) => (
    <Icon {...p}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </Icon>
);

export const IconUser = (p: IconProps) => (
    <Icon {...p}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </Icon>
);

export const IconSpinner = (p: IconProps) => (
    <Icon {...p}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </Icon>
);

export const IconMenu = (p: IconProps) => (
    <Icon {...p}>
        <path d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
);
