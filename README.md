# Blog: Jekyll + Sveltia CMS + Bulma

A GitHub Pages blog with a real editing UI: Jekyll generates the site,
[Sveltia CMS](https://sveltiacms.app) provides a WYSIWYG editor and
publishing workflow at `/admin`, and [Bulma](https://bulma.io) drives the
design, themed to a custom palette with Helvetica Neue throughout.

## What's here

```
_config.yml           Site settings — title, description, author, etc.
_layouts/              default.html, post.html, page.html
_includes/              head.html, navbar.html, footer.html, sidebar.html,
                         posts-data.html (embeds the post index as JSON)
_posts/                 Blog posts (Markdown, one file per post)
_pages/                 Static pages (About, etc.) — a Jekyll collection
tags/index.html        Tag archive page (client-side filtered)
assets/css/style.css   Theme: palette, typography, responsive layout
assets/js/main.js      Navbar burger-menu toggle (Bulma 1.x ships no JS)
assets/js/search.js    Header search box
assets/js/calendar.js  Sidebar calendar widget
assets/js/tags.js      Tag archive page logic
admin/                 Sveltia CMS: index.html + config.yml
.github/workflows/     GitHub Actions build + deploy to Pages
```

The `oauth-worker/` project (a self-hosted Cloudflare Worker) is included
too, but you don't need it — see step 4 for why.

## 1. Push this to GitHub

Create a repo, push this folder to it, then in **Settings → Pages** set
**Source** to **GitHub Actions**. The included workflow
(`.github/workflows/deploy.yml`) builds the site with Jekyll and deploys it
on every push to `main`.

## 2. Fill in your details

- `_config.yml` — `title`, `description`, `url`, `author`,
  `github_username`, `github_repo`, and `footer_links` (a list of
  `name`/`url` pairs shown as a row of links in the footer — add, remove,
  or rename entries freely; point them at social profiles, an
  `mailto:you@yourdomain.com` link, your RSS feed at `/feed.xml`,
  wherever you like).
- `admin/config.yml` — `backend.repo` (as `owner/repo`).
- Swap `assets/images/favicon.svg` for your own mark if you like — it's a
  two-color placeholder using the brand palette.

## 3. Write

- **Directly in Git:** add Markdown files to `_posts/` (filename format
  `YYYY-MM-DD-title.md`) or `_pages/`.
- **Through the CMS:** once step 4 is done, visit `yourdomain.com/admin`,
  sign in, and use the rich-text editor. New posts and edits go through a
  pull request first (`publish_mode: editorial_workflow` in
  `admin/config.yml`) — nothing goes live until that PR is merged, so you
  get review/approval built in without any extra tooling. Merge the PR (or
  have the CMS do it from the editorial workflow view) to publish.

## 4. Set up sign-in for the CMS

Since you're the only one publishing, skip the OAuth app entirely and sign
in with a GitHub **personal access token** — Sveltia offers this option
automatically on its sign-in screen because `admin/config.yml` has no
`base_url` set.

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**
   (https://github.com/settings/personal-access-tokens/new).
2. **Repository access:** "Only select repositories" → pick this repo.
3. **Permissions → Repository permissions:**
   - **Contents:** Read and write
   - **Pull requests:** Read and write (needed for the editorial workflow)
   - **Metadata:** Read-only (selected automatically)
4. Generate it, copy the token somewhere safe (GitHub only shows it once).
5. Visit `yourdomain.com/admin`, choose the personal access token option,
   and paste it in.

The token is stored in your browser (not committed anywhere), so you'll
paste it again if you clear site data or switch browsers/devices. Set an
expiration you're comfortable renewing — GitHub will prompt you to
generate a new one when it lapses.

If you ever want other people to be able to log in without managing their
own tokens, `oauth-worker/` has a ready-to-deploy Cloudflare Worker for
that — see `oauth-worker/README.md`. Not needed for a single-author blog.

## Design notes

- **Palette and roles:** main `#2788a0` is used for the footer, all
  headings (h1–h6) in page/post content, and hyperlinks. Contrast
  `#16242f` is the header background and the body text color. Highlight
  `#f9f8f7` is the page background, and is also what's used for text/icons
  sitting on top of the main- or contrast-colored header and footer (so it
  always reads clearly against those backgrounds). Bulma 1.x reads color
  from HSL CSS custom properties at runtime, so `assets/css/style.css`
  sets those directly (`--bulma-primary-h/s/l`, etc.) rather than
  requiring a Sass build step — the whole site runs off the Bulma CDN
  build.
- **Type:** Helvetica Neue only, at a couple of weights/sizes for
  hierarchy — no second typeface.
- **Layout:** the header is `position: sticky` (stays visible while
  scrolling, never hides), and the whole page is a flex column sized to
  at least the viewport height, so the footer sits at the bottom of the
  screen on short pages instead of floating up under the content.
  Every page (home, posts, and static pages) has a left sidebar with a
  calendar, recent posts, and a tag cloud — see "The sidebar and search"
  below. The homepage lists posts as hairline-divided entries rather than
  a card grid, and single-post pages cap body text around 42rem for a
  readable line length.
- **Responsive:** the sidebar sits to the left of the content on wider
  screens and stacks below it on narrow ones (under ~900px), with the
  main content appearing first in that stacked order. Bulma's navbar
  burger handles the nav menu on small screens. Test at a few widths
  after you add your own content, especially anything with images.

## The sidebar and search

Since this is a static site with no backend, the calendar, search box, and
tag archive all work off one build-time-generated blob of data: every
page embeds a `<script type="application/json" id="postsData">` tag
(rendered by `_includes/posts-data.html`) containing every post's title,
URL, date, tags, and excerpt. The widgets read that embedded JSON
directly — no `fetch()` call, no separate file to load, so it works
identically whether the site is served from your domain, a GitHub Pages
URL, or opened as a local file. No database, no search service, no extra
build step beyond the Jekyll build you already have.

- **Calendar** (`assets/js/calendar.js`) — a mini month calendar in the
  sidebar. Days with at least one post are highlighted and clickable;
  clicking a day shows that day's most recent posts (up to 3) underneath.
  It opens on the month of your most recent post so it's never blank.
- **Recent posts** — the last 5 posts, rendered directly by Jekyll (no
  JS needed for this one).
- **Popular tags** — every tag, ranked by how many posts use it, rendered
  directly by Jekyll. Clicking one goes to `/tags/?tag=<name>`.
- **Tag archive** (`tags/index.html` + `assets/js/tags.js`) — reads the
  `?tag=` from the URL and lists every matching post. With no `?tag=` at
  all, it shows a full tag index instead.
- **Search** (`assets/js/search.js`) — a live dropdown under the header
  search box, matching against post titles, tags, and excerpts as you
  type (2+ characters). It's a plain substring match, not fuzzy search —
  fine for a personal blog's post count; if this ever grows into
  hundreds of posts and matching gets noisy, swapping in a proper search
  index (e.g. Lunr.js) later is a drop-in replacement for just this file.

If you ever rename `_pages/about.md`'s permalink or add new nav items,
the sidebar/search markup lives in `_includes/sidebar.html` and
`_includes/navbar.html` — edit those directly, no build step required
beyond the usual push.

## Local preview

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`. The CMS at `/admin` talks to GitHub directly
via the personal access token, so it needs a live GitHub repo either way —
it won't do much against a `localhost` copy of the site unless you also run
`npx sveltia-cms proxy-server` for local Git-backed editing. Normally
you'll just use `/admin` on the deployed site.
