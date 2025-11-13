# eXpansePi - Dokumentace projektu

## 📁 Struktura projektu

```
expansepi/
├── app/                          # Next.js App Router
│   ├── components/               # Globální komponenty
│   │   └── Navigation.tsx
│   ├── kurzy/                    # Kurzy modul
│   │   ├── components/           # Kurz-specifické komponenty
│   │   │   ├── CourseCard.tsx    # Karta kurzu (reusable)
│   │   │   ├── CourseStatusBadge.tsx
│   │   │   ├── CourseLevelBadge.tsx
│   │   │   └── index.ts          # Barrel export
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Detail kurzu (dynamický)
│   │   └── page.tsx              # Seznam kurzů
│   ├── layout.tsx                # Root layout + metadata
│   ├── page.tsx                  # Homepage
│   ├── robots.ts                 # SEO robots.txt
│   └── sitemap.ts                # Dynamický sitemap
│
├── data/                         # Data layer
│   ├── courses.json              # Zdrojová data kurzů
│   └── courses.ts                # Data access funkce + validace
│
├── types/                        # TypeScript typy
│   └── course.ts                 # Course interface a pomocné typy
│
├── lib/                          # Utility knihovny
│   └── course-constants.ts       # Konstanty, konfigurace, helpers
│
└── public/                       # Statické soubory
```

---

## 🎯 Klíčové koncepty

### 1. **Course Status System**

Kurzy mají dva stavy:
- **`active`** - Hotový kurz, dostupný k zápisu, plný obsah
- **`upcoming`** - Připravovaný kurz, omezený obsah

**Použití:**
```typescript
import { isActiveCourse, getActiveCourses } from '@/data/courses'

const course = getCourseBySlug('python-pro-zacatecniky', 'cs')
if (isActiveCourse(course)) {
  // Zobraz plný obsah
}
```

**Poznámka:** Všechny funkce podporují parametr `lang` pro multijazyčnost (default: `'cs'`).

### 2. **Reusable Components**

Všechny kurz-specifické komponenty jsou v `app/kurzy/components/`:

```tsx
import { CourseCard, CourseStatusBadge } from './components'

<CourseCard course={course} /> // Kompletní karta s logikou
<CourseStatusBadge status="active" /> // Jen status badge
```

