# Hackathon Team Matcher — Implementation Plan

## Product and implementation

A small, single-page static web prototype for exploring hackathon participants and finding useful teammates. The browser owns the sample profile data, search/filter state, recommendation scoring and demo-only interest state; there is no login, server, database or persistence. Plain HTML, CSS and vanilla JavaScript keep the prototype fast to run and easy to adapt.

### Main behavior
- Browse participant profiles with role, location/availability, skills, interests and what they are looking for.
- Search by participant name, skill or project interest, and select one or more exact skills as an OR filter.
- Open an expanded profile with match score and a short explanation of complementary roles and shared interests.
- Rank suggested teammates using role complementarity and shared project interests.
- Toggle interest locally and show an explicit demo-only confirmation; changes reset on reload.
- Provide a friendly empty state and responsive desktop/mobile layout.

### Project structure
- `index.html` — single-page semantic shell and accessible dialog/toast containers.
- `styles.css` — responsive visual system and components.
- `app.js` — sample profiles, matching, search/filter, details and in-memory interest state.
- `manus-routes.json` — declares the sole page route before the preview server starts.
- `TODO.md` — acceptance clauses; native task-list discovery did not find a project todo tool.

## Design direction
- **Design Movement:** contemporary neo-brutalist product studio, softened for approachability.
- **Core Principles:** bold hierarchy; useful density without clutter; candid demo-state feedback; high-contrast accessible controls.
- **Color Philosophy:** warm paper keeps the interface human, near-black makes information crisp, electric blue signals action, and acid-lime/orange accents make the hackathon energy feel lively rather than corporate.
- **Layout Paradigm:** editorial two-column workspace—participant discovery as the wide primary rail and a narrow live-match sidebar—collapsing into a single readable column on small screens.
- **Signature Elements:** a compact four-tile mark; oversized outlined/italic display word; chunky bordered cards with small offset shadows.
- **Interaction Philosophy:** filters update immediately; match rationale is visible rather than mysterious; every interest action receives clear, reversible, demo-only feedback.
- **Animation:** brief 140–200 ms opacity/transform transitions for card and control state changes; honor `prefers-reduced-motion`; no distracting looping motion.
- **Typography System:** system UI sans for body and controls; Georgia italic for a contrasting editorial headline; monospace for metadata, skills and match percentages. Headline is largest, section headings compact and bold, metadata subdued but readable.
- **Brand Essence:** a quick way for builders to find the missing piece of a weekend team; **energetic, candid, collaborative**.
- **Brand Voice:** direct and encouraging. Example lines: “Find your people. Ship something real.” / “A good team is one skill away.”
- **Wordmark & Logo:** “TEAM / UP” wordmark paired with four uneven squares forming a small joining-grid mark.
- **Signature Brand Color:** electric cobalt blue (`#4357F5`).

## Serving
The app is static, dependency-free and served on the project’s configured Preview port. Sample data and all interactions stay in the browser; no external service or backend is needed.
