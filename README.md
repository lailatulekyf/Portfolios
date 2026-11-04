# Portfolio Website

Static site: HTML, CSS and vanilla JavaScript. No build step.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Replace before publishing
- `[YOUR NAME]` in `index.html` (search for it; appears in title, brand, hero, footer)
- `your.email@example.com`, `YOUR-USERNAME` (LinkedIn and GitHub URLs) in the Contact section and footer
- Images in `assets/images/`: `profile.jpg`, `project-triage.png`, `project-hospital-system.png`, `project-sasirangan.png`, `project-glucocheck.png`, `project-sproutlings.png`
- `assets/documents/resume.pdf`

## Achievement and certificate images
- Achievement photos (shown on the page): `assets/images/achievement-isic-2024.jpg`, `achievement-tic-5.jpg`, `achievement-itcc-2024.jpg`
- Certificate images (shown only in the popup after clicking Certificate): `assets/certificates/isic-2024.jpg`, `tic-5-0.jpg`, `itcc-2024.jpg`, `rakamin-data-science.jpg`, `dqlab-sql.jpg`, `dts-data-science-python.jpg`
- If a file is PNG instead of JPG, change its extension in the matching `data-cert` or `<img src>` in `index.html`.

## Add a project
Clicking a card opens a details popup filled from the card itself, and long descriptions are cut with an ellipsis on the card. Copy an `<article class="project" data-cat="...">` block in the Projects section. `data-cat` takes space-separated keys that match the filter buttons: `analytics ml web mobile qa`.
Each card has a GitHub and a Slides button. Replace the `YOUR-...` parts of the URLs (GitHub repo, Google Slides/PowerPoint link). Until then the buttons stay greyed out and do nothing. Remove a button if a project has no repo or slides.

## Deploy to GitHub Pages
1. Create a repository and push these files to the `main` branch.
2. Repository Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://YOUR-USERNAME.github.io/REPO-NAME/` after a minute or two.

## Checklist
- [ ] Placeholders replaced
- [ ] Images and resume added
- [ ] All nav links scroll to the right section
- [ ] Checked at 320px, tablet and desktop widths