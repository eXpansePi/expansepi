# eXpansePi Design Principles

## Authority

This is the mandatory source of truth for the visual and UX design of the eXpansePi website. It applies to every public page, language variant, component, interaction state, and future course offering.

- **MUST / MUST NOT** indicate acceptance requirements. A change that violates them is not ready to merge or publish.
- **SHOULD / SHOULD NOT** indicate the default design decision. Departures require a written rationale explaining the user benefit and evidence that readability, accessibility, performance, and consistency are preserved.
- **MAY** identifies an explicitly permitted choice within these rules. It does not waive a MUST requirement.
- Existing markup or CSS is not an exemption. If the implementation conflicts with this document, correct the implementation or explicitly revise the principle and its tests in the same change.
- [README.md](README.md) describes setup. [DEVELOPMENT.md](DEVELOPMENT.md) describes implementation and publishing. Neither overrides this document's design requirements.
- Changes to a shared rule MUST update this document, the owning tokens/components, and relevant verification together. A page-specific override MUST NOT silently redefine the design system.

## Product And Brand

### The Design Serves A Decision

The primary visitor is considering a new direction in IT and may be unfamiliar with programming, training terminology, or public funding. The design MUST help that person understand the offer and make an informed decision, not merely admire the presentation.

The customer journey is:

```text
Is this for me? -> Which course fits? -> What will I learn and do?
-> What does participation require? -> What does it cost?
-> Can I trust the people and conditions? -> How do I take the next step?
```

- The homepage MUST represent the company and its whole course catalog. It MUST NOT make one programming language the identity of eXpansePi.
- A course page MUST answer the same questions independently; visitors may arrive directly from search or an advertisement.
- The intended impression is confident, technically credible, approachable, and precise. Visitors MUST NOT need to feel like an insider to understand the offer.
- Premium means clear hierarchy, controlled composition, readable type, and dependable behavior. It MUST NOT mean tiny text, artificial exclusivity, or large empty areas around sparse information.
- Technical credibility SHOULD come from real curricula, working examples, tools, and professional experience. Human warmth SHOULD come from respectful writing and real people, not exaggerated promises.

### Identity

- The wordmark MUST read **eXpansePi**, with black **eXpanse** and blue **Pi**. The wordmark's blue is `#2455e8`; its black is `#111111`.
- The wordmark MUST be placed on a surface where this treatment is legible. Do not recolor Pi green, use a gradient in the wordmark, or introduce an unapproved alternate identity for a page.
- Microsoft and JetBrains MUST retain their supplied full-color artwork and proportions. Their logos belong on a light surface, with clear space and comparable visual prominence.
- Partnerships MUST be distinguished from instructors' employment history. A company mentioned in a biography is not automatically an eXpansePi partner.
- Generic SaaS treatments MUST NOT become the default: no decorative gradient orbs, blurred blobs, pervasive glass effects, floating section cards, excessive shadows, or unexplained dashboard-like metrics.
- Technology names, symbols, and code MUST carry relevant meaning. They MUST NOT be scattered around the page solely to make it look technical.

## Layout And Composition

### Shared Grid

- Page bands MUST use the shared `.container` for their principal left and right edges. Header, footer, hero artwork, and adjacent sections MUST relate to those edges.
- Both `width` and `max-width` MUST follow `--content-width`; framework utility caps MUST NOT compete with it.

| Context | Content maximum | Outer gutter | Main section padding per side |
| --- | --- | --- | --- |
| Narrow phone, below 374px | Available width | 16px | 48px |
| Phone, below 768px | Available width | 22px | 48px |
| Tablet, 768-1023px | Available width | 24px | 64px |
| Desktop, 1024-1599px | 1280px | At least 24px | 72px |
| Wide desktop, 1600-2199px | 1400px | At least 64px | 80px |
| Very wide, 2200px and above | 1560px | At least 64px | 80px |

The content maximum is a cap, not a required width. Short paragraphs and reading documents MUST retain an appropriate measure inside it.

- Paired content SHOULD use equal `minmax(0, 1fr)` columns and `--column-gap` (40px desktop, 30px tablet) unless its roles justify a different relationship.
- Grid children containing text, forms, or media MUST be able to shrink. Use `minmax(0, ...)`, `min-width: 0`, wrapping, and sensible media bounds rather than hiding overflow.
- Repeated comparable items MUST share meaningful alignment points: labels, titles, descriptions, facts, prices, or actions as appropriate. Use shared grid tracks or subgrid with a usable fallback; do not simulate alignment with arbitrary fixed text heights.
- One and two items MUST have deliberate layouts. They MUST NOT occupy a three-column template with unexplained empty columns.

### Choose A Composition From The Content

