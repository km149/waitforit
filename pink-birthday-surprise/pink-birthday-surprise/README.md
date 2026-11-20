# A Little Secret 🎀 — Responsive Birthday Surprise Website

A complete, offline-ready, mobile + desktop friendly five-stage surprise site. No npm, Node installation, accounts, frameworks, API keys or internet access required to run it.

## Open in VS Code

1. Extract the `pink-birthday-surprise.zip` file.
2. In Visual Studio Code, choose **File → Open Folder** and select `pink-birthday-surprise`.
3. Open `index.html` in a browser, or right-click it and choose **Open with Live Server** if you have the Live Server extension. You do **not** need Live Server to use it.
4. Send/upload **the full project folder**, keeping `index.html`, `styles.css`, `script.js`, and `assets/` together. If hosting online, upload all these files and folders.

## User flow

1. **Who's Dis? 👀** — three allowed names: Gulbano, Guluna, Halimo. Case-insensitive; all whitespace is ignored.
2. **The Cute Investigation Dept. 🎀** — three multiple choice questions with individual answers, followed by a favorite-person free-text check. Accepted: Mamun, Mamoon, MamunKhan, MamoonKhan, case-insensitive and whitespace-insensitive.
3. **The Secret Discovery 💌** — four reveal-one-at-a-time suspense messages. Birthday theme is not disclosed yet.
4. **Automatic countdown** — 3, 2, 1 with no heart around the numbers, then a pixel-art cat boxing glove and “DANG!” on a lavender `#DCD0FF` background, then automatically goes to the final page.
5. **Happiest Birthday! 🎂** — exact approved wish, pastel pink `#FBE4E8` theme, animated small pixel stickers, and the last line “Yk what to send now 🤭💗”. No sender signature.

## What can you edit?

- `index.html`: document title and basic page shell.
- `styles.css`: colors, responsive sizing, layout, float and punch animations.
- `script.js`: name lists (`entryNames` and `favoriteNames`), questions, replies, surprise messages, birthday text and timing.
- `assets/`: original pixel-art SVG icon graphics. Each SVG contains hard-edged pixel-style shapes.

## Notes

- The website's name checks are **client-side fun gates**, not real security. A determined visitor can inspect code to see the accepted names.
- Visual effects honor a device's `prefers-reduced-motion` setting.
- All graphic assets are included locally and work without internet access.
- Mobile viewport and touch inputs are supported, along with keyboard navigation and semantic headings.
