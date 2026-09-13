import React from "react";

export interface SocialIconProps {
  className?: string;
  size?: number;
}

/**
 * Official YouTube brand logo badge.
 */
export function YoutubeOriginalIcon({
  className = "h-5 w-5",
  size,
}: SocialIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Official Instagram brand logo badge with signature multi-stop gradient.
 */
export function InstagramOriginalIcon({
  className = "h-5 w-5",
  size,
}: SocialIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="ig-radial-official"
          cx="20%"
          cy="110%"
          r="140%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="15%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="65%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect
        width="24"
        height="24"
        rx="6"
        fill="url(#ig-radial-official)"
      />
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="4"
        stroke="#ffffff"
        strokeWidth="1.6"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="#ffffff"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="16" cy="8" r="1" fill="#ffffff" />
    </svg>
  );
}

/**
 * Official Facebook brand logo with authentic blue circular badge.
 */
export function FacebookOriginalIcon({
  className = "h-5 w-5",
  size,
}: SocialIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.12 12.35l.48-3.14h-3.01V7.17c0-.86.42-1.7 1.77-1.7h1.37V2.8c-.82-.11-1.65-.17-2.48-.16-2.53 0-4.18 1.54-4.18 4.31v2.26H6.3v3.14h2.77V20.2c.56.09 1.13.13 1.7.13.57 0 1.14-.04 1.7-.13v-7.85h2.65z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
