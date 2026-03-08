# BotHub Terminal Hacker Landing Page Redesign

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the BotHub landing page as a single terminal window with hacker/cyberpunk aesthetics — black background, Matrix green primary, cyan/magenta neon accents, CRT scanline overlay, monospace everything.

**Architecture:** The entire landing page becomes one scrollable terminal window (titlebar + body). Each content section is introduced by a typed `$ command` prompt, with content rendered as terminal output. All carousel/complex UI is removed in favor of pure ASCII text. Existing Vue download/version components are preserved but restyled.

**Tech Stack:** Nuxt 4 + Docus 5 + Nuxt UI, CSS custom properties, JetBrains Mono font, Markdown content files

---

### Task 1: Rewrite CSS — Terminal Hacker Theme

**Files:**
- Rewrite: `assets/css/ui-overrides.css`

This is the largest task. The existing 56KB CSS is completely replaced with a terminal hacker theme.

**Step 1: Write the new CSS file**

Complete replacement of `assets/css/ui-overrides.css`. Key sections:

1. **CSS Variables** — hacker color palette:
   - `--bg-terminal: #0a0a0a` (near-black)
   - `--bg-titlebar: #161b22` (dark header bar)
   - `--bg-card: rgba(0, 255, 65, 0.03)` (subtle green tint)
   - `--text-green: #00ff41` (Matrix green — commands, headings)
   - `--text-cyan: #00d4ff` (cyan — links, interactive)
   - `--text-magenta: #ff0080` (neon pink — scores, badges)
   - `--text-primary: #c0c0c0` (light gray — body text)
   - `--text-muted: #5a5a5a` (dim gray)
   - `--border-green: #1a3a1a` (dark green borders)
   - `--border-dim: #222` (dark gray borders)
   - `--font-mono: 'JetBrains Mono', 'Fira Code', monospace`
   - `--glow-green: 0 0 10px rgba(0,255,65,0.3)` (text glow)
   - `--glow-cyan: 0 0 10px rgba(0,212,255,0.3)`

2. **Global resets** — force dark, monospace everywhere, hide Docus default backgrounds/gradients

3. **CRT scanline overlay** — `body::after` with repeating-linear-gradient of 2px translucent lines, `pointer-events: none`

4. **Terminal frame** — `.terminal-window` with border, border-radius, titlebar with 3 colored dots, body area

5. **Terminal command prompts** — `.term-cmd` with `$ ` prefix in green, typed animation

6. **Terminal output blocks** — `.term-output` with fade-in reveal

7. **ASCII-style elements** — score bars, dotted separators, bracket-wrapped labels

8. **Override all Docus/Nuxt UI components** — UHeader, UButton, UPageHero, UPageSection forced to terminal style

9. **Responsive** — terminal frame shrinks on mobile, reduce padding

10. **Animations** — blinking cursor, typing effect via CSS, scroll-triggered reveals

**Step 2: Verify dev server runs**

Run: `cd /Users/jiangzikang/Desktop/dev/bothub-site && npm run dev`
Expected: Server starts at localhost:8090, page loads with new dark theme (content will look broken until Task 2-3)

**Step 3: Commit**

```bash
git add assets/css/ui-overrides.css
git commit -m "feat: replace CSS with terminal hacker theme"
```

---

### Task 2: Rewrite Chinese Landing Content

**Files:**
- Rewrite: `content/zh/index.md`

Replace the current Kinetic-style content with terminal-structured sections. Each section uses a `$ command` prompt div followed by output content.

**Structure:**
1. Hero section → `$ cat /etc/bothub/motd` → ASCII logo + version
2. Platforms → `$ bothub --platforms` → ASCII table with scores
3. Downloads → `$ bothub --download` → clickable `./install` lines using existing download components
4. Docs → `$ bothub --docs` → numbered terminal list with links
5. Capabilities → `$ bothub --capabilities` → `-- SECTION --` ASCII boxes
6. Workflows → `$ bothub --workflows` → arrow-chained steps
7. Community → `$ bothub --community` → QQ group link
8. Footer cursor → `$ _` blinking

Key points:
- Keep `::u-page-hero` and `::u-page-section` wrappers (Docus needs them) but add terminal CSS classes
- Replace carousel references (`<desktop-story-carousel>`, `<mobile-story-carousel>`) with terminal text
- Keep `<version-badge>`, download button components, and `<join-qq-group-button>` — just wrap them differently

**Step 1: Write the new content file**

Complete rewrite of `content/zh/index.md`.

**Step 2: Verify in browser**

Run: Visit `http://localhost:8090/`
Expected: Chinese terminal landing page renders with all sections visible

**Step 3: Commit**

```bash
git add content/zh/index.md
git commit -m "feat: rewrite zh landing page as terminal output"
```

---

### Task 3: Rewrite English Landing Content

**Files:**
- Rewrite: `content/en/index.md`

Mirror of Task 2 but in English. Same terminal structure, same commands, English text.

**Step 1: Write the new content file**

Complete rewrite of `content/en/index.md`.

