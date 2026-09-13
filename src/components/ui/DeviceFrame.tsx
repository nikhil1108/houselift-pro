import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";

interface DeviceFrameProps {
  /** Desktop browser or mobile device. */
  variant: "desktop" | "mobile";
  /** Image src or nested <Image> component. */
  children: React.ReactNode;
  /** Title shown in the browser chrome bar (desktop only). */
  title?: string;
  className?: string;
}

/**
 * Browser or mobile device mockup frame for showcasing screenshots.
 * Replaces network-dependent images with crisp local SVG frames.
 */
export function DeviceFrame({
  variant,
  children,
  title = "App Preview",
  className,
}: DeviceFrameProps): JSX.Element {
  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "relative mx-auto w-full max-w-[280px] rounded-[2.5rem] border-8 border-slate-800 bg-slate-900 p-2 shadow-2xl",
          className,
        )}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-800" />

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[1.75rem] bg-white">
          {children}
        </div>

        {/* Footer indicator */}
        <div className="absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-600" />

        {/* Icon badge */}
        <div className="absolute -bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-lg">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded bg-white px-3 py-1 text-xs text-slate-600">
          <Monitor className="h-3 w-3" />
          <span className="truncate">{title}</span>
        </div>
      </div>

      {/* Screen */}
      <div className="relative bg-white">{children}</div>
    </div>
  );
}
