# BLUMI — official website

Static, dependency-free site. Open `index.html` or deploy the folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

## Structure
- `index.html` — all sections, the design system (CSS tokens at the top of `<style>`), and the site script
- `assets/` — the mascot in optimised sizes, plus the favicon

## Updating content
Everything that changes over time is in the `BLUMI_CONFIG` object near the bottom of `index.html`:
- `socials[].url`: add the official X and Telegram links. The cards switch from "coming soon" to live links automatically.
- `nav`: the section links used by the header, mobile menu and footer.
- `web3`: reserved for future Base integrations. Nothing is active: no wallet, no contract, no token.

## Launching the token
In `BLUMI_CONFIG.web3` inside `index.html`:
1. Fill in `token.name`, `token.ticker` and `token.contract` (a real 0x… address on Base).
2. Optional: `token.totalSupply`, `token.buyUrl` (swap link) and `token.chartUrl` (chart link). Empty fields stay hidden.
3. Set `tokenLaunched: true`.

Until then the Token section shows "SOON" everywhere with disabled buttons. Launching fills in the real data, enables the Copy button and Basescan link for the contract address, and an updated footer note. If the contract address is missing or invalid, the section stays in the SOON state.
