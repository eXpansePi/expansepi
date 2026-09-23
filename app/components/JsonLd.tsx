import { serializeJsonLd } from "@/lib/seo"

/** Renders structured data through the shared escaping rules. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
