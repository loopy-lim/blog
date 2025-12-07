interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...data,
        }),
      }}
    />
  )
}

interface BlogPostingJsonLdProps {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  images?: string[]
  url: string
}

export function BlogPostingJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  images,
  url,
}: BlogPostingJsonLdProps) {
  const data = {
    "@type": "BlogPosting",
    headline: title,
    description,
    image: images || [],
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return <JsonLd data={data} />
}

interface WebsiteJsonLdProps {
  name: string
  description: string
  url: string
  author: string
}

export function WebsiteJsonLd({
  name,
  description,
  url,
  author,
}: WebsiteJsonLdProps) {
  const data = {
    "@type": "WebSite",
    name,
    description,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: author,
    },
  }

  return <JsonLd data={data} />
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}
