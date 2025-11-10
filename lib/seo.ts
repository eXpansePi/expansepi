/**
 * SEO Structured Data (JSON-LD) utilities
 */

export interface OrganizationSchema {
  "@context": "https://schema.org"
  "@type": "Organization"
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export interface CourseSchema {
  "@context": "https://schema.org"
  "@type": "Course"
  name: string
  description: string
  provider: {
    "@type": "Organization"
    name: string
    url: string
  }
  courseCode?: string
  educationalLevel?: string
  timeRequired?: string
  inLanguage: string
  url: string
}

export interface BlogPostingSchema {
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  headline: string
  description: string
  author: {
    "@type": "Person"
    name: string
  }
  datePublished: string
  dateModified?: string
  publisher: {
    "@type": "Organization"
    name: string
    logo?: {
      "@type": "ImageObject"
      url: string
    }
  }
  mainEntityOfPage: {
    "@type": "WebPage"
    "@id": string
  }
  inLanguage: string
}

export interface JobPostingSchema {
  "@context": "https://schema.org"
  "@type": "JobPosting"
  title: string
  description: string
  identifier: {
    "@type": "PropertyValue"
    name: string
    value: string
  }
  datePosted: string
  validThrough?: string
  employmentType: string
  jobLocation: {
    "@type": "Place"
    address: {
      "@type": "PostalAddress"
      addressLocality: string
      addressCountry: string
    }
  }
  hiringOrganization: {
    "@type": "Organization"
    name: string
    url: string
  }
  workHours?: string
  baseSalary?: {
    "@type": "MonetaryAmount"
    currency: string
    value?: {
      "@type": "QuantitativeValue"
      value?: number
      unitText?: string
    }
  }
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item: string
  }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"

export function getOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "eXpansePi",
    url: baseUrl,
    description: "IT reskilling courses with experts from Charles University and Czech Technical University",
    sameAs: [
      // Add social media links when available
    ],
  }
}

export function getCourseSchema(
  course: {
    title: string
    description: string
    slug: string
    level?: string
    duration?: string
    accreditation?: string
    certification?: string
    funding?: string
  },
  lang: string,
  courseUrl: string
): CourseSchema {
  const langMap: Record<string, string> = {
    cs: "cs-CZ",
    en: "en-US",
    ru: "ru-RU",
  }

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "eXpansePi",
      url: baseUrl,
    },
    courseCode: course.slug,
    educationalLevel: course.level || "Beginner",
    timeRequired: course.duration || "P8W", // ISO 8601 duration
    inLanguage: langMap[lang] || "cs-CZ",
    url: courseUrl,
    // Add additional properties for better SEO
    ...(course.accreditation && {
      educationalCredentialAwarded: course.certification || "Certificate",
    }),
    ...(course.funding && {
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CZK",
        availability: "https://schema.org/InStock",
        description: course.funding,
      },
    }),
  }
}

export function getBlogPostingSchema(
  post: {
    title: string
    excerpt: string
    slug: string
    author: string
    date: string
    updated?: string
  },
  lang: string
): BlogPostingSchema {
  const langMap: Record<string, string> = {
    cs: "cs-CZ",
    en: "en-US",
    ru: "ru-RU",
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.updated ? new Date(post.updated).toISOString() : new Date(post.date).toISOString(),
    publisher: {
      "@type": "Organization",
      name: "eXpansePi",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${lang}/blog/${post.slug}`,
    },
    inLanguage: langMap[lang] || "cs-CZ",
  }
}

export function getJobPostingSchema(
  vacancy: {
    title: string
    description: string
    slug: string
    location: string
    employmentType: string
    workMode: string
    postedAt: string
    validThrough?: string
  },
  lang: string
): JobPostingSchema {
  const employmentTypeMap: Record<string, string> = {
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACT",
    INTERN: "INTERN",
  }

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.description,
    identifier: {
      "@type": "PropertyValue",
      name: "eXpansePi",
      value: vacancy.slug,
    },
    datePosted: new Date(vacancy.postedAt).toISOString(),
    validThrough: vacancy.validThrough ? new Date(vacancy.validThrough).toISOString() : undefined,
    employmentType: employmentTypeMap[vacancy.employmentType] || "FULL_TIME",
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vacancy.location,
        addressCountry: "CZ",
      },
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "eXpansePi",
      url: baseUrl,
    },
  }
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

