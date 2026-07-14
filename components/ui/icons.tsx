import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({
  className = "h-4 w-4",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const SunriseIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3v3M5.5 9.5l1 1M18.5 9.5l-1 1M3 16h18M6 20h12M8 16a4 4 0 0 1 8 0" />
  </Svg>
);

export const SunIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </Svg>
);

export const MoonIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z" />
  </Svg>
);

export const RouteIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 3v18M6 5.5h11l2 2-2 2H6M6 13.5h8l2 2-2 2H6" />
  </Svg>
);

export const TicketIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2 2 0 0 0 0-4v-2ZM14 6v12" />
  </Svg>
);

export const PlaneIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.6.6 0 0 0-.6 1L9 11l-3 3H4l-1 1 3 2 2 3 1-1v-2l3-3 3.8 4.8a.6.6 0 0 0 1-.6Z" />
  </Svg>
);

export const TrainIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 4h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2ZM4 11h16M9 4v7M15 4v7M8 20l-2 1M16 20l2 1" />
    <path d="M8.5 13.5h.01M15.5 13.5h.01" />
  </Svg>
);

export const BedIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 20v-9m0 5h18v4M3 12h11a4 4 0 0 1 4 4M6 12V9.5h3.5a2 2 0 0 1 2 2" />
  </Svg>
);

export const MapPinIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 21s-6-5.7-6-10a6 6 0 1 1 12 0c0 4.3-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2" />
  </Svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </Svg>
);

export const UtensilsIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 3v7a2 2 0 0 0 4 0V3M8 11v10M16 3c-1.6 1-2 4-2 6h4c0-2-.4-5-2-6ZM16 9v12" />
  </Svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 4 3 19h18L12 4ZM12 10v4M12 17h.01" />
  </Svg>
);

export const SparkleIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 4l1.5 4L18 9.5 13.5 11 12 15l-1.5-4L6 9.5 10.5 8 12 4ZM18.5 14.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z" />
  </Svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M8 2v3M16 2v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  </Svg>
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const PencilIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 6.5l3 3" />
  </Svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />
  </Svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 10V8a6 6 0 1 1 12 0v2M5 10h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM12 14v3" />
  </Svg>
);

export const LogOutIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M15 12H3M11 8l4 4-4 4M9 5V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-1" />
  </Svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 13l4 4L19 7" />
  </Svg>
);

export const ListIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
  </Svg>
);

export const CameraIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 7l1.2-2h9.6L18 7h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2Z" />
    <circle cx="12" cy="13" r="3.2" />
  </Svg>
);

export const DownloadIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
  </Svg>
);

export const CopyIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Svg>
);

export const FileTextIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 2h8l4 4v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M14 2v4h4M8.5 12h7M8.5 16h7M8.5 8h3" />
  </Svg>
);

export const EyeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const TipIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.9 1 1 1.7l.2.4h4.6l.2-.4c.1-.7.5-1.3 1-1.7A6 6 0 0 0 12 3Z" />
  </Svg>
);
