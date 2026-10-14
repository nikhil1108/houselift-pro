import Link from "next/link";
import { Home, Image as ImageIcon, Phone } from "lucide-react";

import { CONTACT_INFO } from "@/components/data/mockData";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { telHref } from "@/lib/utils";

export const dynamic = "force-static";

export default function NotFound(): JSX.Element {
  return (
    <>
      <head>
        <title>Page Not Found | RR and Sons</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <Header />

      <main className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <p className="text-sm font-semibold text-amber-500 uppercase tracking-widest">
            404 Error
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-base text-neutral-400">
            The page you are looking for does not exist, has been removed, or was relocated. Explore our engineering services and photo gallery below.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-500 transition-colors"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-5 py-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              View Site Gallery
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800/80">
            <p className="text-xs text-neutral-500">
              Need immediate emergency structural elevation advice?
            </p>
            <a
              href={telHref(CONTACT_INFO.phonePrimary)}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300"
            >
              <Phone className="h-3.5 w-3.5" />
              Speak with a Senior Engineer: {CONTACT_INFO.phonePrimary}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
