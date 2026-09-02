# Blog: Jekyll + Sveltia CMS + Bulma

A GitHub Pages blog with a real editing UI: Jekyll generates the site,
[Sveltia CMS](https://sveltiacms.app) provides a WYSIWYG editor and
publishing workflow at `/admin`, and [Bulma](https://bulma.io) drives the
design, themed to a custom palette with Helvetica Neue throughout.

## What's here

```
_config.yml           Site settings — title, description, author, etc.
_layouts/              default.html, post.html, page.html
_includes/              head.html, navbar.html, footer.html
_posts/                 Blog posts (Markdown, one file per post)
_pages/                 Static pages (About, etc.) — a Jekyll collection
assets/css/style.css   Theme: palette, typography, responsive layout
assets/js/main.js      Navbar burger-menu toggle (Bulma 1.x ships no JS)
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
  `github_username`, `github_repo`.
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

- **Palette:** main `#2788a0`, contrast `#16242f`, background `#f9f8f7`.
  Bulma 1.x reads color from HSL CSS custom properties at runtime, so
  `assets/css/style.css` sets those directly (`--bulma-primary-h/s/l`,
  etc.) rather than requiring a Sass build step — the whole site runs off
  the Bulma CDN build.
- **Type:** Helvetica Neue only, at a couple of weights/sizes for
  hierarchy — no second typeface.
- **Layout:** dark navbar/footer bookend a warm off-white content area;
  the homepage lists posts as hairline-divided entries rather than a card
  grid, and single-post pages cap body text around 42rem for a readable
  line length.
- **Responsive:** Bulma's grid and navbar burger handle small screens;
  custom rules add a couple of mobile-specific type-scale tweaks. Test at
  a few widths after you add your own content, especially anything with
  images.

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
