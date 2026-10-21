## xpath-pom 2.7.0

Chrome Manifest V3 extension for inspecting page elements and generating **XPath, CSS, Playwright, and Katalon** locators, plus a **Generate POM** workflow that exports selected elements as a Katalon/Groovy page-object class.

### Download

| Package | File |
| --- | --- |
| Production (load unpacked) | `xpath-pom-v2.7.0.zip` |

**SHA-256:** `4c7ea743ba4927fb388c5d9ff8e869a2f9dd58719c6e616fe95be83970612bb2`

### Install

1. Download `xpath-pom-v2.7.0.zip` from the assets below and unzip it (you get a `xpath-pom/` folder).
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the unzipped `xpath-pom/` folder.
4. Pin the extension, then click its toolbar icon on any `http`/`https` page to toggle inspection.

### What's inside

- `manifest.json`, `background.js` (service worker), `content.js`, `content.css`, `icons/`
- No build step, no npm dependencies — the zip is the ready-to-load extension.

### Highlights

- Locator suggestions with match counts and heuristic stability indicators
- Copy locator text; evaluate XPath / CSS / supported Playwright locator formats in the live DOM, with match highlighting
- Katalon tab with `TestObject` declarations and `createTestObjectByXpath(...)` snippets
- Generate POM: highlighted Groovy page-object preview, copy and download
- Context menu **xpath-pom: Get Locators**, dark mode, element navigation, Scan tab, open shadow-root traversal

### Notes & limitations

- Stability scores are heuristics, not guarantees.
- Generated locators describe the DOM at inspection time — prefer stable `data-testid`/accessibility attributes where available.
- POM output is a code template; adapt package, base class, and helper dependencies to your Katalon project.
- `chrome://` and other restricted pages cannot be scripted.

**Full changelog:** see the commit history for the `v2.7.0` tag.
