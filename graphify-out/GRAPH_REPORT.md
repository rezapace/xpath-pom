# Graph Report - xpath-pom  (2026-10-22)

## Corpus Check
- 6 files · ~6,746 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .mdb 2, .map 2)

## Summary
- 85 nodes · 99 edges · 11 communities (7 shown, 4 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- manifest.json
- content.js
- default_icon
- background.js
- pom.cjs
- katalon.cjs
- runtime-invalidation.cjs
- XPath POM Browser Extension Icon (Active, 128×128)
- XPath POM Browser Extension Icon (Active, 16×16)
- XPath POM Browser Extension Icon (Active, 48×48)
- CocoIndex Code Settings Configuration

## God Nodes (most connected - your core abstractions)
1. `sendMessage()` - 6 edges
2. `F()` - 5 edges
3. `j()` - 5 edges
4. `U()` - 4 edges
5. `default_icon` - 4 edges
6. `icons` - 4 edges
7. `r()` - 3 edges
8. `getURL()` - 3 edges
9. `addListener()` - 3 edges
10. `s()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `XPath POM Browser Extension Icon (Active, 128×128)` --conceptually_related_to--> `XPath POM Browser Extension Icon (128×128)`  [INFERRED]
  icons/icon128-active.png → icons/icon128.png
- `XPath POM Browser Extension Icon (Active, 16×16)` --conceptually_related_to--> `XPath POM Browser Extension Icon (16×16)`  [INFERRED]
  icons/icon16-active.png → icons/icon16.png
- `XPath POM Browser Extension Icon (Active, 48×48)` --conceptually_related_to--> `XPath POM Browser Extension Icon (48×48)`  [INFERRED]
  icons/icon48-active.png → icons/icon48.png

## Import Cycles
- None detected.

## Communities (11 total, 4 thin omitted)

### Community 0 - "manifest.json"
Cohesion: 0.13
Nodes (14): background, service_worker, type, description, icons, 128, 16, 48 (+6 more)

### Community 1 - "content.js"
Cohesion: 0.23
Nodes (12): addListener(), F(), G(), getURL(), i(), j(), l(), Q() (+4 more)

### Community 2 - "default_icon"
Cohesion: 0.33
Nodes (6): action, default_icon, default_title, 128, 16, 48

### Community 3 - "background.js"
Cohesion: 0.83
Nodes (3): a(), i(), r()

### Community 4 - "pom.cjs"
Cohesion: 0.14
Nodes (9): assert, container, context, document, fs, page, shadow, source (+1 more)

### Community 5 - "katalon.cjs"
Cohesion: 0.17
Nodes (9): assert, card, context, css, element, fs, source, unsafeCard (+1 more)

### Community 6 - "runtime-invalidation.cjs"
Cohesion: 0.18
Nodes (8): ref_node_assert_strict, ref_node_fs, ref_node_vm, assert, fs, helper, source, vm

## Knowledge Gaps
- **46 isolated node(s):** `update_url`, `manifest_version`, `name`, `version`, `description` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 57 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `action` connect `default_icon` to `manifest.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `s()` connect `content.js` to `background.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `update_url`, `manifest_version`, `name` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `manifest.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `pom.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._