**Step 2: Verify in browser**

Run: Visit `http://localhost:8090/en`
Expected: English terminal landing page renders correctly

**Step 3: Commit**

```bash
git add content/en/index.md
git commit -m "feat: rewrite en landing page as terminal output"
```

---

### Task 4: Simplify AppHeader to Terminal Titlebar

**Files:**
- Modify: `components/AppHeader.vue`
- Modify: `components/AppHeaderLogo.vue`

The Docus `<UHeader>` is too complex for terminal style. Replace with a simple fixed terminal titlebar that has:
- Three colored dots (red/yellow/green)
- Title text: `bothub@system:~`
- Right side: language select (keep functional) + search trigger

Keep using `<UHeader>` wrapper to not break Docus routing, but override its slots heavily.

**Step 1: Modify AppHeaderLogo.vue**

Replace image logo with terminal text: `> BOTHUB` in green monospace.

**Step 2: Modify AppHeader.vue**

Simplify the header template. Keep LanguageSelect and search functionality but remove color mode toggle (we're always dark now) and mobile menu toggle.

**Step 3: Verify header renders**

Run: Visit `http://localhost:8090/`
Expected: Terminal-style header bar at top with dots, title, and language select

**Step 4: Commit**

```bash
git add components/AppHeader.vue components/AppHeaderLogo.vue
git commit -m "feat: simplify header to terminal titlebar style"
```

---

### Task 5: Style Download & Interactive Components

**Files:**
- Modify: `components/DownloadButton.vue`
- Modify: `components/JoinQqGroupButton.vue`
- Modify: `components/VersionBadge.vue`

Keep all logic, just change visual presentation:
- DownloadButton: terminal-style link `> ./install --platform=xxx [vX.X.X]`
- JoinQqGroupButton: `> connect --group=292036480`
- VersionBadge: `[sys] version: vX.X.X`

**Step 1: Modify DownloadButton.vue**

Change `<UButton>` styling to look like a terminal command line. Replace icon with text prefix.

**Step 2: Modify JoinQqGroupButton.vue**

Change to terminal command style.

**Step 3: Modify VersionBadge.vue**

Change to terminal output style with green text.

**Step 4: Verify all interactive elements work**

Run: Visit `http://localhost:8090/`, click download links and QQ group link
Expected: Links navigate correctly, styled as terminal commands

**Step 5: Commit**

```bash
git add components/DownloadButton.vue components/JoinQqGroupButton.vue components/VersionBadge.vue
git commit -m "feat: restyle interactive components as terminal commands"
```

---

### Task 6: Force Dark Mode & Config Cleanup

**Files:**
- Modify: `nuxt.config.ts` (add colorMode config)
- Modify: `components/AppHeaderCenter.vue` (terminal-style search)

Force dark mode since terminal is always dark. Update search button to match terminal style.

**Step 1: Add dark mode forcing to nuxt.config.ts**

Add to appConfig:
```ts
colorMode: {
  preference: 'dark',
  fallback: 'dark',
}
```

And add JetBrains Mono font link to `app.head.link`.

**Step 2: Update AppHeaderCenter.vue**

Style the search button as a terminal command: `[search]` or `$ find ...`.

**Step 3: Verify dark mode is forced**

Run: Visit `http://localhost:8090/`
Expected: Page is always dark, no light mode toggle visible

**Step 4: Commit**

```bash
git add nuxt.config.ts components/AppHeaderCenter.vue
git commit -m "feat: force dark mode and add terminal font"
```

---

### Task 7: Final Visual Polish & Cleanup

**Files:**
- Modify: `assets/css/ui-overrides.css` (refinements)
- Optional cleanup: remove `data/desktop-slides.ts`, `data/mobile-slides.ts`, `composables/useCarousel.ts`, `types/carousel.ts` if confirmed unused

Final adjustments:
1. Tune CRT scanline intensity
2. Check glow effects aren't too strong
3. Verify responsive on mobile viewport
4. Ensure all Docus docs pages (non-landing) still work
5. Clean up unused carousel files

**Step 1: Visual review and CSS tweaks**

Visit all pages, adjust spacing/colors as needed.

**Step 2: Remove unused files**

```bash
rm components/DesktopStoryCarousel.vue
rm components/MobileStoryCarousel.vue
rm data/desktop-slides.ts
rm data/mobile-slides.ts
rm composables/useCarousel.ts
rm types/carousel.ts
```

**Step 3: Verify nothing breaks**

Run: `npm run dev`, visit landing + a docs page
Expected: No errors, all pages render correctly

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: polish terminal theme and remove unused carousel files"
```

---

## Execution Order

Tasks 1-3 are the core (CSS + content), must be done first and in order.
Tasks 4-6 can be parallelized after Task 1.
Task 7 is final polish after everything else.

```
Task 1 (CSS) → Task 2 (zh content) → Task 3 (en content)
                  ↓
         Task 4 (Header) + Task 5 (Components) + Task 6 (Config)
                  ↓
              Task 7 (Polish & Cleanup)
```