| Content relationship | Required approach |
| --- | --- |
| A section title and its explanation | One reading block using `SectionHeading`: a topic-first title, followed directly by a bounded introduction; an eyebrow is optional |
| Comparable facts or options | Common labels and horizontal alignment; consistent units and emphasis |
| A sequential process | Numbered steps with shared heading/body tracks; a vertical sequence when columns become narrow |
| A person's identity and biography | A roster row: image/initials, identity, biography; combine into a full-width reading flow on phones |
| An explanation and an interactive example | Deliberate text/tool split with clear association and stable tool dimensions |
| A closing enquiry invitation | A concise, stacked introduction beside grouped actions on desktop; actions and their commitment note follow the introduction on phones |
| Long-form reading | One bounded reading column, optionally with a clearly identified contents rail |
| Article or preparation listings | Editorial rows when comparison does not require framed cards |

Symmetry MUST be used when equal treatment helps comparison or scanning. Asymmetry SHOULD be used when the roles differ, such as explanation versus tool, identity versus biography, or contents versus document.

An asymmetric layout MUST satisfy all of these conditions:

1. The different column roles can be named in one sentence.
2. The dominant content reflects the visitor's current decision, not decorative importance.
3. At least one clear alignment relationship connects the columns: title baseline, top rule, text start, shared row, or common action band.
4. The quieter side contains useful context or intentional breathing room, not an abandoned gap caused by mismatched structures.
5. Source order remains understandable when the layout becomes one column.

If those conditions cannot be met, regroup the content. Do not keep adjusting margins around an unsuitable two-column layout.

### Whitespace And Rhythm

- Whitespace MUST separate decisions, establish grouping, or improve reading. It MUST NOT conceal missing content.
- Sections MUST size to their content. Do not add viewport-height minimums to ordinary sections or stretch a short block to match an unrelated long block.
- Fixed or bounded dimensions are appropriate for headers, icon buttons, controls, media, and framed interactive tools. They MUST NOT cause content clipping under translation or zoom.
- The standard section rhythm MUST use `--section-space`. Compact transitions MAY use `.section-tight` (52px desktop, 40px phones) when the content warrants it.
- Adjacent sections on the same surface MUST be reviewed together. Their combined bottom/top padding MUST NOT create an accidental double pause between closely related ideas.
- Small spacing SHOULD follow a repeatable 4px-based rhythm, with existing optical adjustments retained where they align text or icons. Do not introduce a new spacing value to correct a structural mismatch.
- A divider MUST communicate a boundary or grouping. Do not add lines to every edge merely to fill a composition.
- A content boundary MUST NOT be marked twice. A ruled comparison band followed by a process uses one shared separator, with 24-32px before the step markers and no extra rules above each step.
- Background changes MUST indicate a meaningful chapter, emphasis, or interaction context. They MUST NOT alternate mechanically after every block.

## Typography

### Families And Hierarchy

- **Manrope Variable** MUST be the main family for navigation, headings, prose, forms, and commands. **IBM Plex Mono** MUST be reserved for code, compact technical metadata, and restrained indexing.
- Fonts MUST remain self-hosted with appropriate Czech, English, and Russian glyph coverage. New pages MUST NOT introduce another font family without a system-level decision and performance review.
- Each page MUST have one meaningful H1. Heading levels MUST follow the document hierarchy rather than the desired visual size.
- Headings MUST identify a topic or offer. Expressive language is welcome when nearby content still makes the page's purpose explicit.
- Display-sized type MUST be limited to primary page/hero content. Cards, sidebars, and tools MUST use their smaller component hierarchy.
- Existing display variants provide the range: homepage H1 39-96px; general page H1 30-58px; course H1 30-49px; section headings 26-40px. These are context-specific variants, not permission to choose any size arbitrarily.
- Headlines SHOULD use approximately 1.1-1.4 line height and medium/semibold weight. Main prose MUST retain the reading scale below.
- Letter spacing MUST remain zero. Do not use negative tracking to force a title into a container.

### Required Reading Scale

| Role | Desktop, 1024px+ | Tablet, 768-1023px | Phone, below 768px |
| --- | --- | --- | --- |
| `--text-body`: explanations, curricula, biographies, answers | 18px | 17px | 16px |
| `--text-support`: conditions, notes, next-step explanations | 16px | 16px | 15px |
| `--text-ui`: commands and secondary navigation | 16px | 16px | 15px |
| `--text-meta`: field labels, dates, credentials | 14px | 14px | 13px |
| Main desktop navigation | 17px | Replaced by mobile navigation | Replaced by mobile navigation |

