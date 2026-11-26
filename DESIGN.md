# Back to the Loj — design direction

A personal, immersive return to Adirondak Loj. The page opens directly in a compact 3D clearing. Huzaifa’s name, work, projects, and personal outdoor photographs make it a portfolio from the first view. A work noticeboard, project notebook, and photo stand can be reached on foot; direct navigation opens the same content. The optional photo view uses a real Lake Colden photograph.

## Visual language

- Dark forest green, warm cream, quiet rust accents.
- Bree Serif headings and Cabin text, self-hosted with OFL licenses. Use the same faces in canvas signs and notebooks.
- Photography fills the landing view; UI stays thin and spacious.
- A minimal HUD frames the first-person scene; nearby interaction reveals the register.
- The shelter silhouette and yellow REGISTER HERE sign reference the real trail register.

## Typography direction

Use the lettering of park signs and practical field guides as the reference. Bree Serif's sturdy, curved slab forms replace the thin display serif; Cabin keeps paragraphs and controls readable. Avoid decorative italics, miniature labels, and excessive letter spacing. Actual trail signs can retain capitals; portfolio text uses sentence case.

- Palette retained: forest `#142e35`, ink `#263d32`, paper `#f1efe5`, moss `#66765e`, sign yellow `#dfbc52`.
- Type scale: 46–52px main headings, 32–38px project titles, 14–16px reading text, 12px metadata. Reduce display sizes on mobile, not reading sizes.
- Layout retained: left-aligned content, roughly 65-character paragraphs, photographs opposite notebook text. The 3D clearing remains the opening view.

```text
Project heading
Short introduction
[ screenshot / photo ] [ title + readable description ]
Previous                  page count               Next
```

Review: a delicate literary serif plus tiny tracked labels felt generic. Use the heavier slab face for the identity and titles, with quieter Cabin text around it. No new ornamental badges or decorative copy.

## Interaction

Rust/WebAssembly owns player movement and collision. Three.js handles rendering. Desktop keyboard and drag look have mobile button and drag equivalents. Nearby E/button interaction opens the local register. The route map is an explicitly illustrated overview with a Google Maps link. Audio is off by default and starts only after a click.

## Accuracy and accessibility

The clearing is an artistic recreation, not a measured scan. The route beyond is contextual, not playable. Real photographs have source and license attribution. A readable DOM map and native dialogs accompany the canvas; controls work with keyboard focus, motion can be reduced, and a no-JavaScript notice links to the preserved portfolio and map.

## Personal content

Use the latest user-supplied résumé for technical achievements, and the user’s own descriptions for restaurant work and personal lessons. Keep both technology and non-technology work visible. No employer dates or college details are inferred. Include authentic project screenshots and personal photos; optimize copies without overwriting originals.

## Campsite

A small personal campsite sits northeast of the portfolio clearing. A rust-orange dome tent, sleeping pad and bag, laced boots, trekking poles and a Haglöfs L.I.M 35-inspired pack surround a stone fire pit. Coffee steams on a cut stump; a lantern lights the tent entrance. Keep snow patchy and the fire area exposed.

The minimap's Visit camp shortcut arrives at a tested, collision-free view. Users can walk up and click the tent door, stoke the fire, brew coffee or switch the lantern. The pack opens the Hiking and camping album page. Dusk is optional; daylight remains the default. GPU particles share the main animation loop and parent disposal registry. Reduced motion hides steam, smoke, sparks and motes, freezes flame motion, and disables light flicker and walking bob. Mobile uses fewer particles and existing touch controls.
