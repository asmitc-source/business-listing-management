import type { AuthorProfile } from "@/lib/authors";
import { Link } from "@tanstack/react-router";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function AuthorBlock({ author }: { author: AuthorProfile }) {
  return (
    <aside
      className="mt-14 overflow-hidden rounded-2xl bg-brand-soft/70 px-5 py-6 hairline sm:px-7 sm:py-7"
      aria-labelledby={`author-block-${author.slug}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="shrink-0">
          {author.imageSrc ? (
            <div className="size-[4.5rem] overflow-hidden rounded-full ring-1 ring-line shadow-soft sm:size-[5.25rem]">
              <picture>
                {author.imageWebpSrc ? (
                  <source srcSet={author.imageWebpSrc} type="image/webp" />
                ) : null}
                <img
                  src={author.imageSrc}
                  alt={author.imageAlt}
                  width={84}
                  height={84}
                  className="size-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          ) : (
            <div
              className="flex size-[4.5rem] items-center justify-center rounded-full bg-cream font-display text-xl font-semibold text-ink ring-1 ring-line sm:size-[5.25rem]"
              aria-hidden="true"
            >
              {author.initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            About the author
          </p>
          <h2
            id={`author-block-${author.slug}`}
            className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]"
          >
            <Link to="/authors/$slug" params={{ slug: author.slug }} className="hover:text-brand hover:underline underline-offset-4">{author.name}</Link>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">{author.bio}</p>
          {author.linkedinUrl ? (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 transition hover:text-brand hover:underline"
            >
              <LinkedInIcon className="size-4 text-[#0A66C2]" />
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