- Body line height MUST be `--body-leading`: 1.75 on desktop/tablet and 1.7 on phones. Dense control labels MAY use 1.5-1.6; long explanations MUST NOT inherit a compact control line height.
- The header CTA MUST remain 16px and the language selector 15px. Mobile navigation links use the larger 19px navigation treatment.
- Funding conditions, price caveats, beginner explanations, biographies, and form outcomes MUST NOT be treated as decorative fine print.
- Eyebrows use `--text-meta` (14px desktop and 13px phone) and remain optional. They MUST NOT carry the only clear topic name while the actual heading is a slogan. Short badges MAY be 13px desktop and 12px phone. Decorative step/line indices MAY be smaller, but MUST NOT carry the only copy of useful information.
- Code MAY use 14px desktop and 13px phone in its bounded tool. Code controls and captions MUST remain readable independently of syntax styling.
- Essential menu links or form labels MUST NOT fall back to 10-12px utility styles.

### Measure And Wrapping

- Ordinary explanatory paragraphs SHOULD occupy approximately 45-72 characters per line on desktop. Section introductions sit 14px below their heading and use a maximum of 64ch; biographies and editorial bodies use about 72ch; article containers use 76ch.
- Short conditions MAY extend to roughly 80-92ch when they are clearly secondary and span few lines. A wide page MUST NOT turn into edge-to-edge prose.
- Typography MUST use deliberate responsive steps. Do not use `vw` font sizes or shrink text until it fits.
- When content no longer fits, widen its track, stack it, or simplify the composition before reducing the reading size.
- Whole words SHOULD wrap naturally. Overflow wrapping is a last-resort safety for unusually long words, URLs, or identifiers, not the normal treatment for a heading.
- Descriptions and conditions MUST NOT be line-clamped away for visual symmetry. Use progressive disclosure only when the hidden content is genuinely secondary and remains accessible.

## Color

### Core Tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--blue` | `#2455e8` | Primary commands, active states, links, brand Pi |
| `--blue-hover` | `#163bb0` | Hover treatment for primary commands |
| `--ink` | `#17191d` | Main text |
| `--muted` | `#4f5968` | Supporting text, not a disabled state |
| `--paper` / `--background` | `#fbfcfe` | Main light surface |
| `--wash` | `#f1f4f8` | Secondary content surface |
| `--line` | `#dbe1e9` | Decorative dividers and grouping |
| `--control-border` | `#758194` | Form/control boundaries that must be distinguishable |
| `--dark` | `#171b23` | Purposeful dark chapters and technical context |
| `--lime` | `#dbef83` | Selection highlights and restrained emphasis/focus on dark surfaces, never the wordmark |

- Core colors in UI styles and dynamic artwork MUST be referenced through tokens, not re-created with near-identical page-specific values. Static brand/partner artwork retains its approved intrinsic colors.
- `--line` is deliberately subtle. It MUST NOT be used as the sole visible boundary of an input on a light surface; use the higher-contrast control border.
- Normal text MUST meet at least `4.5:1` contrast. Large text MAY use `3:1` only when it meets WCAG's large-text definition. Meaningful icons, focus indicators, and necessary control boundaries MUST meet `3:1` against adjacent colors.
- Status MUST be conveyed with text or a recognizable icon as well as color. Green alone does not mean funding is approved or a message was delivered.

### Supporting Surfaces And Semantics

- Pale blue (`#eaf0ff`) is the shared application emphasis band. It MUST remain subordinate to the blue primary button.
- Information badges use pale blue with dark blue text. Success feedback uses a pale green surface and dark readable text; errors use a pale red surface (`#fff2ef`) and dark red text (`#8a271b`).
- Muted green is permitted for conditional funding emphasis and restrained technical/portrait surfaces. It MUST NOT replace the primary blue identity or turn the site into a green theme.
- The darker code surface is confined to the framed learning tool. The whole website MUST NOT inherit a code-editor palette.
- Partner artwork and real imagery MAY introduce their authentic colors. Do not tint logos or photographs to force them into the UI palette.
- A new color MUST have a named semantic or content role, meet contrast requirements, and be reused through the owning pattern. A new hue is not justified merely because a section needs visual variety.

## Components

### Buttons And Links

- Use buttons for actions and links for navigation. A button MUST NOT be a styled dead end; a link MUST have a real destination.
- Each decision group SHOULD have one visually primary command. Secondary actions MUST be quieter, not identical competing primary buttons.
- Primary actions use the solid blue treatment. Secondary actions use the shared outlined or text-link treatment. Decorative gradients and large shadows MUST NOT be added to commands.
- Standalone interactive targets MUST be at least 44px by 44px, including logo links and icon buttons. Inline prose links are exempt from the box size, but MUST be legible and visibly identifiable.
- Icon-only controls MUST have an accessible name. Unfamiliar icons SHOULD have a tooltip. Use the existing Lucide library rather than hand-drawing interface symbols.
- Links embedded in prose MUST be underlined or otherwise identifiable without relying on color alone. Command rows MAY use the established arrow-and-text link pattern.
- Disabled controls MUST look and behave disabled. A waiting cursor/spinner MUST be reserved for an operation actually in progress.

