# Blog Page Template

This template defines the structure for all blog posts on thelaunch.space.

---

## File Location

Each blog post is a single file at:
`app/blogs/<topic-slug>/<post-slug>/page.tsx`

The folder path becomes the URL: `thelaunch.space/blogs/<topic-slug>/<post-slug>`

---

## Topic Slugs

| Slug | Use For |
|------|---------|
| startup-mvps | MVP building, validation, lean startup |
| landing-pages | Conversion, copywriting, landing page design |
| ai-tools | AI products, automation, AI for founders |
| founder-advice | General startup advice, lessons learned |
| growth-strategy | Marketing, growth hacking, scaling |
| technical-guides | How-to guides, tech decisions |

If none fit, create a new slug: lowercase, hyphens, max 2-3 words.

---

## Post Slug Rules

- Lowercase, hyphens, no special chars
- Max 6-8 words, descriptive
- Good: `why-founders-fail-at-mvps`
- Bad: `post-1`, `blog`, `untitled`

---

## Page Structure

Every page.tsx has exactly 3 parts:

### Part 1 - Metadata Export

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POST_TITLE | thelaunch.space",
  description: "POST_DESCRIPTION_150_TO_160_CHARS",
  openGraph: {
    title: "POST_TITLE | thelaunch.space",
    description: "POST_DESCRIPTION_150_TO_160_CHARS",
    url: "https://thelaunch.space/blogs/TOPIC_SLUG/POST_SLUG",
    siteName: "thelaunch.space",
    type: "article",
    publishedTime: "YYYY-MM-DDT00:00:00.000Z",
    authors: ["thelaunch.space"],
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "POST_TITLE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "POST_TITLE | thelaunch.space",
    description: "POST_DESCRIPTION_150_TO_160_CHARS",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://thelaunch.space/blogs/TOPIC_SLUG/POST_SLUG" },
};
```

### Part 2 - JSON-LD Structured Data

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "POST_TITLE",
  description: "POST_DESCRIPTION_150_TO_160_CHARS",
  url: "https://thelaunch.space/blogs/TOPIC_SLUG/POST_SLUG",
  datePublished: "YYYY-MM-DDT00:00:00.000Z",
  dateModified: "YYYY-MM-DDT00:00:00.000Z",
  author: { "@type": "Organization", name: "thelaunch.space", url: "https://thelaunch.space" },
  publisher: {
    "@type": "Organization",
    name: "thelaunch.space",
    url: "https://thelaunch.space",
    logo: { "@type": "ImageObject", url: "https://thelaunch.space/logo.png" }
  },
  image: "https://thelaunch.space/og-image.png",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://thelaunch.space/blogs/TOPIC_SLUG/POST_SLUG" },
};
```

### Part 3 - Page Component

```tsx
export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-text-primary">
        {/* Back link */}
        <header className="max-w-[720px] mx-auto px-6 md:px-8 pt-8 md:pt-12">
          <a href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-blue text-sm font-medium transition-colors">
            ← thelaunch.space
          </a>
        </header>

        <article className="max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">POST_TITLE</h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-10">
            <span>thelaunch.space</span><span>·</span>
            <time dateTime="YYYY-MM-DD">Mon DD, YYYY</time><span>·</span>
            <span>X min read</span>
          </div>

          {/* === BLOG CONTENT — compose using building blocks below === */}

        </article>

        {/* Footer CTA */}
        <footer className="max-w-[720px] mx-auto px-6 md:px-8 pb-16">
          <div className="border-t border-border-color pt-10">
            <p className="text-text-secondary mb-4">Have an idea? We ship MVPs in 21 days.</p>
            <a href="/?cta=open" className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-10 text-base font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition-transform hover:-translate-y-0.5">
              Get Your Launch Roadmap
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
```

---

## Content Building Blocks

Copy Tailwind classes exactly:

| Block | JSX |
|-------|-----|
| Opening paragraph | `<p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8">` |
| Body paragraph | `<p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">` |
| Bold text | `<span className="text-text-primary font-semibold">bold</span>` |
| h2 heading | `<h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">` |
| h3 heading | `<h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">` |
| Internal link | `<a href="/" className="text-accent-blue hover:underline">text</a>` |
| External link | `<a href="URL" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">text</a>` |
| Bullet list | `<ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6"><li>Item</li></ul>` |
| Numbered list | `<ol className="list-decimal list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6"><li>Step</li></ol>` |
| Callout box | `<div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8"><p className="text-text-primary font-medium">Key point.</p></div>` |
| Divider | `<hr className="border-border-color my-10" />` |
| Cross-link | `<a href="/blogs/topic/slug" className="text-accent-blue hover:underline">Other Post Title</a>` |
| Stat/Number callout | `<div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center"><p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">10 : 1,000</p><p className="text-sm md:text-base text-text-secondary">Engineers to non-technical founders competing for their time</p></div>` |
| Left-border callout | `<div className="border-l-4 border-accent-blue pl-6 my-8"><p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">Insight or quote that deserves emphasis.</p></div>` |
| Card-style list | `<div className="space-y-4 my-8"><div className="bg-border-color/20 rounded-xl p-5"><p className="text-text-primary font-semibold mb-1">1. Card Title</p><p className="text-text-secondary text-base leading-relaxed">Description here.</p></div><div className="bg-border-color/20 rounded-xl p-5"><p className="text-text-primary font-semibold mb-1">2. Card Title</p><p className="text-text-secondary text-base leading-relaxed">Description here.</p></div></div>` |

---

## Design Rhythm Rules

Follow for every post:

1. **Divider before h2** - Always place `<hr className="border-border-color my-12" />` before every h2 section heading
2. **Opening paragraph style** - Uses text-xl, text-primary, mb-8 — not the regular gray body style
3. **Visual blocks required** - Use at least ONE visual block (stat callout, card list, or left-border callout) per major section — no back-to-back paragraph-only sections
4. **Alternate block types** - Don't use the same callout style twice in a row
5. **Card lists for important items** - Lists with 3-5 important items should use card-style list instead of basic bullets
