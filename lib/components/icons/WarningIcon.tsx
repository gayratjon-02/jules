interface IconProps {
  className?: string;
}

export function WarningIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495a1.75 1.75 0 013.03 0l6.518 11.273A1.75 1.75 0 0116.518 16.5H3.482a1.75 1.75 0 01-1.515-2.732L8.485 2.495zM10 7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1zm0 7a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