### Cards, Rows, And Badges

- Cards MAY frame an individual repeated offer or a genuinely bounded tool. A whole page section MUST NOT be placed inside a floating card.
- Cards MUST NOT be nested inside other cards. Group facts with spacing, shared tracks, and dividers instead.
- Corners MUST remain restrained: at most 8px, with existing controls/cards generally 3-6px and dialogs/tools at most 7px. Full rounding is for genuinely circular controls, not every label.
- Comparable cards MUST align the information people compare, not just their outer heights. Do not fill a short card with empty space or invented copy.
- Use editorial rows for articles, staff rosters, or unpublished offerings when a card implies an independence or availability the content does not have.
- Badges MUST communicate a concise status or attribute. They MUST NOT become paragraph containers, pretend to be buttons, or imply approval or accreditation unsupported by the course record.
- Team education and employer credentials SHOULD precede the roster as paired, unframed facts with prominent institution names, aligned labels and explanations, and a stacked layout when space is limited. Labels MUST distinguish graduates' education and instructors' employment from institutional partnerships or course accreditation.
- Each institution MUST read as a separate list item, with its own bounded surface and spacing, not as part of one combined name. These noninteractive items MUST wrap without truncation as the data grows. Lists MUST derive from explicit lecturer education/current-employer fields, deduplicate names and omit empty groups; biography mentions MUST NOT be treated as current employment or completed education.

### Forms And Feedback

- Reuse the shared enquiry form. New routes MUST NOT create slightly different versions of the same application workflow.
- Require only the information needed for the initial enquiry. Name and email are required in the present enquiry flow; phone and personal message remain optional.
- Visible labels MUST persist independently of placeholders. Required/optional status and native input types/autocomplete MUST be appropriate to the field.
- Text inputs and selects MUST share the 50px control height and readable 16px input text. Textareas MUST grow or scroll without clipping their content.
- Before submission, explain whether the action is nonbinding and what follows. Submission MUST NOT imply payment, guaranteed admission, or a confirmed place.
- Sending, error, rate-limit, and success states MUST be distinguishable. A failed request MUST NOT appear successful or clear the visitor's input.
- Success and error feedback MUST remain available until the user acts. Do not auto-dismiss the dialog or reset feedback after an arbitrary timer.
- Privacy information MUST be visible near submission. Tracking MUST respect the visitor's consent, and refusing optional cookies MUST NOT prevent an enquiry.
- Floating consent notices MUST reserve measured scroll clearance so keyboard focus can remain visible behind them. That temporary clearance MUST be removed when the notice is dismissed; it is not permanent section whitespace.

### Navigation, Dialogs, And Accordions

- Primary navigation MUST reflect the student journey: courses, participation, funding, people, and questions. Vacancies and administrative information MUST remain secondary.
- A global start/apply action MUST lead to course choice. A published course's action MUST retain that course's context. A preparation page MUST NOT link to a nonexistent application section.
- Navigation MUST switch composition before readable labels collide. Do not shrink the desktop menu to preserve it at a narrower width.
- Mobile navigation and application dialogs MUST support focus containment, Escape, an accessible close control, and focus restoration to their trigger. A pointer click MUST establish the trigger as the return target even in Safari.
- Use native disclosures for ordinary FAQ content. Questions MUST be understandable without opening them. Essential price, date, audience, or format information MUST NOT exist only in an accordion.
- FAQ pairs MUST share row and first-line alignment on desktop, with a sensible reading/tab order on phones. Expanded answers MUST remain natural content, not clipped fixed-height panels.

### Course Facts, CTAs, Numbers, And Processes

- Course title, level, format, duration, next available dates, price status, and next action MUST be easy to locate near the top of a published course page.
- Facts MUST come from that course's record. New C#, Java, JavaScript, AI, or other courses MUST NOT inherit Python's hours, curriculum, format, certificate, instructors, or funding assumptions.
- A single-course preview SHOULD use a full-width facts strip and price/action row. Multiple published courses SHOULD use aligned comparison cards. Preparation entries MUST be visually distinct and have no enrollment action.
- Standard price and potential funded contribution MUST be distinguished. Unknown prices/dates MUST be explicitly unconfirmed; an absent price is not zero.
- Persistent CTAs MUST remain secondary to the page's primary content and MUST NOT obscure focused controls, anchor destinations, or consent choices. Reserve bottom space and account for device safe areas.
- Large numbers MUST express a useful, verified quantity with its unit and conditions nearby. Do not use salary estimates, placement rates, countdowns, or inflated statistics as visual filler.
- Numbered steps MUST represent an actual sequence. Parallel benefits are not a process merely because numbering looks attractive.
- An application invitation MUST NOT repeat an entire process already explained on the page. Keep the next action and its commitment level together. In-development courses MAY use a native disclosure, while published courses remain directly visible.
- Process labels, headings, and body starts MUST align when displayed side by side. On smaller screens, use a vertical sequence rather than unreadably narrow columns.

