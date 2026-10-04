# Repository Guidelines

## Project Structure & Module Organization

This is a static auto-parts storefront. Root-level HTML files define the home, catalog, product, cart, checkout, and contact pages. Page behavior lives in matching files under `js/` (for example, `catalog.html` and `js/catalog.js`); shared navigation behavior is in `js/app.js`. Styles are split between shared files such as `css/variables.css`, `css/layout.css`, and `css/components.css`, and page-specific styles such as `css/catalog.css`. Product records live in `products.json`, and local product photos live in `images/`.

## Build, Test, and Development Commands

There is no build step or package manager configuration. From the repository root, run `python -m http.server 8000`, then open `http://localhost:8000/`. Use a local server because `js/product-data.js` fetches `products.json`; opening HTML directly from disk can block that request. Run `python -m json.tool products.json > $null` in PowerShell after changing product data to check JSON syntax. Stop the server with Ctrl+C.

## Coding Style & Naming Conventions

Follow the existing four-space indentation in JavaScript and CSS. Use descriptive camelCase names for JavaScript functions and variables, kebab-case names for page and asset files, and existing CSS class conventions. Keep shared colors and type values in `css/variables.css`; place page-only rules in the matching CSS file. Keep product IDs, SKUs, image paths, and category labels consistent with the catalog filters. No formatter or linter is configured, so review formatting in touched files before committing.

## Testing Guidelines

No automated test suite or coverage threshold is configured. After a change, serve the site locally and check the affected page at desktop and narrow widths. For shopping changes, verify catalog search and filters, product details, cart quantity and totals, and checkout behavior. Reload between cart steps to confirm `localStorage` persistence. Check the browser console for errors and confirm product images load.

## Commit & Pull Request Guidelines

Recent commits use short, descriptive summaries such as `added product images` and `updated background image`; no formal prefix scheme is evident. Write a focused summary of the change and keep unrelated edits separate. In pull requests, describe the user-visible behavior, list the pages checked, link a related issue when one exists, and include screenshots for visual changes.
