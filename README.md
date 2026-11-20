# BLUMI — official website

Static, dependency-free site. Deploy the folder as-is (Vercel, Framework Preset: Other).

## Files
- `index.html` — all sections, styles, translations and scripts
- `vercel.json` — clean URLs (`/about`, `/token`, `/faq` …). Keep it next to `index.html`.
- `assets/` — mascot images, favicon, social preview, and `assets/brand/` downloads for the Brand Kit

## Sections & addresses
Home `/` · About `/about` · Mascot `/mascot` · Ecosystem `/ecosystem` · Playground `/playground` · Vision `/vision` · Token `/token` · Roadmap `/roadmap` · Community `/community` · FAQ `/faq` · Official Channels `/official` · Brand Kit `/brand-kit`

## Updating content
Everything that changes lives in `BLUMI_CONFIG` near the bottom of `index.html`:
- `socials` — official X and Telegram links (also used by FAQ and Official Channels)
- `colors` — Brand Kit palette
- `web3.token` + `tokenLaunched` — token launch switch (see below)

## Languages
English text is written in the HTML. Indonesian translations are in `I18N_ID` (same keys as the `data-i18n` attributes). The site picks Indonesian automatically for Indonesian browsers and remembers the visitor's choice.

## Launching the token
1. Fill in `token.name`, `token.ticker` and `token.contract` (real 0x… address on Base).
2. Optional: `token.totalSupply`, `token.buyUrl`, `token.chartUrl`.
3. Set `tokenLaunched: true`.
The Token section, FAQ answer, Official Channels and footer note update automatically. If the address is missing or invalid, everything stays in the SOON state.
