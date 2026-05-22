interface IconProps {
  className?: string;
}

export function RefreshIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10a7 7 0 0 1 11.95-4.95L17 7" />
      <path d="M17 3v4h-4" />
      <path d="M17 10a7 7 0 0 1-11.95 4.95L3 13" />
      <path d="M3 17v-4h4" />
    </svg>
  );
}