## Responsive Design

- Every layout MUST be designed for its least spacious supported state, not just stacked after desktop styling is finished.
- On phones, prioritize offer, suitability, current course facts, cost/funding, and next action. Secondary metadata MUST NOT displace the decision-making content.
- On tablets, reconsider column count before reducing type. Two useful columns or a wider roster row are preferable to three narrow biography columns.
- On desktop, use shared grids and comparison relationships deliberately. More available width MUST NOT mean longer unbounded paragraphs.
- Very wide screens MUST expand through the approved content-width tokens while preserving reading measures and the relationship between artwork and content.
- Breakpoints are consequences of content fit, not device labels. The baseline ranges above MUST be respected, and intermediate widths MUST be checked whenever text, columns, or navigation change.
- Source order MUST remain logical for screen readers and one-column layouts. Visual reordering MUST NOT create a different keyboard journey or separate a control from its explanation.
- Controls MUST work without hover. Hover styling is an enhancement, never the only way to reveal an action or information.
- Text and images MUST NOT create page-level horizontal scrolling at 320px. Intentionally scrollable code or data tools MAY scroll internally if keyboard access and purpose are clear.
- Do not use `overflow-x: hidden` on the page to conceal a broken grid. Find the content or track that cannot shrink.
- Images MUST keep their aspect ratio and use responsive sizing. Labels, loading states, hover states, and translations MUST NOT unexpectedly resize fixed-format controls or tools.
- Zoom and text enlargement MUST remain enabled. Check text at 200% and reflow at a narrow viewport; sticky elements MUST not make the remaining reading area unusable.

## Motion And Interaction

- Animation MUST have a user-facing purpose: explain a learning transformation, acknowledge an action, or clarify a state change. Motion solely added because it is possible MUST NOT ship.
- The default intensity is restrained. Use color/border transitions for controls, not bouncing, large scaling, or continuous movement.
- Hover/focus feedback SHOULD take about 120-200ms. Content entrances SHOULD be brief (roughly 250-650ms), with little or no stagger. The purposeful hero assembly MAY take up to about 1400ms once.
- Easing SHOULD settle smoothly, using the existing ease/ease-out behavior. Elastic and spring-like motion MUST NOT be the default for this adult learning product.
- Essential copy and actions MUST exist in the initial HTML and remain operable while an entrance animation runs. A typing sequence or animation MUST NOT gate access to the offer.
- Scroll-triggered effects MUST NOT hijack scrolling, alter navigation expectations, or repeatedly hide already-read content. Native anchor navigation with normal smooth scrolling is acceptable.
- Canvas work MUST stop when complete, offscreen, or in a hidden tab. Pointer interaction MUST be throttled to rendering frames; do not animate continuously while idle.
- `prefers-reduced-motion` MUST remove nonessential motion, smooth scrolling, and pointer displacement. Keep the meaningful final visual and all functionality available.

## Imagery

- Prefer real instructors, real work, clear project screenshots, and imagery that helps people inspect the actual course experience.
- Portraits SHOULD feel approachable and professional, with natural light, believable context, and recognizable faces. Do not use anonymous stock models to imply they teach or study here.
- Missing photographs MUST use a clearly non-photographic fallback such as initials. They MUST NOT reserve a large empty photo panel or fabricate a person.
- A student's image, testimonial, or project MUST have appropriate permission and accurate provenance. Do not imply a demo was made by a graduate.
- Illustrations and generated graphics MAY explain an abstract concept, a technical process, or an explicitly illustrative example. They MUST NOT represent a real student, instructor, outcome, facility, or partnership without evidence.
- The learning demo MUST remain labeled as illustrative. Its interactivity is evidence of the concept, not evidence of student outcomes.
- Learning examples MUST connect one named project and one consistent set of records across the technologies. Show the stage-specific page, data selection, database or application response first; related code may use a native disclosure. A generic result switch MUST NOT imply that unrelated static snippets execute the same interactive application.
- Avoid generic handshakes, laptop-on-desk stock scenes, faceless coding imagery, abstract AI heads, and imagery that adds atmosphere without useful information.
- Photographs MUST NOT be stretched, excessively darkened, blurred, or cropped so tightly that the subject becomes hard to inspect.
- Use `object-fit: contain` for logos and inspectable screenshots. Use `cover` for portraits only with an appropriate focal crop. Preserve intrinsic proportions and explicit dimensions/aspect ratio to avoid layout shift.
- The roster's compact portrait footprint is 80px wide on desktop, 72px on tablet, and 56px on phones; real images and initials MUST fit that identity grouping. A new image-led page MAY use a different ratio when its content requires it and the crop is reviewed at every layout.