**Výhody:**
- DRY princip (Don't Repeat Yourself)
- Snadná údržba (změna na jednom místě)
- Testovatelnost
- Konzistentní design

### 3. **Data Access Layer**

Veškerý přístup k datům přes `data/courses.ts` a `data/vacancies.ts`:

```typescript
import { 
  getAllCourses,        // Všechny kurzy (lang?: string)
  getActiveCourses,     // Jen aktivní (lang?: string)
  getUpcomingCourses,   // Jen připravované (lang?: string)
  getCourseBySlug,      // Jeden kurz podle slug (slug, lang?: string)
  isActiveCourse        // Helper pro status check
} from '@/data/courses'

import {
  getAllVacancies,     // Všechny pozice (lang?: string)
  getOpenVacancies,    // Jen otevřené (lang?: string)
  getVacancyBySlug,    // Jedna pozice podle slug (slug, lang?: string)
} from '@/data/vacancies'
```

**Funkce:**
- Runtime validace dat (TypeScript type guards)
- Caching per jazyk (pouze jedno čtení JSON na jazyk)
- Centralizovaná error handling
- JSDoc dokumentace
- Multijazyčná podpora s automatickým fallbackem

### 4. **Type Safety**

Všechny typy centralizované v `types/course.ts`:

```typescript
export type CourseStatus = 'active' | 'upcoming'
export type CourseLevel = 'Začátečníci' | 'Středně pokročilí' | 'Pokročilí'

export interface Course {
  slug: string
  title: string
  description: string
  duration: string
  level: CourseLevel
  status: CourseStatus
  syllabus?: string[]      // Volitelné pole
  startDate?: string       // Volitelné pole
  price?: number           // Volitelné pole
}
```

---

## 🔧 Jak přidat nový kurz

### Krok 1: Přidej do `data/courses.json`

**Multijazyčná struktura (doporučeno):**
```json
{
  "slug": "nova-technologie",
  "languages": {
    "cs": {
      "title": "Nová technologie",
      "description": "Popis kurzu...",
      "duration": "6 týdnů",
      "level": "Začátečníci"
    },
    "en": {
      "title": "New Technology",
      "description": "Course description...",
      "duration": "6 weeks",
      "level": "Beginner"
    },
    "ru": {
      "title": "Новая технология",
      "description": "Описание курса...",
      "duration": "6 недель",
      "level": "Начальный"
    }
  },
  "status": "upcoming"  // nebo "active"
}
```

**Starší struktura (stále podporována):**
```json
{
  "slug": "nova-technologie",
  "title": "Nová technologie",
  "description": "Popis kurzu...",
  "duration": "6 týdnů",
  "level": "Začátečníci",
  "status": "upcoming"
}
```

### Krok 2: Hotovo! 🎉

Systém automaticky:
- ✅ Přidá kurz do seznamu
- ✅ Vygeneruje detail stránku `/kurzy/nova-technologie`
- ✅ Aktualizuje sitemap
- ✅ Přidá do strukturovaných dat (SEO)

---

## 🎨 Jak změnit vizuální styl

### Status barvy a styly

Uprav `lib/course-constants.ts`:

```typescript
export const COURSE_STATUS_CONFIG = {
  active: {
    label: 'Probíhá',
    badgeClass: 'bg-green-100 text-green-800',  // ← změň barvy
    cardClass: 'border-green-200 bg-gradient-to-br from-white to-green-50',
    icon: '✓',  // ← změň ikonu
  }
}
```

### Level barvy

```typescript
export const COURSE_LEVEL_CONFIG = {
  'Začátečníci': {
    badgeClass: 'bg-blue-100 text-blue-700'  // ← změň barvy
  }
}
```

---

## 🚀 Možná rozšíření

### 1. Přidat více polí do kurzu

**`types/course.ts`:**
```typescript
export interface Course {
  // ... existující pole
  instructor?: string      // Lektor
  capacity?: number        // Kapacita
  enrolled?: number        // Počet zapsaných
  tags?: string[]          // Tagy (např. ['backend', 'beginners'])
}
```

**`data/courses.json`:**
```json
{
  "slug": "python-pro-zacatecniky",
  "instructor": "Mgr. Jan Novák",
  "capacity": 20,
  "enrolled": 15,
  "tags": ["python", "programming", "beginners"]
}
```

### 2. Filtrování kurzů

**`data/courses.ts`:**
```typescript
export function getCoursesByLevel(level: CourseLevel): Course[] {
  return getAllCourses().filter(c => c.level === level)
}

export function getCoursesByTag(tag: string): Course[] {
  return getAllCourses().filter(c => c.tags?.includes(tag))
}
```

### 3. Vyhledávání

**`app/kurzy/page.tsx`:**
```tsx
const [search, setSearch] = useState('')
const filtered = allCourses.filter(c => 
  c.title.toLowerCase().includes(search.toLowerCase())
)
```

### 4. Řazení

**`data/courses.ts`:**
```typescript
export function sortCoursesByDate(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
}
```

---

## 📝 Best Practices použité v projektu

### ✅ **Single Responsibility Principle**
- Každá komponenta má jednu jasnou zodpovědnost
- `CourseCard` = zobrazení karty
- `CourseStatusBadge` = zobrazení statusu
- `data/courses.ts` = přístup k datům

### ✅ **DRY (Don't Repeat Yourself)**
- Žádná duplicita kódu
- Reusable komponenty
- Centralizované konstanty

### ✅ **Type Safety**
- Všechny typy explicitně definované
- Runtime validace dat
- Type guards pro bezpečnost

### ✅ **Separation of Concerns**
- Data layer oddělen od UI
- Konstanty oddělené od logiky
- Komponenty oddělené podle modulu

### ✅ **Dokumentace**
- JSDoc komentáře u všech funkcí
- README s příklady použití
- Inline komentáře pro složitější logiku

### ✅ **Škálovatelnost**
- Snadné přidání nových stavů
- Snadné přidání nových polí
- Modulární struktura

---

## 🔍 Kontrola kvality kódu

```bash
# TypeScript check
npm run build

# Lint check
npm run lint
```

---

## 📚 Další kroky

1. **Databáze** - migrace z JSON do PostgreSQL/SQLite
2. **API Routes** - CRUD endpointy pro správu kurzů
3. **Admin UI** - webové rozhraní pro úpravu kurzů
4. **Testy** - unit testy pro data layer a komponenty
5. **CMS** - integrace s Sanity/Contentful
6. **Autentizace** - přihlášení pro studenty/lektory
7. **E-commerce** - platby, košík, objednávky

---

## 📰 Blog systém

### Struktura souborů
```
data/posts.json        # Zdroje článků (markdown/plain text body)
data/posts.ts          # Data access layer pro články
types/blog.ts          # Typy BlogPost
app/blog/page.tsx      # List s published + připravované (draft) články
app/blog/[slug]/page.tsx  # Detail článku
app/blog/components/BlogCard.tsx  # Reusable karta článku
```

### Typ `BlogPost`
```ts
export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  content: string
  date: string
  updated?: string
  author: string
  tags: string[]
  status: 'published' | 'draft'
  coverImage?: string
  readingMinutes?: number
}
```

### Data access API
```ts
getAllPosts()          // všechny (published + draft)
getPublishedPosts()    // jen publikované
getDraftPosts()        // jen drafty
getPostBySlug(slug)    // konkrétní článek
getPostsByTag(tag)     // filtrované podle tagu
getRecentPosts(limit)  // posledních N publikovaných
```

### Přidání nového článku
1. Otevři `data/posts.json`
2. Přidej nový objekt se `status: "draft"` nebo `"published"`
3. Po nasazení se automaticky objeví v listu (draft sekce ↔ published sekce)

### SEO & Structured Data
- `Blog` + embedded `BlogPosting` JSON-LD na list stránce
- `BlogPosting` JSON-LD na detailu (/blog/[slug])
- `sitemap.ts` zahrnuje pouze `published` články

### Změna logiky
Možné přidat pole `featured: boolean` a vytvořit sekci doporučených: `getPublishedPosts().filter(p => p.featured)`.

### Budoucí rozšíření
- Markdown render (remark / mdx) místo plain textu
- Full-text vyhledávání (lunr.js / minisearch)
- CMS integrace (Sanity, Contentful)
- Pagination & infinite scroll
- Tag cloud + RSS feed (`app/rss.xml` route)

---

## 👔 Volné pozice (dynamické, multijazyčné)

### Struktura
```
data/vacancies.json            # Zdroje pozic (multijazyčné, open/draft/closed)
data/vacancies.ts              # Data access layer s podporou jazyků
types/vacancy.ts               # Typy (Vacancy, JobStatus, EmploymentType, WorkMode)
app/[lang]/volne-pozice/page.tsx      # Seznam pozic (jen open pozice)
app/[lang]/volne-pozice/[slug]/page.tsx # Detail pozice
app/[lang]/volne-pozice/components/   # VacancyCard
```

### Multijazyčná struktura JSON

Pozice podporují stejnou multijazyčnou strukturu jako kurzy:

```json
{
  "slug": "senior-python-developer",
  "languages": {
    "cs": {
      "title": "Senior Python Developer",
      "description": "Hledáme zkušeného Python vývojáře...",
      "details": "# Senior Python Developer\n\nBudete pracovat na...",
      "location": "Praha / Remote"
    },
    "en": {
      "title": "Senior Python Developer",
      "description": "We are looking for an experienced Python developer...",
      "details": "# Senior Python Developer\n\nYou will work on...",
      "location": "Prague / Remote"
    },
    "ru": {
      "title": "Senior Python Developer",
      "description": "Мы ищем опытного разработчика Python...",
      "details": "# Senior Python Developer\n\nВы будете работать над...",
      "location": "Прага / Удаленно"
    }
  },
  "workMode": "hybrid",
  "employmentType": "FULL_TIME",
  "department": "Engineering",
  "tags": ["python", "backend"],
  "status": "open",
  "postedAt": "2024-01-12"
}
```

### Typ `Vacancy`
```ts
export interface Vacancy {
  slug: string
  title: string                    // Lokalizovaný název
  description: string              // Lokalizovaný popis
  details?: string                 // Lokalizovaný detail (markdown)
  location: string                 // Lokalizovaná lokace
  workMode: 'onsite' | 'remote' | 'hybrid'
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  department?: string
  tags?: string[]
  status: 'open' | 'draft' | 'closed'
  postedAt: string
  updated?: string
  validThrough?: string
}
```

### Data access API

Všechny funkce podporují parametr `lang` (default: `'cs'`):

```ts
getAllVacancies(lang?: string)              // Všechny pozice (seřazené podle data)
getOpenVacancies(lang?: string)             // Jen otevřené pozice
getDraftVacancies(lang?: string)            // Jen draft pozice
getClosedVacancies(lang?: string)           // Jen uzavřené pozice
getVacancyBySlug(slug: string, lang?: string)  // Konkrétní pozice
getVacanciesByTag(tag: string, lang?: string)  // Filtrované podle tagu
getRecentVacancies(limit?: number, lang?: string) // Posledních N otevřených
```

**Použití:**
```tsx
// V komponentě
const lang = 'cs' // nebo 'en', 'ru'
const openVacancies = getOpenVacancies(lang)
const vacancy = getVacancyBySlug('senior-python-developer', lang)
```

### Přidání/úprava pozice

1. Otevři `data/vacancies.json`
2. Přidej nový objekt s multijazyčnou strukturou:
   ```json
   {
     "slug": "nova-pozice",
     "languages": {
       "cs": { "title": "...", "description": "...", "location": "..." },
       "en": { "title": "...", "description": "...", "location": "..." },
       "ru": { "title": "...", "description": "...", "location": "..." }
     },
     "workMode": "remote",
     "employmentType": "FULL_TIME",
     "status": "open",
     "postedAt": "2024-01-15"
   }
   ```
3. Nastav `status: "open"` pro zveřejnění
4. Otevřené pozice se automaticky zobrazí v seznamu a mají detailovou stránku

### Zobrazení "Žádné pozice"

Když nejsou žádné otevřené pozice (`status: "open"`), zobrazí se lokalizovaná zpráva:
- **Česky**: "Momentálně nehledáme nové kolegy. Aktuálně nemáme žádné volné pozice."
- **Anglicky**: "We are not currently looking for anyone. No available positions at the moment."
- **Rusky**: "В настоящее время мы не ищем сотрудников. На данный момент нет доступных вакансий."

Zpráva je definována v `i18n/locales/*.json` pod klíčem `vacancies.noVacancies`.

### SEO
- Seznam: `ItemList` se seznamem `JobPosting`
- Detail: `JobPosting` JSON-LD s title/description/datePosted/employmentType
- Sitemap: zahrnuti pouze `open` pozic pro všechny jazyky
- Hreflang: automaticky generováno pro všechny jazykové varianty

### Možná rozšíření
- Přidat salary range, seniority level
- Formulář přihlášky (e-mail/ATS integrace)
- Filtrování podle lokality/typu/oddělení
- RSS/Atom feed pro pozice
- Sekce pro draft/closed pozice (aktuálně se zobrazují jen open)

---

---

## 👥 Tým a lektoři (O nás stránka)

### Struktura
```
data/team.json              # Zdroje týmových členů a lektorů
data/team.ts                # Data access layer
types/team.ts               # Typy (TeamMember, Lecturer, TeamMemberRole)
app/[lang]/o-nas/page.tsx   # O nás stránka s týmem a lektory
app/[lang]/o-nas/components/ # TeamMemberCard, LecturerCard
```

### Typy

**TeamMember:**
```ts
export interface TeamMember {
  id: string                // Unikátní identifikátor
  name: string              // Jméno
  title: string             // Pozice/titul
  description?: string       // Volitelný popis
  specializations?: string[] // Volitelné specializace (pole řetězců)
  photo?: string            // Volitelná URL fotky
  role: 'founder' | 'hr' | 'other'  // Role v organizaci
}
```

**Lecturer:**
```ts
export interface Lecturer {
  id: string                // Unikátní identifikátor
  name: string              // Jméno
  title: string             // Titul/pozice
  description: string      // Popis (povinný)
  specializations?: string[] // Volitelné specializace (pole řetězců)
  photo?: string            // Volitelná URL fotky
}
```

### Struktura JSON

Otevři `data/team.json` a přidej týmové členy a lektory. Podporuje multijazyčné popisy (cs, en, ru):

**Multijazyčná struktura (doporučeno):**
```json
{
  "teamMembers": [
    {
      "id": "jan-novak",
      "name": "Jan Novák",
      "title": "Zakladatel",
      "role": "founder",
      "photo": "/images/team/jan-novak.jpg",
      "languages": {
        "cs": {
          "description": "Zakladatel společnosti s více než 10 lety zkušeností v IT."
        },
        "en": {
          "description": "Founder of the company with over 10 years of experience in IT."
        },
        "ru": {
          "description": "Основатель компании с более чем 10-летним опытом в IT."
        }
      }
    },
    {
      "id": "marie-svobodova",
      "name": "Marie Svobodová",
      "title": "HR Manager",
      "role": "hr",
      "languages": {
        "cs": {
          "description": "Specialistka na nábor a rozvoj talentů."
        },
        "en": {
          "description": "Specialist in recruitment and talent development."
        },
        "ru": {
          "description": "Специалист по найму и развитию талантов."
        }
      }
    }
  ],
  "lecturers": [
    {
      "id": "petr-svoboda",
      "name": "Petr Svoboda",
      "title": "Senior Python Developer",
      "photo": "/images/lecturers/petr-svoboda.jpg",
      "languages": {
        "cs": {
          "description": "Zkušený lektor s praktickými zkušenostmi z vývoje webových aplikací. Absolvent Matfyzu UK.",
          "specializations": ["Python", "Django", "Web Development"]
        },
        "en": {
          "description": "Experienced lecturer with practical experience in web application development. Graduate of Charles University.",
          "specializations": ["Python", "Django", "Web Development"]
        },
        "ru": {
          "description": "Опытный лектор с практическим опытом разработки веб-приложений. Выпускник Карлова университета.",
          "specializations": ["Python", "Django", "Веб-разработка"]
        }
      }
    }
  ]
}
```

**Starší struktura (stále podporována):**
```json
{
  "teamMembers": [
    {
      "id": "jan-novak",
      "name": "Jan Novák",
      "title": "Zakladatel",
      "description": "Zakladatel společnosti s více než 10 lety zkušeností v IT.",
      "role": "founder"
    }
  ],
  "lecturers": [
    {
      "id": "petr-svoboda",
      "name": "Petr Svoboda",
      "title": "Senior Python Developer",
      "description": "Zkušený lektor s praktickými zkušenostmi z vývoje webových aplikací."
    }
  ]
}
```

### Přidání nového týmového člena

1. Otevři `data/team.json`
2. Přidej nový objekt do pole `teamMembers` s multijazyčnou strukturou:
   ```json
   {
     "id": "unikatni-id",
     "name": "Jméno Příjmení",
     "title": "Pozice",
     "role": "founder",  // nebo "hr", "other"
     "photo": "/images/team/foto.jpg",  // volitelné
     "languages": {
       "cs": {
         "description": "Popis v češtině (volitelné)",
         "specializations": ["Specializace 1", "Specializace 2"]
       },
       "en": {
         "description": "Description in English (optional)",
         "specializations": ["Specialization 1", "Specialization 2"]
       },
       "ru": {
         "description": "Описание на русском (необязательно)",
         "specializations": ["Специализация 1", "Специализация 2"]
       }
     }
     // Nebo jednoduše mimo languages objekt:
     // "specializations": ["Python", "Django", "Web Development"]
   }
   ```
3. Týmový člen se automaticky zobrazí v sekci "Náš tým" na stránce O nás s popisem v aktuálním jazyce

### Přidání nového lektora

1. Otevři `data/team.json`
2. Přidej nový objekt do pole `lecturers` s multijazyčnou strukturou:
   ```json
   {
     "id": "unikatni-id",
     "name": "Jméno Příjmení",
     "title": "Titul/Pozice",
     "photo": "/images/lecturers/foto.jpg",  // volitelné
     "languages": {
       "cs": {
         "description": "Popis lektora v češtině (povinný)",
         "specializations": ["Python", "Django", "Web Development"]
       },
       "en": {
         "description": "Lecturer description in English (required)",
         "specializations": ["Python", "Django", "Web Development"]
       },
       "ru": {
         "description": "Описание лектора на русском (обязательно)",
         "specializations": ["Python", "Django", "Веб-разработка"]
       }
     }
     // Nebo jednoduše mimo languages objekt:
     // "specializations": ["Python", "Django", "Web Development"]
   }
   ```
3. Lektor se automaticky zobrazí v sekci "Lektoři" na stránce O nás s popisem v aktuálním jazyce

### Data access API

Všechny funkce podporují parametr `lang` (default: `'cs'`) pro multijazyčné popisy:

```ts
import {
  getAllTeamMembers,           // Všechny týmové členy (lang?: string)
  getAllLecturers,              // Všechny lektory (lang?: string)
  getTeamMembersByRole         // Filtrované podle role (role, lang?: string)
} from '@/data/team'

// Použití
const lang = 'cs' // nebo 'en', 'ru'
const allMembers = getAllTeamMembers(lang)
const founders = getTeamMembersByRole('founder', lang)
const lecturers = getAllLecturers(lang)
```

### Zobrazení na stránce

Stránka `/o-nas` automaticky zobrazuje:
- **Sekce "Náš tým"** - všechny týmové členy v grid layoutu
- **Sekce "Lektoři"** - definici lektora + všechny lektory v grid layoutu

Každá karta má:
- Modrý glow efekt (stejný jako u kurzů)
- Fotku (pokud je poskytnuta, jinak se nezobrazí žádný placeholder)
- Jméno a titul (podporuje víceřádkový text pomocí `\n`)
- Specializace jako modré tagy/badges (pokud jsou poskytnuty)
- Popis

### Lokalizace

Texty sekcí jsou lokalizované v `i18n/locales/*.json`:
```json
{
  "about": {
    "title": "O nás",
    "description": "Poznáte náš tým a vizi",
    "teamTitle": "Náš tým",
    "lecturersTitle": "Lektoři",
    "lecturerDefinition": "Naši lektoři jsou zkušení odborníci s praktickými zkušenostmi v oblasti IT."
  }
}
```

### Poznámky

- **Multijazyčnost**: Popisy podporují tři jazyky (cs, en, ru) pomocí `languages` objektu. Starší struktura s přímým `description` je stále podporována pro zpětnou kompatibilitu.
- **Specializace**: Pole `specializations` může být:
  - V `languages` objektu (multijazyčné) - každý jazyk má své specializace
  - Přímo na objektu (jednoduché) - stejné specializace pro všechny jazyky
  - Zobrazují se jako modré tagy/badges pod titulem
- **Fotky**: Pokud není poskytnuta `photo` nebo je prázdný řetězec, karta se zobrazí bez obrázku (žádný placeholder)
- **Role**: Týmoví členi mohou mít role: `founder`, `hr`, nebo `other`
- **Popis**: U lektorů je popis povinný (v alespoň jednom jazyce), u týmových členů volitelný
- **Grid layout**: Automaticky se přizpůsobí počtu členů (1-3 sloupce podle velikosti obrazovky)
- **Fallback**: Pokud není k dispozici popis v požadovaném jazyce, systém automaticky použije cs → en → ru → první dostupný jazyk
- **ID**: Podporuje jak string, tak number ID (automaticky se převede na string)

---

**Autor:** eXpansePi Team  
**Poslední aktualizace:** Listopad 2025
