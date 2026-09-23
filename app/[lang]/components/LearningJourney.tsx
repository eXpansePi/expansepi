"use client"

import { useId, useRef, useState, type KeyboardEvent } from "react"
import { ArrowRight, BookOpen, Check, ChevronDown, Code2, Database, FileCode2, Filter } from "lucide-react"
import type { SiteCopy } from "@/i18n/site"

export function getLearningExample(copy: SiteCopy["journey"], stage: number, onlyAvailable = true) {
  const allBooks = copy.books.map((title, index) => ({ id: index + 1, title, available: index !== 1 }))
  const availableBooks = allBooks.filter(book => book.available)
  const books = stage === 0 || (stage === 4 && !onlyAvailable) ? allBooks : availableBooks
  const html = `<main>\n  <h1>${copy.projectSubtitle}</h1>\n  <ul class="books">\n${allBooks.map(book => `    <li>${book.title}</li>`).join("\n")}\n  </ul>\n</main>`
  const python = `books = [\n${allBooks.map(book => `    {"title": ${JSON.stringify(book.title)}, "available": ${book.available ? "True" : "False"}},`).join("\n")}\n]\n\ndef available_books(books):\n    return [book for book in books if book["available"]]\n\nfor book in available_books(books):\n    print(book["title"])`
  const sql = `CREATE TABLE books (\n    id INTEGER PRIMARY KEY,\n    title TEXT NOT NULL,\n    available BOOLEAN NOT NULL\n);\n\nINSERT INTO books (id, title, available)\nVALUES ${allBooks.map(book => `(${book.id}, '${book.title.replaceAll("'", "''")}', ${book.available ? 1 : 0})`).join(",\n       ")};\n\nSELECT title FROM books\nWHERE available = 1\nORDER BY id;`
  const files = [
    [{ name: "index.html", code: html }, { name: "styles.css", code: ".books {\n  display: grid;\n  gap: 1rem;\n  padding: 0;\n  list-style: none;\n}" }],
    [{ name: "catalogue.py", code: python }],
    [{ name: "books.sql", code: sql }],
    [
      { name: "models.py", code: 'from django.db import models\n\nclass Book(models.Model):\n    title = models.CharField(max_length=120)\n    available = models.BooleanField(default=True)\n\n    class Meta:\n        db_table = "books"' },
      { name: "views.py", code: 'from django.shortcuts import render\nfrom .models import Book\n\ndef catalogue(request):\n    books = Book.objects.order_by("id")\n    if request.GET.get("available") == "1":\n        books = books.filter(available=True)\n    return render(request, "catalogue.html", {"books": books})' },
      { name: "catalogue.html", code: `<h1>${copy.projectSubtitle}</h1>\n<ul class="books">\n{% for book in books %}\n  <li>{{ book.title }}</li>\n{% endfor %}\n</ul>` },
    ],
    [{ name: "README.md", code: `# ${copy.projectTitle}\n\n${copy.projectDescription}\n\n## ${copy.technologiesLabel}\nPython / Django / SQLite / HTML / CSS\n\n## ${copy.startLabel}\npython manage.py migrate\npython manage.py runserver` }],
  ]
  return { allBooks, books, files: files[stage] || files[0] }
}

export default function LearningJourney({ copy }: { copy: SiteCopy["journey"] }) {
  const id = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const step = copy.steps[active]
  const example = getLearningExample(copy, active, onlyAvailable)

  function chooseStep(index: number, focus = false) {
    setActive(index)
    if (focus) tabs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % copy.steps.length
    else if (event.key === "ArrowLeft") next = (index + copy.steps.length - 1) % copy.steps.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = copy.steps.length - 1
    else return
    event.preventDefault()
    chooseStep(next, true)
  }

  return (
    <section className="section dark-section" id="cesta" aria-labelledby={`${id}-heading`}>
      <div className="container">
        <header className="section-header"><div className="section-heading"><p className="eyebrow">{copy.eyebrow}</p><h2 className="section-title" id={`${id}-heading`}>{copy.title}</h2></div><p className="section-intro">{copy.intro}</p></header>
        <div className="journey-tabs" role="tablist" aria-label={copy.eyebrow}>
          {copy.steps.map((item, index) => <button key={item.label} id={`${id}-tab-${index}`} ref={element => { tabs.current[index] = element }} type="button" role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} className="journey-tab" onClick={() => chooseStep(index)} onKeyDown={event => handleKeyDown(event, index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}
        </div>
        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="journey-panel">
          <div className="journey-description">
            <div className="journey-number">{String(active + 1).padStart(2, "0")} / {String(copy.steps.length).padStart(2, "0")}</div>
            <h3>{step.title}</h3><p>{step.text}</p>
            <ul className="journey-skills">{step.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
            {active < copy.steps.length - 1 && <button className="text-link journey-next" onClick={() => chooseStep(active + 1, true)}>{copy.next}<ArrowRight aria-hidden="true" /></button>}
          </div>
          <div className="journey-example">
            <div className="project-workbench learning-example" data-stage={active}>
              <div className="workbench-bar">
                <span className="workbench-filename">{active === 2 ? <Database aria-hidden="true" /> : <BookOpen aria-hidden="true" />}{active === 2 ? "books" : copy.projectTitle}</span>
                <span className="example-kind">{step.exampleLabel}</span>
              </div>
              <div className="example-body">
                {active === 2 ? <>
                  <table className="example-table">
                    <caption>{copy.tableCaption}</caption>
                    <thead><tr><th scope="col"><code>id</code></th><th scope="col"><code>title</code></th><th scope="col"><code>available</code></th></tr></thead>
                    <tbody>{example.allBooks.map(book => <tr key={book.id}><td>{book.id}</td><td>{book.title}</td><td>{book.available ? "1" : "0"}</td></tr>)}</tbody>
                  </table>
                  <p className="example-data-note">{copy.availabilityNote}</p>
                  <div className="example-query-result"><span>{copy.queryResult}</span><p>{example.books.map(book => book.title).join(" · ")}</p></div>
                </> : <>
                  <div className="example-heading"><h4>{copy.projectSubtitle}</h4><span className="example-count" aria-live="polite">{copy.countLabel}: {example.books.length} / {example.allBooks.length}</span></div>
                  {active === 1 && <div className="example-filter-note"><Filter aria-hidden="true" /><span>{copy.filterResult}</span></div>}
                  {active === 3 && <div className="example-request"><ArrowRight aria-hidden="true" /><code>GET /books/?available=1</code></div>}
                  {active === 4 && <label className="example-filter"><input type="checkbox" checked={onlyAvailable} onChange={event => setOnlyAvailable(event.target.checked)} />{copy.availableOnly}</label>}
                  <ul className="example-books">{example.books.map(book => <li key={book.id} className="example-book"><span className="example-book-icon"><BookOpen aria-hidden="true" /></span><span className="example-book-title">{book.title}</span>{active > 0 && <span className={`example-availability${book.available ? " is-available" : ""}`}>{book.available && <Check aria-hidden="true" />}{book.available ? copy.available : copy.borrowed}</span>}</li>)}</ul>
                </>}
              </div>
            </div>
            <p className="workbench-caption">{copy.projectLabel}</p>
            <details className="example-code">
              <summary><Code2 aria-hidden="true" /><span>{copy.codeLabel}</span><ChevronDown aria-hidden="true" /></summary>
              <div className="example-code-files" tabIndex={0} role="region" aria-label={copy.codeLabel}>
                {example.files.map(file => <div className="example-code-file" key={file.name}>
                  <div className="example-file-label"><FileCode2 aria-hidden="true" /><span translate="no">{file.name}</span></div>
                  <div className="code-view"><pre translate="no">{file.code.split("\n").map((line, index) => <span className="code-line" key={index}><span className="line-number" aria-hidden="true">{index + 1}</span><code>{line || " "}</code></span>)}</pre></div>
                </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}