## Content And UX

- Write from the visitor's questions, not the company's internal organization. Start with what the offer is, whom it fits, what participation involves, and what the next action means.
- Use concrete outcomes and plain language. Explain technical terms when a beginner needs them; do not imply that unfamiliar terminology is a personal failing.
- Headlines SHOULD be concise and specific. Supporting copy MUST add information rather than repeat the headline in more words.
- Useful content density MUST take priority over decorative minimalism. Do not delete conditions, shrink explanations, or invent statistics to balance a layout.
- Progressive disclosure MUST separate basic decisions from optional depth. Full curricula, detailed FAQs, and legal chapters may be progressively explored; core course facts may not be hidden.
- CTA wording MUST describe the action and its commitment level. Use the established course-choice and nonbinding-enquiry vocabulary consistently across header, course page, dialog, and feedback.
- Trust MUST come from verified people, professional backgrounds, company information, course details, and transparent conditions. Logos complement that evidence; they do not replace it.
- Dates, prices, accreditation, partner relationships, funding eligibility, testimonials, salaries, and employment outcomes MUST NOT be fabricated or inferred from another course.
- Funding MUST be conditional on the relevant assessment and requirements. Do not equate eligibility to approval or market a course as unconditionally free.
- A course MUST NOT promise employment or a specific salary. Learning outcomes MUST be distinguished from employment outcomes and the work still required afterward.
- Missing information MUST remain an explicit content gap until verified. An honest unconfirmed price or labeled placeholder is preferable to a plausible invented fact; it is not a claim that the content is launch-complete.
- Localization MUST preserve meaning, units, commitment level, and legal conditions. A localized URL is not proof of translated content. Fallback content MUST have its actual language identified with `lang` so it is not presented to assistive technology as another language.
- Existing untranslated legal text MUST NOT be casually rewritten or machine-translated as part of styling. Preserve its meaning and mark its source language until an appropriate translation is supplied.

## Accessibility

- WCAG 2.2 AA is the minimum acceptance target. Automated checks are necessary but MUST NOT substitute for keyboard, zoom, touch, and visual review.
- The contrast requirements in the color section MUST hold for normal, hover, selected, focus, error, and success states, not only the default screenshot.
- Use semantic landmarks, headings, lists, description lists, labels, buttons, links, and native controls. A styled `div` MUST NOT replace a native interactive element without a genuine need and equivalent behavior.
- Each page MUST provide a working skip link and a main-content target. The sticky header MUST NOT cover its destination.
- Focus MUST remain visible, sufficiently contrasted, and unobscured. Reuse the shared blue focus ring on light surfaces and lime on dark surfaces; never remove outlines without an equivalent indicator.
- Keyboard order MUST match the reading order. Menus, tabs, dialogs, and disclosures MUST support their expected keys and states. Focus MUST be restored or intentionally moved after a state change.
- Visible labels and programmatic names MUST agree. Repeated generic links SHOULD include the item context in their accessible name.
- Errors MUST identify the problem and preserve entered values. Use native validation where appropriate, with additional accessible feedback for server errors.
- Dynamic success feedback MUST be announced and receive sensible focus when it replaces a form. A spinner alone is not an accessible status message.
- Informative images MUST have useful alt text. Decorative icons/artwork MUST be hidden from the accessibility tree. Required information MUST NOT exist only in a canvas, image, hover tooltip, or color.
- Reduced-motion behavior is mandatory. Device zoom MUST NOT be disabled. Content must still be understandable when animation, imagery, or optional tracking is unavailable.

## Performance

- Design decisions MUST account for mobile loading and interaction cost, not only appearance on a fast desktop.
- Use optimized responsive images with explicit dimensions and accurate `sizes`. Below-the-fold media SHOULD lazy-load; critical first-viewport media MUST NOT depend on a late lazy request.
- Do not preload every image or font subset. Use the existing self-hosted families and load only required weights/subsets. A new visual font choice requires a concrete benefit that outweighs its cost.
- Server rendering SHOULD be the default for content. Client components are for actual state and interaction, not a requirement for decorative sections.
- New dependencies MUST solve real domain or rendering complexity. Do not add a large library solely for a decorative effect. Use existing CSS, native elements, Lucide icons, and shared components first.
- Markdown and other structured content MUST use a suitable parser, not ad hoc string replacement. Rendering untrusted raw HTML is not an acceptable shortcut for presentation.
- Animations SHOULD use opacity and transforms where suitable and MUST avoid continuous layout work. Canvas dimensions/pixel ratio and offscreen activity MUST be bounded.
- Responsive loading and layout stability MUST be checked in the rendered page. A nonblank screenshot alone does not prove good perceived performance.

