# eXpansePi - IT Education Platform

A modern, multilingual Next.js application for IT education courses, blog posts, and job vacancies. Built with TypeScript, Tailwind CSS, and Next.js App Router.

## 🌍 Features

- **Multilingual Support**: Czech (cs), English (en), Russian (ru)
- **Dynamic Courses**: Manage courses via JSON with multilingual content
- **Blog System**: Publish articles with draft/published status
- **Job Vacancies**: Dynamic job postings with multilingual support
- **SEO Optimized**: Complete structured data, sitemap, hreflang tags
- **Type-Safe**: Full TypeScript coverage with runtime validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
expansepi/
├── app/                    # Next.js App Router
│   └── [lang]/              # Language-specific routes
│       ├── kurzy/           # Courses module
│       ├── blog/            # Blog module
│       ├── volne-pozice/   # Vacancies module
│       └── ...
├── data/                    # JSON data sources
│   ├── courses.json        # Course data (multilingual)
│   ├── posts.json          # Blog posts
│   ├── vacancies.json      # Job vacancies (multilingual)
│   ├── team.json           # Team members and lecturers
│   └── *.ts                # Data access layers
├── types/                   # TypeScript type definitions
├── lib/                     # Utility functions
├── i18n/                    # Internationalization
│   └── locales/            # Translation files
└── public/                  # Static assets
```

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide
- **[CHANGES.md](./CHANGES.md)** - Recent changes and updates
- **[SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md)** - SEO setup guide

## 🎯 Key Features

### Multilingual Content

All content (courses, blog posts, vacancies) supports three languages:
- Czech (cs) - default
- English (en)
- Russian (ru)

Content is structured in JSON files with language-specific data:

```json
{
  "slug": "example",
  "languages": {
    "cs": { "title": "...", "description": "..." },
    "en": { "title": "...", "description": "..." },
    "ru": { "title": "...", "description": "..." }
  }
}
```

### Dynamic Data Management

- **Courses**: Add/edit in `data/courses.json`
- **Blog Posts**: Add/edit in `data/posts.json`
- **Vacancies**: Add/edit in `data/vacancies.json`
- **Team Members & Lecturers**: Add/edit in `data/team.json`

All data is validated at runtime with TypeScript type guards.

### SEO Features

- Automatic sitemap generation
- Structured data (JSON-LD) for courses, blog posts, and job postings
- Hreflang tags for all language variants
- Open Graph and Twitter Card metadata
- Canonical URLs

## 🔧 Configuration

### Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://expansepi.com
```

### Adding New Content

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed instructions on:
- Adding new courses
- Publishing blog posts
- Managing job vacancies
- Adding team members and lecturers
- Customizing styles

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚢 Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📝 License

Copyright © eXpansePi. All rights reserved.