## Page-Level Consistency

- Public pages MUST share the same wordmark, header, language navigation, footer, focus treatment, and reading scale. A different content type is not a reason to return to an older visual template.
- Page introductions MUST establish the topic before the content. Long-form articles may use a narrower, centered reading container, but their heading, metadata, prose, and ending MUST align with that same measure.
- The homepage MUST offer catalog discovery and explain the broader learning journey without assigning every course the same format or outcome.
- Published course pages MUST place pricing and applying together, expose course facts in a scannable overview, then provide curriculum, practical experience, funding where applicable, people, questions, and the next step.
- Unpublished offerings MUST remain visibly in preparation, without enrollment controls or fabricated dates. Do not create urgency from the mere presence of a catalog entry.
- Contact pages SHOULD make the form primary while aligning the contact-information and form headings. Company/legal details MUST be grouped separately from the main contact methods.
- About pages MUST prioritize real people and relevant teaching principles. Biography lengths need not be identical; the roster structure must make the differences natural.
- Homepage and course-page profiles SHOULD use explicitly authored localized summaries. The about page retains full biographies; do not truncate them with string splitting or line clamping.
- Blog and vacancy lists SHOULD use editorial rows; detail pages SHOULD use the common reading layout. Short or empty states MUST be truthful and must not be padded into a full-screen brochure.
- The privacy page SHOULD behave as one document with navigable chapters, not an unrelated stack of promotional cards.
- Canonical URLs, localized routes, useful internal links, metadata, and structured data MUST survive layout work. Retired public entry points require an intentional redirect, not a silent dead end.

## Design Decision Rules

When a decision is ambiguous, apply these rules in order:

1. **Truth, accessibility, and functional correctness win.** No visual benefit justifies a misleading claim or unusable control.
2. **Prefer readability over decorative minimalism.** Increase usable space or change the composition before shrinking important text.
3. **Match the layout to the content relationship.** Use symmetry for comparison and asymmetry for distinct roles, not as a style habit.
4. **Favor real information over decoration.** Missing facts are a content problem, not an invitation to add graphics or statistics.
5. **Reuse a suitable pattern.** A new component requires a user need the existing patterns cannot communicate clearly.
6. **Preserve deliberate breathing room.** Remove accidental empty regions, but do not pack every gap or force all sections to equal height.
7. **Protect mobile use.** Desktop composition may become simpler on a phone, but essential information and actions may not disappear.
8. **Require a purpose for motion.** If the state or story is equally clear without an effect, omit it.
9. **Keep the identity coherent.** Fashionable colors, shapes, fonts, or effects are not a sufficient reason to introduce them.
10. **Prefer the simpler verifiable implementation.** A shared grid or native disclosure is preferable to per-item offsets and bespoke interaction logic.

The change description MUST explain any new pattern or intentional exception, identify affected widths/states, and include the relevant checks. Do not create a permanent page-specific exception solely to make one screenshot look balanced.

## Examples

These examples explain relationships; they are not templates every page must copy.

### Funding Or Another Decision Process

```text
Preferred:
[Optional context]
[Topic-first heading]
[Concise explanation below the heading]
-------------------------------------------------
[Option A and conditions]   [Option B and conditions]
-------------------------------------------------
[01 heading]  [02 heading]  [03 heading]
[Body]        [Body]        [Body]
-------------------------------------------------
[Caveat]                    [Relevant next action]

Avoid:
[Large headline]            [Step 01]
[Introduction]              [Step 02]
[Unrelated large statistic] [Step 03]
[Short leftover paragraph]  [Long caveat]
```

The preferred version gives each row a common purpose. On a phone, keep that purpose and source order while stacking the steps.

### Useful Versus Accidental Asymmetry

- **Preferred:** compact identity information beside a wider biography, with a shared top rule and text start.
- **Preferred:** an explanation beside a working code example, with the example clearly framed as a tool.
- **Avoid:** three biography cards with radically different heights and no common reading structure.
- **Avoid:** a heading and three lines of prose beside a long process merely because the section was originally two columns.

### Typography And Commitment

```text
Section heading:      What you will learn
Body text:            Concrete skills and practical work
Supporting note:      Conditions that affect participation
Metadata:             Format / teaching hours / next start
Primary action:       Explore the full course

After course choice:
Primary action:       Send a nonbinding enquiry
Supporting note:      No payment or confirmation of a place
```

The note remains readable. Neither metadata nor small badges may carry the only explanation of a financial commitment.

### Responsive Choice

- **Preferred:** five readable learning tabs rearrange into balanced rows on a phone, while keyboard order remains unchanged.
- **Avoid:** preserving a single row by shrinking tab labels to 9px.
- **Preferred:** one course gets an overview layout, two courses get two balanced columns, and a larger catalog uses comparable cards.
- **Avoid:** leaving two empty columns when only one course is published.

## Required Review

Every UI change MUST be reviewed against the affected rules above. Shared changes require review across every consuming page, not only the original anchor.

### Content And Composition

- [ ] The offer, audience, cost/status, and next action are clear for a first-time visitor.
- [ ] All claims, dates, prices, relationships, and content languages are accurate or explicitly unconfirmed.
- [ ] Column roles are deliberate; repeated information aligns at meaningful points.
- [ ] Whitespace supports grouping and pacing rather than concealing sparse content.
- [ ] Tokens and approved components are reused; no conflicting local type or color scale is introduced.

### Rendered Behavior

- [ ] Check 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, and 2560px, plus intermediate widths relevant to the change.
- [ ] Inspect actual screenshots on phone, tablet, laptop, and wide desktop. Check crops, wrapping, visual weight, section transitions, and loaded assets.
- [ ] Check Czech, English, and Russian where shared content or controls are affected.
- [ ] Exercise navigation, open disclosures, dialogs, validation, loading, errors, success, and empty/preparation states as applicable.
- [ ] Check keyboard focus, standalone target sizes, contrast, zoom/text enlargement, and reduced motion.
- [ ] Check Chromium and Safari/WebKit when shared layout or native controls change. Automated geometry/axe checks complement, but do not replace, visual inspection.
- [ ] Run relevant regressions, type/lint checks, and a production build for shared UI changes. Follow the commands in [README.md](README.md#verification) and [DEVELOPMENT.md](DEVELOPMENT.md#verification).

Do not declare conformance solely because the code compiles or screenshots contain no horizontal scrollbar. Explain any unverified requirement; a failing mandatory rule is not a cosmetic follow-up.

## Implementation Map

| Responsibility | Owning implementation |
| --- | --- |
| Tokens, typography, grids, surfaces, responsive rules | [app/globals.css](app/globals.css) |
| Font loading and global document shell | [app/layout.tsx](app/layout.tsx) |
| Headings, facts, numbered processes, profiles, FAQs, CTAs | [app/[lang]/components/CourseSections.tsx](app/%5Blang%5D/components/CourseSections.tsx) |
| Header, language selection, mobile navigation | [app/[lang]/components/Navigation.tsx](app/%5Blang%5D/components/Navigation.tsx) |
| Footer and partner presentation | [app/[lang]/components/Footer.tsx](app/%5Blang%5D/components/Footer.tsx), [app/[lang]/components/PartnerSection.tsx](app/%5Blang%5D/components/PartnerSection.tsx) |
| Enquiry and consent UI | [app/[lang]/components/EnquiryForm.tsx](app/%5Blang%5D/components/EnquiryForm.tsx), [app/[lang]/components/CookieBanner.tsx](app/%5Blang%5D/components/CookieBanner.tsx) |
| Application dialog | [app/[lang]/kurzy/[slug]/components/ApplyModal.tsx](app/%5Blang%5D/kurzy/%5Bslug%5D/components/ApplyModal.tsx) |
| Catalog presentation | [app/[lang]/kurzy/components/CourseCard.tsx](app/%5Blang%5D/kurzy/components/CourseCard.tsx) |
| Purposeful hero and learning interactions | [app/[lang]/components/HeroScene.tsx](app/%5Blang%5D/components/HeroScene.tsx), [app/[lang]/components/LearningJourney.tsx](app/%5Blang%5D/components/LearningJourney.tsx) |
| Shared language-specific customer copy | [i18n/site.ts](i18n/site.ts) |
| Course facts and publication status | [data/courses.json](data/courses.json), [data/courses.ts](data/courses.ts) |
| Date availability | [lib/course-schedule.ts](lib/course-schedule.ts) |
| Content, layout, accessibility, and interaction regressions | [tests/course-experience.test.mjs](tests/course-experience.test.mjs), [tests/site.spec.ts](tests/site.spec.ts) |

This map is a starting point for reuse, not permission to treat every legacy component as an approved pattern. The principles govern new work even when a nearby implementation predates them.